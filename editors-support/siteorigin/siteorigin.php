<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

if ( ! defined( 'SITEORIGIN_PANELS_VERSION' ) ) {
	return;
}

add_filter( 'siteorigin_panels_widgets', 'cl_siteorigin_panels_widgets' );
function cl_siteorigin_panels_widgets( $widgets ) {
	$config = cl_config( 'elements', array() );
	foreach ( $config as $name => $elm ) {
		if ( ! isset( $elm['widget_class'] ) OR empty( $elm['widget_class'] ) ) {
			$elm['widget_class'] = 'CL_Widget_' . ucfirst( preg_replace( '~^cl\-~', '', $name ) );
		}
		if ( empty( $widgets[ $elm['widget_class'] ] ) ) {
			continue;
		}
		$widgets[ $elm['widget_class'] ]['groups'] = array( 'codelights' );
		$widgets[ $elm['widget_class'] ]['icon'] = 'icon-' . $name;
	}

	return $widgets;
}

add_action( 'admin_head', 'cl_siteorigin_icons_style' );
function cl_siteorigin_icons_style() {
	echo '<style type="text/css" id="cl_siteorigin_icons_style">';
	foreach ( cl_config( 'elements', array() ) as $name => $elm ) {
		if ( isset( $elm['icon'] ) AND ! empty( $elm['icon'] ) ) {
			echo '.so-panels-dialog .widget-icon.icon-' . $name . ' {';
			echo '-webkit-background-size: 20px 20px;';
			echo 'background-size: 20px 20px;';
			echo 'background-image: url(' . $elm['icon'] . ');';
			echo '}';
		}
	}
	echo '}';
	echo '</style>';
}

add_filter( 'siteorigin_panels_widget_dialog_tabs', 'cl_siteorigin_panels_widget_dialog_tabs', 20 );
function cl_siteorigin_panels_widget_dialog_tabs( $tabs ) {
	$tabs[] = array(
		'title' => 'CodeLights',
		'filter' => array(
			'groups' => array( 'codelights' ),
		),
	);

	return $tabs;
}

add_action( 'admin_enqueue_scripts', 'cl_admin_enqueue_siteorigin_scripts' );
function cl_admin_enqueue_siteorigin_scripts() {
	global $cl_uri;
	wp_enqueue_script( 'cl-siteorigin', $cl_uri . '/editors-support/siteorigin/siteorigin.js', array( 'jquery' ), FALSE, TRUE );
}
