<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Review element.
 *
 * @var $type string Testimonial type: 'quote' / 'doc' / 'video'
 * @var $layout string Quote layout: 'horizontal' / 'balloon' / 'framed' / 'clean' / 'centered' / 'modern'
 * @var $doc int ID of the WP attachment image
 * @var $video string Video URL to embed
 * @var $quote string Multiline quote
 * @var $source string Quote source
 * @var $el_class string Extra class name
 * @var $author string Author name
 * @var $occupation string Author occupation
 * @var $avatar string Author avatar type: 'none' / 'font' / 'image'
 * @var $avatar_icon string Author avatar icon
 * @var $avatar_image int ID of the WP attachment image
 */

// Main element classes
$classes = ' type_' . $type;
if ( $type == 'quote' ) {
	$classes .= ' layout_' . $layout;
}

if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}

$output = '<div class="cl-review' . $classes . '">';

// Preparing the author block
$author_html = '<div class="cl-review-author">';
if ( $avatar != 'none' ) {
	$author_html .= '<span class="cl-review-author-avatar">';
	if ( $avatar == 'font' AND ! empty( $avatar_icon ) ) {
		$author_html .= '<i class="' . cl_prepare_icon_class( $avatar_icon ) . '"></i>';;
	} elseif ( $avatar == 'image' AND ! empty( $avatar_image ) ) {
		$author_html .= wp_get_attachment_image( $avatar_image, 'medium' );
	}
	$author_html .= '</span>';
}
if ( ! empty( $author ) ) {
	$author_html .= '<span class="cl-review-author-name">' . $author . '</span>';
}
if ( ! empty( $author ) AND ! empty( $occupation ) ) {
	$author_html .= '<span class="cl-review-author-delimiter">, </span>';
}
if ( ! empty( $occupation ) ) {
	$author_html .= '<span class="cl-review-author-occupation">' . $occupation . '</span>';
}
$author_html .= '</div>';

if ( $type == 'quote' AND ( $layout == 'horizontal' OR $layout == 'modern' ) ) {
	// Author block at the beginning
	$output .= $author_html;
}

// Scanned document
if ( $type == 'doc' ) {
	$output .= '<div class="cl-review-doc">';
	if ( ! empty( $doc ) ) {
		$output .= wp_get_attachment_image( $doc, 'large' );
	}
	$output .= '</div>';
}

// Video testimonial
if ( $type == 'video' ) {
	global $wp_embed;
	$output .= '<div class="cl-review-video">';
	$output .= $wp_embed->run_shortcode( '[embed]' . $video . '[/embed]' );
	$output .= '</div>';
}

if ( ! empty( $quote ) ) {
	$output .= '<div class="cl-review-quote">';
	$output .= nl2br( $quote );
	$output .= '</div>';
}

if ( $type != 'quote' OR ( $layout != 'horizontal' AND $layout != 'modern' ) ) {
	// Author block at the end
	$output .= $author_html;
}

$output .= '</div>';

echo $output;

