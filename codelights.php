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
//require $cl_dir . '/widgets/cl_flipbox.php';

/* load admin js and css styles */
add_action( 'admin_enqueue_scripts', 'cl_register_admin_scripts' );
function cl_register_admin_scripts() {
	global $cl_uri;

	$screen = get_current_screen();
	if ( $screen->base == 'widgets' ) {
		wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );

		wp_register_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );
		wp_localize_script( 'cl-admin-script', 'clAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
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

/* wp_ajax_ - only for registered users */
add_action( 'wp_ajax_cl_image_url_by_id', 'cl_get_image_url' );
function cl_get_image_url() {
	$image_id = $_POST['value'];

	$thumbnail = wp_get_attachment_image_src( $image_id, 'thumbnail' );
	if ( $thumbnail !== FALSE ) {
		$url = $thumbnail[0];
		$success = 'true';
	} else {
		$message = __( 'No image with ID ', 'codelights' ) . $image_id;
	}
	$response = array( 'success' => $success, 'message' => $message, 'url' => $url );
	echo json_encode( $response );
	die();
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
