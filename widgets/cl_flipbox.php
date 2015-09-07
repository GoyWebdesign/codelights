<?php

class CL_Widget_Flipbox extends CL_Widget {

	public $config = array();

	public function __construct() {
		$this->config = array(
			'name' => '(CodeLights) ' . __( 'Flipbox', 'codelights' ),
			'description' => __( 'Amazing flippable element', 'codelights' ),
			'params' => array(
				'front' => array(
					'type' => 'textfield',
					'heading' => __( 'Front', 'codelights' ),
					'std' => 'front default text',
				),
				'back' => array(
					'type' => 'textarea',
					'heading' => __( 'Back', 'codelights' ),
					'std' => 'back default text',
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
