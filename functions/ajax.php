<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

add_action( 'wp_ajax_cl_get_elist_template', 'ajax_cl_get_elist_template' );
function ajax_cl_get_elist_template() {
	cl_load_template( 'elist', array() );

	// We don't use JSON to reduce data size
	die;
}

add_action( 'wp_ajax_cl_get_eform_template', 'ajax_cl_get_eform_template' );
function ajax_cl_get_eform_template() {
	$config = cl_config( 'elements' );
	if ( ! isset( $_POST['name'] ) OR ! isset( $config[ $_POST['name'] ] ) ) {
		die;
	}
	$name = $_POST['name']; // Validated via config keys

	cl_load_template( 'eform/eform', array(
		'name' => 'cl_ebuilder_eform_' . $name,
		'params' => $config[ $name ]['params'],
		'field_id_pattern' => 'cl_ebuilder_eform_' . $name . '_%s',
	) );

	// We don't use JSON to reduce data size
	die;
}
