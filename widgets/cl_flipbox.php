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
					'description' => 'Description for the textfield',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'back' => array(
					'type' => 'textarea',
					'heading' => __( 'Back', 'codelights' ),
					'std' => 'back default text',
					'weight' => 200,
					'description' => 'Description for the textarea',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
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
					'description' => 'Description for the dropdown',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'rightside' => array(
					'type' => 'checkbox',
					'heading' => __( 'Right side', 'codelights' ),
					'value' => array(
						'One' => 'one',
						'Two' => 'two',
						'Three' => 'three',
					),
					'weight' => 400,
					'description' => 'Description for the checkbox group',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'darkside' => array(
					'type' => 'checkbox',
					'heading' => __( 'Dark side', 'codelights' ),
					'weight' => 500,
					'description' => 'Description for one checkbox',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'innercontent' => array(
					'type' => 'textarea_html',
					'heading' => __( 'Inner content', 'codelights' ),
					'std' => 'Default content for textarea',
					'weight' => 800,
					'description' => 'Description for the textarea',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'explodedcontent' => array(
					'type' => 'textarea_exploded',
					'heading' => __( 'Exploded content', 'codelights' ),
					'std' => 'Default exploded content for textarea',
					'weight' => 600,
					'description' => 'Description for the exploded textarea',
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'colorfield' => array(
					'type' => 'colorpicker',
					'heading' => __( 'Color of something', 'codelights' ),
					'std' => '#ffffff',
					'weight' => 900,
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'attachedimages' => array(
					'type' => 'attach_images',
					'multiple' => TRUE,
					'heading' => __( 'A little box of images', 'codelights' ),
					'std' => '',
					'weight' => 1000,
					'edit_field_class' => 'vc_col-sm-12 vc_column',
				),
				'amazinglink' => array(
					'type' => 'link',
					'heading' => __( 'An amazing link', 'codelights' ),
					'std' => 'url:http%3A%2F%2Fgoogle.ru|title:Google|target:_blank',
					'weight' => 1100,
					'edit_field_class' => 'vc_col-sm-12 vc_column',
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
