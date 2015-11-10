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

// Implementing editors support after admin init to be able to check which plugins were actlually loaded
add_action( 'admin_init', 'cl_editors_support' );
function cl_editors_support() {
	global $cl_dir;
	require $cl_dir . '/editors-support/native/native.php';
	require $cl_dir . '/editors-support/js_composer/js_composer.php';
	require $cl_dir . '/editors-support/siteorigin/siteorigin.php';
}

// Ajax requests
if ( is_admin() ) {
	if ( ! defined( 'DOING_AJAX' ) OR ! DOING_AJAX ) {
		// Admin interface

	} elseif ( isset( $_POST['action'] ) AND substr( $_POST['action'], 0, 3 ) == 'cl_' ) {
		// Ajax methods
		require $cl_dir . '/functions/ajax.php';
	}
}

/* load admin js and css styles */
add_action( 'admin_enqueue_scripts', 'cl_admin_enqueue_scripts' );
function cl_admin_enqueue_scripts() {
	global $cl_uri, $post_type, $wp_scripts, $wp_styles;

	$screen = get_current_screen();
	$is_widgets = ( $screen->base == 'widgets' );
	$is_customizer = ( $screen->base == 'customize' );
	$is_content_editor = ( isset( $post_type ) AND post_type_supports( $post_type, 'editor' ) );
	if ( $is_widgets OR $is_customizer OR $is_content_editor ) {
		wp_register_style( 'cl-editor', $cl_uri . '/admin/css/editor.css' );
		$elm_icons_style = '';
		$wp_styles->add_data( 'cl-editor', 'data', $wp_styles->get_data( 'cl-editor', 'data' ) . $elm_icons_style );
		wp_enqueue_style( 'cl-editor' );

		wp_register_script( 'cl-editor', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );
		$ajax_url_script = 'if (window.$cl === undefined) window.$cl = {}; $cl.ajaxUrl = ' . wp_json_encode( admin_url( 'admin-ajax.php' ) ) . ";\n";
		$wp_scripts->add_data( 'cl-editor', 'data', $ajax_url_script );
		wp_enqueue_script( 'cl-editor' );

		if ( ! did_action( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}

		// For link field type
		wp_enqueue_script( 'jquery-ui-core' );
		wp_enqueue_script( 'jquery-ui-sortable' );
	}
}
