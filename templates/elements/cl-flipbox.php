<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single flipbox element.
 *
 * @var $link_type string Link type: 'none' / 'container' / 'btn'
 * @var $link string URL of the overall flipbox anchor in a encoded link format
 * @var $back_btn_label string Back button label
 * @var $back_btn_bgcolor string Back button background color
 * @var $back_btn_color string
 * @var $animation string Animation type: 'cardflip' / 'cubetilt' / 'cubeflip' / 'coveropen'
 * @var $direction string Animation direction: 'n' / 'ne' / 'e' / 'se' / 's' / 'sw' / 'w' / 'nw'
 * @var $duration string Animation duration in milliseconds: '100ms' / '200ms' / ... / '900ms'
 * @var $easing string Easing CSS class name
 * @var $front_icon_type string Front icon type: 'none' / 'font' / 'image'
 * @var $front_icon_name string The name of the front icon if present (ex: 'star' / 'fa-star')
 * @var $front_icon_size int Front icon font size
 * @var $front_icon_style string Front icon style type: 'default' / 'circle' / 'square'
 * @var $front_icon_color string
 * @var $front_icon_bgcolor string
 * @var $front_icon_image int ID of the WP attachment image
 * @var $front_icon_image_width string Image icon width in pixels or percent
 * @var $front_title string
 * @var $front_title_size string
 * @var $front_desc string Description
 * @var $front_bgcolor string
 * @var $front_textcolor string
 * @var $front_bgimage int ID of the WP attachment image
 * @var $back_title string
 * @var $back_title_size string
 * @var $back_desc string Back-side text
 * @var $back_bgcolor string
 * @var $back_textcolor string
 * @var $back_bgimage int ID of the WP attachment image
 * @var $width string In pixels or percents: '100' / '100%'
 * @var $height string
 * @var $valign string Vertical align: 'top' / 'center'
 * @var $border_radius string
 * @var $border_size string
 * @var $border_color string
 * @var $padding string
 * @var $el_class string Extra class name
 */

// Main element classes
$classes = '';

if ( in_array( $direction, array( 'ne', 'se', 'sw', 'nw' ) ) ) {
	// When rotating cubetilt in diaginal direction, we're actually doing a cube flip animation instead
	if ( $animation == 'cubetilt' ) {
		$animation = 'cubeflip';
	}
}
// Main element classes
$classes .= ' animation_' . $animation . ' direction_' . $direction;
if ( ! empty( $valign ) ) {
	$classes .= ' valign_' . $valign;
}

$tag = 'div';
$atts = '';
if ( $link_type != 'none' AND ! empty( $link ) ) {
	$link_atts = cl_parse_link_value( $link, TRUE );
	// Altering the whole element's div with anchor when it has a link
	if ( $link_type == 'container' ) {
		$tag = 'a';
		$atts .= $link_atts;
	}
}
if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}
$inline_css = cl_prepare_inline_css( array(
	'width' => $width,
) );
$output = '<' . $tag . $atts . ' class="cl-flipbox' . $classes . '"' . $inline_css . '>';

$helper_classes = ' easing_' . $easing;
$helper_inline_css = cl_prepare_inline_css( array(
	'transition-duration' => $duration,
) );
$output .= '<div class="cl-flipbox-h' . $helper_classes . '"' . $helper_inline_css . '><div class="cl-flipbox-hh">';
if ( $animation == 'cubeflip' AND in_array( $direction, array( 'ne', 'se', 'sw', 'nw' ) ) ) {
	$output .= '<div class="cl-flipbox-hhh">';
}

