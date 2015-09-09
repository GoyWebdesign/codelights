<?php

//add_action( 'admin_print_scripts-widgets.php', 'cl_enqueue_scripts' );
//add_action( 'siteorigin_panel_enqueue_admin_scripts', 'cl_enqueue_scripts' );
//function cl_enqueue_scripts() {
//	global $cl_file;
//	wp_register_script( 'cl-flipbox', plugins_url( '/editors-support/siteorigin/cl-flipbox.js', $cl_file ), array( 'jquery' ), '1.0', TRUE );
//	wp_enqueue_script( 'cl-flipbox' );
//}

add_filter( 'siteorigin_panels_widget_dialog_tabs', 'cl_siteorigin_panels_widget_dialog_tabs', 20 );
function cl_siteorigin_panels_widget_dialog_tabs( $tabs ) {
	$tabs[] = array(
		'title' => __( 'CodeLights', 'codelights' ),
		'filter' => array(
			'groups' => array( 'codelights' ),
		),
	);

	return $tabs;
}
