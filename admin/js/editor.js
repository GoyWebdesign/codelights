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

!function($){
	if (window.$cl === undefined) window.$cl = {};
	if (window.$cl.mixins === undefined) window.$cl.mixins = {};

	/**
	 * Class mutator, allowing bind, unbind, and trigger class instance events
	 * @type {{}}
	 */
	$cl.mixins.Events = {
		/**
		 * Attach a handler to an event for the elements
		 * @param {String} eventType A string containing event type, such as 'beforeShow' or 'change'
		 * @param {Function} handler A function to execute each time the event is triggered
		 */
		bind: function(eventType, handler){
			if (this.$$events === undefined) this.$$events = {};
			if (this.$$events[eventType] === undefined) this.$$events[eventType] = [];
			this.$$events[eventType].push(handler);
		},
		/**
		 * Remove a previously-attached event handler from the elements.
		 * @param {String} eventType A string containing event type, such as 'beforeShow' or 'change'
		 * @param {Function} handler The function that is to be no longer executed.
		 */
		unbind: function(eventType, handler){
			if (this.$$events === undefined || this.$$events[eventType] === undefined) return;
			var handlerPos = $.inArray(handler, this.$$events[eventType]);
			if (handlerPos != -1) {
				this.$$events[eventType].splice(handlerPos, 1);
			}
		},
		/**
		 * Execute all handlers and behaviours attached to the class instance for the given event type
		 * @param {String} eventType A string containing event type, such as 'beforeShow' or 'change'
		 * @param {Array} extraParameters Additional parameters to pass along to the event handler
		 */
		trigger: function(eventType, extraParameters){
			if (this.$$events === undefined || this.$$events[eventType] === undefined || this.$$events[eventType].length == 0) return;
			for (var index = 0; index < this.$$events[eventType].length; index++) {
				this.$$events[eventType][index](this, extraParameters);
			}
		}
	};

	/**
	 * $cl.Field class
	 *
	 * Boundable events: beforeShow, afterShow, change, beforeHide, afterHide
	 *
	 * @param row
	 * @constructor
	 */
	$cl.Field = function(row){
		this.$row = $(row);
		if (this.$row.data('clfield')) return this.$row.data('clfield');
		this.type = this.$row.cssMod('type');
		this.name = this.$row.cssMod('for');
		this.$input = this.$row.find('input[name], textarea[name], select[name]');
		this.inited = false;

		// Overloading by a certain type's declaration, moving parent functions to "parent" namespace: init => parentInit
		if ($cl.Field[this.type] !== undefined) {
			for (var fn in $cl.Field[this.type]) {
				if (!$cl.Field[this.type].hasOwnProperty(fn)) continue;
				if (this[fn] !== undefined) {
					var parentFn = 'parent' + fn.charAt(0).toUpperCase() + fn.slice(1);
					this[parentFn] = this[fn];
				}
				this[fn] = $cl.Field[this.type][fn];
			}
		}

		this.$row.data('clfield', this);

		// Init on the first show
		var initEvent = function(){
			this.init();
			this.inited = true;
			this.unbind('beforeShow', initEvent);
		}.bind(this);
		this.bind('beforeShow', initEvent);
	};
	$.extend($cl.Field.prototype, $cl.mixins.Events, {
		init: function(){
			this.$input.on('change', function(){
				this.trigger('change', [this.getValue()]);
			}.bind(this));
		},
		deinit: function(){
		},
		getValue: function(){
			return this.$input.val();
		},
		setValue: function(value){
			this.$input.val(value);
			this.render();
			this.trigger('change', [value]);
		},
		render: function(){
		}
	});

	/**
	 * $cl.Field type: attach_images
	 */
	$cl.Field['attach_images'] = {

		init: function(){
			this.parentInit();

			this.$field = this.$row.find('.cl-imgattach');
			this.multiple = this.$field.data('multiple');
			this.$list = this.$field.find('.cl-imgattach-list');
			this.$btnAdd = this.$field.find('.cl-imgattach-add');

			this._events = {
				openMediaUploader: this.openMediaUploader.bind(this),
				deleteImg: function(event){
					$(event.target).closest('li').remove();
					this.updateInput();
				}.bind(this),
				updateInput: this.updateInput.bind(this)
			};

			this.$list.sortable({stop: this._events.updateInput});
			this.$btnAdd.on('click', this._events.openMediaUploader);
			this.$list.on('click', '.cl-imgattach-delete', this._events.deleteImg);
		},

		render: function(){
			var value = this.getValue(),
				items = {},
				currentIds = [],
				neededIds = value ? value.split(',').map(Number) : [];
			this.$list.children().toArray().forEach(function(item){
				var $item = $(item),
					id = parseInt($item.data('id'));
				items[id] = $item;
				currentIds.push(id);
			});
			var index = 0;
			for (index = 0; index < neededIds.length; index++) {
				var id = neededIds[index],
					currentIndex = currentIds.indexOf(id, index);
				if (currentIndex == index) continue;
				if (currentIndex == -1) {
					// Creating the new item
					var attachment = wp.media.attachment(id);
					items[id] = this.createItem(attachment);
				} else {
					// Moving existing item
					currentIds.splice(currentIndex, 1);
				}
				if (index == 0) {
					items[id].prependTo(this.$list);
				} else {
					items[id].insertAfter(items[neededIds[index - 1]]);
				}
				currentIds.splice(index, 0, id);
			}
			for (; index < currentIds.length; index++) {
				// Removing the excess items
				items[currentIds[index]].remove();
			}
		},
		updateInput: function(){
			var oldValue = this.getValue(),
				imgIds = this.$list.children().toArray().map(function(item){
					return parseInt(item.getAttribute('data-id'));
				}),
				newValue = imgIds.join(',');
			if (newValue != oldValue) {
				this.$input.val(newValue).trigger('change');
			}
		},
		openMediaUploader: function(){
			var value = this.getValue(),
				initialIds = value ? value.split(',').map(Number) : [];
			var frame = wp.media({
				title: this.$btnAdd.attr('title'),
				multiple: this.multiple ? 'add' : false,
				library: {type: 'image'},
				button: {text: this.$btnAdd.attr('title')}
			});
			frame.on('open', function(){
				var selection = frame.state().get('selection');
				initialIds.forEach(function(id){
					selection.add(wp.media.attachment(id));
				});
			}.bind(this));
			frame.on('select', function(){
				var selection = frame.state().get('selection'),
					updatedIds = [];
				selection.forEach(function(attachment){
					if (attachment.id && initialIds.indexOf(attachment.id) == -1) {
						// Adding the new images
						this.$list.append(this.createItem(attachment));
					}
					updatedIds.push(attachment.id);
				}.bind(this));
				initialIds.forEach(function(id){
					if (updatedIds.indexOf(id) == -1) {
						// Deleting images that are not present in the recent selection
						this.$list.find('[data-id="' + id + '"]').remove();
					}
				}.bind(this));
				this.updateInput();
			}.bind(this));
			frame.open();
		},
		/**
		 * Prepare item's dom from WP attachment object
		 * @param {Object} attachment
		 * @return {jQuery}
		 */
		createItem: function(attachment){
			if (!attachment || !attachment.attributes.id) return '';
			var html = '<li data-id="' + attachment.id + '">' +
				'<a class="cl-imgattach-delete" href="javascript:void(0)">&times;</a>' +
				'<img width="150" height="150" class="attachment-thumbnail" src="';
			if (attachment.attributes.sizes !== undefined) {
				var size = (attachment.attributes.sizes.thumbnail !== undefined) ? 'thumbnail' : 'full';
				html += attachment.attributes.sizes[size].url;
			}
			html += '"></li>';
			var $item = $(html);
			if (attachment.attributes.sizes === undefined) {
				// Loading missing image via ajax
				attachment.fetch({
					success: function(){
						var size = (attachment.attributes.sizes.thumbnail !== undefined) ? 'thumbnail' : 'full';
						$item.find('img').attr('src', attachment.attributes.sizes[size].url);
					}.bind(this)
				});
			}
			return $item;
		}

	};

	/**
	 * $cl.Field type: colorpicker
	 */
	$cl.Field['colorpicker'] = {
		init: function(){
			this.parentInit();
			this.changeTimer = null;
			this._events = {
				change: function(value){
					clearTimeout(this.changeTimer);
					this.changeTimer = setTimeout(function(){
						this.$input.trigger('change');
					}.bind(this), 100);
				}.bind(this)
			};
			this.$input.wpColorPicker({
				change: this._events.change
			});
		},
		render: function(){
			var value = this.getValue();
			this.$input.wpColorPicker('color', value);
		}
	};

	/**
	 * $cl.Field type: dropdown
	 */
	$cl.Field['dropdown'] = {
		init: function(){
			this.$input.on('change keyup', function(){
				this.trigger('change', [this.getValue()]);
			}.bind(this));
		}
	};

	/**
	 * $cl.Field type: link
	 */
	$cl.Field['link'] = {
		init: function(){
			this.$document = $(document);
			this.$btn = this.$row.find('.cl-linkdialog-btn');
			this.$linkUrl = this.$row.find('.cl-linkdialog-url');
			this.$linkTitle = this.$row.find('.cl-linkdialog-title');
			this.$linkTarget = this.$row.find('.cl-linkdialog-target');
			this._events = {
				open: function(event){
					wpLink.open(this.$input.attr('id'));
					wpLink.textarea = this.$input;
					var data = this.decodeLink(this.getValue());
					$('#wp-link-url').val(data.url);
					$('#wp-link-text').val(data.title);
					$('#wp-link-target').prop('checked', (data.target == '_blank'));
					$('#wp-link-submit').on('click', this._events.submit);
					this.$document.on('wplink-close', this._events.close);
				}.bind(this),
				submit: function(event){
					event.preventDefault();
					var wpLinkText = $('#wp-link-text').val(),
						linkAtts = wpLink.getAttrs();
					this.setValue(this.encodeLink(linkAtts.href, wpLinkText, linkAtts.target));
					this.$input.trigger('change');
					this._events.close();
				}.bind(this),
				close: function(){
					this.$document.off('wplink-close', this._events.close);
					$('#wp-link-submit').off('click', this._events.submit);
					if (typeof wpActiveEditor != 'undefined') wpActiveEditor = undefined;
					wpLink.close();
				}.bind(this)
			};

			this.$btn.on('click', this._events.open);
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
			this.$linkUrl.text(this.shortenUrl(data.url || ''));
			this.$linkTarget.text(data.target || '');
		},
		/**
		 * Get shortened version of URL with url's beginning and end
		 * @param url
		 */
		shortenUrl: function(url){
			return (url.length <= 60) ? url : (url.substr(0, 28) + '...' + url.substr(url.length - 29));
		},
		encodeLink: function(url, title, target){
			var result = 'url:' + encodeURIComponent(url);
			if (title) result += '|title:' + encodeURIComponent(title);
			if (target) result += '|target:' + encodeURIComponent(target);
			return result;
		},
		decodeLink: function(link){
			var atts = link.split('|'),
				result = {url: '', title: '', target: ''};
			atts.forEach(function(value, index){
				var param = value.split(':', 2);
				result[param[0]] = decodeURIComponent(param[1]).trim();
			});
			return result;
		}
	};

	/**
	 * $cl.Tabs class
	 *
	 * Boundable events: beforeShow, afterShow, beforeHide, afterHide
	 *
	 * @param container
	 * @constructor
	 */
	$cl.Tabs = function(container){
		this.$container = $(container);
		this.$items = this.$container.find('.cl-tabs-item');
		this.$sections = this.$container.find('.cl-tabs-section');
		this.items = this.$items.toArray().map($);
		this.sections = this.$sections.toArray().map($);
		this.active = 0;
		this.items.forEach(function($elm, index){
			$elm.on('click', this.open.bind(this, index));
		}.bind(this));
	};
	$.extend($cl.Tabs.prototype, $cl.mixins.Events, {
		open: function(index){
			if (index == this.active || this.sections[index] == undefined) return;
			if (this.sections[this.active] !== undefined) {
				this.trigger('beforeHide', [this.active, this.sections[this.active], this.items[this.active]]);
				this.sections[this.active].hide();
				this.items[this.active].removeClass('active');
				this.trigger('afterHide', [this.active, this.sections[this.active], this.items[this.active]]);
			}
			this.trigger('beforeShow', [index, this.sections[index], this.items[index]]);
			this.sections[index].show();
			this.items[index].addClass('active');
			this.trigger('afterShow', [index, this.sections[index], this.items[index]]);
			this.active = index;
		}
	});

	/**
	 * $cl.EForm class
	 * @param container
	 * @param {Object} options
	 * @constructor
	 */
	$cl.EForm = function(container){
		this.$container = $(container);
		this.$tabs = this.$container.find('.cl-tabs');
		if (this.$tabs.length) {
			this.tabs = new $cl.Tabs(this.$tabs);
		}

		// Dependencies rules and the list of dependent fields for all the affecting fields
		this.deps = {};
		this.affects = {};

		this.$fields = this.$container.find('.cl-eform-row');
		this.fields = {};
		this.$fields.each(function(index, row){
			var $row = $(row),
				name = $row.cssMod('for');
			this.fields[name] = new $cl.Field($row);
			this.fields[name].trigger('beforeShow');
			var $dependency = $row.find('.cl-eform-row-dependency');
			if ($dependency.length) {
				this.deps[name] = ($dependency[0].onclick() || {});
				if (this.affects[this.deps[name].element] === undefined) this.affects[this.deps[name].element] = [];
				this.affects[this.deps[name].element].push(name);
			}
		}.bind(this));

		$.each(this.affects, function(name, affectedList){
			var onChangeFn = function(){
				for (var index = 0; index < affectedList.length; index++) {
					if (this.shouldBeVisible(affectedList[index])) {
						this.fields[affectedList[index]].$row.show();
					} else {
						this.fields[affectedList[index]].$row.hide();
					}
				}
			}.bind(this);
			this.fields[name].bind('change', onChangeFn);
			onChangeFn();
		}.bind(this));
	};
	$.extend($cl.EForm.prototype, {
		/**
		 * Get a particular field value
		 * @param {String} name Field name
		 * @return {String}
		 */
		getValue: function(name){
			return (this.fields[name] === undefined) ? null : this.fields[name].getValue();
		},
		setValue: function(name, value){
			if (this.fields[name] !== undefined) this.field[name].setValue(value);
		},
		getValues: function(){
			var values = {};
			this.fields.forEach(function(field, name){
				values[name] = field.getValue();
			}.bind(this));
			return values;
		},
		setValues: function(values){
			values.forEach(function(value, name){
				if (this.fields[name] !== undefined) this.field[name].setValue(value);
			}.bind(this));
		},
		/**
		 * Check if the field should be visible
		 * @param {String} name
		 * @return {Boolean}
		 */
		shouldBeVisible: function(name){
			if (this.deps[name] === undefined) return true;
			var dep = this.deps[name],
				value = this.fields[dep.element].getValue();
			if (dep.value !== undefined) {
				return (dep.value instanceof Array) ? (dep.value.indexOf(value) != -1) : (value == dep.value);
			} else if (dep.not_empty !== undefined) {
				return (value != '');
			} else return true;
		}
	});

}(jQuery);

// Admin widgets editor
if (window.wpWidgets !== undefined) jQuery(function($){
	$('#widgets-right').find('.cl-eform').each(function(){
		new $cl.EForm(this);
	});
	$(document).bind('widget-added widget-updated', function(event, widget){
		new $cl.EForm($(widget).find('.cl-eform'));
	});
	// Widget's fields may be shown
	$(document).bind('wp-pin-menu', function(){
		//console.log('toggled sidebar block');
	});
	// TODO Re-create on widget save
	// TODO Widget toggle
	// TODO Widget deletion
});

// Customizer widgets editor
if (window._wpCustomizeWidgetsSettings !== undefined) jQuery(function($){
	$('#widgets-right').find('.cl-eform').each(function(){
		new $cl.EForm(this);
	});
	$(document).bind('widget-added widget-updated', function(event, widget){
		new $cl.EForm($(widget).find('.cl-eform'));
	});
	// TODO Re-create on widget save
	// TODO Widget toggle
	// TODO Widget deletion
});
