<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single flipbox element.
 *
 * @var $initial string The initial string
 * @var $final string The final string
 * @var $animation string Digits animation type: 'none' / 'slideup' / 'slidedown'
 * @var $size string Font size
 * @var $substring string
 * @var $el_class string Extra class name
 */

// Finding numbers positions in both initial and final strings
$pos = array();
foreach ( array( 'initial', 'final' ) as $key ) {
	// In this array we'll store the string's character number, where primitive changes from letter to number or back
	preg_match_all( '~([\d]+([\.,·][\d]+)?)~', $$key, $matches, PREG_OFFSET_CAPTURE );
	foreach ( $matches[0] as $match ) {
		$pos[ $key ][] = $match[1];
		$pos[ $key ][] = $match[1] + strlen( $match[0] );
	}
};

// Making sure we have the equal number of numbers in both strings
if ( count( $pos['initial'] ) != count( $pos['final'] ) ) {
	// Not-paired numbers will be treated as letters
	if ( count( $pos['initial'] ) > count( $pos['final'] ) ) {
		$pos['initial'] = array_slice( $pos['initial'], 0, count( $pos['final'] ) );
	} else/*if ( count( $positions['initial'] ) < count( $positions['final'] ) )*/ {
		$pos['final'] = array_slice( $pos['final'], 0, count( $pos['initial'] ) );
	}
}

// Position boundaries
foreach ( array( 'initial', 'final' ) as $key ) {
	array_unshift( $pos[ $key ], 0 );
	$pos[ $key ][] = strlen( $$key );
}

$output = '<div class="cl-counter">';
$output .= '<div class="cl-counter-text">';

// Do we treat this as a number or as a letter combination
for ( $index = 0, $length = count( $pos['initial'] ) - 1; $index < $length; $index ++ ) {
	$part_type = ( $index % 2 ) ? 'number' : 'words';
	$part_initial = substr( $initial, $pos['initial'][ $index ], $pos['initial'][ $index + 1 ] - $pos['initial'][ $index ] );
	$part_final = substr( $final, $pos['final'][ $index ], $pos['final'][ $index + 1 ] - $pos['final'][ $index ] );
	$output .= '<span class="cl-counter-text-part type_' . $part_type . '" data-final="' . esc_attr( $part_final ) . '">' . $part_initial . '</span>';
}

$output .= '</div>';
if ( ! empty( $substring ) ) {
	$output .= '<div class="cl-counter-substring">' . $substring . '</div>';
}
$output .= '</div>';
echo $output;
