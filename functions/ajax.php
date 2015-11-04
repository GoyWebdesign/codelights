<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Load elements list HTML to choose from
 */
add_action( 'wp_ajax_cl_get_elist_template', 'ajax_cl_get_elist_template' );
function ajax_cl_get_elist_template() {
	cl_load_template( 'elist', array() );

	// We don't use JSON to reduce data size
	die;
}

/**
 * Load shortcode builder elements forms
 */
add_action( 'wp_ajax_cl_get_ebuilder_template', 'ajax_cl_get_ebuilder_template' );
function ajax_cl_get_ebuilder_template() {
	$template_vars = array(
		'titles' => array(),
		'body' => '',
	);
	// Loading all the forms HTML
	foreach ( cl_config( 'elements', array() ) as $name => $elm ) {

	}

	// Maybe load with some form?
	if ( isset( $_POST['name'] ) AND isset( $config[ $_POST['name'] ] ) ) {
		$name = $_POST['name']; // Validated via config keys
		if ( isset( $config[ $name ]['name'] ) ) {
			$template_vars['title'] = $config[ $name ]['name'];
		}
		$template_vars['body'] = cl_get_template( 'eform/eform', array(
			'name' => 'cl_ebuilder_eform_' . $name,
			'params' => $config[ $name ]['params'],
			'field_id_pattern' => 'cl_ebuilder_eform_' . $name . '_%s',
		) );
	}

	cl_load_template( 'ebuilder', $template_vars );

	// We don't use JSON to reduce data size
	die;
}
