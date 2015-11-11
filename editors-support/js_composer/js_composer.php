<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

if ( ! class_exists( 'Vc_Manager' ) ) {
	return;
}

// Visual Composer Compatibility
add_action( 'vc_after_set_mode', function () {

	foreach ( cl_config( 'elements' ) as $element ) {
		if ( isset( $element['params'] ) AND is_array( $element['params'] ) ) {
			foreach ( $element['params'] as $index => &$param ) {
				// Using the proper params types
				if ( isset( $param['type'] ) AND $param['type'] == 'link' ) {
					$param['type'] = 'vc_link';
				}
				// Preparing the proper 'edit_field_class' vendor prefixes
				if ( isset( $param['edit_field_class'] ) ) {
					$param['edit_field_class'] = preg_replace( '~(^|[^\w])cl_col~', '$1vc_col', $param['edit_field_class'] );
				}
			}
		}
		vc_map( $element );
	}
} );
