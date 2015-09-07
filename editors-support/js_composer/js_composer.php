<?php

// Visual Composer Compatibility
add_action( 'vc_after_set_mode', function () {

	$config = require dirname( __FILE__ ) . '/../../config/elements.php';
	vc_map( $config['cl-flipbox'] );
} );
