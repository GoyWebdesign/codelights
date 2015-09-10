jQuery(document).ready(function ($) {
	'use strict';

	/* Add Color Picker to all inputs that have 'color-field' class */
	$('.cl-color-picker').wpColorPicker();

	// $('.widget-title-action').click(function (e) {
	$('.widget-top').click(function (e) {
		var $parent = $(this).closest('div[id]');
		var parent_id = $parent.attr('id').match(/_cl_/);
		if (parent_id !== null) {
			var widget_id = parent_id['input'];
			var widget_class = $('#' + widget_id).attr('class');
			var $parent_sidebar = $(this).closest('[class^=sidebars-column]');
			if (widget_class == 'widget') {
				$parent_sidebar.css('max-width', '650px');
			} else if (widget_class == 'widget open') {
				$parent_sidebar.css('max-width', '');
			}
		}
	});

	$('.widget-control-close').click(function (e) {
		var $parent = $(this).closest('div[id]');
		var parent_id = $parent.attr('id').match(/_cl_/);
		if (parent_id !== null) {
			var widget_id = parent_id['input'];
			var widget_class = $('#' + widget_id).attr('class');
			var $parent_sidebar = $(this).closest('[class^=sidebars-column]');
			$parent_sidebar.css('max-width', '');
		}
	});

	$('.sidebar-name').click(function (e) {
		var $parent_sidebar = $(this).closest('[class^=sidebars-column]');
		$parent_sidebar.css('max-width', '');
	});

	// Event handler for widget Save button click
	$('input[name=savewidget]', 'div[id*=_cl_]').on('click', function () {
		var element_id = $(this).attr('id');
		var $parent = $(this).closest('div[id]');
		var parent_id = $parent.attr('id').match(/_cl_/);
		if (parent_id !== null) {
			var widget_id = parent_id['input'];
			var $textarea_wrapper = $('#' + widget_id).find('.cl-widget-textarea-html-wrapper');
			var $textarea = $textarea_wrapper.find('textarea');
			var textarea_id = $textarea.attr('id');

			var $iframe = $('#' + textarea_id + '_ifr');
			var iframe_content = $iframe.contents().find("body").html();
			$textarea.val(iframe_content);
		}

	});

	// Event handler for widget updated
	$(document).on('widget-updated', function (event, $widget) {
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();
			var widget_id = $widget.attr('id');

			// tinymce editor handler
			var $textarea_wrapper = $widget.find('.cl-widget-textarea-html-wrapper');
			var $textarea = $textarea_wrapper.find('textarea');
			var textarea_id = $textarea.attr('id');

			var configured = is_tinymce_configured(textarea_id);

			var tmce_active = is_tinymce_active(textarea_id);

			var tmce_hidden = $textarea.is(":visible");

			window.setTimeout(function () {
				// TinyMCE instance deactivation
				if (tmce_active === true) {
					if (tmce_hidden === true) {
						try {
							tinymce.remove();
						} catch (e) {}

					} else {
						tinymce.get(textarea_id).remove();
					}
				}

				// check is buttons is configured
				var quicktags_active = is_quicktags_active(textarea_id);

				if (quicktags_active === true) {
					// TinyMCE instance activation
					// buttons for non-visual mode
					var prevInstances, newInstance;
					prevInstances = QTags.instances;
					QTags.instances = [];
					quicktags(tinyMCEPreInit.qtInit[textarea_id]);
					QTags._buttonsInit();
					newInstance = QTags.instances[textarea_id];
					QTags.instances = prevInstances;
					QTags.instances[textarea_id] = newInstance;
				}

				//textarea init		
				tinyMCEPreInit.mceInit[textarea_id].selector = '#' + textarea_id;
				tinyMCEPreInit.mceInit[textarea_id].height = '100%';
				tinymce.init(tinyMCEPreInit.mceInit[textarea_id]);
			}, 500);
			// color picker handler
			$('.cl-color-picker').wpColorPicker();
		}

	});


	// Check if the tinymce quicktags buttons is created
	function is_quicktags_active(textarea_id) {
		return 'object' === typeof QTags.instances[textarea_id];
	}

	// Check if the tinymce instance is configured
	function is_tinymce_configured(textarea_id) {
		return 'undefined' !== typeof tinyMCEPreInit.mceInit[textarea_id];
	}

	// Check if the tinymce instance is active
	function is_tinymce_active(textarea_id) {
		return 'object' === typeof tinymce && 'object' === typeof tinymce.get(textarea_id) && null !== tinymce.get(textarea_id);
	}

});