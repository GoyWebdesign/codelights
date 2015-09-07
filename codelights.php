<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Plugin Name: CodeLights
 * Plugin URI: https://codelights.com/
 * Description: Premium-quality shortcodes.
 * Version: 1.0.0
 * Author: CodeLights
 * Author URI: https://codelights.com/
 */

$cl_file = __FILE__;
$cl_dir = dirname( __FILE__ );

require $cl_dir . '/shortcodes/cl-flipbox.php';

require $cl_dir . '/editors-support/js_composer/js_composer.php';
require $cl_dir . '/editors-support/siteorigin/siteorigin.php';

// Widgets
require $cl_dir . '/functions/cl_widget.php';
require $cl_dir . '/widgets/cl_flipbox.php';

/**
 *
 *
 * @param string $template Template path
 * @param array $vars Variables that should be passed to template
 *
 * TODO Rewrite this function in a proper way
 */
function cl_load_template( $template, $vars = NULL ) {
	global $cl_dir;
	if ( is_array( $vars ) AND ! empty( $vars ) ) {
		extract( $vars );
	}
	include $cl_dir . '/templates/' . $template . '.php';
}
