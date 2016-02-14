<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

if ( ! defined( 'FL_BUILDER_VERSION' ) ) {
	return;
}

add_action( 'wp_enqueue_scripts', 'cl_enqueue_bb_scripts', 15 );
function cl_enqueue_bb_scripts() {
	if ( ! class_exists( 'FLBuilderModel' ) ) {
		return;
	}
	if ( FLBuilderModel::is_builder_active() ) {
		cl_enqueue_forms_assets();
		global $cl_uri, $cl_version;
		$dependencies = array(
			( defined( 'WP_DEBUG' ) && WP_DEBUG ) ? 'fl-builder' : 'fl-builder-min',
			'cl-editor',
		);
		wp_enqueue_script( 'beaver-builder', $cl_uri . '/editors-support/beaver-builder/beaver-builder.js', $dependencies, $cl_version );
	}
}
