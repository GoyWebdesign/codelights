<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

global $cl_uri;

return array(

	'cl-counter' => array(
		'title' => __( 'Stats Counter', 'codelights' ),
		'description' => __( 'Animated text with numbers', 'codelights' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-counter.png',
		'widget_php_class' => 'CL_Widget_Counter',
		'params' => array(
			'initial' => array(
				'title' => __( 'Initial Counter value', 'codelights' ),
				'description' => __( 'Initial string with all the prefixes, suffixes and decimal marks if needed.', 'codelights' ),
				'type' => 'textfield',
				'std' => '0',
			),
			'final' => array(
				'title' => __( 'Final Counter value', 'codelights' ),
				'description' => __( 'Final value the way it should look like, when the animation ends.', 'codelights' ),
				'type' => 'textfield',
				'std' => '100',
			),
			'title' => array(
				'title' => __( 'Counter Title', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
			),
			'duration' => array(
				'title' => __( 'Animation Duration', 'codelights' ),
				'description' => __( 'In milliseconds', 'codelights' ),
				'type' => 'textfield',
				'std' => '3000',
				'group' => __( 'Custom', 'codelights' ),
			),
			'value_size' => array(
				'title' => __( 'Value Font Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '50',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'title_size' => array(
				'title' => __( 'Title Font Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '20',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'value_color' => array(
				'title' => __( 'Value Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'title_color' => array(
				'title' => __( 'Title Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Custom', 'codelights' ),
			),
		),
	),
	'cl-flipbox' => array(
		'title' => __( 'FlipBox', 'codelights' ),
		'description' => __( 'Two-sided content element, flipping on hover', 'codelights' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-flipbox.png',
		'widget_php_class' => 'CL_Widget_Flipbox',
		'params' => array(
			/**
			 * General
			 */
			'link_type' => array(
				'title' => __( 'Link', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'none' => __( 'No Link', 'codelights' ),
					'container' => __( 'Add link to the whole FlipBox', 'codelights' ),
					'btn' => __( 'Add link as a separate button', 'codelights' ),
				),
				'std' => 'none',
			),
			'link' => array(
				'title' => __( 'Link URL', 'codelights' ),
				'type' => 'link',
				'show_if' => array( 'link_type', 'in', array( 'container', 'btn' ) ),
			),
			'back_btn_label' => array(
				'title' => __( 'Button Label', 'codelights' ),
				'type' => 'textfield',
				'std' => 'READ MORE', // Not translatable
				'show_if' => array( 'link_type', '=', 'btn' ),
			),
			'back_btn_bgcolor' => array(
				'title' => __( 'Button Background Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'link_type', '=', 'btn' ),
			),
			'back_btn_color' => array(
				'title' => __( 'Button Text Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'link_type', '=', 'btn' ),
			),
			'animation' => array(
				'title' => __( 'Animation Type', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'cardflip' => __( 'Card Flip', 'codelights' ),
					'cubetilt' => __( 'Cube Tilt', 'codelights' ),
					'cubeflip' => __( 'Cube Flip', 'codelights' ),
					'coveropen' => __( 'Cover Open', 'codelights' ),
				),
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'direction' => array(
				'title' => __( 'Animation Direction', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'n' => __( 'Up', 'codelights' ),
					'ne' => __( 'Up-Right', 'codelights' ),
					'e' => __( 'Right', 'codelights' ),
					'se' => __( 'Down-Right', 'codelights' ),
					's' => __( 'Down', 'codelights' ),
					'sw' => __( 'Down-Left', 'codelights' ),
					'w' => __( 'Left', 'codelights' ),
					'nw' => __( 'Up-Left', 'codelights' ),
				),
				'std' => 'w',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'duration' => array(
				'title' => __( 'Animation Duration', 'codelights' ),
				'description' => __( 'In milliseconds', 'codelights' ),
				'type' => 'textfield',
				'std' => '500',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'easing' => array(
				'title' => __( 'Animation Easing', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'ease' => 'ease',
					'easeInOutExpo' => 'easeInOutExpo',
					'easeInOutCirc' => 'easeInOutCirc',
					'easeOutBack' => 'easeOutBack',
				),
				'std' => 'easeInOutSine',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			/**
			 * Front Side
			 */
			'front_icon_type' => array(
				'title' => __( 'Icon to Display', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'none' => __( 'None', 'codelights' ),
					'font' => __( 'FontAwesome Icon', 'codelights' ),
					'image' => __( 'Custom Image', 'codelights' ),
				),
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_icon_name' => array(
				'title' => __( 'Icon Name', 'codelights' ),
				'description' => sprintf( __( '<a href="%s" target="_blank">FontAwesome</a> icon', 'codelights' ), 'http://fontawesome.io/icons/' ),
				'type' => 'textfield',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'font' ),
			),
			'front_icon_size' => array(
				'title' => __( 'Icon Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '35',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'font' ),
			),
			'front_icon_style' => array(
				'title' => __( 'Icon Style', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'default' => __( 'Simple', 'codelights' ),
					'circle' => __( 'Circle Background', 'codelights' ),
					'square' => __( 'Square Background', 'codelights' ),
				),
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'font' ),
			),
			'front_icon_color' => array(
				'title' => __( 'Icon Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'font' ),
			),
			'front_icon_bgcolor' => array(
				'title' => __( 'Icon Background Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'font' ),
			),
			'front_icon_image' => array(
				'title' => __( 'Image', 'codelights' ),
				'type' => 'image',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'image' ),
			),
			'front_icon_image_width' => array(
				'title' => __( 'Image Width', 'codelights' ),
				'description' => __( 'In pixels or percents', 'codelights' ),
				'type' => 'textfield',
				'std' => '32px',
				'group' => __( 'Front Side', 'codelights' ),
				'show_if' => array( 'front_icon_type', '=', 'image' ),
			),
			'front_title' => array(
				'title' => __( 'Title', 'codelights' ),
				'type' => 'textfield',
				'std' => 'FlipBox Title', // Not translatable
				'admin_label' => TRUE,
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_title_size' => array(
				'title' => __( 'Title Font Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_desc' => array(
				'title' => __( 'Description', 'codelights' ),
				'type' => 'textarea',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_elmorder' => array(
				'title' => __( 'Elements Order', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'itd' => __( 'Icon', 'codelights' ) . ' / ' . __( 'Title', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ),
					'tid' => __( 'Title', 'codelights' ) . ' / ' . __( 'Icon', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ),
					'tdi' => __( 'Title', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ) . ' / ' . __( 'Icon', 'codelights' ),
				),
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_bgcolor' => array(
				'title' => __( 'Background Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_textcolor' => array(
				'title' => __( 'Text Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_bgimage' => array(
				'title' => __( 'Background Image', 'codelights' ),
				'type' => 'image',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
			),
			'front_bgimage_size' => array(
				'title' => __( 'Image Size', 'codelights' ),
				'type' => 'select',
				'options' => cl_image_sizes_select_values(),
				'std' => 'full',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Front Side', 'codelights' ),
			),
			/**
			 * Back Side
			 */
			'back_title' => array(
				'title' => __( 'Title', 'codelights' ),
				'type' => 'textfield',
				'std' => 'FlipBox Title', // Not translatable
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_title_size' => array(
				'title' => __( 'Title Font Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_desc' => array(
				'title' => __( 'Description', 'codelights' ),
				'type' => 'textarea',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_elmorder' => array(
				'title' => __( 'Elements Order', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'tdb' => __( 'Title', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ) . ' / ' . __( 'Button (if exists)', 'codelights' ),
					'tbd' => __( 'Title', 'codelights' ) . ' / ' . __( 'Button (if exists)', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ),
					'btd' => __( 'Button (if exists)', 'codelights' ) . ' / ' . __( 'Title', 'codelights' ) . ' / ' . __( 'Description', 'codelights' ),
				),
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_bgcolor' => array(
				'title' => __( 'Background Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_textcolor' => array(
				'title' => __( 'Text Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_bgimage' => array(
				'title' => __( 'Background Image', 'codelights' ),
				'type' => 'image',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Back Side', 'codelights' ),
			),
			'back_bgimage_size' => array(
				'title' => __( 'Image Size', 'codelights' ),
				'type' => 'select',
				'options' => cl_image_sizes_select_values(),
				'std' => 'full',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Back Side', 'codelights' ),
			),
			/**
			 * Custom
			 */
			'width' => array(
				'title' => __( 'Width', 'codelights' ),
				'description' => __( 'In pixels or percents', 'codelights' ),
				'type' => 'textfield',
				'std' => '100%',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'height' => array(
				'title' => __( 'Height', 'codelights' ),
				'description' => __( 'Leave blank to use front height', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'valign' => array(
				'type' => 'checkboxes',
				'options' => array(
					'center' => __( 'Center-Align Content Vertically', 'codelights' ),
				),
				'std' => 'top',
				'group' => __( 'Custom', 'codelights' ),
			),
			'border_radius' => array(
				'title' => __( 'Border Radius', 'codelights' ),
				'type' => 'textfield',
				'std' => '0',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'border_size' => array(
				'title' => __( 'Border Width', 'codelights' ),
				'type' => 'textfield',
				'std' => '0',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'border_color' => array(
				'title' => __( 'Border Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'padding' => array(
				'title' => __( 'Padding', 'codelights' ),
				'description' => __( 'In pixels or percents', 'codelights' ),
				'type' => 'textfield',
				'std' => '15%',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Custom', 'codelights' ),
			),
		),
	),
	'cl-ib' => array(
		'title' => __( 'Interactive Banner', 'codelights' ),
		'description' => __( 'Hoverable image with additional data', 'codelights' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-ib.png',
		'widget_php_class' => 'CL_Widget_Ib',
		'params' => array(
			/**
			 * Content
			 */
			'image' => array(
				'title' => __( 'Banner Image', 'codelights' ),
				'type' => 'image',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'size' => array(
				'title' => __( 'Image Size', 'codelights' ),
				'type' => 'select',
				'options' => cl_image_sizes_select_values(),
				'std' => 'large',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'title' => array(
				'title' => __( 'Title', 'codelights' ),
				'type' => 'textfield',
				'std' => 'Banner Title', // Not translatable
				'admin_label' => TRUE,
			),
			'desc' => array(
				'title' => __( 'Description', 'codelights' ),
				'type' => 'textarea',
			),
			'link' => array(
				'title' => __( 'Link', 'codelights' ),
				'type' => 'link',
			),
			'animation' => array(
				'title' => __( 'Animation Type', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'melete' => 'Melete',
					'soter' => 'Soter',
					'phorcys' => 'Phorcys',
					'aidos' => 'Aidos',
					'caeros' => 'Caeros',
					'hebe' => 'Hebe',
					'aphelia' => 'Aphelia',
					'nike' => 'Nike',
				),
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'easing' => array(
				'title' => __( 'Animation Easing', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'ease' => 'ease',
					'easeInOutExpo' => 'easeInOutExpo',
					'easeInOutCirc' => 'easeInOutCirc',
					'easeOutBack' => 'easeOutBack',
				),
				'std' => 'ease',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			/**
			 * Style
			 */
			'bgcolor' => array(
				'title' => __( 'Background Color', 'codelights' ),
				'type' => 'color',
				'std' => '#444444',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'textcolor' => array(
				'title' => __( 'Text Color', 'codelights' ),
				'type' => 'color',
				'std' => '#ffffff',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'ratio' => array(
				'title' => __( 'Aspect Ratio', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'2x1' => '2x1 (' . __( 'Landscape', 'codelights' ) . ')',
					'3x2' => '3x2 (' . __( 'Landscape', 'codelights' ) . ')',
					'4x3' => '4x3 (' . __( 'Landscape', 'codelights' ) . ')',
					'1x1' => '1x1 (' . __( 'Square', 'codeligths' ) . ')',
					'3x4' => '3x4 (' . __( 'Portrait', 'codelights' ) . ')',
					'2x3' => '2x3 (' . __( 'Portrait', 'codelights' ) . ')',
					'1x2' => '1x2 (' . __( 'Portrait', 'codelights' ) . ')',
				),
				'std' => '3x2',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'align' => array(
				'title' => __( 'Text Alignment', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'left' => __( 'Left', 'codelights' ),
					'center' => __( 'Center', 'codelights' ),
					'right' => __( 'Right', 'codelights' ),
				),
				'std' => 'center',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'width' => array(
				'title' => __( 'Width', 'codelights' ),
				'description' => __( 'In pixels or percents', 'codelights' ),
				'type' => 'textfield',
				'std' => '100%',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'padding' => array(
				'title' => __( 'Padding', 'codelights' ),
				'description' => __( 'In pixels or percents', 'codelights' ),
				'type' => 'textfield',
				'std' => '10%',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Style', 'codelights' ),
			),
			/**
			 * Typography
			 */
			'title_size' => array(
				'title' => __( 'Title Font Size', 'codelights' ),
				'description' => '',
				'type' => 'textfield',
				'std' => '30px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Typography', 'codelights' ),
			),
			'desc_size' => array(
				'title' => __( 'Description Font Size', 'codelights' ),
				'description' => '',
				'type' => 'textfield',
				'std' => '16px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Typography', 'codelights' ),
			),
			'title_mobile_size' => array(
				'title' => __( 'Title Font Size for Mobiles', 'codelights' ),
				'description' => __( 'This value will be applied when screen width is less than 600px', 'codelights' ),
				'type' => 'textfield',
				'std' => '24px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Typography', 'codelights' ),
			),
			'desc_mobile_size' => array(
				'title' => __( 'Description Size for Mobiles', 'codelights' ),
				'description' => __( 'This value will be applied when screen width is less than 600px', 'codelights' ),
				'type' => 'textfield',
				'std' => '16px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Typography', 'codelights' ),
			),
			'title_tag' => array(
				'title' => __( 'Title Tag Name', 'codelights' ),
				'description' => __( 'Used for SEO purposes', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'h1' => 'h1',
					'h2' => 'h2',
					'h3' => 'h3',
					'h4' => 'h4',
					'h5' => 'h5',
					'h6' => 'h6',
					'div' => 'div',
				),
				'std' => 'h4',
				'group' => __( 'Typography', 'codelights' ),
			),
		),
	),
	'cl-itext' => array(
		'title' => __( 'Interactive Text', 'codelighs' ),
		'description' => __( 'Text with some dynamicatlly changing part', 'codelighs' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-itext.png',
		'widget_php_class' => 'CL_Widget_Itext',
		'params' => array(
			/**
			 * General
			 */
			'texts' => array(
				'title' => __( 'Text States', 'codelights' ),
				'description' => __( 'Each state from a new line', 'codelights' ),
				'type' => 'textarea',
				'std' => 'We create great design' . "\n" . 'We create great websites' . "\n" . 'We create great code',
			),
			'dynamic_bold' => array(
				'title' => '',
				'type' => 'checkboxes',
				'options' => array(
					TRUE => __( 'Bold Dynamic Text', 'codelights' ),
				),
				'std' => TRUE,
			),
			'animation_type' => array(
				'title' => __( 'Animation Type', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'fadeIn' => __( 'Fade in the whole part', 'codelights' ),
					'flipInX' => __( 'Flip the whole part', 'codelights' ),
					'flipInXChars' => __( 'Flip character by character', 'codelights' ),
					'zoomIn' => __( 'Zoom in the whole part', 'codelights' ),
					'zoomInChars' => __( 'Zoom in character by character', 'codelights' ),
				),
				'std' => 'fadeIn',
			),
			/**
			 * Custom
			 */
			'font_size' => array(
				'title' => __( 'Font Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '50px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'font_size_mobile' => array(
				'title' => __( 'Font Size for Mobiles', 'codelights' ),
				'description' => __( 'This value will be applied when screen width is less than 600px', 'codelights' ),
				'type' => 'textfield',
				'std' => '30px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'color' => array(
				'title' => __( 'Basic Text Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'dynamic_color' => array(
				'title' => __( 'Dynamic Text Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'align' => array(
				'title' => __( 'Text Alignment', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'left' => __( 'Left', 'codelights' ),
					'center' => __( 'Center', 'codelights' ),
					'right' => __( 'Right', 'codelights' ),
				),
				'std' => 'center',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'tag' => array(
				'title' => __( 'Tag Name', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'div' => 'div',
					'h1' => 'h1',
					'h2' => 'h2',
					'h3' => 'h3',
					'h4' => 'h4',
					'h5' => 'h5',
					'h6' => 'h6',
					'p' => 'p',
				),
				'std' => 'h2',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'duration' => array(
				'title' => __( 'Animation Duration', 'codelights' ),
				'description' => __( 'In milliseconds', 'codelights' ),
				'type' => 'textfield',
				'std' => '300',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'delay' => array(
				'title' => __( 'Animation Delay', 'codelights' ),
				'description' => __( 'In seconds', 'codelights' ),
				'type' => 'textfield',
				'std' => '5',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Custom', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Custom', 'codelights' ),
			),
		),
	),
	'cl-popup' => array(
		'title' => __( 'Modal Popup', 'codelights' ),
		'description' => __( 'Dialog box displayed above the page content', 'codelights' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-popup.png',
		'widget_php_class' => 'CL_Widget_Modal',
		'params' => array(
			/**
			 * General
			 */
			'title' => array(
				'title' => __( 'Popup Title', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
			),
			'content' => array(
				'title' => __( 'Popup Content', 'codelights' ),
				'type' => 'html',
				'std' => '',
			),
			/**
			 * Trigger
			 */
			'show_on' => array(
				'title' => __( 'Show Popup On', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'btn' => __( 'Button Click', 'codelights' ),
					'text' => __( 'Text Click', 'codelights' ),
					'image' => __( 'Image Click', 'codelights' ),
					'load' => __( 'Page Load', 'codelights' ),
				),
				'std' => 'btn',
				'group' => __( 'Trigger', 'codelights' ),
			),
			'btn_label' => array(
				'title' => __( 'Button / Text Label', 'codelights' ),
				'type' => 'textfield',
				'std' => 'READ MORE', // Not translatable
				'show_if' => array( 'show_on', 'in', array( 'btn', 'text' ) ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'btn_bgcolor' => array(
				'title' => __( 'Button Background Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'btn' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'btn_color' => array(
				'title' => __( 'Button Text Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'btn' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'image' => array(
				'title' => __( 'Image', 'codelights' ),
				'type' => 'image',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'image' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'image_size' => array(
				'title' => __( 'Image Size', 'codelights' ),
				'type' => 'select',
				'options' => cl_image_sizes_select_values(),
				'std' => 'large',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'image' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'text_size' => array(
				'title' => __( 'Text Size', 'codelights' ),
				'type' => 'textfield',
				'std' => '',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'text' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'text_color' => array(
				'title' => __( 'Text Color', 'codelights' ),
				'type' => 'color',
				'classes' => 'cl_col-sm-6 cl_column',
				'show_if' => array( 'show_on', '=', 'text' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'align' => array(
				'title' => __( 'Button / Image / Text Alignment', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'left' => __( 'Left', 'codelights' ),
					'center' => __( 'Center', 'codelights' ),
					'right' => __( 'Right', 'codelights' ),
				),
				'std' => 'left',
				'show_if' => array( 'show_on', 'in', array( 'btn', 'image', 'text' ) ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			'show_delay' => array(
				'title' => __( 'Popup Show Delay', 'codelights' ),
				'description' => __( 'In seconds', 'codelights' ),
				'type' => 'textfield',
				'std' => '2',
				'show_if' => array( 'show_on', '=', 'load' ),
				'group' => __( 'Trigger', 'codelights' ),
			),
			/**
			 * Popup Style
			 */
			'size' => array(
				'title' => __( 'Popup Size', 'codelights' ),
				'type' => 'select',
				'options' => array(
					's' => __( 'Small', 'codelights' ),
					'm' => __( 'Medium', 'codelights' ),
					'l' => __( 'Large', 'codelights' ),
					'xl' => __( 'Huge', 'codelights' ),
					'f' => __( 'Fullscreen', 'codelights' ),
				),
				'group' => __( 'Style', 'codelights' ),
			),
			'paddings' => array(
				'type' => 'checkboxes',
				'options' => array(
					'none' => __( 'Remove white space around popup content', 'codelights' ),
				),
				'std' => 'default',
				'group' => __( 'Style', 'codelights' ),
			),
			'animation' => array(
				'title' => __( 'Appearance Animation', 'codelights' ),
				'type' => 'select',
				'options' => array(
					// Inspired by http://tympanus.net/Development/ModalWindowEffects/
					'fadeIn' => __( 'Fade In', 'codelights' ),
					'scaleUp' => __( 'Scale Up', 'codelights' ),
					'scaleDown' => __( 'Scale Down', 'codelights' ),
					'slideTop' => __( 'Slide from Top', 'codelights' ),
					'slideBottom' => __( 'Slide from Bottom', 'codelights' ),
					'flipHor' => __( '3D Flip (Horizontal)', 'codelights' ),
					'flipVer' => __( '3D Flip (Vertical)', 'codelights' ),
				),
				'group' => __( 'Style', 'codelights' ),
			),
			'border_radius' => array(
				'title' => __( 'Border Radius', 'codelights' ),
				'type' => 'textfield',
				'std' => '0',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'overlay_bgcolor' => array(
				'title' => __( 'Overlay Background Color', 'codelights' ),
				'type' => 'color',
				'std' => 'rgba(0,0,0,0.75)',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'title_bgcolor' => array(
				'title' => __( 'Header Background Color', 'codelights' ),
				'type' => 'color',
				'std' => '#f2f2f2',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'title_textcolor' => array(
				'title' => __( 'Header Text Color', 'codelights' ),
				'type' => 'color',
				'std' => '#666666',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'content_bgcolor' => array(
				'title' => __( 'Content Background Color', 'codelights' ),
				'type' => 'color',
				'std' => '#ffffff',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'content_textcolor' => array(
				'title' => __( 'Content Text Color', 'codelights' ),
				'type' => 'color',
				'std' => '#333333',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Style', 'codelights' ),
			),
		),
	),
	'cl-review' => array(
		'title' => __( 'Testimonial', 'codelights' ),
		'description' => __( 'Client\'s review about a product or service', 'codelights' ),
		'category' => 'CodeLights',
		'icon' => $cl_uri . '/admin/img/cl-review.png',
		'widget_php_class' => 'CL_Widget_Review',
		'params' => array(
			/**
			 * General
			 */
			'quote' => array(
				'title' => __( 'Quote Text', 'codelights' ),
				'type' => 'textarea',
				'std' => 'This product is really awesome!',
			),
			'author' => array(
				'title' => __( 'Author Name', 'codelights' ),
				'type' => 'textfield',
				'std' => 'John Smith',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'occupation' => array(
				'title' => __( 'Author Description', 'codelights' ),
				'type' => 'textfield',
				'std' => 'Head of ACME',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'avatar_image' => array(
				'title' => __( 'Author Photo', 'codelights' ),
				'type' => 'image',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'source' => array(
				'title' => __( 'Author Link', 'codelights' ),
				'type' => 'link',
				'classes' => 'cl_col-sm-6 cl_column',
			),
			'type' => array(
				'title' => __( 'Review Type', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'quote' => __( 'Quote Text Only', 'codelights' ),
					'doc' => __( 'With Scanned Document', 'codelights' ),
					'video' => __( 'With Video', 'codelights' ),
				),
			),
			'doc' => array(
				'title' => __( 'Scanned Document', 'codelights' ),
				'type' => 'image',
				'show_if' => array( 'type', '=', 'doc' ),
			),
			'video' => array(
				'title' => __( 'Video URL to Embed', 'codelights' ),
				'type' => 'textfield',
				'std' => 'https://vimeo.com/146383727',
				'show_if' => array( 'type', '=', 'video' ),
			),
			'layout' => array(
				'title' => __( 'Quote Style', 'codelights' ),
				'type' => 'select',
				'options' => array(
					'clean' => __( 'Clean', 'codelights' ),
					'centered' => __( 'Centered', 'codelights' ),
					'balloon' => __( 'Speech Balloon', 'codelights' ),
					'framed' => __( 'Framed', 'codelights' ),
					'modern' => __( 'Modern', 'codelights' ),
				),
				'group' => __( 'Style', 'codelights' ),
			),
			'bg_color' => array(
				'title' => __( 'Background Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Style', 'codelights' ),
				'show_if' => array( 'layout', 'in', array( 'balloon', 'framed', 'modern' ) ),
			),
			'text_color' => array(
				'title' => __( 'Text Color', 'codelights' ),
				'type' => 'color',
				'group' => __( 'Style', 'codelights' ),
				'show_if' => array( 'layout', 'in', array( 'balloon', 'framed', 'modern' ) ),
			),
			'quote_size' => array(
				'title' => __( 'Quote Text Size', 'codelights' ),
				'description' => '',
				'type' => 'textfield',
				'std' => '18px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'author_size' => array(
				'title' => __( 'Author Text Size', 'codelights' ),
				'description' => '',
				'type' => 'textfield',
				'std' => '14px',
				'classes' => 'cl_col-sm-6 cl_column',
				'group' => __( 'Style', 'codelights' ),
			),
			'italic' => array(
				'title' => '',
				'type' => 'checkboxes',
				'options' => array(
					TRUE => __( 'Make Quote Text italic', 'codelights' ),
				),
				'std' => TRUE,
				'group' => __( 'Style', 'codelights' ),
			),
			'el_class' => array(
				'title' => __( 'Extra class name', 'codelights' ),
				'description' => __( 'If you wish to style particular content element differently, then use this field to add a class name and then refer to it in your css file.', 'codelights' ),
				'type' => 'textfield',
				'group' => __( 'Style', 'codelights' ),
			),
		),
	),
);
