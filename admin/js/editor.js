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
			this.render();
			this.fireEvent('change', value);
		},
		addEvent: function(trigger, fn){
			if (this.$$events[trigger] === undefined) this.$$events[trigger] = [];
			this.$$events[trigger].push(fn);
		},
		render: function(){},
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

	/**
	 * Field Type: Checkbox
	 */
	window.CLField['checkbox'] = {
		init: function(options){
			this.$input = this.$row.find('[name="' + this.name + '[]"]');
			this.parentInit(options);
		},
		getValue: function(){
			var values = [];
			this.$input.filter(':checked').each(function(index, input){
				values.push(input.value);
			});
			return values.join(',');
		},
		setValue: function(value){
			if (typeof value != 'string') return;
			value = value.split(',');
			this.$input.each(function(index, input){
				// TODO Maybe use true/false values insted of 'checked'/false
				$(this).prop('checked', ($.inArray(this.value, value) != -1) ? 'checked' : false);
			});
		}
	};

	// TODO rebuild getValue, setValue for VC data format
	// rebuilded, tested
	window.CLField['textarea_exploded'] = {
		init: function(options){
			this.parentInit(options);
			this.$textarea = this.$row.find('.cl-textarea-exploded-content');

			this.$textarea.on('change keyup', function(){
				this.fireEvent('change', this._updateInputValue());
			}.bind(this));
		},
		getValue: function(){
			var value = this.parentGetValue();
			// TODO fix formatting
			// fixed
			value = value.split('\n').join(',');
			return value;
		},
		setValue: function(value){
			this.$input.val(value);
			value = value.split(',').join('\n');
			this.$textarea.val(value);
		},
		_updateInputValue: function(){
			var value = this.$textarea.val();
			value = value.split('\n').join(',');
			this.$input.val(value);
		}
	};

	// TODO rebuild getValue, setValue for VC data format
	// rebuilded, tested
	window.CLField['colorpicker'] = {
		init: function(options){
			this.parentInit(options);
			this.$input.wpColorPicker();
		},
		setValue: function(value){
			this.$input.wpColorPicker('color', value);
			this.parentSetValue(value);
		}
	};

	// TODO Test with two field instances at the same page
	// tested, OK
	window.CLField['link'] = {
		init: function(){
			this.$document = $(document);
			this.$insertButton = this.$row.find('.cl-insert-link-button');
			this.$linkUrl = this.$row.find('.cl-linkdialog-url');
			this.$linkTitle = this.$row.find('.cl-linkdialog-title');
			this.$linkTarget = this.$row.find('.cl-linkdialog-target');

			this._events = {
				open: function(event){
					window.wpActiveEditor = this.$input.attr('id');
					wpLink.open();
					wpLink.textarea = this.$input;
					$('#wp-link-url').val(this.$linkUrl.html());
					$('#wp-link-text').val(this.$linkTitle.html());
					$('#wp-link-target').prop('checked', (this.$linkTarget.html() == '_blank'));
					$('#wp-link-submit').on('click', this._events.submit);
					this.$document.on('wplink-close', this._events.close);
				}.bind(this),
				submit: function(event){
					event.preventDefault();
					var wpLinkText = $('#wp-link-text').val(),
						linkAtts = wpLink.getAttrs(),
						encodedUrl = encodeURIComponent(linkAtts.href),
						encodedTitle = encodeURIComponent(wpLinkText),
						encodedTarget = encodeURIComponent(linkAtts.target);
					this.setValue('url:' + encodedUrl + '|title:' + encodedTitle + '|target:' + encodedTarget);
					this._events.close();
				}.bind(this),
				close: function(){
					this.$document.off('wplink-close', this._events.close);
					$('#wp-link-submit').off('click', this._events.submit);
					if (typeof wpActiveEditor != 'undefined') wpActiveEditor = undefined;
					wpLink.close();
				}.bind(this)
			};

			this.$insertButton.on('click', this._events.open);
		},
		render: function(){
			var value = this.getValue(),
				parts = value.split('|'),
				data = {};
			for (var i = 0; i < parts.length; i++){
				var part = parts[i].split(':', 2);
				if (part.length > 1) data[part[0]] = decodeURIComponent(part[1]);
			}
			this.$linkTitle.text(data.title || '');
			this.$linkUrl.text(data.url || '');
			this.$linkTarget.text(data.target || '');
		}
	};

	// TODO Test with two field instances at the same page
	// working, but reinitialization after ajax update is needed
	window.CLField['textarea_html'] = {
		init: function(options){
			this.parentInit(options);
			// TODO Use this.$input instead
			// this.$textarea replaced by this.$input

			// tinymce editor handler
			var widgetTextareaID = this.$input.attr('id'),
				tmceHidden = this.$input.is(':visible'),
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

			var quicktagsActive = this._isQuicktagsActive(widgetTextareaID);

			// TODO Write link to the relevant issue description
			// http://www.tinymce.com/develop/bugtracker_view.php?id=4528
			// http://www.tinymce.com/forum/viewtopic.php?id=22824
			// http://www.tinymce.com/forum/viewtopic.php%3Fpid%3D112768
			// but now it working without setTimeout with one instance on a page,
			// and not working with two instances on the page
			window.setTimeout(function(){
				// TinyMCE instance deactivation
				if (tmceActive === true) {
					if (tmceHidden === true) {
						// TODO Write link to the relevant FireFox issue
						// http://www.tinymce.com/develop/bugtracker_view.php?id=3152
						// but now it working without try {} catch {} with one instance on a page,
						// and not working with two instances on the page
						try {
							//tinymce.remove();
							tinymce.get(widgetTextareaID).remove();
						} catch (e) {
						}

					} else {
						//tinymce.get(initTextareaID).remove();
					}
				}

				//textarea init
				//tinyMCEPreInit.mceInit[widgetTextareaID] = tinyMCEPreInit.mceInit[initTextareaID];

				if (quicktagsActive === true) {
					// TinyMCE instance activation
					// buttons for non-visual mode
					var prevInstances, newInstance;
					prevInstances = QTags.instances;
					QTags.instances = [];
					quicktags(tinyMCEPreInit.qtInit[widgetTextareaID]);
					QTags._buttonsInit();
					newInstance = QTags.instances[widgetTextareaID];
					QTags.instances = prevInstances;
					QTags.instances[widgetTextareaID] = newInstance;
				} else {
					new QTags(widgetTextareaID);
					QTags._buttonsInit();
				}

				// TODO Try to initialize via variable with direct dom link (this.$input), not by its id
				// initialization with direct DOM link is not working
				tinyMCEPreInit.mceInit[widgetTextareaID].selector = '#' + widgetTextareaID;
				tinyMCEPreInit.mceInit[widgetTextareaID].height = '100%';
				tinymce.init(tinyMCEPreInit.mceInit[widgetTextareaID]);
			}, 500);
		},
		save: function(){
			if (this.$input.length > 0) {
				var textareaId = this.$input.attr('id'),
					newTinyMCEEditor = tinymce.get(textareaId);
				newTinyMCEEditor.save();
			}
		},
		/**
		 *    private functions
		 */
		// Check if the tinymce quicktags buttons is created
		_isQuicktagsActive: function(textareaID){
			// TODO Remove joda style
			// removed
			return typeof QTags.instances[textareaID] === 'object';
		},
		// Check if the tinymce instance is configured
		_isTinymceConfigured: function(textareaID){
			// TODO Remove joda style
			// removed
			return typeof tinyMCEPreInit.mceInit[textareaID] !== 'undefined';
		},
		// Check if the tinymce instance is active
		_isTinymceActive: function(textareaID){
			// TODO Remove joda style
			// removed
			return typeof tinymce === 'object' && typeof tinymce.get(textareaID) === 'object' && tinymce.get(textareaID) !== null;
		}
	};

	// TODO rebuild getValue, setValue for VC data format
	// TODO Test with two field instances at the same page
	// tested, OK
	window.CLField['attach_images'] = {
		init: function(options){
			this.parentInit(options);

			// TODO replace hidden input by class type_
			// replaced
			this.multiple = this.$row.hasClass('multiple');
			this.$attachedImages = this.$row.find('.cl-attached-images');
			this.$attachments = this.$row.find('.cl-images-container');

			// init sortable images
			this.$row.find('.sortable-attachment-list').sortable({
				stop: function(event, ui){
					this._sortImagesInList();
				}.bind(this)
			});

			// open WP media uploader
			this.$buttonAddImage = this.$row.find('.cl-widget-add-images-button').on('click', this._open.bind(this));

			this.$row.on('click', '.attachment-delete-link', function(event){
				event.preventDefault();
				this.fireEvent('click', this._deleteImageFromList($(event.target)));
			}.bind(this));

		},
		// TODO make handler from USOF
		getValue: function(){
			var value = this.parentGetValue();
			// Do something
			return value;
		},

		// TODO make handler from USOF
		setValue: function(value){
			this.parentSetValue(value);
			// Do something
		},

		// add image button hide if no multiple images and one image chosen after ajax
		addImageButtonAfterAjax: function($widget){
			var $findres = $widget.find('.attachments-thumbnail');
			if (this.multiple !== true && $findres.length > 0) {
				this.$buttonAddImage.css('display', 'none');
			}
		},

		// create list of attachments in hidden input after ajax
		createAttachmentsListAfterAjax: function($widget){
			var $container = $widget.find('.cl-images-container'),
				galleryImagesArray = this._getAttachmentsList($container);
			if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
				var galleryImagesVal = galleryImagesArray.toString();
				this.$attachedImages.val(galleryImagesVal);
			} else {
				this.$attachedImages.removeAttr('value');
			}
		},
		_open: function(){
			// TODO Rename "Insert into post" button to "Save selection"
			// renamed

			// Create the media frame.
			var fileFrame = wp.media.frames.file_frame = wp.media({
				title: wp.media.view.l10n.editGalleryTitle,
				button: {
					text: wp.media.view.l10n.insertIntoPost = 'Save selection'
				},
				multiple: this.multiple // Set to true to allow multiple files to be selected
			});

			// When an image is selected, run a callback.
			fileFrame.on('select', function(){
				var selection = fileFrame.curState().get('selection');

				selection.map(function(attachment){

					attachment = attachment.toJSON();
					if (typeof attachment.sizes.thumbnail != 'undefined') {
						var attachmentSize = attachment.sizes.thumbnail;
					} else {
						var attachmentSize = attachment.sizes.full;
					}

					var galleryImagesArray = this._getAttachmentsList(this.$attachments); // array
					if (this.multiple === true) {
						var isImageExsist = false;
						for (var i = 0; i < galleryImagesArray.length; i++) {
							if (galleryImagesArray[i] == attachment.id) {
								isImageExsist = true;
							}
						}

						if (isImageExsist === false) {
							this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + attachment.id + '"><span class="attachment-delete-wrapper"><a href="#" class="attachment-delete-link" data-id="' + attachment.name + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
							galleryImagesArray.push(attachment.id); // array
							var galleryImagesRes = galleryImagesArray.toString(); // string
							this.$attachedImages.val(galleryImagesRes);
						} else {
							this.$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
							$('.attachments-thumbnail-error').fadeOut(3000);
						}

					} else {
						this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + attachment.id + '"><span class="attachment-delete-wrapper"><a href="#" class="attachment-delete-link" data-id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '" height="' + attachmentSize.height + '" width="' + attachmentSize.width + '"></div></li>');
						this.$attachedImages.val(attachment.id);
						this.$buttonAddImage.css('display', 'none');
					}

				}.bind(this));
			}.bind(this));
			// Finally, open the modal
			fileFrame.open();
		},

		_sortImagesInList: function(){
			var galleryImagesArray = this._getAttachmentsList(this.$attachments),
				galleryImagesRes = galleryImagesArray.toString();
			this.$attachedImages.val(galleryImagesRes);
		},

		// delete the image from list of attached images
		_deleteImageFromList: function($image){
			$image.closest('li').remove();
			if (this.multiple === true) {
				var galleryImagesArray = this._getAttachmentsList(this.$attachments);
				if (typeof galleryImagesArray !== 'undefined' && galleryImagesArray.length > 0) {
					var galleryImagesVal = galleryImagesArray.toString();
					this.$attachedImages.val(galleryImagesVal);
				} else {
					this.$attachedImages.removeAttr('value');
				}
			} else {
				this.$buttonAddImage.css('display', 'block');
				this.$attachedImages.removeAttr('value');
			}
		},

		// rebuild the array of attached images list
		_getAttachmentsList: function($container){
			var galleryImagesArray = [];
			$container.find('li.attachments-thumbnail').each(function(index){
				var imageID = $(this).data('image');
				galleryImagesArray.push(imageID);
			});
			return galleryImagesArray;
		}
	};

}(jQuery);


