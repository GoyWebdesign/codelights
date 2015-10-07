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
		$instance['classname'] = ( isset( $instance['classname'] ) AND ! empty( $instance['classname'] ) ) ? $instance['classname'] : '';
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

		uasort( $this->config['params'], array( 'CL_Widget', 'sort_by_weight' ) );

		echo '<div class="cl-widgetform"><div class="cl-widgetform-h">';

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
	 *
	 */
	private static function vendor_prefixes( $field_class ) {
		$row_class = str_ireplace( 'vc_col', 'cl-col', $field_class );
		$row_class = esc_attr( $row_class );

		return $row_class;
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];

		$output = '<div class="cl-tabs">';
		$output .= '<nav>';
		$output .= '<ul class="cl-tabs-navigation">';
		$output .= '<li><a data-content="first-tab" class="selected" href="#0">First tab</a></li>';
		$output .= '<li><a data-content="second-tab" href="#1">Second tab</a></li>';
		$output .= '</ul>'; // .cl-tabs-navigation
		$output .= '</nav>';

		$output .= '<ul class="cl-tabs-content">';
		$output .= '<li data-content="first-tab" class="selected">';
		// form output start
		$output .= '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" ' . cl_array_to_data_js( $js_data ) . '>';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<input class="widefat" id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $field_name ) . '" type="text" value="' . esc_attr( $value ) . '" />';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];

		if ( is_array( $param['value'] ) ) {
			$values = $param['value'];
		} else {
			$values = array( __( 'Yes', 'codelights' ) => 'yes' );
		}

		if ( strpos( $value, ',' ) !== FALSE ) {
			// if list of values is array (multiple checkbox)
			$current_values = explode( ',', $value );
		} else {
			// if list of values is string (single checkbox)
			$current_values = array( __( 'Yes', 'codelights' ) => $value );
		}

		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . '  type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<span class="cl-form-row-label">' . $param['heading'] . ':</span><br />';
		$output .= '</div>';

		if ( ! empty( $values ) ) {
			$output .= '<div class="cl-form-row-field">';
			foreach ( $values as $label => $v ) {
				if ( count( $current_values ) > 0 AND in_array( $v, $current_values ) ) {
					$checked = 'checked="checked"';
				} else {
					$checked = '';
				}
				$output .= ' <label class="cl-checkbox-label">';
				$output .= '<input value="' . $v . '" class="widefat" type="checkbox" ' . $checked . '>';
				$output .= $label;
				$output .= '</label>';
			}
			$output .= '</div>';
		}
		$output .= '<input type="hidden" id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $field_name ) . '" value="' . esc_attr( $value ) . '">';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];

		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<select name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '" id="' . esc_attr( $field_id ) . '" class="widefat">';
		if ( isset( $param['value'] ) AND is_array( $param['value'] ) ) {
			foreach ( $param['value'] as $value_title => $value_key ) {
				$output .= '<option value="' . esc_attr( $value_key ) . '"' . selected( $value, $value_key, FALSE ) . '>' . $value_title . '</option>';
			}
		}
		$output .= '</select>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];

		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<textarea class="widefat" rows="5" cols="20" id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $this->get_field_name( $param['name'] ) ) . '">' . esc_textarea( $value ) . '</textarea>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_id = $this->get_field_id( $param['name'] );
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
		$content = $value;
		$editor_id = $this->get_field_id( $param['name'] );
		$editor_name = $this->get_field_name( $param['name'] );
		$settings = array(
			'media_buttons' => TRUE,
			'textarea_name' => $editor_name,
			'wpautop' => FALSE,
			'default_editor' => 'tmce',
		);

		$output = '<div class="cl-form-row ' . $row_class . ' type_' . esc_attr( $param['type'] ) . ' for_' . esc_attr( $param['name'] ) . ' cl-widget-textarea-html-wrapper" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';

		ob_start();
		wp_editor( $content, $editor_id, $settings );
		$output .= ob_get_contents();
		ob_end_clean();

		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$value_visible = str_replace( ",", "\n", $value );
		$field_id = $this->get_field_id( $param['name'] );
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field input_' . esc_attr( $param['type'] ) . '">';
		$output .= '<textarea class="widefat cl-textarea-exploded-content">' . esc_attr( $value_visible ) . '</textarea>';
		$output .= '<textarea id="' . esc_attr( $field_id ) . '" name="' . esc_attr( $field_name ) . '" class="cl-textarea-exploded-values">' . esc_attr( $value ) . '</textarea>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<textarea id="' . $field_id . '" class="widefat" rows="16"></textarea>';
		$output .= '<input type="hidden" name="' . esc_attr( $field_name ) . '" value="' . esc_attr( $value ) . '">';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
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
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<input id="' . esc_attr( $field_id ) . '" data-default-color="' . esc_attr( $param['std'] ) . '" name="' . $this->get_field_name( $param['name'] ) . '" class="cl-color-picker" value="' . esc_attr( $value ) . '"/>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	public function form_attach_image( $param, $value ) {
		$param['multiple'] = FALSE;
		$this->form_attach_images( $param, $value );
	}

	public function form_attach_images( $param, $value ) {
		if ( strpos( $value, ',' ) !== FALSE ) {
			$images = array_map( 'intval', explode( ',', $value ) );
		} elseif ( $value != '' ) {
			$images = (int) $value;
		}

		$param['multiple'] = ( ! isset( $param['multiple'] ) OR $param['multiple'] );
		if ( $param['multiple'] === TRUE ) {
			$multiple_class = 'multiple';
		} else {
			$multiple_class = '';
		}

		$field_id = $this->get_field_id( $param['name'] );
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
		$param['heading'] = isset( $param['heading'] ) ? $param['heading'] : $param['name'];
		$output = '<div class="cl-form-row ' . $row_class . ' ' . $multiple_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . ' cl-attach-images-group" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<ul class="cl-images-container ui-sortable sortable-attachment-list">';
		$has_images = FALSE;
		if ( is_array( $images ) AND ! empty( $images ) ) {
			foreach ( $images as $image ) {
				$output .= '<li class="attachments-thumbnail ui-sortable-handle" data-image="' . $image . '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' . $image . '">&times;</a></span><div class="centered">' . wp_get_attachment_image( $image ) . '</div></li>';
			}
			$has_images = TRUE;
		} elseif ( ! is_array( $images ) AND $images != '' ) {
			$output .= '<li class="attachments-thumbnail ui-sortable-handle" data-image="' . $images . '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' . $images . '">&times;</a></span><div class="centered">' . wp_get_attachment_image( $images ) . '</div></li>';
			$has_images = TRUE;
		}
		$output .= '</ul>';
		if ( ! $param['multiple'] AND $has_images === TRUE ) {
			$style = 'style="display:none;"';
		}
		$output .= '<a ' . $style . ' class="cl-widget-add-images-button" title="' . __( 'Add images', 'codelights' ) . '" href="javascript:void(0)">' . __( 'Add images', 'codelights' ) . '</a>';
		$output .= '<input type="hidden" id="' . esc_attr( $field_id ) . '" class="cl-attached-images" name="' . $this->get_field_name( $param['name'] ) . '" value="' . esc_attr( $value ) . '"/>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';

		echo $output;
	}

	public function form_link( $param, $value ) {
		$field_id = $this->get_field_id( $param['name'] );
		$field_name = $this->get_field_name( $param['name'] );
		$row_class = $this->vendor_prefixes( $param['edit_field_class'] );
		$js_data = $param['dependency'];
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

		$output = '<div class="cl-form-row ' . $row_class . ' for_' . esc_attr( $param['name'] ) . ' type_' . esc_attr( $param['type'] ) . '" data-name="' . esc_attr( $field_name ) . '" data-id="' . esc_attr( $field_id ) . '" data-param_settings="' . cl_array_to_data_js( $js_data ) . '">';
		$output .= '<div class="cl-form-row-label">';
		$output .= '<label for="' . esc_attr( $field_id ) . '">' . esc_attr( $param['heading'] ) . ':</label>';
		$output .= '</div>';
		$output .= '<div class="cl-form-row-field">';
		$output .= '<textarea id="' . esc_attr( $field_id ) . '" name="' . $this->get_field_name( $param['name'] ) . '" class="cl-insert-link-container">' . esc_attr( $value ) . '</textarea>';
		$output .= '<a class="button button-default button-large cl-insert-link-button" href="javascript:void(0)">' . __( 'Insert link', 'codelights' ) . '</a>';
		$output .= '<span class="cl-linkdialog-label">' . __( 'Title:', 'codelights' ) . '</span>';
		$output .= '<span class="cl-linkdialog-title">' . esc_attr( urldecode( $url_components['title'] ) ) . '</span>';
		$output .= '<span class="cl-linkdialog-label">' . __( 'URL:', 'codelights' ) . '</span>';
		$output .= '<span class="cl-linkdialog-url">' . esc_attr( urldecode( $url_components['url'] ) ) . '</span>';
		$output .= '<span class="cl-linkdialog-target">' . esc_attr( urldecode( $url_components['target'] ) ) . '</span>';
		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-form-row-description">' . esc_attr( $param['description'] ) . '</div>';
		}
		$output .= '</div>';
		echo $output;
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
