/**
 * Retrieve/set/erase dom modificator class <mod>_<value> for the CSS Framework
 * @param {String} mod Modificator namespace
 * @param {String} [value] Value
 * @returns {string|jQuery}
 */
jQuery.fn.cssMod = function(mod, value){
	if (this.length == 0) return this;
	// Remove class modificator
	if (value === false) {
		return this.each(function(){
			this.className = this.className.replace(new RegExp('(^| )' + mod + '\_[a-z0-9\_]+( |$)'), '$2');
		});
	}
	var pcre = new RegExp('^.*?' + mod + '\_([a-z0-9\_]+).*?$'),
		arr;
	// Retrieve modificator
	if (value === undefined) {
		return (arr = pcre.exec(this.get(0).className)) ? arr[1] : false;
	}
	// Set modificator
	else {
		return this.each(function(){
			this.className = this.className.replace(new RegExp('(^| )' + mod + '\_[a-z0-9\_]+( |$)'), '$1' + mod + '_' + value + '$2');
		});
	}
};

/**
 * CodeLights Form Fields
 */
!function($){

	window.CLField = function(row, options){
		this.$row = $(row);
		if (this.$row.data('clfield')) return this.$row.data('clfield');
		this.type = this.$row.cssMod('type');
		this.name = this.$row.data('name');
		this.$input = this.$row.find('[name="' + this.name + '"]');
		this.inited = false;

		/**
		 * Boundable field events
		 */
		this.$$events = {
			beforeShow: [],
			afterShow: [],
			change: [],
			beforeHide: [],
			afterHide: []
		};

		// Overloading selected functions, moving parent functions to "parent" namespace: init => parentInit
		if (window.CLField[this.type] !== undefined) {
			for (var fn in window.CLField[this.type]) {
				if (!window.CLField[this.type].hasOwnProperty(fn)) continue;
				if (this[fn] !== undefined) {
					var parentFn = 'parent' + fn.charAt(0).toUpperCase() + fn.slice(1);
					this[parentFn] = this[fn];
				}
				this[fn] = window.CLField[this.type][fn];
			}
		}

		this.$row.data('clfield', this);

		// Init on first show
		var initEvent = function(){
			this.init(options);
			this.inited = true;
			this.removeEvent('beforeShow', initEvent);
		}.bind(this);
		this.addEvent('beforeShow', initEvent);
	};

	window.CLField.prototype = {
		// init input field
		init: function(){
			this.$input.on('change', function(){
				this.fireEvent('change', this.getValue());
			}.bind(this)); // CLField instance
		},
		deinit: function(){
			// something
		},
		// return this input value
		getValue: function(){
			return this.$input.val();
		},
		// set this input value
		setValue: function(value){
			this.$input.val(value);
			this.fireEvent('change', value);
		},
		addEvent: function(trigger, fn){
			if (this.$$events[trigger] === undefined) this.$$events[trigger] = [];
			this.$$events[trigger].push(fn);
		},
		fireEvent: function(trigger, values){
			if (this.$$events[trigger] === undefined || this.$$events[trigger].length == 0) return;
			for (var index = 0; index < this.$$events[trigger].length; index++) {
				this.$$events[trigger][index](this, values);
			}
		},
		removeEvent: function(trigger, fn){
			if (this.$$events[trigger] === undefined) return;
			var fnPos = $.inArray(fn, this.$$events[trigger]);
			if (fnPos != -1) {
				this.$$events[trigger].splice(fnPos, 1);
			}
		}
	};
}(jQuery);

// Some codelights field example
!function($){
	window.CLField['textfield'] = {
		init: function(options){
			this.parentInit();
			// Do something
			console.log('init');
		},
		deinit: function(){
			this.parentDeinit();
			// Do something
		},
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			console.log('inner value:' + value);
		},
		setValue: function(){
			this.parentSetValue();
			// Do something
		}
	};
}(jQuery);


