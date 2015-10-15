<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Ineractive Banner element.
 *
 * @var $image int ID of the WP attachment image
 * @var $size string WordPress image resize name
 * @var $title string
 * @var $desc string
 * @var $link string URL of the overall element or button in a 'vc_link' format
 * @var $animation string Animation type: 'melete' / 'soter' / 'phorcys' / 'aidos' / ...
 * @var $bgcolor string Background color
 * @var $textcolor string Text color
 * @var $ratio string Aspect ratio: '2x1' / '3x2' / '4x3' / '1x1' / '3x4' / '2x3' / '1x2'
 * @var $width string In pixels or percents: '100' / '100%'
 * @var $align string Text align: 'left' / 'center' / 'right'
 * @var $padding string In pixels or percents: '20px' / '10%'
 * @var $title_size string Title size: 'tiny' / 'small' / 'medium' / 'large' / 'huge'
 * @var $title_tag string Title tag name: 'h2' / 'h3' / 'h4' / 'h5' / 'div'
 * @var $easing string Easing CSS class name
 * @var $el_class string Extra class name
 */

// Main element classes, inner css and additional attributes
$classes = ' animation_' . $animation . ' ratio_' . $ratio . ' align_' . $align;

// Altering whole element's div with anchor when it has a link
$tag = empty( $link ) ? 'div' : 'a';
$atts = empty( $link ) ? '' : cl_parse_vc_link( $link, TRUE );

$title_html = '';
if ( ! empty( $title ) ) {
	if ( empty( $title_tag ) ) {
		$title_tag = 'div';
	}
	$title_html .= '<' . $title_tag . ' class="cl-ib-title size_' . $title_size . '">' . $title . '</' . $title_tag . '>';
	$classes .= ' with_title';
}

$text_html = '';
if ( ! empty( $desc ) ) {
	$text_html .= '<div class="cl-ib-text">' . $desc . '</div>';
	$classes .= ' with_desc';
}

if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}
$output = '<' . $tag . $atts . ' class="cl-ib' . $classes . '"';
$output .= cl_prepare_inline_css( array(
	'width' => $width,
	'background-color' => $bgcolor,
	'color' => $textcolor,
) );
$output .= '>';

$output .= '<div class="cl-ib-h easing_' . $easing . '">';
$img = wp_get_attachment_image_src( $image, $size );
if ( ! $img ) {
	// TODO set placeholder
	$img = array( '', 0, 0 );
}
$output .= '<div class="cl-ib-image" style="background-image: url(' . esc_attr( $img[0] ) . ')">';
$output .= '<img src="' . esc_attr( $img[0] ) . '" ' . image_hwstring( $img[1], $img[2] ) . ' alt="' . esc_attr( $title ) . '" />';
$output .= '</div>';
$output .= '<div class="cl-ib-content"';
$output .= cl_prepare_inline_css( array(
	'padding' => $padding,
) );
$output .= '><div class="cl-ib-content-h">' . $title_html . $text_html . '</div></div>';
$output .= '</div>';
$output .= '</' . $tag . '>';

echo $output;
