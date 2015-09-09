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
function cl_register_admin_scripts() {
	global $cl_uri;
	wp_enqueue_style( 'cl-admin-style', $cl_uri . '/admin/css/editor.css' );
	wp_enqueue_script( 'cl-admin-script', $cl_uri . '/admin/js/editor.js', array( 'jquery' ), FALSE, TRUE );
	wp_enqueue_script( 'tiny_mce' );
}

add_action( 'admin_enqueue_scripts', 'cl_register_admin_scripts' );
