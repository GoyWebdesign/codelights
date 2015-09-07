<?php

// Visual Composer Compatibility
add_action( 'vc_after_set_mode', function () {
	require dirname( __FILE__ ) . '/cl-flipbox.php';
} );
