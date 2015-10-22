<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output element's form textarea_html field
 *
 * @var $name string Form's field name
 * @var $id string Form's field ID
 * @var $value string Current value
 */

wp_editor( $value, $id, array(
	'media_buttons' => FALSE,
	'textarea_name' => $name,
	'wpautop' => FALSE,
	'default_editor' => 'tmce',
) );
