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
			// color picker reinit
			$('.cl-color-picker').wpColorPicker();
			// sortable reinit
			$('.sortable-attachment-list').sortable({
				stop: function (event, ui) {
					var $parent = $(this).closest('.cl-attach-images-group');
					var parent_id = $parent.attr('id');
					var $attached_images = $parent.find('.cl-attached-images');
					var container_id = $(this).attr('id');
					var gallery_images_array = new Array();
					$('#' + container_id + ' > li').each(function (index) {
						var image_id = $(this).attr('id');
						gallery_images_array.push(image_id);
					});
					var gallery_images_res = gallery_images_array.toString();
					$attached_images.val(gallery_images_res);
				}
			});
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

	// images attachment

	// init sortable images
	$('.sortable-attachment-list').sortable();

	// handler of event after sorting
	$(".sortable-attachment-list").on('sortstop', function (event, ui) {
		var $parent = $(this).closest('.cl-attach-images-group');
		var $attached_images = $parent.find('.cl-attached-images');
		var container_id = $(this).attr('id');
		var gallery_images_array = new Array();
		$('#' + container_id + ' > li').each(function (index) {
			var image_id = $(this).attr('id');
			gallery_images_array.push(image_id);
		});
		var gallery_images_res = gallery_images_array.toString();
		$attached_images.val(gallery_images_res);
	});

	$("body").on("mouseenter", ".attachments-thumbnail", function () {
		$(this).children(".attachment-delete-wrapper").css("background-color", "rgba(0,0,0,0.5)");
		$(this).children(".attachment-delete").css("display", "block");
	}).on("mouseleave", ".attachments-thumbnail", function () {
		$(this).children(".attachment-delete-wrapper").css("background-color", "rgba(0,0,0,0)");
		$(this).children(".attachment-delete").css("display", "none");
	});


	function removeA(arr) {
		var what, a = arguments,
			L = a.length,
			ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax = arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	}

	$("body").on("click", ".attachment-delete-link", function (e) {
		var attachment_id = $(this).attr("id");
		var gallery_images_res;

		var $parent = $(this).closest('.cl-attach-images-group');
		var $attached_images = $parent.find('.cl-attached-images');

		var gallery_images = $attached_images.val(); // string
		if (gallery_images != '') {
			var gallery_images_array = new Array();
			var n = gallery_images.search(',');
			if (n > 0) {
				gallery_images_array = gallery_images.split(','); // array
				gallery_images_array = removeA(gallery_images_array, attachment_id); // array
				gallery_images_res = gallery_images_array.toString(); // string
			} else {
				gallery_images_res = '';
			}
		}


		//$attachments.remove("#" + attachment_id);
		$(this).closest('li').remove();
		$attached_images.val(gallery_images_res);
		e.preventDefault();
	});

	// Uploading files
	var file_frame;

	$('.cl_widget_add_images_button').live('click', function (event) {

		event.preventDefault();
		var $parent = $(this).closest('.cl-attach-images-group');
		var parent_id = $parent.attr('id');
		var $attachments = $parent.find('.cl-images-container');
		var attachments_id = $attachments.attr('id');
		var $attached_images = $parent.find('.cl-attached-images');

		// If the media frame already exists, reopen it.
		if (file_frame) {
			file_frame.open();
			return;
		}

		// Create the media frame.
		file_frame = wp.media.frames.file_frame = wp.media({
			title: $(this).data('uploader_title'),
			button: {
				text: $(this).data('uploader_button_text'),
			},
			multiple: true // Set to true to allow multiple files to be selected
		});



		// When an image is selected, run a callback.
		file_frame.on('select', function () {

			var selection = file_frame.state().get('selection');

			selection.map(function (attachment) {

				attachment = attachment.toJSON();
				if (typeof attachment.sizes.thumbnail != 'undefined') {
					var attachment_size = attachment.sizes.thumbnail;
				} else {
					var attachment_size = attachment.sizes.full;
				}

				var gallery_images = $attached_images.val(); // string
				if (gallery_images != '') {
					var gallery_images_array = new Array();
					var n = gallery_images.search(',');
					if (n > 0) {
						gallery_images_array = gallery_images.split(','); // array
					} else {
						gallery_images_array.push(gallery_images); // array
					}

					var is_image_exsist = false;
					for (var i = 0; i < gallery_images_array.length; i++) {
						if (gallery_images_array[i] == attachment.id) {
							is_image_exsist = true;
						}
					}

					if (is_image_exsist === false) {
						$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachment_size.url + '" height="' + attachment_size.height + '" width="' + attachment_size.width + '"></div></li>');
						gallery_images_array.push(attachment.id); // array
						var gallery_images_res = gallery_images_array.toString(); // string
						$attached_images.val(gallery_images_res);
					} else {
						$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
						$('.attachments-thumbnail-error').fadeOut(3000);
					}
				} else {
					var gallery_images_res = attachment.id;
					$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachment_size.url + '" height="' + attachment_size.height + '" width="' + attachment_size.width + '"></div></li>');
					$attached_images.val(gallery_images_res);
				}


			});

		});
		// Finally, open the modal
		file_frame.open();
	});

});