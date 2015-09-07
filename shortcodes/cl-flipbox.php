<?php

add_shortcode( 'cl-flipbox', function ( $atts ) {

	$atts = shortcode_atts( array(
		'front' => 'front',
		'back' => 'back',
	), $atts );

	ob_start();
	cl_load_template( 'elements/cl-flipbox', $atts );
	return ob_get_clean();
} );

add_action( 'wp_enqueue_scripts', 'cl_enqueue_styles', 12 );
function cl_enqueue_styles() {
	global $cl_file;
	wp_register_style( 'cl-base', plugins_url( '/css/cl-base.css', $cl_file ), array(), '1.0', 'all' );
	wp_enqueue_style( 'cl-base' );
}