jQuery(document).ready(function($){
	'use strict';

	/* scripts initialization on Widget Area load */

	// init Color Picker to all inputs that have 'color-field' class on Widget Area load
	$('.cl-color-picker').wpColorPicker();

	// field initialization
	var field = new CLField('#widget-cl_flipbox-2-front');
	field.fireEvent('beforeShow');
	var value = field.getValue();
	console.log('value:' + value);

	// init sortable images on Widget Area load
	$('.sortable-attachment-list').sortable({
		stop: function(event, ui){
			clMediaUploader.sortImagesInList($(this));
		}
	});

	// init handler for insert link button on Widget Area load
	clLinkBtn.init();

	// init tabs in widget on Widget Area load
	clTabs.init();

	/* --------- end scripts initialization on Widget Area load --------- */

	/* scripts initialization in a siteorigin page builder modal window */
	$(document).on('panelsopen', function(event){
		var $dialog = $(event.target);
		// Check that this is for our widget class
		if (!$dialog.has('.cl-widgetform')) return;

		// init Color Picker to all inputs that have 'color-field' class on Page Builder panel open
		$('.cl-color-picker').wpColorPicker();

		// init sortable images on Page Builder panel open
		$('.sortable-attachment-list').sortable({
			stop: function(event, ui){
				clMediaUploader.sortImagesInList($(this));
			}
		});

		// init TinyMCE editor in widget on Page Builder panel open
		clWidgetTMCE.init($dialog);

		//init tabs in widget on Page Builder panel open
		clTabs.init();

		// init handler for insert link button on Page Builder panel open
		clLinkBtn.init();

	});

	/* --------- end scripts initialization in a siteorigin page builder modal window --------- */

	/* events handlers starts here */

	// Event handler for widget Save button click
	$('#widgets-right').on('click', 'input[name=savewidget]', function(){
		clWidgetTMCE.save($(this));
	});

	// Event handler for widget updated after ajax
	$(document).on('widget-updated', function(event, $widget){
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();

			// init Color Picker to all inputs that have 'color-field' class in Widget Area after ajax
			$('.cl-color-picker').wpColorPicker();

			// init sortable images in Widget Area after ajax
			$('.sortable-attachment-list').sortable({
				stop: function(event, ui){
					// multiple only
					clMediaUploader.sortImagesInList($(this));
				}
			});

			// reinit TinyMCE editor in widget after ajax
			clWidgetTMCE.init($widget);

			// add image button hide if no multiple images and one image chosen after ajax
			// single only
			clMediaUploader.addImageButtonAfterAjax($widget);

			// create list of attachments in hidden input after ajax
			// single & multiple
			clMediaUploader.createAttachmentsListAfterAjax($widget);

			// init handler for insert link button in Widget Area after ajax
			clLinkBtn.init();

			// init tabs in Widget Area after ajax
			clTabs.init();
		}
	});

	// handler of mouse events on images in sortable list
	$(document).on('mouseenter', '.attachments-thumbnail', function(event){
		$(this).children('.attachment-delete-wrapper').css('background-color', 'rgba(0,0,0,0.5)');
		$(this).children('.attachment-delete').css('display', 'block');
		event.preventDefault();
	}).on('mouseleave', '.attachments-thumbnail', function(event){
		$(this).children('.attachment-delete-wrapper').css('background-color', 'rgba(0,0,0,0)');
		$(this).children('.attachment-delete').css('display', 'none');
		event.preventDefault();
	});

	// handler of delete image event
	$(document).on('click', '.attachment-delete-link', function(event){
		// single & multiple
		clMediaUploader.deleteImageFromList($(this));
		event.preventDefault();
	});

	// open WP media uploader
	$(document).on('click', '.cl_widget_add_images_button', function(event){
		// single && multiple
		clMediaUploader.open($(this));
		event.preventDefault();
	});

	/* --------- events handlers ends here --------- */

});

