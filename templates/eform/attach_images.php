<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output element's form attach_image field
 *
 * @var $name string Form's field name
 * @var $id string Form's field ID
 * @var $value string Current value
 * @var $multiple bool Allow attach multiple images?
 */

$img_ids = array_map( 'intval', explode( ',', $value ) );
$multiple = ( ! isset( $multiple ) OR $multiple );

$output = '<div class="cl-imgattach" data-multiple="' . intval( $multiple ) . '">';
$output .= '<ul class="cl-imgattach-list">';
foreach ( $img_ids as $img_id ) {
	$output .= '<li data-id="' . $img_id . '"><a href="javascript:void(0)" class="cl-imgattach-delete">&times;</a>' . wp_get_attachment_image( $image ) . '</li>';
}
$output .= '</ul>';
$add_btn_title = $multiple ? __( 'Add images', 'codelights' ) : __( 'Add image', 'codelights' );
$output .= '<a href="javascript:void(0)" class="cl-imgattach-add" title="' . $add_btn_title . '"';
$output .= ' style="display: ' . ( ( $multiple OR count( $img_ids ) == 0 ) ? 'block' : 'none' ) . ';"';
$output .= '>' . $add_btn_title . '</a>';
$output .= '<input type="hidden" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '" />';
$output .= '</div>';

echo $output;
