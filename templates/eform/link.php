<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output element's form link field
 *
 * @var $name string Form's field name
 * @var $id string Form's field ID
 * @var $value string Current value
 */
$link = cl_parse_link_value( $value );

$output = '<div class="cl-linkdialog">';
$output .= '<a class="button button-default button-large cl-insert-link-button" href="javascript:void(0)">' . __( 'Insert link', 'codelights' ) . '</a>';
$output .= '<span class="cl-linkdialog-label">' . __( 'Title:', 'codelights' ) . '</span>';
$output .= '<span class="cl-linkdialog-title">' . $link['title'] . '</span>';
$output .= '<span class="cl-linkdialog-label">' . __( 'URL:', 'codelights' ) . '</span>';
$output .= '<span class="cl-linkdialog-url">' . $link['url'] . '</span>';
$output .= '<span class="cl-linkdialog-target">' . $link['target'] . '</span>';
$output .= '<input type="hidden" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '" />';
$output .= '</div>';

echo $output;