var clWidgetTMCE = (function($){
	'use strict';

	function _init($widget){
		// tinymce editor handler
		var $textareaWrapper = $widget.find('.cl-widget-textarea-html-wrapper'),
			$textarea = $textareaWrapper.find('textarea'),
			widgetTextareaID = $textarea.attr('id'),
			tmceHidden = $textarea.is(":visible"),
			tmceActive = isTinymceActive(widgetTextareaID),
		// check is buttons is configured
			initTextareaID;

		var array = $.map(tinyMCEPreInit.mceInit, function(value, index){
			return [index];
		});

		var res = array.forEach(function(element, index, array){
			var found = element.match('widget-cl_');
			if (found !== null && found.length > 0) {
				initTextareaID = element;
			}
		});

		var quicktagsActive = isQuicktagsActive(initTextareaID);

		window.setTimeout(function(){
			// TinyMCE instance deactivation
			if (tmceActive === true) {
				if (tmceHidden === true) {
					try {
						tinymce.remove();
					} catch (e) {
					}

				} else {
					tinymce.get(initTextareaID).remove();
				}
			}

			//textarea init
			tinyMCEPreInit.mceInit[widgetTextareaID] = tinyMCEPreInit.mceInit[initTextareaID];

			if (quicktagsActive === true) {
				// TinyMCE instance activation
				// buttons for non-visual mode
				var prevInstances, newInstance;
				prevInstances = QTags.instances;
				QTags.instances = [];
				quicktags(tinyMCEPreInit.qtInit[initTextareaID]);
				QTags._buttonsInit();
				newInstance = QTags.instances[initTextareaID];
				QTags.instances = prevInstances;
				QTags.instances[initTextareaID] = newInstance;
			} else {
				new QTags(widgetTextareaID);
				QTags._buttonsInit();
			}

			tinyMCEPreInit.mceInit[widgetTextareaID].selector = '#' + widgetTextareaID;
			tinyMCEPreInit.mceInit[widgetTextareaID].height = '100%';
			tinymce.init(tinyMCEPreInit.mceInit[widgetTextareaID]);
		}, 500);
	}

	function _save($this){
		var $widget = $this.closest('.widget'),
			$textarea = $widget.find('.cl-widget-textarea-html-wrapper textarea');
		if ($textarea.length > 0) {
			var textareaId = $textarea.attr('id'),
				newTinyMCEEditor = tinymce.get(textareaId);
			newTinyMCEEditor.save();
		}
	}

	// private functions

	// Check if the tinymce quicktags buttons is created
	function isQuicktagsActive(textareaID){
		return 'object' === typeof QTags.instances[textareaID];
	}

	// Check if the tinymce instance is configured
	function isTinymceConfigured(textareaID){
		return 'undefined' !== typeof tinyMCEPreInit.mceInit[textareaID];
	}

	// Check if the tinymce instance is active
	function isTinymceActive(textareaID){
		return 'object' === typeof tinymce && 'object' === typeof tinymce.get(textareaID) && null !== tinymce.get(textareaID);
	}

	return {
		init: _init,
		save: _save
	};

})(jQuery);

