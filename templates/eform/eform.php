<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single element's editing form
 *
 * @var $name string ELement name
 * @var $params array List of config-based params
 * @var $values array List of param_name => value
 * @var $field_name_fn callable Function to generate field string name based on param name
 * @var $field_name_pattern string Sprintf pattern to generate field string name (when $field_name_fn is not set)
 * @var $field_id_fn callable Function to generate field string ID based on param name
 * @var $field_id_pattern string Sprintf pattern to generate field string ID (when $field_id_fn is not set)
 */

// Validating and sanitizing input
global $cl_eform_index;
$field_name_pattern = isset( $field_name_pattern ) ? $field_name_pattern : '%s';
$field_id_pattern = isset( $field_id_pattern ) ? $field_id_pattern : ( 'cl_eform_' . $cl_eform_index . '_%s' );
$values = ( isset( $values ) AND is_array( $values ) ) ? $values : array();

// Ordering params by weight and grouping them
foreach ( $params as $index => $param ) {
	$params[ $index ]['_index'] = $index;
}
if ( ! function_exists( 'cl_usort_by_weight' ) ) {
	function cl_usort_by_weight( &$elm1, &$elm2 ) {
		$weight1 = isset( $elm1['weight'] ) ? $elm1['weight'] : 0;
		$weight2 = isset( $elm2['weight'] ) ? $elm2['weight'] : 0;
		if ( $weight2 == $weight1 ) {
			// Preserving the initial order for elements with the same weight
			return $elm1['_index'] - $elm2['_index'];
		}

		return ( $weight2 < $weight1 ) ? -1 : 1;
	}
}
usort( $params, 'cl_usort_by_weight' );

// Validating, sanitizing and grouping params
$groups = array();
foreach ( $params as $index => $param ) {
	if ( ! isset( $param['param_name'] ) ) {
		if ( WP_DEBUG ) {
			wp_die( 'Parameter name for ' . json_encode( $param ) . ' must be defined' );
		}
		continue;
	}
	$param['type'] = isset( $param['type'] ) ? $param['type'] : 'textfield';
	$param['edit_field_class'] = isset( $param['edit_field_class'] ) ? $param['edit_field_class'] : '';
	$param['std'] = isset( $param['std'] ) ? $param['std'] : '';
	$group = isset( $param['group'] ) ? $param['group'] : __( 'General', 'codelights' );
	if ( ! isset( $groups[ $group ] ) ) {
		$groups[ $group ] = array();
	}
	$groups[ $group ][] = &$params[ $index ];
}

$output = '<div class="cl-eform for_' . $name . '"><div class="cl-eform-h">';
if ( count( $groups ) > 1 ) {
	$output .= '<div class="cl-tabs">';
	$output .= '<div class="cl-tabs-list">';
	foreach ( $groups as $group => &$group_params ) {
		$output .= '<div class="cl-tabs-item">' . $group . '</div>';
	}
	$output .= '</div>';
	$output .= '<div class="cl-tabs-sections">';
}

foreach ( $groups as &$group_params ) {
	if ( count( $groups ) > 1 ) {
		$output .= '<div class="cl-tabs-section">';
	}
	foreach ( $params as $index => $param ) {

		$output .= '<div class="cl-eform-row type_' . $param['type'] . ' for_' . $param['param_name'] . ' ' . $param['edit_field_class'] . '">';
		if ( isset( $param['heading'] ) AND ! empty( $param['heading'] ) ) {
			$output .= '<div class="cl-eform-row-heading">';
			$output .= '<label for="' . esc_attr( $param['id'] ) . '">' . $param['heading'] . '</label>';
			$output .= '</div>';
		}
		$output .= '<div class="cl-eform-row-field">';

		// Outputting the field itself
		$field = array(
			'name' => isset( $field_name_fn ) ? $field_name_fn( $param['param_name'] ) : sprintf( $field_name_pattern, $param['param_name'] ),
			'id' => isset( $field_id_fn ) ? $field_id_fn( $param['param_name'] ) : sprintf( $field_id_pattern, $param['param_name'] ),
			'value' => isset( $values[ $param['param_name'] ] ) ? $values[ $param['param_name'] ] : $param['std'],
		);
		if ( in_array( $param['type'], array( 'checkbox', 'dropdown' ) ) AND isset( $param['value'] ) ) {
			$field['options'] = $param['value'];
		}
		if ( $param['type'] == 'attach_image' ) {
			$param['type'] = 'attach_images';
			$field['multiple'] = FALSE;
		}
		$output .= cl_get_template( 'eform/' . $param['type'], $field );

		$output .= '</div>';
		if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ) {
			$output .= '<div class="cl-eform-row-description">' . $param['description'] . '</div>';
		}
		if ( isset( $param['dependency'] ) AND ! empty( $param['dependency'] ) ) {
			$output .= '<div class="cl-eform-row-dependency"' . cl_pass_data_to_js( $param['dependency'] ) . '></div>';
		}
		$output .= '</div><!-- .cl-eform-row -->';
	}
	if ( count( $groups ) > 1 ) {
		$output .= '</div><!-- .cl-tabs-section -->';
	}
}

if ( count( $groups ) > 1 ) {
	$output .= '</div><!-- .cl-tabs-sections -->';
	$output .= '</div><!-- .cl-tabs -->';
}
$output .= '</div></div>';

echo $output;


