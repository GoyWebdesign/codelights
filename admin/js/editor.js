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
		this.$ajaxurl = clAjax.ajaxurl;

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
		render: function(){
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

	/**
	 * Field Type: Checkbox
	 */
	window.CLField['checkbox'] = {
		init: function(options){
			this.$checkboxes = this.$row.find('input[type=checkbox]');

			this._events = {
				change: function(event){
					var value = this._getCheckboxes();
					this.setValue(value);
				}.bind(this)
			};

			this.$checkboxes.on('change', this._events.change);
		},
		render: function(){
			var value = this.getValue();
			if (typeof value != 'string') return;
			value = value.split(',');
			this.$checkboxes.each(function(index, input){
				$(this).prop('checked', ($.inArray(this.value, value) != -1));
			});
		},
		_getCheckboxes: function(){
			var values = [];
			this.$checkboxes.filter(':checked').each(function(index, input){
				values.push(input.value);
			});
			return values.join(',');
		}
	};

	window.CLField['textarea_exploded'] = {
		init: function(options){
			this.$textarea = this.$row.find('.cl-textarea-exploded-content');

			this._events = {
				change: function(event){
					this.updateInputValue();
				}.bind(this)
			};

			this.$textarea.on('input paste', this._events.change);
		},
		setValue: function(value){
			this.parentSetValue(value);
			value = value.split(',').join('\n');
			this.$textarea.val(value);
		},
		updateInputValue: function(){
			var value = this.$textarea.val();
			value = value.split('\n').join(',');
			this.$input.val(value);
		}
	};

	window.CLField['colorpicker'] = {
		init: function(options){
			this.$input.wpColorPicker();
		},
		render: function(){
			var value = this.getValue();
			this.$input.wpColorPicker('color', value);
		}
	};

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
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i].split(':', 2);
				if (part.length > 1) data[part[0]] = decodeURIComponent(part[1]);
			}
			this.$linkTitle.text(data.title || '');
			this.$linkUrl.text(data.url || '');
			this.$linkTarget.text(data.target || '');
		}
	};

	window.CLField['textarea_html'] = {
		init: function(options){
			this.parentInit(options);
			this.textareaID = this.$input.attr('id');
			var tinymceActive = this._isTinymceActive();

			// tinymce editor handler
			if (tinymceActive !== false) {
				tinymce.get(this.textareaID).remove();

				new QTags(this.textareaID);
				QTags._buttonsInit();

				tinyMCEPreInit.mceInit[this.textareaID].selector = '#' + this.textareaID;
				tinyMCEPreInit.mceInit[this.textareaID].height = '100%';
				tinymce.init(tinyMCEPreInit.mceInit[this.textareaID]);
			}
		},
		save: function(){
			tinymce.get(this.textareaID).save();
		},
		getValue: function(){
			var value;
			if (this.$input.is(':visible') === false) {
				value = tinymce.get(this.textareaID).getContent();
			} else {
				value = this.parentGetValue();
			}
			return value;
		},
		setValue: function(value){
			if (this.$input.is(':visible') === false) {
				tinymce.get(this.textareaID).setContent(value);
				this.parentFireEvent('change');
			} else {
				this.parentSetValue(value);
			}
		},
		// Check if the tinymce instance is active
		_isTinymceActive: function(){
			return typeof tinymce === 'object' && typeof tinymce.get(this.textareaID) === 'object' && tinymce.get(this.textareaID) !== null;
		}
	};

	window.CLField['attach_images'] = {
		init: function(options){
			this.parentInit(options);

			this.multiple = this.$row.hasClass('multiple');
			this.$attachedImages = this.$row.find('.cl-attached-images');
			this.$attachments = this.$row.find('.cl-images-container');
			this.$imagesUrls = this.getImagesUrls();
			this.$buttonAddImage = this.$row.find('.cl-widget-add-images-button');

			// init sortable images
			this.$row.find('.sortable-attachment-list').sortable({
				stop: function(event, ui){
					this.updateInputVal();
				}.bind(this)
			});

			this._events = {
				open: function(event){
					this._open();
				}.bind(this),
				delete: function(event){
					$(event.target).closest('li').remove();
					if (this.multiple === true) {
						this.updateInputVal();
					} else {
						this.$buttonAddImage.css('display', 'block');
						this.$attachedImages.removeAttr('value');
					}
				}.bind(this)
			};

			// open WP media uploader
			this.$buttonAddImage.on('click', this._events.open.bind(this));

			// delete image from list
			this.$attachments.on('click', '.attachment-delete-link', this._events.delete.bind(this));

		},
		render: function(){
			var value = this.getValue(),
				imagesIds = [];
			if (value.search(',') != -1) {
				imagesIds = value.split(',');
			} else if (value.length > 0) {
				imagesIds.push(value);
			}

			if (imagesIds !== undefined && imagesIds.length > 0) {
				this.$attachments.empty();
				imagesIds.forEach(function(imageID){
					if (this.$imagesUrls[imageID] === undefined) {
						$.ajax({
							type: 'POST',
							url: this.$ajaxurl,
							dataType: 'json',
							data: {
								action: 'cl_image_url_by_id',
								value: imageID
							},
							success: function(result){
								if (!result.success) {
									return alert(result.message);
								}
								this.$imagesUrls[imageID] = result.url;
								this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + imageID + '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' + imageID + '">&times;</a></span><div class="centered"><img src="' + result.url + '"></div></li>');
							}.bind(this)
						});
					} else {
						this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + imageID + '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' + imageID + '">&times;</a></span><div class="centered"><img src="' + this.$imagesUrls[imageID] + '"></div></li>');
					}
				}.bind(this));

				if (this.multiple === false) {
					this.$buttonAddImage.css('display', 'none');
				}
			}
		},
		setValue: function(value){
			if (this.multiple === false && (value.search(',') != -1)) {
				var images = value.split(',');
				value = images[0];
			}
			this.parentSetValue(value);
		},

		/**
		 * return list of images in container
		 *
		 * @returns {Object}
		 */
		getImagesUrls: function(){
			var galleryImagesUrls = {};
			this.$attachments.find('.attachments-thumbnail').each(function(index){
				var val = $(this).data('image');
				galleryImagesUrls[val] = $(this).find('img').attr('src');
			});
			return galleryImagesUrls;
		},

		/**
		 * add image button hide if no multiple images and one image chosen after ajax
		 */
		addImageButtonAfterAjax: function(){
			var $findres = this.$attachments.find('.attachments-thumbnail');
			if (this.multiple === false && $findres.length > 0) {
				this.$buttonAddImage.css('display', 'none');
			}
		},

		/**
		 * create list of attachments in hidden input after ajax
		 */
		updateInputVal: function(){
			var galleryImagesArray = this._getAttachmentsList();
			if (galleryImagesArray !== undefined && galleryImagesArray.length > 0) {
				this.$attachedImages.val(galleryImagesArray.toString());
			} else {
				this.$attachedImages.removeAttr('value');
			}
		},
		/**
		 * open media uploader window
		 * @private
		 */
		_open: function(){
			// Create the media frame.
			var fileFrame = wp.media.frames.file_frame = wp.media({
				title: wp.media.view.l10n.editGalleryTitle,
				button: {
					text: wp.media.view.l10n.insertIntoPost = 'Save selection'
				},
				multiple: this.multiple
			});

			// When an image is selected, run a callback.
			fileFrame.on('select', function(){
				var selection = fileFrame.state().get('selection'),
					attachmentSize;

				selection.map(function(attachment){

					attachment = attachment.toJSON();
					if (attachment.sizes.thumbnail !== undefined) {
						attachmentSize = attachment.sizes.thumbnail;
					} else {
						attachmentSize = attachment.sizes.full;
					}

					var galleryImagesArray = this._getAttachmentsList();
					if (this.multiple === true) {
						var isImageExsist = ($.inArray(attachment.id, galleryImagesArray) != -1);

						if (isImageExsist === false) {
							this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + attachment.id + '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '"></div></li>');
							galleryImagesArray.push(attachment.id);
							this.$imagesUrls[attachment.id] = attachmentSize.url;
							this.$attachedImages.val(galleryImagesArray.toString());
						} else {
							this.$attachments.append('<li class="attachments-thumbnail-error">This image is already in the Gallery</li>');
							$('.attachments-thumbnail-error').fadeOut(3000);
						}

					} else {
						this.$attachments.append('<li class="attachments-thumbnail ui-sortable-handle" data-image="' + attachment.id + '"><span class="attachment-delete-wrapper"><a href="javascript:void(0)" class="attachment-delete-link" data-id="' + attachment.id + '">&times;</a></span><div class="centered"><img src="' + attachmentSize.url + '"></div></li>');
						this.$imagesUrls[attachment.id] = attachmentSize.url;
						this.$attachedImages.val(attachment.id);
						this.$buttonAddImage.css('display', 'none');
					}

				}.bind(this));
			}.bind(this));
			// Finally, open the modal
			fileFrame.open();
		},

		/**
		 * return the array of attached images list
		 *
		 * @param $container
		 * @returns {Array}
		 * @private
		 */
		_getAttachmentsList: function(){
			var galleryImagesArray = [];
			this.$attachments.find('.attachments-thumbnail').each(function(index){
				galleryImagesArray.push($(this).data('image'));
			});
			return galleryImagesArray;
		}
	};

}(jQuery);