var clMediaUploader = (function($){
	'use strict';

	function _open($button){
		var $parent = $button.closest('.cl-attach-images-group'),
			$attachments = $parent.find('.cl-images-container'),
			$multiple = $parent.find('.multiple-attachments'), // input with multiple trigger
			multipleAttachmentsVal = $multiple.val(),
			multipleAttachments = (multipleAttachmentsVal === 'true'),
			fileFrame;

		// Create the media frame.
		fileFrame = wp.media.frames.file_frame = wp.media({
			title: wp.media.view.l10n.editGalleryTitle,
			button: {
				text: wp.media.view.l10n.insertIntoPost,
			},
			multiple: multipleAttachments // Set to true to allow multiple files to be selected
		});

		// When an image is selected, run a callback.
		fileFrame.on('select', function(){

			var $attachmentsStorage = $parent.find('.cl-attached-images'), // input with list of attached images
				$attachmentsList = $parent.find('.cl-images-container'), // ul with attached images
				attachmentsListID = $attachmentsList.attr('id'),
				$addButton = $parent.find('.cl_widget_add_images_button'), // button
				selection = fileFrame.state().get('selection');

			selection.map(function(attachment){

				attachment = attachment.toJSON();
				if (typeof attachment.sizes.thumbnail != 'undefined') {
					var attachmentSize = attachment.sizes.thumbnail;
				} else {
					var attachmentSize = attachment.sizes.full;
				}

				var galleryImagesArray = clMediaUploader.getAttachmentsList(attachmentsListID); // array
				if (multipleAttachments !== false) {

					var isImageExsist = false;
					for (var i = 0; i < galleryImagesArray.length; i++) {
						if (galleryImagesArray[i] == attachment.name) {
							isImageExsist = true;
						}
					}

					if (isImageExsist === false) {
						$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.name + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.name + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
						galleryImagesArray.push(attachment.name); // array
						var galleryImagesRes = galleryImagesArray.toString(); // string
						$attachmentsStorage.val(galleryImagesRes);
					} else {
						$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
						$('.attachments-thumbnail-error').fadeOut(3000);
					}

				} else {
					$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.name + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.name + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
					$attachmentsStorage.val(attachment.name);
					$addButton.css('display', 'none');
				}

			});
		});
		// Finally, open the modal
		fileFrame.open();
	}

	// add image button hide if no multiple images and one image chosen after ajax
	function _addImageButtonAfterAjax($widget){
		var $multiple = $widget.find('.multiple-attachments'),
			multipleAttachments = $multiple.val(),
			$addButton = $widget.find('.cl_widget_add_images_button'),
			$findres = $widget.find('.attachments-thumbnail');

		if (multipleAttachments == 'false' && $findres.length > 0) {
			$addButton.css('display', 'none');
		}
	}

	// create list of attachments in hidden input after ajax
	function _createAttachmentsListAfterAjax($widget){
		var attachmentsListID = $widget.find('.cl-images-container').attr('id'),
			$attachedImages = $widget.find('.cl-attached-images'),
			galleryImagesArray = this.getAttachmentsList(attachmentsListID);
		if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
			var gallery_images_val = galleryImagesArray.toString();
			$attachedImages.val(gallery_images_val);
		} else {
			$attachedImages.removeAttr('value');
		}
	}


	function _sortImagesInList($list){
		var $parent = $list.closest('.cl-attach-images-group'),
			$attachedImages = $parent.find('.cl-attached-images'),
			attachmentsListID = $list.attr('id'),
			galleryImagesArray = this.getAttachmentsList(attachmentsListID),
			galleryImagesRes = galleryImagesArray.toString();
		$attachedImages.val(galleryImagesRes);
	}

	// delete the image from list of attached images
	function _deleteImageFromList($image){
		var $parent = $image.closest('.cl-attach-images-group'),
			$addButton = $parent.find('.cl_widget_add_images_button'),
			$attachedImagesDel = $parent.find('.cl-attached-images'),
			$multiple = $parent.find('.multiple-attachments'),
			multipleAttachment = $multiple.val(),
			containerID = $parent.find('.cl-images-container').attr('id');

		$image.closest('li').remove();
		if (multipleAttachment == 'false') {
			$addButton.css('display', 'block');
			$attachedImagesDel.removeAttr('value');
		} else {
			var galleryImagesArray = this.getAttachmentsList(containerID);
			if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
				var galleryImagesVal = galleryImagesArray.toString();
				$attachedImagesDel.val(galleryImagesVal);
			} else {
				$attachedImagesDel.removeAttr('value');
			}
		}
	}

	// rebuild the array of attached images list
	function _getAttachmentsList(attachmentsListID){
		var galleryImagesArray = new Array();
		$('#' + attachmentsListID + ' > li.attachments-thumbnail').each(function(index){
			var imageID = $(this).attr('id');
			galleryImagesArray.push(imageID);
		});
		return galleryImagesArray;
	}

	return {
		open: _open,
		getAttachmentsList: _getAttachmentsList,
		deleteImageFromList: _deleteImageFromList,
		sortImagesInList: _sortImagesInList,
		addImageButtonAfterAjax: _addImageButtonAfterAjax,
		createAttachmentsListAfterAjax: _createAttachmentsListAfterAjax
	};

})(jQuery);


