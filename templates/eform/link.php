<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output element's form link field
 *
 * @var $name string Form's field name
 * @var $id string Form's field ID
 * @var $value string Current value
 */

// Link button interface is a part of the html editor, so we need to load it as well
cl_maybe_load_html_editor();
wp_enqueue_script( 'wplink' );
wp_enqueue_style( 'editor-buttons' );

$link = cl_parse_link_value( $value );

// Shortening the link
if ( strlen( $link['url'] ) > 60 ) {
	$link['url'] = substr_replace( $link['url'], '...', 28, strlen( $link['url'] ) - 57 );
}

$output = '<div class="cl-linkdialog">';
$output .= '<a class="cl-linkdialog-btn button button-default button-large" href="javascript:void(0)">' . __( 'Insert link', 'codelights' ) . '</a>';
$output .= '<span class="cl-linkdialog-url">' . $link['url'] . '</span>';
$output .= '<textarea name="' . esc_attr( $name ) . '" id="' . esc_attr( $id ) . '">' . esc_textarea( $value ) . '</textarea>';
$output .= '</div>';

echo $output;
