<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );
/**
 * Native WordPress editor Shortcode Builder
 */

add_action( 'init', 'cl_init_buttons' );
function cl_init_buttons() {
	add_filter( 'mce_buttons', 'cl_mce_buttons' );
	add_filter( 'mce_external_plugins', 'cl_mce_external_plugins' );
}

function cl_mce_buttons( $buttons ) {
	$buttons[] = 'codelights';

	return $buttons;
}

function cl_mce_external_plugins( $mce_external_plugins ) {
	global $cl_uri;
	$mce_external_plugins['codelights'] = $cl_uri . '/editors-support/native/tinymce.js';

	return $mce_external_plugins;
}

add_action( 'admin_print_footer_scripts', 'cl_quicktags_button' );
function cl_quicktags_button() {
	if ( wp_script_is( 'quicktags' ) ) {
		echo '<script id="cl_quicktags">' . file_get_contents( dirname( __FILE__ ) . '/quicktags.js' ) . '</script>';
	}
}
