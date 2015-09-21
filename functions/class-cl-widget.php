<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

abstract class CL_Widget extends WP_Widget {

	public function __construct() {

		// Widget name may be set either from overloading class attribute ...
		$id_base = $this->id_base;
		if ( empty( $id_base ) ) {
			// ... or fetched from the CL_Widget_<name> part
			$id_base = preg_replace( '/(wp_)?widget_/', '', strtolower( get_class( $this ) ) );
		}

		//		$this->config = cl_config( 'widgets.' . $id_base );
		if ( $this->config === NULL ) {
			wp_die( 'Wrong CodeLights widget definition: id_base should be set by attribute or by class name' );
		}

		parent::__construct( $id_base, $this->config['name'], array(
			'description' => $this->config['description'],
			'classname' => $this->config['class'],
			'panels_groups' => array( 'codelights' ),
			'category' => $this->config['category'],
			'icon' => $this->config['icon'],
		) );
	}

	/**
	 * Common widgets' jobs
	 *
	 * @param array $args Display arguments including before_title, after_title, before_widget, and after_widget.
	 * @param array $instance The settings for the particular instance of the widget.
	 */
	public function before_widget( &$args, &$instance ) {
		if ( isset( $this->config['params'] ) AND is_array( $this->config['params'] ) ) {
			foreach ( $this->config['params'] as $param_name => $param ) {
				if ( ! isset( $instance[ $param_name ] ) ) {
					$instance[ $param_name ] = isset( $param['std'] ) ? $param['std'] : '';
				}
			}
		}
		$instance['title'] = ( isset( $instance['title'] ) AND ! empty( $instance['title'] ) ) ? $instance['title'] : '';
	}

	/**
	 * Output the settings update form.
	 *
	 * @param array $instance Current settings.
	 *
	 * @return string Form's output marker that could be used for further hooks
	 */
	public function form( $instance ) {
		if ( ! isset( $this->config['params'] ) OR ! is_array( $this->config['params'] ) OR empty( $this->config['params'] ) ) {
			// 'noform'
			return parent::form( $instance );
		}

		$form_id = 'cl-widgetform-' . rand( 0, 999 );

		uasort( $this->config['params'], array( 'CL_Widget', 'sort_by_weight' ) );

		echo '<div class="cl-widgetform" id="' . $form_id . '"><div class="cl-widgetform-h">';

		foreach ( $this->config['params'] as $param_name => $param ) {
			if ( ! isset( $param['type'] ) ) {
				$param['type'] = 'textfield';
			}
			if ( ! method_exists( $this, 'form_' . $param['type'] ) ) {
				continue;
			}
			$param['name'] = isset( $param['name'] ) ? $param['name'] : $param_name;
			$param['std'] = isset( $param['std'] ) ? $param['std'] : '';
			$value = isset( $instance[ $param_name ] ) ? $instance[ $param_name ] : $param['std'];
			$this->{'form_' . $param['type']}( $param, $value );
		}

		echo '</div></div>';

		return 'clform';
	}

	/**
	 * Sort config array by 'weight' Parameter
	 *
	 * @param array $a First evaluating parameter from config
	 * @param array $b Second evaluating parameter from config
	 */
	private static function sort_by_weight( $a, $b ) {
		if ( $a['weight'] == $b['weight'] ) {
			return 0;
		}

		return ( $a['weight'] < $b['weight'] ) ? - 1 : 1;
	}

