<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Visual Composer's Shortcode Mapping: cl-flipbox
 */
vc_map( array(
	'base' => 'cl-flipbox',
	'name' => __( 'Flipbox', 'codelights' ),
//	'icon' => 'icon-wpb-ui-button',
	'category' => __( 'CodeLights', 'codelights' ),
	'weight' => 100,
	'params' => array(
		array(
			'param_name' => 'front',
			'heading' => __( 'Front', 'codelights' ),
			'type' => 'textfield',
			'std' => 'Front Text',
			'weight' => 110,
		),
		array(
			'param_name' => 'back',
			'heading' => __( 'Back', 'codelights' ),
			'type' => 'textfield',
			'std' => 'Back Text',
			'weight' => 100,
		),
	),
) );
