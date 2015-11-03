<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output elements list to choose from
 */

$elements = cl_config( 'elements', array() );

?>
<div class="cl-elist">
	<div class="cl-elist-h">
		<h2 class="cl-elist-title"><?php _e( 'Insert shortcode', 'codelights' ) ?></h2>
		<div class="cl-elist-closer">&times;</div>
		<ul class="cl-elist-list">
			<?php foreach ( $elements as $name => $elm ): ?>
				<li class="cl-elist-item for_<?php echo $name ?>" data-name="<?php echo $name ?>">
					<div class="cl-elist-item-icon <?php echo isset( $elm['icon'] ) ? $elm['icon'] : '' ?>"></div>
					<h3 class="cl-elist-item-name"><?php echo isset( $elm['name'] ) ? $elm['name'] : $name ?></h3>
					<?php if ( isset( $elm['description'] ) AND ! empty( $elm['description'] ) ): ?>
						<div class="cl-elist-item-description"><?php echo $elm['description'] ?></div>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</div>
