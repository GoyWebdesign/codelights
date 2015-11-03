<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Plugin Name: CodeLights
 * Plugin URI: https://codelights.com/
 * Description: Premium-quality shortcodes.
 * Version: 1.0.0
 * Author: CodeLights
 * Author URI: https://codelights.com/
 */

// Global variables that may be used for
$cl_file = __FILE__;
$cl_dir = plugin_dir_path( __FILE__ );
$cl_uri = plugins_url( '', __FILE__ );

require $cl_dir . '/functions/helpers.php';
require $cl_dir . '/functions/shortcodes.php';

// Widgets
require $cl_dir . '/functions/class-cl-widget.php';

// Ajax requests
if ( is_admin() ) {
	if ( ! defined( 'DOING_AJAX' ) OR ! DOING_AJAX ) {
		// Admin interface
		require $cl_dir . '/editors-support/native/native.php';
		require $cl_dir . '/editors-support/js_composer/js_composer.php';
		require $cl_dir . '/editors-support/siteorigin/siteorigin.php';
	} elseif ( isset( $_POST['action'] ) AND substr( $_POST['action'], 0, 3 ) == 'cl_' ) {
		// Ajax methods
		require $cl_dir . '/functions/ajax.php';
	}
}

/* load admin js and css styles */
add_action( 'admin_enqueue_scripts', 'cl_register_admin_scripts' );
function cl_register_admin_scripts() {
	global $cl_uri, $post_type;

	$screen = get_current_screen();
	$is_widgets = ( $screen->base == 'widgets' );
	$is_customizer = ( $screen->base == 'customize' );
	$is_content_editor = ( isset( $post_type ) AND post_type_supports( $post_type, 'editor' ) );
	if ( $is_widgets OR $is_customizer OR $is_content_editor ) {
		wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );

		wp_register_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );
		global $wp_scripts;
		$ajax_url_script = 'if (window.$cl === undefined) window.$cl = {}; $cl.ajaxUrl = ' . wp_json_encode( admin_url( 'admin-ajax.php' ) ) . ";\n";
		$wp_scripts->add_data( 'cl-admin-script', 'data', $wp_scripts->get_data( 'cl-admin-script', 'data' ) . $ajax_url_script );
		wp_enqueue_script( 'cl-admin-script' );

		if ( ! did_action( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}

		// For link field type
		wp_enqueue_script( 'jquery-ui-core' );
		wp_enqueue_script( 'jquery-ui-sortable' );
	}
}

add_action( 'customize_controls_print_scripts', 'cl_customize_controls_print_scripts' );
function cl_customize_controls_print_scripts() {
	global $cl_uri;
	wp_enqueue_style( 'cl-customizer', $cl_uri . '/admin/css/customizer.css' );
	wp_enqueue_script( 'cl-customizer', $cl_uri . '/admin/js/customizer.js', array( 'jquery' ), FALSE, TRUE );
}

/**
 * Enqueue all my widget's admin scripts
 */
add_action( 'admin_print_scripts-widgets.php', 'cl_so_widget_enqueue_scripts' );
// Add this to enqueue your scripts on Page Builder too
//add_action( 'siteorigin_panel_enqueue_admin_scripts', 'cl_so_widget_enqueue_scripts' );
function cl_so_widget_enqueue_scripts() {
	global $cl_uri;
	wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );
	wp_enqueue_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );

	// For attach_image / attach_images field types
	if ( ! did_action( 'wp_enqueue_media' ) ) {
		wp_enqueue_media();
	}

	wp_enqueue_script( 'jquery-ui-core' );
	wp_enqueue_script( 'jquery-ui-sortable' );
}

function cl_write_debug( $value, $with_backtrace = FALSE ) {
	global $cl_dir;
	static $first = TRUE;
	$data = '';
	if ( $with_backtrace ) {
		$backtrace = debug_backtrace();
		array_shift( $backtrace );
		$data .= print_r( $backtrace, TRUE ) . ":\n";
	}
	ob_start();
	var_dump( $value );
	$data .= ob_get_clean() . "\n\n";
	file_put_contents( $cl_dir . '/debug.txt', $data, $first ? NULL : FILE_APPEND );
	$first = FALSE;
}