	/**
	 * Output form's textfield element
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_textfield( $param, $value ) {
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$field_id = $this->get_field_id( $param['name'] );

		$output = '<div class="cl-tabs">';
		$output .= '<nav>';
		$output .= '<ul class="cl-tabs-navigation">';
		$output .= '<li><a data-content="first-tab" class="selected" href="#0">First tab</a></li>';
		$output .= '<li><a data-content="second-tab" href="#0">Second tab</a></li>';
		$output .= '</ul>'; // .cl-tabs-navigation
		$output .= '</nav>';

		$output .= '<ul class="cl-tabs-content">';
		$output .= '<li data-content="first-tab" class="selected">';
		// form output start
		$output .= '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<input class="widefat" id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '" type="text" value="' . esc_attr( $value ) . '" />';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';
		// form output end
		$output .= '</li>';

		$output .= '<li data-content="second-tab">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis erat eget augue efficitur ultricies. Morbi iaculis placerat convallis. In a elit venenatis lorem feugiat tempor. Cras posuere felis in ex elementum, ut ornare augue gravida. Sed euismod molestie nunc non suscipit. Fusce iaculis malesuada neque, ut mollis risus molestie vitae. Nulla vitae elit scelerisque, rutrum neque nec, fermentum ipsum. Phasellus cursus sed felis nec suscipit. Vivamus imperdiet dapibus sem dignissim porttitor. Morbi sagittis aliquet magna, at placerat ante. Donec vel nisi ac ante gravida condimentum. Aenean in volutpat mi.</li>';
		$output .= '</ul>'; // .cl-tabs-content
		$output .= '</div>'; // .cl-tabs

		echo $output;
	}

	/**
	 * Output form's textfield element
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_checkbox( $param, $value ) {
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$field_id = $this->get_field_id( $param['name'] );

		if ( is_array( $value ) ) {
			$current_value = $value;
		} else {
			$current_value = array( $value => 0 );
		}
		if ( isset( $param['value'] ) AND is_array( $param['value'] ) ) {
			$values = $param['value'];
		} else {
			$values = array( __( 'Yes', 'codelights' ) => 1 );
		}

		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<span class="cl-form-row-label">' . $param['heading'] . ':</span><br />';
		$output .= '</div>';

		if ( ! empty( $values ) ) {
			$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
			foreach ( $values as $label => $v ) {
				if ( count( $current_value ) > 0 AND in_array( $v, $current_value ) ) {
					$checked = ' checked';
				} else {
					$checked = '';
				}
				$output .= ' <label class="cl-checkbox-label">';
				$output .= '<input id="' . esc_attr( $field_id ) . '" value="' . $v . '" class="widefat" type="checkbox" name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '[]"' . $checked . '>';
				$output .= $label;
				$output .= '</label>';
			}
			$output .= '</div>';
		}
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output form's dropdown element
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_dropdown( $param, $value ) {
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$field_id = $this->get_field_id( $param['name'] );
		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<select name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '" id="' . esc_attr( $field_id ) . '" class="widefat">';
		if ( isset( $param['value'] ) AND is_array( $param['value'] ) ) {
			foreach ( $param['value'] as $value_title => $value_key ) {
				$output .= '<option value="' . esc_attr( $value_key ) . '"' . selected( $value, $value_key, FALSE ) . '>' . $value_title . '</option>';
			}
		}
		$output .= '</select>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output form's textarea element
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_textarea( $param, $value ) {
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$field_id = $this->get_field_id( $param['name'] );
		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<textarea class="widefat" rows="5" cols="20" id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '">' . esc_textarea( $value ) . '</textarea>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output form's textarea with TinyMCE editor
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_textarea_html( $param, $value ) {
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$content = $value;
		$editor_id = $this->get_field_id( $param['name'] );
		$editor_name = $this->get_field_name( $param['name'] );
		$settings = array(
			'media_buttons' => TRUE,
			'textarea_name' => $editor_name,
			'wpautop' => FALSE,
			'default_editor' => 'tmce',
		);

		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . ' cl-widget-textarea-html-wrapper">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';

		ob_start();
		wp_editor( $content, $editor_id, $settings );
		$output .= ob_get_contents();
		ob_end_clean();

		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output's exploded textarea
	 * Data saved and coma-separated values are merged with line breaks and returned in a textarea.
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_textarea_exploded( $param, $value ) {
		$value = str_replace( ",", "\n", $value );
		$field_id = $this->get_field_id( $param['name'] );
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<textarea id="' . $field_id . '" name="' . $this->get_field_name( $param['name'] ) . '" class="widefat">' . esc_attr( $value ) . '</textarea>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output's textarea with raw html
	 * This attribute type allows safely add custom html to your post/page.
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_textarea_raw_html( $param, $value ) {
		$field_id = $this->get_field_id( $param['name'] );
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<textarea id="' . $field_id . '" name="' . $this->get_field_name( $param['name'] ) . '" class="widefat" rows="16">' . htmlentities( rawurldecode( base64_decode( $value ) ), ENT_COMPAT, 'UTF-8' ) . '</textarea>';
		$output .= '<input id="' . $this->get_field_id( 'raw_area_html_field' ) . '" name="' . $this->get_field_name( 'raw_area_html_field' ) . '" type="hidden" value="' . $param['name'] . '">';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	/**
	 * Output's color picker
	 *
	 * @param array $param Parameter from config
	 * @param string $value Current value
	 */
	public function form_colorpicker( $param, $value ) {
		$field_id = $this->get_field_id( $param['name'] );
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<input id="' . esc_attr( $field_id ) . '" data-default-color="' . esc_attr( $param['std'] ) . '" name="' . $this->get_field_name( $param['name'] ) . '" class="cl-color-picker" value="' . esc_attr( $value ) . '"/>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	public function form_attach_images( $param, $value ) {
		$rand = rand( 0, 9999 );

		if ( strpos( $value, ',' ) !== FALSE ) {
			$images = array_map( 'intval', explode( ',', $value ) );
		} elseif ( $value != '' ) {
			$images = (integer) $value;
		}

		$field_id = $this->get_field_id( $param['name'] );
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div id="cl-attach-images-group-' . $rand . '" class="cl-form-row for_' . esc_attr( $param['name'] ) . ' cl-attach-images-group">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<ul id="cl-images-container-' . $rand . '" class="cl-images-container ui-sortable sortable-attachment-list">';
		$has_images = FALSE;
		if ( is_array( $images ) AND ! empty( $images ) ) {
			foreach ( $images as $image ) {
				$output .= '<li class="attachments-thumbnail ui-sortable-handle" id="' . $image . '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' . $image . '">&times;</a></span><div class="centered">' . wp_get_attachment_image( $image ) . '</div></li>';
			}
			$has_images = TRUE;
		} elseif ( ! is_array( $images ) AND $images != '' ) {
			$output .= '<li class="attachments-thumbnail ui-sortable-handle" id="' . $images . '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' . $images . '">&times;</a></span><div class="centered">' . wp_get_attachment_image( $images ) . '</div></li>';
			$has_images = TRUE;
		}
		$output .= '</ul>';
		if ( $param['multiple'] == 'false' AND $has_images === TRUE ) {
			$style = 'style="display:none;"';
		}
		$output .= '<a id="cl-widget-add_images-button-' . $rand . '" ' . $style . ' class="cl_widget_add_images_button" title="' . __( 'Add images', 'codelights' ) . '" href="#">' . __( 'Add images', 'codelights' ) . '</a>';

		$output .= '<input type="hidden" id="' . esc_attr( $field_id ) . '" class="cl-attached-images" name="' . $this->get_field_name( $param['name'] ) . '" value="' . esc_attr( $value ) . '"/>';
		$output .= '<input type="hidden" class="multiple-attachments" name="' . $this->get_field_name( 'multiple_value' ) . '" value="' . esc_attr( $param['multiple'] ) . '"/>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	public function form_insert_link( $param, $value ) {
		$field_id = $this->get_field_id( $param['name'] );
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		if ( ! empty ( $value ) AND strpos( $value, '|' ) !== FALSE ) {
			$stored_values = explode( '|', $value );
		}
		$url_components = array();
		foreach ( $stored_values as $url_element ) {
			$key_val = explode( ':', $url_element );
			$key = $key_val[0];
			$val = $key_val[1];
			$url_components[ $key ] = $val;
		}

		$output = '<div class="cl-form-row for_' . esc_attr( $param['name'] ) . '">';
		$output .= '<div class="cl-form-row-label label_' . esc_attr( $param['type'] ) . '">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<textarea id="' . esc_attr( $field_id ) . '" name="' . $this->get_field_name( $param['name'] ) . '" class="cl-insert-link-container">' . esc_attr( $value ) . '</textarea>';
		$output .= '<a id="insert_wp_link" class="button button-default button-large cl-insert-link-button" href="#">' . __( 'Insert link', 'codelights' ) . '</a>';
		$output .= '<span class="cl-linkdialog-label">' . __( 'Title:', 'codelights' ) . '</span>';
		$output .= '<span class="cl-linkdialog-title">' . esc_attr( urldecode( $url_components['title'] ) ) . '</span>';
		$output .= '<span class="cl-linkdialog-label">' . __( 'URL:', 'codelights' ) . '</span>';
		$output .= '<span class="cl-linkdialog-url">' . esc_attr( urldecode( $url_components['url'] ) ) . '</span>';
		$output .= '<span class="cl-linkdialog-target">' . esc_attr( urldecode( $url_components['target'] ) ) . '</span>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description description_' . esc_attr( $param['type'] ) . '">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';
		echo $output;
	}

	public function update( $new_instance, $old_instance ) {
		$instance = $new_instance;

		// encode raw html
		$raw_area_html_field = $new_instance['raw_area_html_field'];
		$raw_html_value = base64_encode( $new_instance[ $raw_area_html_field ] );
		$instance[ $raw_area_html_field ] = $raw_html_value;

		return $instance;
	}

}

//add_action( 'widgets_init', 'cl_widgets_init' );
function cl_widgets_init() {
	$config = cl_config( 'widgets', array() );
	foreach ( $config as $widget_id => $widget ) {
		if ( ! isset( $widget['class'] ) ) {
			wp_die( 'Widget class should be defined for ' . $widget_id );
		}
		if ( ! class_exists( $widget['class'] ) ) {
			$filepath = cl_locate_file( 'widgets/' . $widget_id . '.php' );
			if ( $filepath === FALSE ) {
				continue;
			}
			include $filepath;
			if ( ! class_exists( $widget['class'] ) ) {
				wp_die( 'Widget class ' . $widget['class'] . ' is not found at ' . $filepath );
			}
		}
		register_widget( $widget['class'] );
	}
}
