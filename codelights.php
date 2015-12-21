<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Plugin Name: SiteOrigin Widgets by CodeLights
 * Version: 1.0.8
 * Plugin URI: http://codelights.com/
 * Description: Flexible high-end shortcodes and widgets. Responsive, modern, SEO-optimized and easy-to-use. Also can work without SiteOrigin.
 * Author: CodeLights
 * Author URI: http://codelights.com/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: codelights
 */

// Global variables for plugin usage
$cl_file = __FILE__;
$cl_dir = plugin_dir_path( __FILE__ );
$cl_uri = plugins_url( '', __FILE__ );
$cl_version = preg_match( '~Version\: ([^\n]+)~', file_get_contents( __FILE__, NULL, NULL, 82, 150 ), $cl_matches ) ? $cl_matches[1] : FALSE;
unset( $cl_matches );

require $cl_dir . '/functions/helpers.php';
require $cl_dir . '/functions/shortcodes.php';

// Widgets
require $cl_dir . '/functions/class-cl-widget.php';

add_action( 'plugins_loaded', 'cl_plugins_loaded' );
function cl_plugins_loaded() {
	// Editors support
	global $cl_dir;
	require $cl_dir . '/editors-support/native/native.php';
	require $cl_dir . '/editors-support/js_composer/js_composer.php';
	require $cl_dir . '/editors-support/siteorigin/siteorigin.php';
	// I18n support
	cl_maybe_load_plugin_textdomain();
}

// Ajax requests
if ( is_admin() AND isset( $_POST['action'] ) AND substr( $_POST['action'], 0, 3 ) == 'cl_' ) {
	require $cl_dir . '/functions/ajax.php';
}

// Load admin scripts and styles
add_action( 'admin_enqueue_scripts', 'cl_admin_enqueue_scripts' );
function cl_admin_enqueue_scripts() {
	global $cl_uri, $post_type, $wp_scripts, $cl_version;

	$screen = get_current_screen();
	$is_widgets = ( $screen->base == 'widgets' );
	$is_customizer = ( $screen->base == 'customize' );
	$is_content_editor = ( isset( $post_type ) AND post_type_supports( $post_type, 'editor' ) );
	if ( $is_widgets OR $is_customizer OR $is_content_editor ) {
		wp_enqueue_style( 'cl-editor', $cl_uri . '/admin/css/editor.css', array(), $cl_version );
		wp_register_script( 'cl-editor', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), $cl_version, TRUE );
		$ajax_url_script = 'if (window.$cl === undefined) window.$cl = {}; $cl.ajaxUrl = ' . wp_json_encode( admin_url( 'admin-ajax.php' ) ) . ";\n";
		$wp_scripts->add_data( 'cl-editor', 'data', $ajax_url_script );
		wp_enqueue_script( 'cl-editor' );

		if ( ! did_action( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}
		wp_enqueue_script( 'jquery-ui-sortable' );
	}

	if ( $is_customizer ) {
		wp_enqueue_style( 'cl-customizer', $cl_uri . '/admin/css/customizer.css', array(), $cl_version );
	}
}

add_action( 'customize_controls_print_styles', 'cl_customizer_icons_style' );
function cl_customizer_icons_style() {
	echo '<style type="text/css" id="cl_customizer_icons_style">';
	foreach ( cl_config( 'elements', array() ) as $name => $elm ) {
		if ( isset( $elm['icon'] ) AND ! empty( $elm['icon'] ) ) {
			echo '#available-widgets .widget-tpl[class*=" ' . $name . '"] .widget-title::before {';
			echo 'content: \'\';';
			echo '-webkit-background-size: 20px 20px;';
			echo 'background-size: 20px 20px;';
			echo 'background-image: url(' . $elm['icon'] . ');';
			echo '}';
		}
	}
	echo '}';
	echo '</style>';
}
