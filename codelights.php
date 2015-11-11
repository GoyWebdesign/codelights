<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Plugin Name: CodeLights
 * Plugin URI: https://codelights.com/
 * Description: Flexible high-end page elements that can be used both as shortcodes and widgets. Responsive, modern, SEO-optimized and easy-to-use.
 * Version: 1.0
 * Author: CodeLights
 * Author URI: https://codelights.com/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

$cl_file = __FILE__;
$cl_dir = plugin_dir_path( __FILE__ );
$cl_uri = plugins_url( '', __FILE__ );

require $cl_dir . '/functions/helpers.php';
require $cl_dir . '/functions/shortcodes.php';

// Widgets
require $cl_dir . '/functions/class-cl-widget.php';

add_action( 'plugins_loaded', 'cl_editors_support' );
function cl_editors_support() {
	global $cl_dir;
	require $cl_dir . '/editors-support/native/native.php';
	require $cl_dir . '/editors-support/js_composer/js_composer.php';
	require $cl_dir . '/editors-support/siteorigin/siteorigin.php';
}

// Ajax requests
if ( is_admin() AND isset( $_POST['action'] ) AND substr( $_POST['action'], 0, 3 ) == 'cl_' ) {
	require $cl_dir . '/functions/ajax.php';
}

// Load admin scripts and styles
add_action( 'admin_enqueue_scripts', 'cl_admin_enqueue_scripts' );
function cl_admin_enqueue_scripts() {
	global $cl_uri, $post_type, $wp_scripts;

	$screen = get_current_screen();
	$is_widgets = ( $screen->base == 'widgets' );
	$is_customizer = ( $screen->base == 'customize' );
	$is_content_editor = ( isset( $post_type ) AND post_type_supports( $post_type, 'editor' ) );
	if ( $is_widgets OR $is_customizer OR $is_content_editor ) {
		wp_enqueue_style( 'cl-editor', $cl_uri . '/admin/css/editor.css' );
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
