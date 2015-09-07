<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single flipbox element.
 *
 * @var $link string URL of the overall flipbox anchor
 * @var $target string Target of the overall flipbox anchor
 * @var $front_icon string The name of the front icon if present
 * @var $front_icon_style string
 * @var $front_icon_color string
 * @var $front_icon_bgcolor string
 * @var $front_image mixed ID of the WP attachment image or the URL
 * @var $front_title string
 * @var $front_text string
 * @var $front_bgcolor string
 * @var $front_border_style string
 * @var $front_border_color string
 * @var $front_border_size string
 * @var $back_image mixed ID of the WP attachment image or the URL
 * @var $back_title string
 * @var $back_text string
 * @var $back_button_label string
 * @var $back_button_size string
 * @var $back_button_color string
 * @var $back_button_bgcolor string
 * @var $back_bgcolor string
 * @var $back_border_style string
 * @var $back_border_color string
 * @var $back_border_size string
 * @var $animation string Animation type: 'cardflip' / 'cubesides' / 'emptybox' / 'coveropen'
 * @var $direction string Animation direction: 'n' / 'ne' / 'e' / 'se' / 's' / 'sw' / 'w' / 'nw'
 * @var $animation_duration int In milliseconds
 * @var $animation_easing string
 * @var $width mixed
 * @var $height mixed
 *
 *
 * TODO Rework in a more proper way
 * TODO Add one more layout http://css-flip-box-3d.firchow.net/
 */

?>

<a href="#" class="cl-flipbox">
	<div class="cl-flipbox-h">
		<div class="cl-flipbox-front">
			<div class="cl-flipbox-front-icon"></div>
			<div class="cl-flipbox-front-image"><img src="" alt=""></div>
			<h4 class="cl-flipbox-front-title">FlipBox Title</h4>
			<p class="cl-flipbox-front-text">Some subtitle text that goes below the title and has multiple lines.</p>
		</div>
		<div class="cl-flipbox-back">
			<div class="cl-flipbox-back-image"><img src="" alt=""></div>
			<h4 class="cl-flipbox-back-title">Backside Title</h4>
			<p class="cl-flipbox-back-text">Some subtitle text that goes below the title and has multiple lines.</p>
			<div class="cl-flipbox-back-button">The Button</div>
		</div>
	</div>
</a>