var clTabs = (function($){
	'use strict';

	function _init(){
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
	}

	return {
		init: _init
	};

})(jQuery);


var clLinkBtn = (function($){
	'use strict';
	var clLinkSideload = false; //used to track whether or not the link dialogue actually existed on this page, ie was wp_editor invoked.

	/* PRIVATE METHODS
	 -------------------------------------------------------------- */
	//add event listeners

	function _init(){
		$('.cl-widgetform').on('click', '.cl-insert-link-button', function(event){
			//var targetID = event.target.id,
			var targetContainerID = $(this).closest('.cl-widgetform').attr('id'),
				textareaID = $('#' + targetContainerID).find('.cl-insert-link-container').attr('id');

			_addLinkListeners(targetContainerID);

			window.wpActiveEditor = textareaID;
			wpLink.open();
			wpLink.textarea = $('#' + textareaID);
			var existingLinkTitle = $('#' + targetContainerID).find('.cl-linkdialog-title').text();
			if (existingLinkTitle !== 'undefined' || existingLinkTitle.length > 0) {
				$('#wp-link-text').val(existingLinkTitle);
			}
			var existingLinkUrl = $('#' + targetContainerID).find('.cl-linkdialog-url').text();
			if (existingLinkUrl !== 'undefined' || existingLinkUrl.length > 0) {
				$('#wp-link-url').val(existingLinkUrl);
			}
			var existingLinkTarget = $('#' + targetContainerID).find('.cl-linkdialog-target').text();
			if (existingLinkTarget == '_blank') {
				$('#wp-link-target').prop('checked', true);
			}
			return false;
			event.preventDefault();
		});

	}

	/* LINK EDITOR EVENT HACKS
	 -------------------------------------------------------------- */
	function _addLinkListeners(targetContainerID){
		$('body').on('click', '#wp-link-submit', function(event){
			var wpLinkText = $('#wp-link-text').val(),
				linkAtts = wpLink.getAttrs(),
				$textarea = $('#' + targetContainerID).find('.cl-insert-link-container'),
				$linkValUrl = $('#' + targetContainerID).find('.cl-linkdialog-url'),
				$linkValTitle = $('#' + targetContainerID).find('.cl-linkdialog-title'),
				$linkValTarget = $('#' + targetContainerID).find('.cl-linkdialog-target'),
				encodedUrl = encodeURIComponent(linkAtts.href),
				encodedTitle = encodeURIComponent(wpLinkText),
				encodedTarget = encodeURIComponent(linkAtts.target),
				linkValEncoded = 'url:' + encodedUrl + '|title:' + encodedTitle + '|target:' + encodedTarget;

			$textarea.text(linkValEncoded);
			$linkValTitle.text(wpLinkText);
			$linkValUrl.text(linkAtts.href);
			$linkValTarget.text(linkAtts.target);
			_removeLinkListeners();
			return false;
			event.preventDefault();
		});

		$('body').on('click', '#wp-link-cancel', function(event){
			_removeLinkListeners();
			return false;
		});
	}

	function _removeLinkListeners(){
		if (typeof wpActiveEditor != 'undefined') {
			wpActiveEditor = undefined;
		}

		wpLink.close();

		$('body').off('click', '#wp-link-submit');
		$('body').off('click', '#wp-link-cancel');
	}

	return {
		init: _init
	};

})(jQuery);
