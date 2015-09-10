<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

// Visual Composer Compatibility
add_action( 'vc_after_set_mode', function () {

	foreach ( cl_config( 'elements' ) as $element ) {
		vc_map( $element );
	}
} );
