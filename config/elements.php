<?php

return array(

	'cl-flipbox' => array(
		'base' => 'cl-flipbox',
		'name' => __( 'FlipBox Element', 'codelights' ),
		'description' => __( 'Two-sided content element, flipping on hover', 'codelights' ),
		'class' => '',
		'weight' => 200,
		'category' => 'CodeLights',
		'icon' => 'flipbox',
		'params' => array(
			array(
				'param_name' => 'link',
				'heading' => __( 'FlipBox Link', 'codelights' ),
				'description' => '',
				'type' => 'vc_link',
				'weight' => 200,
			),
			array(
				'param_name' => 'front_icon',
				'heading' => __( 'Front-Side Icon', 'codelights' ),
				'description' => '',
				'type' => 'textfield',
				'weight' => 190,
			),
			array(
				'param_name' => 'front_icon_style',
				'heading' => __( 'Icon Style', 'codelights' ),
				'description' => '',
				'type' => 'dropdown',
				'value' => array(
					__( 'Simple', 'codelights' ) => 'default',
					__( 'Inside the Solid circle', 'codelights3' ) => 'circle',
				),
				'edit_field_class' => 'col-md-4',
				'dependency' => array( 'element' => 'front_icon', 'not_empty' => TRUE ),
				'weight' => 180,
			),
			array(
				'param_name' => 'front_icon_color',
				'heading' => __( 'Icon Color', 'codelights' ),
				'description' => '',
				'type' => 'colorpicker',
				'edit_field_class' => 'col-md-4',
				'dependency' => array( 'element' => 'front_icon', 'not_empty' => TRUE ),
				'weight' => 170,
			),
			array(
				'param_name' => 'front_icon_bgcolor',
				'heading' => __( 'Icon Background', 'codelights' ),
				'description' => '',
				'type' => 'colorpicker',
				'edit_field_class' => 'col-md-4',
				'dependency' => array( 'element' => 'front_icon', 'not_empty' => TRUE ),
				'weight' => 160,
			),
			array(
				'param_name' => 'front_icon_bgcolor',
				'heading' => __( 'Icon Background', 'codelights' ),
				'description' => '',
				'type' => 'colorpicker',
				'weight' => 150,
			),
		),
	),

);
