jQuery(document).ready(function($){
	'use strict';

	/* Add Color Picker to all inputs that have 'color-field' class */
	$('.cl-color-picker').wpColorPicker();

	// Event handler for widget Save button click
	$('#widgets-right').on('click', 'input[name=savewidget]', function(){
		var $widget = $(this).closest('.widget'),
			$textarea = $widget.find('.cl-widget-textarea-html-wrapper textarea');
		if ($textarea.length > 0) {
			var textareaId = $textarea.attr('id'),
				newTinyMCEEditor = tinymce.get(textareaId);
			newTinyMCEEditor.save();
		}
	});

	// Event handler for widget updated
	$(document).on('widget-updated', function(event, $widget){
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();

			// tinymce editor handler
			var widget_id = $widget.attr('id'),
				$textareaWrapper = $widget.find('.cl-widget-textarea-html-wrapper'),
				$textarea = $textareaWrapper.find('textarea'),
				textareaID = $textarea.attr('id');

			var configured = is_tinymce_configured(textareaID);

			var tmceActive = is_tinymce_active(textareaID);

			var tmceHidden = $textarea.is(":visible");

			window.setTimeout(function(){
				// TinyMCE instance deactivation
				if (tmceActive === true) {
					if (tmceHidden === true) {
						try {
							tinymce.remove();
						} catch (e) {
						}

					} else {
						tinymce.get(textareaID).remove();
					}
				}

				// check is buttons is configured
				var quicktagsActive = is_quicktags_active(textareaID);

				if (quicktagsActive === true) {
					// TinyMCE instance activation
					// buttons for non-visual mode
					var prevInstances, newInstance;
					prevInstances = QTags.instances;
					QTags.instances = [];
					quicktags(tinyMCEPreInit.qtInit[textareaID]);
					QTags._buttonsInit();
					newInstance = QTags.instances[textareaID];
					QTags.instances = prevInstances;
					QTags.instances[textareaID] = newInstance;
				}

				//textarea init
				tinyMCEPreInit.mceInit[textareaID].selector = '#' + textareaID;
				tinyMCEPreInit.mceInit[textareaID].height = '100%';
				tinymce.init(tinyMCEPreInit.mceInit[textareaID]);
			}, 500);

			// add image button hide if no multiple images and one image chosen
			var galleryImagesArray = new Array(),
				$multiple = $widget.find('.multiple-attachments'),
				multipleAttachments = $multiple.val(),
				$addButton = $widget.find('.cl_widget_add_images_button'),
				$findres = $widget.find('.attachments-thumbnail'),
				$attachedImages = $widget.find('.cl-attached-images');

			if (multipleAttachments == 'false' && $findres.length > 0) {
				$addButton.css('display', 'none');
			}

			// insert list of attachments in hidden input
			var attachmentsListID = $widget.find('.cl-images-container').attr('id');
			galleryImagesArray = get_attachments_list(attachmentsListID);
			if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
				var gallery_images_val = galleryImagesArray.toString();
				$attachedImages.val(gallery_images_val);
			} else {
				$attachedImages.removeAttr('value');
			}

			// color picker reinit
			$('.cl-color-picker').wpColorPicker();

			// sortable reinit
			$('.sortable-attachment-list').sortable({
				stop: function(event, ui){
					var containerID = $(this).attr('id'),
						galleryImagesArray = get_attachments_list(containerID),
						galleryImagesRes = galleryImagesArray.toString();
					$attachedImages.val(galleryImagesRes);
				}
			});

		}

	});

	// Check if the tinymce quicktags buttons is created
	function is_quicktags_active(textareaID){
		return 'object' === typeof QTags.instances[textareaID];
	}

	// Check if the tinymce instance is configured
	function is_tinymce_configured(textareaID){
		return 'undefined' !== typeof tinyMCEPreInit.mceInit[textareaID];
	}

	// Check if the tinymce instance is active
	function is_tinymce_active(textareaID){
		return 'object' === typeof tinymce && 'object' === typeof tinymce.get(textareaID) && null !== tinymce.get(textareaID);
	}

	// images attachment

	// rebuild array with images from list
	function get_attachments_list(attachmentsListID){
		var galleryImagesArray = new Array();
		$('#' + attachmentsListID + ' > li.attachments-thumbnail').each(function(index){
			var imageID = $(this).attr('id');
			galleryImagesArray.push(imageID);
		});
		return galleryImagesArray;
	}

	// remove element from array by value
	function removeA(arr){
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

	// init sortable images
	$('.sortable-attachment-list').sortable();

	// handler of event after sorting
	$('.sortable-attachment-list').on('sortstop', function(event, ui){
		var $parent = $('.widget.open').find('.cl-attach-images-group'),
			$attachedImages = $parent.find('.cl-attached-images'),
			attachmentsListID = $(this).attr('id'),
			galleryImagesArray = get_attachments_list(attachmentsListID),
			galleryImagesRes = galleryImagesArray.toString();
		$attachedImages.val(galleryImagesRes);
	});

	$('#widgets-right').on('mouseenter', '.attachments-thumbnail', function(e){
		e.preventDefault();
		$(this).children('.attachment-delete-wrapper').css('background-color', 'rgba(0,0,0,0.5)');
		$(this).children('.attachment-delete').css('display', 'block');
	}).on('mouseleave', '.attachments-thumbnail', function(e){
		e.preventDefault();
		$(this).children('.attachment-delete-wrapper').css('background-color', 'rgba(0,0,0,0)');
		$(this).children('.attachment-delete').css('display', 'none');
	});

	$('#widgets-right').on('click', '.attachment-delete-link', function(e){
		e.preventDefault();
		var $parent = $(this).closest('.cl-attach-images-group'),
			$attachedImagesDel = $parent.find('.cl-attached-images'),
			attachmentsListID = $parent.find('.cl-images-container').attr('id'),
			$multiple = $parent.find('.multiple-attachments'),
			multipleAttachment = $multiple.val(),
			$addButton = $parent.find('.cl_widget_add_images_button');

		$(this).closest('li').remove();
		if (multipleAttachment == 'false') {
			$addButton.css('display', 'block');
			$attachedImagesDel.removeAttr('value');
		} else {
			var galleryImagesArray = get_attachments_list(attachmentsListID);
			if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
				var galleryImagesVal = galleryImagesArray.toString();
				$attachedImagesDel.val(galleryImagesVal);
			} else {
				$attachedImagesDel.removeAttr('value');
			}
		}

	});

	// open WP media uploader
	$('#widgets-right').on('click', '.cl_widget_add_images_button', function(event){

		var fileFrame;

		event.preventDefault();

		var $parent = $('.widget.open').find('.cl-attach-images-group'),
			$attachments = $parent.find('.cl-images-container');

		// If the media frame already exists, reopen it.
		if (fileFrame) {
			fileFrame.open();
			return;
		}

		// Create the media frame.
		fileFrame = wp.media.frames.file_frame = wp.media({
			title: $(this).data('uploader_title'),
			button: {
				text: $(this).data('uploader_button_text'),
			},
			multiple: true // Set to true to allow multiple files to be selected
		});

		// When an image is selected, run a callback.
		fileFrame.on('select', function(){

			var $attachmentsStorage = $parent.find('.cl-attached-images'), // input with list of attached images
				$attachmentsList = $parent.find('.cl-images-container'), // ul with attached images
				attachmentsListID = $attachmentsList.attr('id'),
				$multiple = $parent.children('.multiple-attachments'), // input with multiple trigger
				multipleAttachments = $multiple.val(),
				$addButton = $parent.children('.cl_widget_add_images_button'), // button
				selection = fileFrame.state().get('selection');

			selection.map(function(attachment){

				attachment = attachment.toJSON();
				if (typeof attachment.sizes.thumbnail != 'undefined') {
					var attachmentSize = attachment.sizes.thumbnail;
				} else {
					var attachmentSize = attachment.sizes.full;
				}

				var galleryImagesArray = get_attachments_list(attachmentsListID); // array
				if (multipleAttachments != 'false') {

					if (galleryImagesArray != '' || galleryImagesArray !== 'undefined') {
						var isImageExsist = false;
						for (var i = 0; i < galleryImagesArray.length; i++) {
							if (galleryImagesArray[i] == attachment.id) {
								isImageExsist = true;
							}
						}

						if (isImageExsist === false) {
							$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
							galleryImagesArray.push(attachment.id); // array
							var galleryImagesRes = galleryImagesArray.toString(); // string
							$attachmentsStorage.val(galleryImagesRes);
						} else {
							$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
							$('.attachments-thumbnail-error').fadeOut(3000);
						}
					}

				} else {
					$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
					$attachmentsStorage.val(attachment.id);
					$addButton.css('display', 'none');
				}

			});
		});
		// Finally, open the modal
		fileFrame.open();
	});


	// handler for insert link button
	clLinkBtn.init();

	// tabs
	var tabs = $('.cl-tabs');

	tabs.each(function(){
		var tab = $(this),
			tabItems = tab.find('ul.cl-tabs-navigation'),
			tabContentWrapper = tab.children('ul.cl-tabs-content'),
			tabNavigation = tab.find('nav');

		tabItems.on('click', 'a', function(event){
			event.preventDefault();
			var selectedItem = $(this);
			if (!selectedItem.hasClass('selected')) {
				var selectedTab = selectedItem.data('content'),
					selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
					slectedContentHeight = selectedContent.innerHeight();

				tabItems.find('a.selected').removeClass('selected');
				selectedItem.addClass('selected');
				selectedContent.addClass('selected').siblings('li').removeClass('selected');
				//animate tabContentWrapper height when content changes
				tabContentWrapper.animate({
					'height': slectedContentHeight
				}, 200);
			}
		});
	});

});