/**
 * CLForm Core
 */
!function($){
	window.CLForm = function(container, options){
		window.$clfield = this;
		this.init(container, options);
	};

	window.CLForm.prototype = {
		init: function(container, options){
			this.$container = $(container);
			this.$blocks = {};
			this.$field = {};
			// Showing conditions (fieldId => condition)
			this.showIf = {};
			// Showing dependencies (fieldId => affected field ids)
			this.showIfDeps = {};
			// Showing dependencies (depended field ID => field ID)
			this.showDepended = {};

			$.each(this.$container.find('.cl-form-row'), function(index, block){
				var $block = $(block),
					id = $block.data('id'),
					shouldBeShown = this.execDependency(id);
				this.$blocks[id] = $block;

				/* get dependencies */
				var param = $block.data('param_settings');
				if (param !== undefined && param !== null) {
					this.showIf[id] = {};
					if (param.element !== undefined) {
						var parentID = this.$container.find('.for_' + param.element).data('id')
						this.showIfDeps[id] = parentID;
						this.showDepended[parentID] = id;
					}
					if (param.not_empty !== undefined) {
						this.showIf[id]['not_empty'] = param.not_empty;
					}
					if (param.callback !== undefined) {
						this.showIf[id]['callback'] = param.callback;
					}
					if (param.value !== undefined) {
						this.showIf[id]['value'] = param.value;
					}
				}

				if (shouldBeShown === true) {
					this.$field[id] = new CLField($block);
					this.$field[id].fireEvent('beforeShow');
					this.$field[id].fireEvent('afterShow');
				} else {
					this.$blocks[id].css('display', 'none');
				}
			}.bind(this));

			if (this.showIfDeps !== undefined) {
				for (var fieldId in this.showIfDeps) {
					var parentFieldID = this.showIfDeps[fieldId];
					this.$field[parentFieldID].addEvent('change', function(field){
						var pfID = field.$input.attr('id'),
							fieldId = this.showDepended[pfID];
						var shouldBeShown = this.execDependency(fieldId),
							isShown = (this.$blocks[fieldId].css('display') != 'none');
						if (shouldBeShown === false && isShown === true) {
							// hide element
							this.$field[fieldId].fireEvent('beforeHide');
							this.$blocks[fieldId].stop(true, false).slideUp(function(){
								this.$field[fieldId].fireEvent('afterHide');
							}.bind(this));
						} else if (shouldBeShown === true && isShown === false) {
							// show element
							if (this.$field[fieldId].length == 0) {
								this.$field[fieldId] = new CLField($block);
							}
							this.$field[fieldId].fireEvent('beforeShow');
							this.$blocks[fieldId].stop(true, false).slideDown(function(){
								this.$field[fieldId].fireEvent('afterShow');
							}.bind(this));
						}
					}.bind(this));
				}
			}
		},

		execDependency: function(id){
			if (this.showIfDeps[id] !== undefined) {
				var parentID = this.showIfDeps[id],
					fieldValue = this.getValue(parentID);

				if (this.showIf[id]['not_empty'] !== undefined) {
					if (this.showIf[id]['not_empty'] !== (fieldValue.length > 0)) {
						return false;
					}
				}
				if (this.showIf[id]['value'] !== undefined) {
					var values = this.showIf[id]['value'],
						totalresult = true;
					for (var key in values) {
						if (values.hasOwnProperty(key)) {
							var condition = values[key],
								result = fieldValue.search(condition);
							if (result == -1) {
								totalresult = false;
							}
						}
					}
					if (totalresult === false) {
						return false;
					}
				}
			}
			return true;
		},

		getValue: function(id){
			return this.$field[id].getValue();
		},

		setValue: function(id, value){
			this.$field[id].setValue(value);
		},

		getValues: function(){
			var values = {};
			for (var id in this.$blocks) {
				values[id] = this.$field[id].getValue();
			}
			return values;
		},

		setValues: function(values){
			for (var id in values) {
				this.$field[id].setValue(values[id]);
			}
		}

	};
}(jQuery);


