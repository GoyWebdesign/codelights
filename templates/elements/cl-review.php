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

if ( ( $avatar == 'image' AND ! empty( $avatar_image ) ) OR ( $avatar == 'font' AND ! empty( $avatar_icon ) ) ) {
	$classes .= ' with_avatar';
}

if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}

$output = '<div class="cl-review' . $classes . '">';

// Preparing the author block
$author_html = '<div class="cl-review-author">';
if ( $avatar != 'none' ) {
	$author_html .= '<span class="cl-review-author-avatar"';
	if ( $avatar == 'image' AND ! empty( $avatar_image ) AND ( $avatar_image_src = wp_get_attachment_image_src( $avatar_image, 'thumbnail' ) ) ) {
		$author_html .= ' style="background-image: url(' . $avatar_image_src[0] . ')"';
	}
	$author_html .= '>';
	if ( $avatar == 'font' AND ! empty( $avatar_icon ) ) {
		cl_enqueue_assets( 'font-awesome' );
		$author_html .= '<i class="' . cl_prepare_icon_class( $avatar_icon ) . '"></i>';;
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

// Scanned document
if ( $type == 'doc' ) {
	if ( ! empty( $doc ) ) {
		$output .= '<a class="cl-review-doc" href="' . wp_get_attachment_url( $doc ) . '" target="_blank">' . wp_get_attachment_image( $doc, 'large' ) . '</a>';
	} else {
		$output .= '<div class="cl-review-doc"></div>';
	}
}

if ( $type != 'quote' OR $layout == 'modern' ) {
	// Author block at the beginning
	$output .= $author_html;
}

// Video testimonial
if ( $type == 'video' ) {
	global $wp_embed;
	$output .= '<div class="cl-review-video"><div class="cl-review-video-h">';
	$output .= $wp_embed->run_shortcode( '[embed]' . $video . '[/embed]' );
	$output .= '</div></div>';
}

if ( ! empty( $quote ) ) {
	$output .= '<div class="cl-review-quote">';
	if ( $type == 'quote' AND ! empty( $source ) ) {
		cl_enqueue_assets( 'font-awesome' );
		$output .= '<a class="cl-review-quote-source" href="' . esc_attr( $source ) . '" target="_blank"></a>';
	}
	$output .= '<div class="cl-review-quote-text">';
	$output .= $quote;
	$output .= '</div></div>';
}

if ( $type == 'quote' AND $layout != 'modern' ) {
	// Author block at the end
	$output .= $author_html;
}

$output .= '</div>';

echo $output;