jQuery(document).ready(function($){
	'use strict';

	/* scripts initialization on Widget Area load */

	// test CLField['checkbox']
	/*
	 var newCheckbox = new CLField('#widgets-right .type_checkbox:first');
	 newCheckbox.fireEvent('beforeShow');
	 var values = newCheckbox.getValue();
	 console.log(values);
	 values = values + ',2';
	 newCheckbox.setValue(values);
	 */

	// test CLField['textarea_exploded']
	/* var newTextareaExploded = new CLField('#widgets-right .type_textarea_exploded:first');
	 newTextareaExploded.fireEvent('beforeShow');
	 var values = newTextareaExploded.getValue();
	 console.log(values);
	 values = values + ',new value';
	 newTextareaExploded.setValue(values);*/

	// init Color Picker to all inputs that have 'color-field' class on Widget Area load
	var newColorPicker = new CLField('#widgets-right .type_colorpicker:eq(0)');
	newColorPicker.fireEvent('beforeShow');
	/*
	 var value = newColorPicker.getValue();
	 console.log(value);
	 var newvalue = '#35aa98';
	 newColorPicker.setValue(newvalue);
	 */
	/*
	 var secondColorPicker = new CLField('#widgets-right .type_colorpicker:eq(1)');
	 secondColorPicker.fireEvent('beforeShow');
	 */

	// textarea_raw_html initialization
	/*
	var newRawHTML = new CLField('#widgets-right .type_textarea_raw_html:eq(0)');
	newRawHTML.fireEvent('beforeShow');
	*/

	// init sortable images on Widget Area load
	var newAttachImages = new CLField('#widgets-right .type_attach_images:eq(0)');
	newAttachImages.fireEvent('beforeShow');

	// init handler for insert link button on Widget Area load
	var newLinkWindow = new CLField('#widgets-right .type_link:eq(0)');
	newLinkWindow.fireEvent('beforeShow');

	/**
	 * second widget
	 * @type {Window.CLField}
	 */
	// init Color Picker to all inputs that have 'color-field' class in Widget Area after ajax
	var secondColorPicker = new CLField('#widgets-right .type_colorpicker:eq(1)');
	secondColorPicker.fireEvent('beforeShow');

	// init sortable images on Widget Area load
	var secondAttachImages = new CLField('#widgets-right .type_attach_images:eq(1)');
	secondAttachImages.fireEvent('beforeShow');

	// init handler for insert link button in Widget Area after ajax
	var secondLinkWindow = new CLField('#widgets-right .type_link:eq(1)');
	secondLinkWindow.fireEvent('beforeShow');

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
		var newLinkWindow = new CLField('#widgets-right .type_link:first');
		newLinkWindow.fireEvent('beforeShow');

	});

	/* --------- end scripts initialization in a siteorigin page builder modal window --------- */

	/* events handlers starts here */

	// Event handler for widget Save button click
	$('#widgets-right').on('click', 'input[name=savewidget]', function(event){
		var $button = $(event.target),
			$parent = $button.closest('form'),
			$row = $parent.find('.type_textarea_html'),
			updateTinyMCE = new CLField($row);
		updateTinyMCE.save();
	});

	// Event handler for widget updated after ajax
	$(document).on('widget-updated', function(event, $widget){
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();

			/*
			 var newRawHTML = new CLField('#widgets-right .type_textarea_raw_html:eq(0)');
			 newRawHTML.fireEvent('beforeShow');
			 */

			// init Color Picker to all inputs that have 'color-field' class in Widget Area after ajax
			var newColorPicker = new CLField('#widgets-right .type_colorpicker:eq(0)');
			newColorPicker.fireEvent('beforeShow');

			// reinit TinyMCE editor in widget after ajax
			var newTinyMCE = new CLField('#widgets-right .type_textarea_html:eq(0)');
			newTinyMCE.fireEvent('beforeShow');

			// init sortable images on Widget Area load
			var newAttachImages = new CLField('#widgets-right .type_attach_images:eq(0)');
			newAttachImages.fireEvent('beforeShow');

			// add image button hide if no multiple images and one image chosen after ajax
			// single only
			newAttachImages.addImageButtonAfterAjax($widget);

			// create list of attachments in hidden input after ajax
			// single & multiple
			newAttachImages.createAttachmentsListAfterAjax($widget);

			// init handler for insert link button in Widget Area after ajax
			var newLinkWindow = new CLField('#widgets-right .type_link:eq(0)');
			newLinkWindow.fireEvent('beforeShow');

			/**
			 * second widget
			 * @type {Window.CLField}
			 */
			// init Color Picker to all inputs that have 'color-field' class in Widget Area after ajax
			var secondColorPicker = new CLField('#widgets-right .type_colorpicker:eq(1)');
			secondColorPicker.fireEvent('beforeShow');

			// reinit TinyMCE editor in widget after ajax
			var secondTinyMCE = new CLField('#widgets-right .type_textarea_html:eq(1)');
			secondTinyMCE.fireEvent('beforeShow');

			// init sortable images on Widget Area load
			var secondAttachImages = new CLField('#widgets-right .type_attach_images:eq(1)');
			secondAttachImages.fireEvent('beforeShow');

			// add image button hide if no multiple images and one image chosen after ajax
			// single only
			secondAttachImages.addImageButtonAfterAjax($widget);

			// create list of attachments in hidden input after ajax
			// single & multiple
			secondAttachImages.createAttachmentsListAfterAjax($widget);

			// init handler for insert link button in Widget Area after ajax
			var secondLinkWindow = new CLField('#widgets-right .type_link:eq(1)');
			secondLinkWindow.fireEvent('beforeShow');

			// init tabs in Widget Area after ajax
			clTabs.init();
		}
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
