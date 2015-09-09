<?php

class CL_Widget_Flipbox extends CL_Widget {

	public $config = array();

	public function __construct() {
		$this->config = array(
			'name' => '(CodeLights) ' . __( 'Flipbox', 'codelights' ),
			'description' => __( 'Amazing flippable element', 'codelights' ),
			'classname' => 'cl-widget-class',
			'category' => __( 'CodeLights', 'codelights' ),
			'icon' => 'cl-icon.png',
			'params' => array(
				'front' => array(
					'type' => 'textfield',
					'heading' => __( 'Front', 'codelights' ),
					'std' => 'front default text',
					'weight' => 100,
					'class' => array( 'widefat' ),
				),
				'back' => array(
					'type' => 'textarea',
					'heading' => __( 'Back', 'codelights' ),
					'std' => 'back default text',
					'weight' => 200,
					'class' => array( 'widefat' ),
				),
				'leftside' => array(
					'type' => 'dropdown',
					'heading' => __( 'Left side', 'codelights' ),
					'std' => 0,
					'value' => array(
						'First value' => 0,
						'Second value' => 1,
						'Third value' => 2,
					),
					'weight' => 300,
					'class' => array( 'widefat' ),
				),
				'rightside' => array(
					'type' => 'checkbox',
					'heading' => __( 'Right side', 'codelights' ),
					'std' => 1,
					'value' => array(
						'One' => 1,
						'Two' => 2,
						'Three' => 3,
					),
					'weight' => 400,
					'class' => array( 'widefat' ),
				),
				'darkside' => array(
					'type' => 'checkbox',
					'heading' => __( 'Dark side', 'codelights' ),
					'std' => 0,
					'weight' => 500,
					'class' => array( 'widefat' ),
				),
			),
		);
		parent::__construct();
	}

	public function widget( $instance, $params ) {

		$params = shortcode_atts( array(
			'front' => 'front',
			'back' => 'back',
		), $params );
		cl_load_template( 'elements/cl-flipbox', $params );
	}

}

add_action( 'widgets_init', 'cl_widgets_init_flipbox' );
function cl_widgets_init_flipbox() {
	register_widget( 'CL_Widget_Flipbox' );
}
