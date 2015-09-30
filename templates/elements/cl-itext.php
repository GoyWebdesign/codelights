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

// Getting the whole set of parts with all the intermediate values (part_index => part_states)
$groups = array();
foreach ( $_parts[0] as $part ) {
	$groups[] = array( $part );
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
			$groups[ $j - 1 ][ $i_index ] = $initial[ $i - 1 ];
			continue;
		}
		if ( $i > 0 AND $j > 0 AND $min == $dist[ $i - 1 ][ $j - 1 ] ) {
			// Modify
			$groups[ $j - 1 ][ $i_index ] = $initial[ $i - 1 ];
		} elseif ( $j > 0 AND $min == $dist[ $i ][ $j - 1 ] ) {
			// Remove
			$groups[ $j - 1 ][ $i_index ] = '';
			$i ++;
		} elseif ( $min == $dist[ $i - 1 ][ $j ] ) {
			// Insert
			if ( $j == 0 ) {
				array_unshift( $groups, '' );
			} else {
				array_splice( $groups, $j, 0, '' );
			}
			$groups[ $j ] = array_fill( 0, count( $_parts ), '' );
			$groups[ $j ][ $i_index ] = $initial[ $i - 1 ];
			$j ++;
		}
	}
	// Updating final parts
	$_parts[ $i_index ] = array();
	foreach ( $groups as $parts_group ) {
		$_parts[ $i_index ][] = $parts_group[ $i_index ];
	}
}

// Finding the dynamic parts and their animation indexes
$group_changes = array();
foreach ( $groups as $index => $group ) {
	$group_changes[ $index ] = array();
	for ( $i = 0; $i < count( $_parts ); $i ++ ) {
		if ( $group[ $i ] != $group[ isset( $group[ $i + 1 ] ) ? ( $i + 1 ) : 0 ] ) {
			$group_changes[ $index ][] = $i;
		}
	}
}

// Combining groups that are either static, or are changed at the same time
for ( $i = 1; $i < count( $group_changes ); $i ++ ) {
	if ( $group_changes[ $i - 1 ] == $group_changes[ $i ] ) {
		// Combining with the previous element
		foreach ( $groups[ $i - 1 ] AS $index => $part ) {
			$groups[ $i - 1 ][ $index ] .= $groups[ $i ][ $index ];
		}
		array_splice( $groups, $i, 1 );
		array_splice( $group_changes, $i, 1 );
		$i--;
	}
}

$output = '<' . $tag . ' class="cl-itext' . $classes . '"' . $inner_css . cl_pass_data_to_js( $js_data ) . '>';
foreach ( $groups as $index => $group ) {
	ksort( $group );
	if ( empty( $group_changes[ $index ] ) ) {
		// Static part
		$output .= $group[0];
	} else {
		$output .= '<span class="cl-itext-part';
		// Animation classes (just in case site editor wants some custom styling for them)
		foreach ( $group_changes[ $index ] as $changesat ) {
			$output .= ' changesat_' . $changesat;
		}
		$output .= '"' . cl_pass_data_to_js( $group ) . '>' . $group[0] . '</span>';
	}
}
$output .= '</' . $tag . '>';

echo $output;
