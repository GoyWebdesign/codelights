<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Ineractive Banner element.
 *
 * @var $image int ID of the WP attachment image
 * @var $size string WordPress image resize name
 * @var $title string
 * @var $text string
 * @var $icon string
 * @var $link_type string Type of link: 'none' / 'banner' / 'btn'
 * @var $button_label string
 * @var $link string URL of the overall element or button in a 'vc_link' format
 * @var $animation string Animation type: 'melete' / '2' / '3' / '4'
 * @var $direction string Animation direction: 'n' / 'e' / 's' / 'w'
 * @var $animation_duration string In milliseconds: '100ms' / '200ms' / ... / '900ms'
 * @var $animation_easing string Easing CSS class name
 * @var $width mixed In pixels or percents: '100' / '100%'
 * @var $ratio string Aspect ratio: '2x1' / '3x2' / '4x3' / '1x1' / '3x4' / '2x3' / '1x2'
 * @var $title_size string Heading and Icon font size in percents (e.g. '6%')
 * @var $text_size string Text and Button font size in percents (e.g. '4%')
 * @var $el_class string Extra class name
 */

// Main element classes, inner css and additional attributes
$classes = ' animation_' . $animation . ' direction_' . $direction;
$classes .= ' ratio_' . $ratio;

$tag = 'div';
$atts = '';
// Relative font sizes
if ( ! empty( $title ) OR ! empty( $icon ) ) {
	$atts .= ' data-title_size="' . esc_attr( $title_size ) . '"';
}
if ( ! empty( $text ) OR ! empty( $button_label ) ) {
	$atts .= ' data-text_size="' . esc_attr( $text_size ) . '"';
}
if ( ! empty( $link ) ) {
	$link = cl_parse_vc_link( $link );
	if ( $link_type == 'banner' ) {
		// Altering whole element's div with anchor when it has a link
		$tag = 'a';
		$atts .= ' href="' . esc_attr( $link['url'] ) . '" title="' . esc_attr( $link['title'] ) . '" target="' . esc_attr( $link['target'] ) . '"';
	}
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
$output .= '<div class="cl-ib-content">';
if ( ! empty( $icon ) ) {
	cl_enqueue_assets( 'font-awesome' );
	$output .= '<div class="cl-ib-icon"><i class="' . cl_prepare_icon_class( $icon ) . '"></i></div>';
}
if ( ! empty( $title ) ) {
	$output .= '<div class="cl-ib-title">' . $title . '</div>';
}
if ( ! empty( $text ) ) {
	$output .= '<div class="cl-ib-text">' . $text . '</div>';
}
if ( $link_type == 'btn' AND ! empty( $button_label ) ) {
	$output .= '<a href="' . esc_attr( $link['url'] ) . '" title="' . esc_attr( $link['title'] ) . '" target="' . esc_attr( $link['target'] ) . '">' . $button_label . '</a>';
}
$output .= '</div>';
$output .= '</div>';
$output .= '</' . $tag . '>';

echo $output;
