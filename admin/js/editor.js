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
		this.name = this.$row.data('name');
		this.$input = this.$row.find('[name="' + this.name + '"]');
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
			this.$addBtn = this.$field.find('.cl-imgattach-add');

			console.log(this.$field[0], this.multiple)
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
		this.items = $.map(this.$items.toArray(), $);
		this.sections = $.map(this.$sections.toArray(), $);
		this.active = 0;
		$.each(this.items, function(index, $elm){
			//$elm.on('click', this.open.bind(this, index));
			$elm.on('click', function(){
				this.open(index);
			}.bind(this));
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
	 * @constructor
	 */
	$cl.EForm = function(container){
		this.$container = $(container);
		this.$tabs = this.$container.find('.cl-tabs');
		if (this.$tabs.length) {
			this.tabs = new $cl.Tabs(this.$tabs);
		}

		this.$fields = this.$container.find('.cl-eform-row');
		this.fields = {};
		this.$fields.each(function(index, row){
			var $row = $(row),
				name = $row.cssMod('for');
			this.fields[name] = new $cl.Field($row);
			this.fields[name].trigger('beforeShow');
		}.bind(this));
	};

	$('#widgets-right .cl-eform').each(function(){
		new $cl.EForm(this);
	});

}(jQuery);