var clLinkSideload = false; //used to track whether or not the link dialogue actually existed on this page, ie was wp_editor invoked.

var clLinkBtn = (function($){
	'use strict';
	var clLinkSideload = false; //used to track whether or not the link dialogue actually existed on this page, ie was wp_editor invoked.

	/* PRIVATE METHODS
	 -------------------------------------------------------------- */
//add event listeners

	function _init(){
		$('#widgets-right').on('click', '.cl-insert-link-button', function(e){
			e.preventDefault();
			_addLinkListeners();
			clLinkSideload = false;

			var linkValContainer = $('.cl-insert-link-container');

			if (typeof wpActiveEditor != 'undefined') {
				wpLink.open();
				var existingLinkTitle = $('.widget.open').find('.cl-linkdialog-title').text();
				if (existingLinkTitle !== 'undefined' || existingLinkTitle.length > 0) {
					$('#wp-link-text').val(existingLinkTitle);
				}
				var existingLinkUrl = $('.widget.open').find('.cl-linkdialog-url').text();
				if (existingLinkUrl !== 'undefined' || existingLinkUrl.length > 0) {
					$('#wp-link-url').val(existingLinkUrl);
				}
				var existingLinkTarget = $('.widget.open').find('.cl-linkdialog-target').text();
				if (existingLinkTarget == '_blank') {
					$('#wp-link-target').prop('checked', true);
				}
				wpLink.textarea = $(linkValContainer);
			} else {
				window.wpActiveEditor = true;
				clLinkSideload = true;
				wpLink.open();
				wpLink.textarea = $(linkValContainer);
			}
			return false;
		});

	}

	/* LINK EDITOR EVENT HACKS
	 -------------------------------------------------------------- */
	function _addLinkListeners(){
		$('body').on('click', '#wp-link-submit', function(e){
			var wp_link_text = $('#wp-link-text').val(),
				linkAtts = wpLink.getAttrs(),
				link_val_container = $('.cl-insert-link-container'),
				link_val_url = $('.cl-linkdialog-url'),
				link_val_title = $('.cl-linkdialog-title'),
				link_val_target = $('.cl-linkdialog-target'),
				encoded_url = encodeURIComponent(linkAtts.href),
				encoded_title = encodeURIComponent(wp_link_text),
				encoded_target = encodeURIComponent(linkAtts.target),
				link_val_encoded = 'url:' + encoded_url + '|title:' + encoded_title + '|target:' + encoded_target;

			link_val_container.text(link_val_encoded);
			link_val_title.text(wp_link_text);
			link_val_url.text(linkAtts.href);
			link_val_target.text(linkAtts.target);
			_removeLinkListeners();
			return false;
			e.preventDefault();
		});

		$('body').on('click', '#wp-link-cancel', function(e){
			_removeLinkListeners();
			return false;
		});
	}

	function _removeLinkListeners(){
		if (clLinkSideload) {
			if (typeof wpActiveEditor != 'undefined') {
				wpActiveEditor = undefined;
			}
		}

		wpLink.close();
		wpLink.textarea = $('.cl-insert-link-button'); //focus on button

		$('body').off('click', '#wp-link-submit');
		$('body').off('click', '#wp-link-cancel');
	}

	/* PUBLIC ACCESSOR METHODS
	 -------------------------------------------------------------- */
	return {
		init: _init
	};

})(jQuery);
