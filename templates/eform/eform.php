<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Output a single element's editing form
 *
 * @var $params array List of config-based params
 * @var $values array List of param_name => value
 * @var $field_name_fn callable Function to generate field string name based on param name
 * @var $field_name_pattern string Sprintf pattern to generate field string name when $field_name_fn is not set
 * @var $field_id_fn callable Function to generate field string ID based on param name
 * @var $field_id_pattern string Sprintf pattern to generate field string ID when $field_id_fn is not set
 */

// Validating and sanitizing input
global $cl_eform_index;
$field_name_pattern = isset( $field_name_pattern ) ? $field_name_pattern : '%s';
$field_id_pattern = isset( $field_id_pattern ) ? $field_id_pattern : ( 'cl_eform_' . $cl_eform_index . '_%s' );
$values = isset( $values ) ? $values : array();
?>
<div class="cl-eform">
	<div class="cl-eform-h">

		<?php foreach ( $params as $index => $param ): ?>

			<?php
			if ( ! isset( $param['param_name'] ) ) {
				if ( WP_DEBUG ) {
					wp_die( 'Parameter name for ' . json_encode( $param ) . ' must be defined' );
				}
				continue;
			}
			$param['type'] = isset( $param['type'] ) ? $param['type'] : 'textfield';
			$classes = ' type_' . $param['type'] . ' for_' . $param['param_name'];
			if ( isset( $param['edit_field_class'] ) ) {
				// TODO Translate vendor prefixes
				$classes .= ' ' . $param['edit_field_class'];
			}
			$param['group'] = isset( $param['group'] ) ? $param['group'] : __( 'General', 'codelights' );
			$param['std'] = isset( $param['std'] ) ? $param['std'] : '';
			$field = array(
				'name' => isset( $field_name_fn ) ? $field_name_fn( $param['param_name'] ) : sprintf( $field_name_pattern, $param['param_name'] ),
				'id' => isset( $field_id_fn ) ? $field_id_fn( $param['param_name'] ) : sprintf( $field_id_pattern, $param['param_name'] ),
				'value' => isset( $values[ $param['param_name'] ] ) ? $values[ $param['param_name'] ] : $param['std'],
			);
			if ( in_array( $field['type'], array( 'checkbox', 'dropdown' ) ) AND isset( $param['value'] ) ) {
				$field['options'] = $param['value'];
			}
			if ( $field['type'] == 'attach_image' ) {
				$field['type'] = 'attach_images';
				$field['multiple'] = FALSE;
			}
			?>

			<div class="cl-eform-row<?php echo esc_attr( $classes ) ?>">
				<?php if ( isset( $param['heading'] ) AND ! empty( $param['heading'] ) ): ?>
					<div class="cl-eform-row-heading">
						<label for="<?php echo esc_attr( $param['id'] ) ?>"><?php echo $param['heading'] ?></label>
					</div>
				<?php endif; ?>
				<div class="cl-eform-row-field">
					<?php cl_load_template( 'eform/' . $param['type'], $field ) ?>
				</div>
				<?php if ( isset( $param['description'] ) AND ! empty( $param['description'] ) ): ?>
					<div class="cl-eform-row-description"><?php echo $param['description'] ?></div>
				<?php endif; ?>
			</div>

		<?php endforeach; ?>

	</div>
</div>
