<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Needed assets, used by cl_enqueue_assets function.
 *
 * Dev note: the same keys for styles and scripts should stand for the same element, as they are loaded together.
 */

global $cl_uri;

return array(

	/**
	 * Each style entry contains params for wp_enqueue_style function:
	 * $handle => array( $src, $deps, $ver, $media )
	 */
	'styles' => array(
		'font-awesome' => array( $cl_uri . '/vendor/font-awesome/font-awesome.min.css', array(), '4.4.0', 'all' ),
		'cl-core' => array( $cl_uri . '/css/cl-core.css', array(), FALSE, 'all' ),
		'cl-flipbox' => array( $cl_uri . '/css/cl-flipbox.css', array( 'cl-core' ), FALSE, 'all' ),
		'cl-ib' => array( $cl_uri . '/css/cl-ib.css', array( 'cl-core' ), FALSE, 'all' ),
		'cl-itext' => array( $cl_uri . '/css/cl-itext.css', array( 'cl-core' ), FALSE, 'all' ),
	),
	/**
	 * Each script entry contains params for wp_enqueue_script function:
	 * $handle => array( $src, $deps, $ver, $in_footer )
	 */
	'scripts' => array(
		'cl-core' => array( $cl_uri . '/js/cl-core.js', array( 'jquery' ), FALSE, TRUE ),
		'cl-counter' => array( $cl_uri . '/js/cl-counter.js', array( 'jquery', 'cl-core' ), FALSE, TRUE ),
		'cl-flipbox' => array( $cl_uri . '/js/cl-flipbox.js', array( 'jquery', 'cl-core' ), FALSE, TRUE ),
		'cl-ib' => array( $cl_uri . '/js/cl-ib.js', array( 'jquery' ), FALSE, TRUE ),
		'cl-itext' => array( $cl_uri . '/js/cl-itext.js', array( 'jquery', 'cl-core' ), FALSE, TRUE ),
	),

);
