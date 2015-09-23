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
 * Function.bind: simple function for defining scopes for functions called from events
 */
Function.prototype.usBind = function(scope, args){
	var self = this;
	return function(){
		return self.apply(scope, args || arguments);
	};
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
			this.parentInit(options);
			// Do something
		},
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			return value;
		},
		setValue: function(value){
			this.parentSetValue(value);
			// Do something
		}
	};

	window.CLField['checkbox'] = {
		init: function(options){
			this.parentInit(options);
			// Do something
		},
		getValue: function(){
			var values = new Array();
			this.$row.find('input').each(function(index){
				var $input = $(this);
				var checked = $input.prop('checked');
				values[index] = checked;
			});
			return values;
		},
		setValue: function(values){
			if (typeof values != 'undefined' && values.length > 0) {
				this.$row.find('input').each(function(index){
					var $input = $(this);
					if (values[index] === true) {
						$input.prop('checked', true);
					} else {
						$input.prop('checked', false);
					}
				});
			}
		}
	};

	window.CLField['dropdown'] = {
		init: function(options){
			this.parentInit(options);
			// Do something
		},
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			return value;
		},
		setValue: function(value){
			this.parentSetValue(value);
			// Do something
		}
	};

	window.CLField['textarea'] = {
		init: function(options){
			this.parentInit(options);
			// Do something
		},
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			return value;
		},
		setValue: function(value){
			this.parentSetValue(value);
			// Do something
		}
	};

	window.CLField['textarea_exploded'] = {
		init: function(options){
			this.parentInit(options);
			// Do something
		},
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			value = value.split(',').join('\n');
			return value;
		},
		setValue: function(value){
			value = value.split(',').join('\n');
			this.parentSetValue(value);
			// Do something
		}
	};

	window.CLField['textarea_raw_html'] = {
		init: function(options){
			this.$textarea = this.$row.find('textarea');
			var inputValue = this._getInputValue(),
				textareaValue = decodeURIComponent(atob(inputValue));
			this.$textarea.val(textareaValue);

			this.$textarea.on('change keyup', function(){
				this.fireEvent('change', this._updateInputValue());
			}.bind(this));
		},
		deinit: function(){
			this.parentDeinit();
			// Do something
		},
		getValue: function(){
			var value = this.$textarea.val();
			// Do something
			return value;
		},
		setValue: function(value){
			this.$textarea.val(value);
			value = btoa(encodeURIComponent(value));
			this.parentSetValue(value);
		},
		_getInputValue: function(){
			var value = this.parentGetValue();
			return value;
		},
		_updateInputValue: function(){
			var value = this.$textarea.val();
			value = btoa(encodeURIComponent(value));
			this.parentSetValue(value);
		}
	};

	window.CLField['colorpicker'] = {
		init: function(options){
			this.parentInit(options);
			$('.cl-color-picker').wpColorPicker();
		}
	};

	window.CLField['insert_link'] = {
		init: function(){
			this.$insertButton = this.$row.find('.cl-insert-link-button');
			this.$insertButton.on('click', function(event){
				this._addLinkListeners();
				var textareaID = this.$row.find('.cl-insert-link-container').attr('id');
				window.wpActiveEditor = textareaID;
				wpLink.open();
				wpLink.textarea = $('#' + textareaID);
				var existingLinkTitle = this.$row.find('.cl-linkdialog-title').text();
				if (existingLinkTitle !== 'undefined' || existingLinkTitle.length > 0) {
					$('#wp-link-text').val(existingLinkTitle);
				}
				var existingLinkUrl = this.$row.find('.cl-linkdialog-url').text();
				if (existingLinkUrl !== 'undefined' || existingLinkUrl.length > 0) {
					$('#wp-link-url').val(existingLinkUrl);
				}
				var existingLinkTarget = this.$row.find('.cl-linkdialog-target').text();
				if (existingLinkTarget == '_blank') {
					$('#wp-link-target').prop('checked', true);
				}
				event.preventDefault();
			}.bind(this));
		},
		_addLinkListeners: function(){
			var $container = this.$row;
			var classObject = this;
			$('body').on('click', '#wp-link-submit', function(event){
				var wpLinkText = $('#wp-link-text').val(),
					linkAtts = wpLink.getAttrs(),
					$textarea = $container.find('.cl-insert-link-container'),
					$linkValUrl = $container.find('.cl-linkdialog-url'),
					$linkValTitle = $container.find('.cl-linkdialog-title'),
					$linkValTarget = $container.find('.cl-linkdialog-target'),
					encodedUrl = encodeURIComponent(linkAtts.href),
					encodedTitle = encodeURIComponent(wpLinkText),
					encodedTarget = encodeURIComponent(linkAtts.target),
					linkValEncoded = 'url:' + encodedUrl + '|title:' + encodedTitle + '|target:' + encodedTarget;

				$textarea.text(linkValEncoded);
				$linkValTitle.text(wpLinkText);
				$linkValUrl.text(linkAtts.href);
				$linkValTarget.text(linkAtts.target);
				classObject._removeLinkListeners();
				event.preventDefault();
			});

			$('body').on('click', '#wp-link-cancel', function(event){
				classObject._removeLinkListeners();
				return false;
			});
		},
		_removeLinkListeners: function(){
			if (typeof wpActiveEditor != 'undefined') {
				wpActiveEditor = undefined;
			}

			wpLink.close();

			$('body').off('click', '#wp-link-submit');
			$('body').off('click', '#wp-link-cancel');
		}
	};

	window.CLField['textarea_html'] = {
		init: function(options){
			this.parentInit(options);
			// tinymce editor handler
			this.$widget = this.$row.closest('.widget.open');
			this.$textarea = this.$row.find('textarea');

			// handler for click on save button in widget
			if (this.$widget.length > 0) {
				this.$widget.on('click', function(){
					this.fireEvent('click', this._save());
				}.bind(this));
			}

			var widgetTextareaID = this.$textarea.attr('id'),
				tmceHidden = this.$textarea.is(":visible"),
				tmceActive = this._isTinymceActive(widgetTextareaID),
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

			var quicktagsActive = this._isQuicktagsActive(initTextareaID);

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
		},
		/**
		 *    private functions
		 */
		_save: function(){
			if (this.$textarea.length > 0) {
				var textareaId = this.$textarea.attr('id'),
					newTinyMCEEditor = tinymce.get(textareaId);
				newTinyMCEEditor.save();
			}
		},
		// Check if the tinymce quicktags buttons is created
		_isQuicktagsActive: function(textareaID){
			return 'object' === typeof QTags.instances[textareaID];
		},
		// Check if the tinymce instance is configured
		_isTinymceConfigured: function(textareaID){
			return 'undefined' !== typeof tinyMCEPreInit.mceInit[textareaID];
		},
		// Check if the tinymce instance is active
		_isTinymceActive: function(textareaID){
			return 'object' === typeof tinymce && 'object' === typeof tinymce.get(textareaID) && null !== tinymce.get(textareaID);
		}
	};

	window.CLField['attach_images'] = {
		init: function(options){
			this.parentInit(options);
			var classObject = this;

			this.multiple = this.$row.find('.multiple-attachments').val();
			this.$attachedImages = this.$row.find('.cl-attached-images');

			// init sortable images
			this.$row.find('.sortable-attachment-list').sortable({
				stop: function(event, ui){
					classObject._sortImagesInList();
				}
			}).bind(this);

			// open WP media uploader
			this.$buttonAddImage = this.$row.find('.cl-widget-add-images-button').on('click', this._open.usBind(this));

			this.$row.on('click', '.attachment-delete-link', function(event){
				classObject.fireEvent('click', classObject._deleteImageFromList($(this)));
				event.preventDefault();
			});

		},
		// add image button hide if no multiple images and one image chosen after ajax
		addImageButtonAfterAjax: function($widget){
			var $findres = $widget.find('.attachments-thumbnail');

			if (this.multiple == 'false' && $findres.length > 0) {
				this.$buttonAddImage.css('display', 'none');
			}
		},

		// create list of attachments in hidden input after ajax
		createAttachmentsListAfterAjax: function($widget){
			var attachmentsListID = $widget.find('.cl-images-container').attr('id'),
				galleryImagesArray = this._getAttachmentsList(attachmentsListID);
			if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
				var gallery_images_val = galleryImagesArray.toString();
				this.$attachedImages.val(gallery_images_val);
			} else {
				this.$attachedImages.removeAttr('value');
			}
		},
		_open: function(){
			var $attachments = this.$row.find('.cl-images-container'),
				multipleAttachments = (this.multiple === 'true'),
				$parent = this,
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
				var $attachmentsList = $parent.$row.find('.cl-images-container'), // ul with attached images
					attachmentsListID = $attachmentsList.attr('id'),
					selection = fileFrame.state().get('selection');

				selection.map(function(attachment){

					attachment = attachment.toJSON();
					if (typeof attachment.sizes.thumbnail != 'undefined') {
						var attachmentSize = attachment.sizes.thumbnail;
					} else {
						var attachmentSize = attachment.sizes.full;
					}

					var galleryImagesArray = $parent._getAttachmentsList(attachmentsListID); // array
					if (multipleAttachments !== false) {

						var isImageExsist = false;
						for (var i = 0; i < galleryImagesArray.length; i++) {
							if (galleryImagesArray[i] == attachment.id) {
								isImageExsist = true;
							}
						}

						if (isImageExsist === false) {
							$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.name + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
							galleryImagesArray.push(attachment.id); // array
							var galleryImagesRes = galleryImagesArray.toString(); // string
							$parent.$attachedImages.val(galleryImagesRes);
						} else {
							$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
							$('.attachments-thumbnail-error').fadeOut(3000);
						}

					} else {
						$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" id="' + attachment.id + '"><span class="attachment-delete-wrapper"></span><span class="attachment-delete"><a href="#" class="attachment-delete-link" id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
						$parent.$attachedImages.val(attachment.id);
						$parent.$buttonAddImage.css('display', 'none');
					}

				});
			}).bind(this);
			// Finally, open the modal
			fileFrame.open();
		},

		_sortImagesInList: function(){
			var attachmentsListID = this.$row.find('.cl-images-container').attr('id'),
				galleryImagesArray = this._getAttachmentsList(attachmentsListID),
				galleryImagesRes = galleryImagesArray.toString();
			this.$attachedImages.val(galleryImagesRes);
		},

		// delete the image from list of attached images
		_deleteImageFromList: function($image){
			var $parent = $image.closest('.cl-attach-images-group'),
				containerID = $parent.find('.cl-images-container').attr('id');

			$image.closest('li').remove();
			if (this.multiple == 'false') {
				this.$buttonAddImage.css('display', 'block');
				this.$attachedImages.removeAttr('value');
			} else {
				var galleryImagesArray = this._getAttachmentsList(containerID);
				if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
					var galleryImagesVal = galleryImagesArray.toString();
					this.$attachedImages.val(galleryImagesVal);
				} else {
					this.$attachedImages.removeAttr('value');
				}
			}
		},

		// rebuild the array of attached images list
		_getAttachmentsList: function(attachmentsListID){
			var galleryImagesArray = new Array();
			$('#' + attachmentsListID + ' > li.attachments-thumbnail').each(function(index){
				var imageID = $(this).attr('id');
				galleryImagesArray.push(imageID);
			});
			return galleryImagesArray;
		}
	};

}(jQuery);