jQuery(document).ready(function($){
	'use strict';

	/* scripts initialization on Widget Area load */

	var $firstWidget = $('#widgets-right').find('.cl-widgetform:eq(0)'),
		firstForm = new CLForm($firstWidget);

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
		updateTinyMCE.fireEvent('beforeShow');
		updateTinyMCE.save();
	});

	// Event handler for widget updated after ajax
	$(document).on('widget-updated', function(event, $widget){
		if ($widget.is('[id*=_cl_]')) {
			event.preventDefault();

			// init checkboxes on Widget Area load
			var firstCB = new CLField('#widgets-right .type_checkbox:eq(0)');
			firstCB.fireEvent('beforeShow');

			// init checkboxes on Widget Area load
			var secondCB = new CLField('#widgets-right .type_checkbox:eq(1)');
			secondCB.fireEvent('beforeShow');

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
			newAttachImages.addImageButtonAfterAjax();

			// create list of attachments in hidden input after ajax
			// single & multiple
			newAttachImages.updateInputVal();

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
			secondAttachImages.addImageButtonAfterAjax();

			// create list of attachments in hidden input after ajax
			// single & multiple
			secondAttachImages.updateInputVal();

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
			var $tab = $(this),
				$tabItems = $tab.find('ul.cl-tabs-navigation'),
				$tabContentWrapper = $tab.children('ul.cl-tabs-content');

			$tabItems.on('click', 'a', function(event){
				event.preventDefault();
				var $selectedItem = $(this);
				if (!$selectedItem.hasClass('selected')) {
					var $selectedTab = $selectedItem.data('content'),
						$selectedContent = $tabContentWrapper.find('li[data-content="' + $selectedTab + '"]'),
						selectedContentHeight = $selectedContent.innerHeight();

					$tabItems.find('a.selected').removeClass('selected');
					$selectedItem.addClass('selected');
					$selectedContent.addClass('selected').siblings('li').removeClass('selected');
					//animate tabContentWrapper height when content changes
					$tabContentWrapper.animate({
						'height': selectedContentHeight
					}, 200);
				}
			});
		});
	}

	return {
		init: _init
	};

})(jQuery);
