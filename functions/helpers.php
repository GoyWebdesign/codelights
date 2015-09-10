<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Load plugin's textdomain
 *
 * @param string $domain
 * @param string $path Relative path to seek in child theme and theme
 *
 * @return bool
 */
function cl_maybe_load_plugin_textdomain( $domain = 'codelights', $path = 'languages' ) {
	if ( is_textdomain_loaded( $domain ) ) {
		return TRUE;
	}

	return load_plugin_textdomain( $domain, FALSE, $path );
}

/**
 * Load and return some specific config or it's part
 *
 * @param string $path <config_name>[.<name1>[.<name2>[...]]]
 *
 * @oaram mixed $default Value to return if no data is found
 *
 * @return mixed
 */
function cl_config( $path, $default = NULL ) {
	global $cl_dir;
	// Caching configuration values in a inner static value within the same request
	static $configs = array();
	// Defined paths to configuration files
	$path = explode( '.', $path );
	$config_name = $path[0];
	if ( ! isset( $configs[ $config_name ] ) ) {
		cl_maybe_load_plugin_textdomain();
		$config_path = $cl_dir . '/config/' . $config_name . '.php';
		$config = require $config_path;
		$configs[ $config_name ] = apply_filters( 'cl_config_' . $config_name, $config );
	}
	$value = $configs[ $config_name ];
	for ( $i = 1; $i < count( $path ); $i ++ ) {
		if ( is_array( $value ) AND isset( $value[ $path[ $i ] ] ) ) {
			$value = $value[ $path[ $i ] ];
		} else {
			$value = $default;
			break;
		}
	}

	return $value;
}

/**
 * Load and output the template
 *
 * @param string $template Template path
 * @param array $vars Variables that should be passed to the template
 */
function cl_load_template( $template, $vars = NULL ) {
	global $cl_dir;

	$vars = apply_filters( 'cl_template_vars:' . $template, $vars );
	if ( is_array( $vars ) AND ! empty( $vars ) ) {
		extract( $vars );
	}

	do_action( 'cl_before_template:' . $template, $vars );
	include $cl_dir . '/templates/' . $template . '.php';
	do_action( 'cl_after_template:' . $template, $vars );
}

/**
 * Get and return the template output
 *
 * @param string $template Template path
 * @param array $vars Variables that should be passed to the template
 *
 * @return string Template output
 */
function cl_get_template( $template, $vars = NULL ) {
	ob_start();
	cl_load_template( $template, $vars );

	return ob_get_clean();
}

/**
 * Make sure the styles and scripts needed for the element (and their dependencies) are loaded and enqueued for the current page
 *
 * @param string $handle Style and/or script key
 *
 * @return bool Successfully?
 */
function cl_enqueue_assets( $handle ) {

	global $cl_enqueued_handles;

	if ( ! isset( $cl_enqueued_handles ) ) {
		$cl_enqueued_handles = array();
	}

	if ( in_array( $handle, $cl_enqueued_handles ) ) {
		// Won't do excess actions for the already enqueued assets
		return TRUE;
	}

	$types = array( 'style', 'script' );

	// List of type => config params for the current handle
	$assets = array();
	// The list of needed dependencies
	$deps = array();
	foreach ( $types as $type ) {
		// Getting the needed config from config/assets.php. May be changed via 'cl_config_assets' filter, if needed.
		$config = cl_config( 'assets.' . $type . 's.' . $handle );
		if ( is_array( $config ) AND ! empty( $config ) ) {
			$assets[ $type ] = $config;
			$deps += ( isset( $config[1] ) AND is_array( $config[1] ) ) ? $config[1] : array();
		}
	}

	if ( empty( $assets ) ) {
		// There are no valid assets for the current key
		return FALSE;
	}

	// First getting and loading the list of the needed element dependencies
	if ( ! empty( $deps ) ) {
		$deps = array_unique( $deps );
		// Keeping only the ones that are not enqueued yet
		$deps = array_diff( $deps, $cl_enqueued_handles );
		// Keeping only the ones that are located within the plugin
		$inner_assets = array();
		foreach ( $types as $type ) {
			$inner_assets += array_keys( cl_config( 'assets.' . $type . 's' ) );
		}
		$deps = array_intersect( $deps, $inner_assets );
		// Enqueuing all the needed dependencies before the actual handle
		array_map( 'cl_enqueue_assets', $deps );
	}

	foreach ( $assets as $type => $config ) {
		array_unshift( $config, $handle );
		// If this function is called too late (after wp_head), we still include the asset in a wrong way just to provide fallback tolerance
		$action = ( did_action( 'wp_enqueue_scripts' ) > 0 ) ? 'enqueue' : 'register';
		call_user_func_array( 'wp_' . $action . '_' . $type, $config );
	}

	$cl_enqueued_handles[] = $handle;

	return TRUE;
}