jQuery(document).ready(function($){
	'use strict';

	/* scripts initialization on Widget Area load */

	// init Color Picker to all inputs that have 'color-field' class on Widget Area load
	var newColorPicker = new CLField('#widgets-right .type_colorpicker:first');
	newColorPicker.fireEvent('beforeShow');

	// textarea_raw_html initialization
	var newRawHTML = new CLField('#widgets-right .type_textarea_raw_html:first');
	newRawHTML.fireEvent('beforeShow');

	// init sortable images on Widget Area load
	var newAttachImages = new CLField('#widgets-right .type_attach_images:first');
	newAttachImages.fireEvent('beforeShow');

	// init handler for insert link button on Widget Area load
	var newLinkWindow = new CLField('#widgets-right .type_insert_link:first');
	newLinkWindow.fireEvent('beforeShow');

	// init tabs in widget on Widget Area load
	clTabs.init();

	/* --------- end scripts initialization on Widget Area load --------- */

	/* scripts initialization in a siteorigin page builder modal window */
	$(document).on('panelsopen', function(event){
		var $dialog = $(event.target);
		// Check that this is for our widget class
		if (!$dialog.has('.cl-widgetform')) return;

		// !!!!!!!!! need to rewrite CSS classes for SO Panel Builder

		// init Color Picker to all inputs that have 'color-field' class on Page Builder panel open
		var newColorPicker = new CLField('#widgets-right .type_colorpicker:first');
		newColorPicker.fireEvent('beforeShow');

		// init TinyMCE editor in widget on Page Builder panel open
		//clWidgetTMCE.init($dialog);
		var newTinyMCE = new CLField('#widgets-right .type_textarea_html:first');
		newTinyMCE.fireEvent('beforeShow');

		//init tabs in widget on Page Builder panel open
		clTabs.init();

		// textarea_raw_html initialization
		var newRawHTML = new CLField('#widgets-right .type_textarea_raw_html:first');
		newRawHTML.fireEvent('beforeShow');

		// init handler for insert link button on Page Builder panel open
		var newLinkWindow = new CLField('#widgets-right .type_insert_link:first');
		newLinkWindow.fireEvent('beforeShow');

	});

	/* --------- end scripts initialization in a siteorigin page builder modal window --------- */

	/* events handlers starts here */

	// Event handler for widget updated after ajax
	$(document).on('widget-updated', function(event, $widget){
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();

			var newRawHTML = new CLField('#widgets-right .type_textarea_raw_html:first');
			newRawHTML.fireEvent('beforeShow');

			// init Color Picker to all inputs that have 'color-field' class in Widget Area after ajax
			var newColorPicker = new CLField('#widgets-right .type_colorpicker:first');
			newColorPicker.fireEvent('beforeShow');

			// reinit TinyMCE editor in widget after ajax
			//clWidgetTMCE.init($widget);
			var newTinyMCE = new CLField('#widgets-right .type_textarea_html:first');
			newTinyMCE.fireEvent('beforeShow');

			// init sortable images on Widget Area load
			var newAttachImages = new CLField('#widgets-right .type_attach_images:first');
			newAttachImages.fireEvent('beforeShow');

			// add image button hide if no multiple images and one image chosen after ajax
			// single only
			newAttachImages.addImageButtonAfterAjax($widget);

			// create list of attachments in hidden input after ajax
			// single & multiple
			newAttachImages.createAttachmentsListAfterAjax($widget);

			// init handler for insert link button in Widget Area after ajax
			var newLinkWindow = new CLField('#widgets-right .type_insert_link:first');
			newLinkWindow.fireEvent('beforeShow');

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

	/* --------- events handlers ends here --------- */

});

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
