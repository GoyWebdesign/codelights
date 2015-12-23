<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output element's form color field
 *
 * @var $name string Form's field name
 * @var $id string Form's field ID
 * @var $value string Current value
 */

cl_enqueue_script( 'wp-color-picker' );
cl_enqueue_style( 'wp-color-picker' );

$output = '<input id="' . esc_attr( $id ) . '" type="text" data-default-color="' . esc_attr( $value ) . '" name="' . esc_attr( $name ) . '" class="cl-color-picker" value="' . esc_attr( $value ) . '"/>';

echo $output;