add_action( 'wp_enqueue_scripts', 'cl_wp_enqueue_scripts', 20 );
function cl_wp_enqueue_scripts() {

	global $cl_enqueued_handles;

	$cl_enqueued_handles = isset( $cl_enqueued_handles ) ? $cl_enqueued_handles : array();

	foreach ( $cl_enqueued_handles as $handle ) {
		if ( wp_style_is( $handle, 'registered' ) ) {
			wp_enqueue_style( $handle );
		}
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_enqueue_script( $handle );
		}
	}
}

/**
 * Combine user attributes with config-based attributes and fill in defaults when needed.
 *
 * @param array $atts User attributes
 * @param string $shortcode The shortcode
 *
 * @return array Result
 */
function cl_shortcode_atts( $atts, $shortcode ) {

	// We need to extract shortcodes pairs from the config, so storing them within app execution for productivity
	global $cl_shortcode_pairs;

	if ( ! isset( $cl_shortcode_pairs ) ) {
		$cl_shortcode_pairs = array();
	}

	if ( ! isset( $cl_shortcode_pairs[ $shortcode ] ) ) {
		$cl_shortcode_pairs[ $shortcode ] = array();
		foreach ( cl_config( 'elements.' . $shortcode . '.params', array() ) as $param ) {
			if ( ! isset( $param['param_name'] ) ) {
				continue;
			}
			if ( isset( $param['std'] ) ) {
				$cl_shortcode_pairs[ $shortcode ][ $param['param_name'] ] = $param['std'];
			} elseif ( $param['type'] == 'dropdown' AND isset( $param['value'] ) AND is_array( $param['value'] ) ) {
				$cl_shortcode_pairs[ $shortcode ][ $param['param_name'] ] = current( $param['value'] );
			} else {
				$cl_shortcode_pairs[ $shortcode ][ $param['param_name'] ] = '';
			}
		}
	}

	return shortcode_atts( $cl_shortcode_pairs[ $shortcode ], $atts, $shortcode );
}

/**
 * Parsing vc_link field type properly
 *
 * @param string $value
 *
 * @return array
 */
function cl_parse_vc_link( $value ) {
	$result = array( 'url' => '', 'title' => '', 'target' => '' );
	$params_pairs = explode( '|', $value );
	if ( ! empty( $params_pairs ) ) {
		foreach ( $params_pairs as $pair ) {
			$param = explode( ':', $pair, 2 );
			if ( ! empty( $param[0] ) && isset( $param[1] ) ) {
				$result[ $param[0] ] = rawurldecode( $param[1] );
			}
		}
	}

	// Some of the values may have excess spaces, like the target's ' _blank' value.
	return array_map( 'trim', $result );
}

/**
 * Prepare a proper icon classname from user's custom input
 *
 * @param string $icon_class
 *
 * @return string
 */
function cl_prepare_icon_class( $icon_class ) {
	if ( substr( $icon_class, 0, 3 ) != 'fa-' ) {
		$icon_class = 'fa-' . $icon_class;
	}

	return 'fa ' . $icon_class;
}
