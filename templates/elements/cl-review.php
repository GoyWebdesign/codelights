<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Review element.
 *
 * @var $author string Author name
 * @var $occupation string Author occupation
 * @var $avatar_image int ID of the WP attachment image
 * @var $layout string Quote layout: 'horizontal' / 'balloon' / 'framed' / 'clean' / 'centered' / 'modern'
 * @var $type string Testimonial type: 'quote' / 'doc' / 'video'
 * @var $doc int ID of the WP attachment image
 * @var $video string Video URL to embed
 * @var $quote string Multiline quote
 * @var $source string Quote source
 * @var $el_class string Extra class name
 */

// Main element classes
$classes = ' type_' . $type . ' layout_' . $layout;

// Preparing the author block
$author_tag = 'div';
$author_atts = '';
if ( $type == 'quote' AND ! empty( $source ) ) {
	$author_tag = 'a';
	$author_atts .= cl_parse_link_value( $source, TRUE );
}
$author_html = '<' . $author_tag . ' class="cl-review-author"' . $author_atts . '>';
if ( ! empty( $avatar_image ) AND ( $avatar_image_src = wp_get_attachment_image_src( $avatar_image, 'thumbnail' ) ) ) {
	$author_html .= '<span class="cl-review-author-avatar" style="background-image: url(' . $avatar_image_src[0] . ')"></span>';
	$classes .= ' with_avatar';
}
if ( ! empty( $author ) ) {
	$author_html .= '<span class="cl-review-author-name">' . $author . '</span>';
}
if ( ! empty( $occupation ) ) {
	$author_html .= '<span class="cl-review-author-occupation">' . $occupation . '</span>';
}
$author_html .= '</' . $author_tag . '>';

if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}

$output = '<div class="cl-review' . $classes . '">';

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
	$output .= '<q class="cl-review-quote-text">';
	$output .= $quote;
	$output .= '</q></div>';
}

if ( $type == 'quote' AND $layout != 'modern' ) {
	// Author block at the end
	$output .= $author_html;
}

$output .= '</div>';

echo $output;