$front_inline_css = cl_prepare_inline_css( array(
	'height' => $height,
	'padding' => $padding,
	'color' => $front_textcolor,
	'background-color' => $front_bgcolor,
	'background-image' => $front_bgimage,
	'border-color' => $border_color,
	'border-radius' => $border_radius,
	'border-width' => $border_size,
) );
$output .= '<div class="cl-flipbox-front"' . $front_inline_css . '><div class="cl-flipbox-front-h">';
if ( $front_icon_type == 'font' AND ! empty( $front_icon_name ) ) {
	cl_enqueue_assets( 'font-awesome' );
	$front_icon_size = intval( $front_icon_size );
	$front_icon_css_props = array(
		'background-color' => $front_icon_bgcolor,
		'color' => $front_icon_color,
	);
	if ( $front_icon_style != 'default' ) {
		$front_icon_css_props['border-color'] = $front_icon_color;
	}
	if ( ! empty( $front_icon_size ) ) {
		$front_icon_size = intval( $front_icon_size );
		$front_icon_boxsize = $front_icon_size * ( ( $front_icon_style == 'default' ) ? 1 : 2.3 );
		$front_icon_css_props += array(
			'width' => $front_icon_boxsize,
			'height' => $front_icon_boxsize,
			'font-size' => $front_icon_size,
			'line-height' => $front_icon_boxsize,
		);
	}
	$output .= '<div class="cl-flipbox-front-icon style_' . $front_icon_style . '"' . cl_prepare_inline_css( $front_icon_css_props ) . '>';
	$output .= '<i class="' . cl_prepare_icon_class( $front_icon_name ) . '"></i>';
	$output .= '</div>';
} elseif ( $front_icon_type == 'image' AND ! empty( $front_icon_image ) AND ( $front_icon_image_html = wp_get_attachment_image( $front_icon_image, 'medium' ) ) ) {
	$output .= '<div class="cl-flipbox-front-image"';
	$output .= cl_prepare_inline_css( array(
		'width' => $front_icon_image_width,
	) );
	$output .= '>' . $front_icon_image_html . '</div>';
}
if ( ! empty( $front_title ) ) {
	$output .= '<h4 class="cl-flipbox-front-title"';
	$output .= cl_prepare_inline_css( array(
		'font-size' => $front_title_size,
	) );
	$output .= '>' . $front_title . '</h4>';
}
if ( ! empty( $front_desc ) ) {
	$output .= '<p class="cl-flipbox-front-desc">' . $front_desc . '</p>';
}
$output .= '</div></div>';

$back_inline_css = cl_prepare_inline_css( array(
	'padding' => $padding,
	'color' => $back_textcolor,
	'background-color' => $back_bgcolor,
	'background-image' => $back_bgimage,
	'border-color' => $border_color,
	'border-radius' => $border_radius,
	'border-width' => $border_size,
) );
$output .= '<div class="cl-flipbox-back"' . $back_inline_css . '><div class="cl-flipbox-back-h">';
if ( ! empty( $back_image ) AND ( $back_image_html = wp_get_attachment_image( $back_image, 'medium' ) ) ) {
	$output .= '<div class="cl-flipbox-back-image">' . $back_image_html . '</div>';
}
if ( ! empty( $back_title ) ) {
	$output .= '<h4 class="cl-flipbox-back-title"';
	$output .= cl_prepare_inline_css( array(
		'font-size' => $back_title_size,
	) );
	$output .= '>' . $back_title . '</h4>';
}
if ( ! empty( $back_desc ) ) {
	$output .= '<p class="cl-flipbox-back-desc">' . $back_desc . '</p>';
}
if ( ! empty( $back_btn_label ) ) {
	$back_btn_inline_css = cl_prepare_inline_css( array(
		'color' => $back_btn_color,
		'background-color' => $back_btn_bgcolor,
	) );
	$output .= '<a class="cl-btn"' . $back_btn_inline_css . $link_atts . '>' . $back_btn_label . '</a>';
}
$output .= '</div></div>';

if ( $animation == 'cubeflip' ) {
	// Counting flanks color
	$flank_inline_css_props = array(
		'border-color' => $border_color,
		'border-radius' => $border_radius,
		'border-width' => $border_size,
	);
	// We need some additional dom-elements for some of the animations (:before / :after won't suit)
	if ( in_array( $direction, array( 'ne', 'e', 'se', 'sw', 'w', 'nw' ) ) ) {
		// Top / bottom side flank
		if ( ! empty( $front_bgcolor ) ) {
			$front_rgb = cl_hex_to_rgb( $front_bgcolor );
			for ( $i = 0; $i < 2; $i++ ) {
				$front_rgb[ $i ] = min( 255, $front_rgb[ $i ] + 20 );
			}
			$flank_inline_css_props['background-color'] = cl_rgb_to_hex( $front_rgb );
		}
		$output .= '<div class="cl-flipbox-yflank"' . cl_prepare_inline_css( $flank_inline_css_props ) . '></div>';
	}
	if ( in_array( $direction, array( 'n', 'ne', 'se', 's', 'sw', 'nw' ) ) ) {
		// Left / right side flank
		if ( ! empty( $front_bgcolor ) ) {
			$front_rgb = cl_hex_to_rgb( $front_bgcolor );
			for ( $i = 0; $i < 2; $i++ ) {
				$front_rgb[ $i ] = max( 0, $front_rgb[ $i ] - 20 );
			}
			$flank_inline_css_props['background-color'] = cl_rgb_to_hex( $front_rgb );
		}
		$output .= '<div class="cl-flipbox-xflank"' . cl_prepare_inline_css( $flank_inline_css_props ) . '></div>';
	}
}

if ( $animation == 'cubeflip' AND in_array( $direction, array( 'ne', 'se', 'sw', 'nw' ) ) ) {
	$output .= '</div>';
}
$output .= '</div></div>';
$output .= '</' . $tag . '>';

echo $output;
