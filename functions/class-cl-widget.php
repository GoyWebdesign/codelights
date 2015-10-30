<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

abstract class CL_Widget extends WP_Widget {

	public function __construct() {

		// Widget's ID is defined by it's class name
		$id_base = preg_replace( '~^cl_widget_~', 'cl-', strtolower( get_class( $this ) ) );
		$this->config = cl_config( 'elements.' . $id_base );

		if ( ! is_array( $this->config ) OR ! isset( $this->config['params'] ) OR ! is_array( $this->config['params'] ) ) {
			if ( WP_DEBUG ) {
				wp_die( 'Config for widget ' . $id_base . ' is not found' );
			}

			return;
		}

		parent::__construct( $id_base, '(' . $this->config['category'] . ') ' . $this->config['name'], array(
			'description' => $this->config['description'],
			'classname' => $this->config['class'],
			'panels_groups' => array( $this->config['category'] ),
			'category' => $this->config['category'],
			'icon' => $this->config['icon'],
		) );
	}

	/**
	 * Output the settings update form.
	 *
	 * @param array $instance Current settings.
	 *
	 * @return string Form's output marker that could be used for further hooks
	 */
	public function form( $instance ) {

		cl_load_template( 'eform/eform', array(
			'name' => $this->id_base,
			'params' => $this->config['params'],
			'values' => $instance,
			'field_name_fn' => array( $this, 'get_field_name' ),
			'field_id_fn' => array( $this, 'get_field_id' ),
		) );

		return 'clform';
	}

	/**
	 * Echo the widget content.
	 *
	 * @param array $args Display arguments including before_title, after_title, before_widget, and after_widget.
	 * @param array $instance The settings for the particular instance of the widget.
	 */
	public function widget( $args, $instance ) {
		cl_enqueue_assets( $this->id_base );
		$instance = cl_shortcode_atts( $instance, $this->id_base );
		cl_load_template( 'elements/' . $this->id_base, $instance );
	}

}

// Initializing widgets
add_action( 'widgets_init', 'cl_widgets_init' );
function cl_widgets_init() {
	$config = cl_config( 'elements', array() );
	foreach ( $config as $base_id => $element ) {
		$widget_class = 'CL_Widget_' . strtoupper( $base_id[3] ) . substr( $base_id, 4 );
		if ( ! class_exists( $widget_class ) ) {
			wp_die( 'Widget class ' . $widget_class . ' must exist and be defined at functions/class-cl-widget.php' );
		}
		register_widget( $widget_class );
	}
}

// List of exact widgets should always match the original elements config list
// TODO Replace with some kind of dynamic mapping
class CL_Widget_Counter extends CL_Widget {

}

class CL_Widget_Flipbox extends CL_Widget {

}

class CL_Widget_Ib extends CL_Widget {

}

class CL_Widget_Itext extends CL_Widget {

}
