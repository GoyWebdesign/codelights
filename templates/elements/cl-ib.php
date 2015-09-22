<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Ineractive Banner element.
 *
 * @var $image int ID of the WP attachment image
 * @var $size string WordPress image resize name
 * @var $title string
 * @var $title_size int Title font size in percents relative to banner width (e.g. '6%')
 * @var $text string
 * @var $text_size int Text font size in percents relative to banner width (e.g. '4%')
 * @var $icon string
 * @var $icon_size int Icon font size in percents relative to banner width (e.g. '6%')
 * @var $link_type string Type of link: 'none' / 'banner' / 'btn'
 * @var $btn_label string
 * @var $btn_size int Button font size in percents relative to banner width (e.g. '4%')
 * @var $btn_color string
 * @var $btn_bgcolor string
 * @var $link string URL of the overall element or button in a 'vc_link' format
 * @var $animation string Animation type: 'melete' / 'soter' / 'phorcys' / 'aidos' / ...
 * @var $direction string Animation direction: 'n' / 'e' / 's' / 'w'
 * @var $animation_duration string In milliseconds: '100ms' / '200ms' / ... / '900ms'
 * @var $animation_easing string Easing CSS class name
 * @var $width mixed In pixels or percents: '100' / '100%'
 * @var $ratio string Aspect ratio: '2x1' / '3x2' / '4x3' / '1x1' / '3x4' / '2x3' / '1x2'
 * @var $el_class string Extra class name
 */

// Main element classes, inner css and additional attributes
$classes = ' animation_' . $animation . ' direction_' . $direction;
$classes .= ' ratio_' . $ratio;

$tag = 'div';
$atts = '';
if ( ! empty( $link ) ) {
	$link = cl_parse_vc_link( $link );
	if ( $link_type == 'banner' ) {
		// Altering whole element's div with anchor when it has a link
		$tag = 'a';
		$atts .= ' href="' . esc_attr( $link['url'] ) . '" title="' . esc_attr( $link['title'] ) . '" target="' . esc_attr( $link['target'] ) . '"';
	}
}

$icon_html = '';
if ( ! empty( $icon ) ) {
	cl_enqueue_assets( 'font-awesome' );
	$icon_html .= '<div class="cl-ib-icon"';
	if ( ! empty( $icon_size ) ) {
		$icon_html .= ' style="font-size:' . intval( $icon_size ) . 'px"';
	}
	$icon_html .= '><i class="' . cl_prepare_icon_class( $icon ) . '"></i></div>';
	$classes .= ' with_icon';
}

$title_html = '';
if ( ! empty( $title ) ) {
	$title_html .= '<div class="cl-ib-title"';
	if ( ! empty( $title_size ) ) {
		$title_html .= ' style="font-size:' . intval( $title_size ) . 'px"';
	}
	$title_html .= '>' . $title . '</div>';
	$classes .= ' with_title';
}

$text_html = '';
if ( ! empty( $text ) ) {
	$text_html .= '<div class="cl-ib-text"';
	if ( ! empty( $text_size ) ) {
		$text_html .= ' style="font-size:' . intval( $text_size ) . 'px"';
	}
	$text_html .= '>' . $text . '</div>';
	$classes .= ' with_text';
}

$btn_html = '';
if ( $link_type == 'btn' AND ! empty( $btn_label ) ) {
	$btn_inner_css = '';
	if ( ! empty( $btn_color ) ) {
		$btn_inner_css .= 'color:' . $btn_color . ';';
	}
	if ( ! empty( $btn_bgcolor ) ) {
		$btn_inner_css .= 'background-color: ' . $btn_bgcolor . ';';
	}
	if ( ! empty( $btn_size ) ) {
		$btn_inner_css .= 'font-size:' . intval( $btn_size ) . 'px;';
	}
	if ( ! empty( $btn_inner_css ) ) {
		$btn_inner_css = ' style="' . esc_attr( $btn_inner_css ) . '"';
	}
	$btn_html .= '<a class="cl-btn style_flat" href="' . esc_attr( $link['url'] ) . '" title="' . esc_attr( $link['title'] ) . '" target="' . esc_attr( $link['target'] ) . '"' . $btn_inner_css . '>' . $btn_label . '</a>';
	$classes .= ' with_btn';
}

$inner_css = '';
if ( ! empty( $width ) ) {
	if ( strpos( $width, '%' ) !== FALSE ) {
		$inner_css .= 'width:' . floatval( $width ) . '%;';
	} else {
		$inner_css .= 'width:' . intval( $width ) . 'px;';
	}
}
if ( ! empty( $inner_css ) ) {
	$inner_css = ' style="' . esc_attr( $inner_css ) . '"';
}
if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}
$output = '<' . $tag . $atts . ' class="cl-ib' . $classes . '"' . $inner_css . '>';
$helper_classes = ' easing_' . $animation_easing;
$helper_inner_css = '';
if ( ! empty( $animation_duration ) ) {
	$helper_inner_css .= '-webkit-transition-duration:' . $animation_duration . ';transition-duration:' . $animation_duration . ';';
}
if ( ! empty( $helper_inner_css ) ) {
	$helper_inner_css = ' style="' . esc_attr( $helper_inner_css ) . '"';
}
$output .= '<div class="cl-ib-h' . $helper_classes . '"' . $helper_inner_css . '>';
$img = wp_get_attachment_image_src( $image, $size );
if ( ! $img ) {
	// TODO set placeholder
}
$output .= '<div class="cl-ib-image" style="background-image: url(' . esc_attr( $img[0] ) . ')">';
$output .= '<img src="' . esc_attr( $img[0] ) . '" ' . image_hwstring( $img[1], $img[2] ) . ' alt="' . esc_attr( $title ) . '" />';
$output .= '</div>';
// Will be quite useful lots of animations
$output .= '<div class="cl-ib-overlay"></div>';
$output .= '<div class="cl-ib-content">' . $icon_html . $title_html . $text_html . $btn_html . '</div>';
$output .= '</div>';
$output .= '</' . $tag . '>';

echo $output;
