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

require $cl_dir . '/editors-support/js_composer/js_composer.php';
require $cl_dir . '/editors-support/siteorigin/siteorigin.php';

// Widgets
require $cl_dir . '/functions/class-cl-widget.php';
require $cl_dir . '/widgets/cl_flipbox.php';

/* load admin js and css styles */
add_action( 'admin_enqueue_scripts', 'cl_register_admin_scripts' );
function cl_register_admin_scripts() {
	global $cl_uri;
	wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );
	wp_enqueue_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );

	$screen = get_current_screen();
	$post_type = $screen->id;
	//echo 'post type:' . $post_type;
	// load scripts and styles only in widget area
	if ( strpos( $post_type, 'widgets' ) !== FALSE OR strpos( $post_type, 'page' ) !== FALSE ) {
		wp_enqueue_script( 'tiny_mce' );
		wp_enqueue_script( 'wp-color-picker' );
		wp_enqueue_style( 'wp-color-picker' );
		if ( ! did_action( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}
		wp_enqueue_script( 'wp-link' );
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
add_action( 'admin_print_scripts-widgets.php', 'mywidget_enqueue_scripts' );
// Add this to enqueue your scripts on Page Builder too
add_action( 'siteorigin_panel_enqueue_admin_scripts', 'mywidget_enqueue_scripts' );
function mywidget_enqueue_scripts() {
	global $cl_uri;
	wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );
	wp_enqueue_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );

	wp_enqueue_script( 'tiny_mce' );
	wp_enqueue_script( 'wp-color-picker' );
	wp_enqueue_style( 'wp-color-picker' );
	if ( ! did_action( 'wp_enqueue_media' ) ) {
		wp_enqueue_media();
	}
	wp_enqueue_script( 'wp-link' );
	wp_enqueue_script( 'jquery-ui-core' );
	wp_enqueue_script( 'jquery-ui-sortable' );
}
