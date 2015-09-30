<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single Ineractive Banner element.
 *
 * @var $texts string newline-separated text states
 * @var $font_size int Font size in pixels
 * @var $color string Basic text color
 * @var $dynamic_color string Changing part text color
 * @var $animation_type string Animation type: 'replace' / 'terminal' / 'shortest'
 * @var $animation_duration string Animation duration: '100ms' / '200ms' / ... / '1200ms'
 * @var $animation_delay string Animation delay: '1000ms' / '2000ms' / ... / '10000ms'
 * @var $tag string Tag name: 'div' / 'h1' / 'h2' / 'h3' / 'p'
 * @var $el_class string Extra class name
 */

// Main element classes, inner css and additional attributes
$classes = ' animation_' . $animation_type;

$texts_arr = explode( "\n", strip_tags( $texts ) );

$inner_css = '';
if ( ! empty( $color ) ) {
	$inner_css .= 'color:' . $color . ';';
}
if ( ! empty( $inner_css ) ) {
	$inner_css = ' style="' . esc_attr( $inner_css ) . '"';
}

$js_data = array(
	'texts' => $texts_arr,
	'type' => $animation_type,
	'duration' => $animation_duration,
	'delay' => $animation_delay,
);
if ( ! empty( $dynamic_color ) ) {
	$js_data['dynamicColor'] = $dynamic_color;
}

if ( ! empty( $el_class ) ) {
	$classes .= ' ' . $el_class;
}

// Counting the parts that will actually be changed and splitting them into different spans
$_parts = array();
foreach ( $texts_arr as $index => $text ) {
	preg_match_all( '~\w+|[^\w]+~u', $text, $matches );
	$_parts[ $index ] = $matches[0];
}

// TODO Remove test data below
$_parts = array(
	array( 'a', 'b', 'c' ),
	array( 'a', 'b', 'c', 'd' ),
	array( 'b', 'c', 'd' ),
);

// Getting the whole set of parts with all the intermediate values (part_index => part_states)
$parts = array();
foreach ( $_parts[0] as $part ) {
	$parts[] = array( $part );
}

for ( $i_index = count( $_parts ) - 1; $i_index > 0; $i_index -- ) {
	$f_index = isset( $_parts[ $i_index + 1 ] ) ? ( $i_index + 1 ) : 0;
	$initial = &$_parts[ $i_index ];
	$final = &$_parts[ $f_index ];
	// Counting arrays edit distance for the strings parts to find the common parts
	$dist = array();
	for ( $i = 0; $i <= count( $initial ); $i ++ ) {
		$dist[ $i ] = array( $i );
	}
	for ( $j = 1; $j <= count( $final ); $j ++ ) {
		$dist[0][ $j ] = $j;
		for ( $i = 1; $i <= count( $initial ); $i ++ ) {
			if ( $initial[ $i - 1 ] == $final[ $j - 1 ] ) {
				$dist[ $i ][ $j ] = $dist[ $i - 1 ][ $j - 1 ];
			} else {
				$dist[ $i ][ $j ] = min( $dist[ $i - 1 ][ $j ], $dist[ $i ][ $j - 1 ], $dist[ $i - 1 ][ $j - 1 ] ) + 1;
			}
		}
	}
	for ( $i = count( $initial ), $j = count( $final ); $i > 0 OR $j > 0; $i --, $j -- ) {
		$min = $dist[ $i ][ $j ];
		if ( $i > 0 ) {
			$min = min( $min, $dist[ $i - 1 ][ $j ], ( $j > 0 ) ? $dist[ $i - 1 ][ $j - 1 ] : $min );
		}
		if ( $j > 0 ) {
			$min = min( $min, $dist[ $i ][ $j - 1 ] );
		}
		if ( $min >= $dist[ $i ][ $j ] ) {
			$parts[ $j - 1 ][ $i_index ] = $initial[ $i - 1 ];
			continue;
		}
		if ( $i > 0 AND $j > 0 AND $min == $dist[ $i - 1 ][ $j - 1 ] ) {
			// Modify
			$parts[ $j - 1 ][ $i_index ] = $initial[ $i - 1 ];
		} elseif ( $j > 0 AND $min == $dist[ $i ][ $j - 1 ] ) {
			// Remove
			$parts[ $j - 1 ][ $i_index ] = '';
			$i ++;
		} elseif ( $min == $dist[ $i - 1 ][ $j ] ) {
			// Insert
			if ( $j == 0 ) {
				array_unshift( $parts, '' );
			} else {
				array_splice( $parts, $j, 0, '' );
			}
			$parts[ $j ] = array_fill( 0, count( $_parts ), '' );
			$parts[ $j ][ $i_index ] = $initial[ $i - 1 ];
			$j ++;
		}
	}
	// Updating final parts
	$_parts[ $i_index ] = array();
	foreach ( $parts as $parts_group ) {
		$_parts[ $i_index ][] = $parts_group[ $i_index ];
	}
}


$output = '<' . $tag . ' class="cl-itext' . $classes . '"' . $inner_css . cl_pass_data_to_js( $js_data ) . '>';
$output .= $texts_arr[0];
$output .= '</' . $tag . '>';

echo $output;
