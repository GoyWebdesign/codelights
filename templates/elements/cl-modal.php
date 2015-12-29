<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Modal Popup element.
 *
 * @var $title string Modal title
 * @var $content string Modal HTML content
 * @var $show_on string Show modal on: 'btn' / 'image' / 'text' / 'load'
 * @var $btn_label string Button label
 * @var $btn_bgcolor string Button background color
 * @var $btn_color string Button text color
 * @var $image int ID of the WP attachment image
 * @var $image_size string WordPress image thumbnail name
 * @var $text_label string Text label
 * @var $text_color string Text color
 * @var $align string Button / image / text alignment: 'left' / 'center' / 'right'
 * @var $show_delay int Modal box show delay (in ms)
 * @var $size string Modal box size: 's' / 'm' / 'l' / 'f'
 * @var $animation string 'scaleUp' / 'slideRight' / 'slideBottom' / 'newspaper' / 'fall' / 'stickyTop' / 'stickyBottom' / 'flipHor' / 'flipVer' / 'scaleDown'
 * @var $overlay_bgcolor string Overlay background color
 * @var $title_bgcolor string Title background color
 * @var $title_textcolor string Title text color
 * @var $content_bgcolor string Content background color
 * @var $content_textcolor string Content text color
 * @var $border_radius int Border radius
 * @var $el_class string Extra class name
 */

// Enqueuing the needed assets
wp_enqueue_style( 'cl-modal' );
wp_enqueue_script( 'cl-modal' );

// Main element classes
$classes = ' align_' . $align;
if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}

$output = '<div class="cl-modal' . $classes . '">';

// Trigger
if ( $show_on == 'image' AND ! empty( $image ) AND ( $image_html = wp_get_attachment_image( $image, $image_size ) ) ) {
	$output = '<a href="javascript:void(0)" class="cl-modal-trigger type_image">' . $image_html . '</a>';
} elseif ( $show_on == 'text' ) {
	$output = '<a href="javascript:void(0)" class="cl-modal-trigger type_text"';
	$output .= cl_prepare_inline_css( array(
		'color' => $text_color,
	) );
	$output .= '>' . $text_label . '</a>';
} elseif ( $show_on == 'load' ) {
	$output .= '<span class="cl-modal-trigger type_load" data-delay="' . intval( $show_delay ) . '"></span>';
} else/*if ( $show_on == 'btn' )*/ {
	$output .= '<a href="javascript:void(0)" class="cl-modal-trigger type_btn cl-btn"';
	$output .= cl_prepare_inline_css( array(
		'color' => $btn_color,
		'background-color' => $btn_bgcolor,
	) );
	$output .= '>' . $btn_label . '</a>';
}

// Overlay
$output .= '<div class="cl-modal-overlay"';
$output .= cl_prepare_inline_css( array(
	'background-color' => $overlay_bgcolor,
) );
$output .= '></div>';

// The part that will be shown
$box_classes = ' size_' . $size . ' animation_' . $animation;
$output .= '<div class="cl-modal-box"';
$output .= cl_prepare_inline_css( array(
	'border-radius' => $border_radius,
) );
$output .= '><div class="cl-modal-box-h">';

// Modal box title
if ( ! empty( $title ) ) {
	$output .= '<div class="cl-modal-box-title"';
	$output .= cl_prepare_inline_css( array(
		'color' => $title_textcolor,
		'background-color' => $title_bgcolor,
	) );
	$output .= '>' . $title . '</div>';
}

// Modal box content
$output .= '<div class="cl-modal-box-content"';
$output .= cl_prepare_inline_css( array(
	'color' => $content_textcolor,
	'background-color' => $content_bgcolor,
) );
$output .= '>' . $content . '</div>';

$output .= '</div></div>';

$output .= '</div>';

echo $output;
