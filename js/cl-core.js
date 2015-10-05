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
 * Globally available CodeLights helpers
 */
!function($){
	if (window.$cl === undefined) window.$cl = {};
	// Known elements and their constructors
	window.$cl.elements = {};

	$(function(){
		for (var elm in $cl.elements) {
			if (!$cl.elements.hasOwnProperty(elm)) continue;
			$('.' + elm).each(function(){
				$(this).data(elm, new $cl.elements[elm](this));
			});
		}
	});

	// Class mutators
	$cl.mutators = {};
	$cl.mutators.Scalable = {
		/**
		 * Makes the current element scalable: resizes selected inner dom elements proportionally if they are set in pixels
		 * @param rules object css-selectors => array of the resizable properties
		 * @param baseWidth int Container's width, at which elements should have the current pixel-based values
		 */
		makeScalable: function(rules, baseWidth){
			// If container's width is fixed (may only be set inline) than doing nothing
			if (this.$container[0].style.width.indexOf('px') != -1) return;
			// List of properties that could be set in pixels from inline
			if (baseWidth === undefined) baseWidth = 300;
			this.scalables = {};
			for (var selector in rules){
				if ( ! rules.hasOwnProperty(selector)) continue;
				var $elm = this.$container.find(selector);
				if ($elm.length == 0) continue;
				for (var i = 0; i < rules[selector].length; i++) {
					var prop = rules[selector][i],
						baseValue = $elm.css(prop);
					if (typeof baseValue == 'string' && baseValue.substring(baseValue.length - 2) == 'px' && parseInt(baseValue) != 0) {
						// Found some resizable property
						if (this.scalables[selector] === undefined) this.scalables[selector] = {$elm: $elm};
						this.scalables[selector][prop] = parseInt(baseValue);
					}
				}
			}
			// Events
			if (this._events === undefined) this._events = {};
			this._events.scale = function(){
				var width = this.$container.width(),
					scale = width / baseWidth;
				for (var selector in this.scalables){
					if ( ! this.scalables.hasOwnProperty(selector)) continue;
					for (var prop in this.scalables[selector]){
						if ( ! this.scalables[selector].hasOwnProperty(prop) || prop == '$elm') continue;
						this.scalables[selector].$elm.css(prop, (this.scalables[selector][prop] * scale) + 'px');
					}
				}
			}.bind(this);
			$(window).on('resize load', this._events.scale);
			this._events.scale();
		}
	};
}(jQuery);


/**
 * CLScroll
 */
!function($){
	var CLScroll = function(){
		this.$window = $(window);

		this.waypoints = [];

		this._events = {
			resize: this.resize.bind(this),
			scroll: this.scroll.bind(this)
		};

		this.$window.on('resize load', this._events.resize);
		this.$window.on('scroll', this._events.scroll);
	};
	CLScroll.prototype = {
		/**
		 * Add new waypoint
		 * @param {jQuery} $elm
		 * @param {mixed} offset Offset from the bottom of screen in pixels (100) or percents ('20%')
		 * @param {Function} fn The function that will be called
		 */
		addWaypoint: function($elm, offset, fn){
			$elm = ($elm instanceof $) ? $elm : $($elm);
			if ($elm.length == 0) return;
			var waypoint = {
				$elm: $elm,
				offset: (typeof offset == 'string' && offset.indexOf('%') != -1) ? offset : parseInt(offset),
				fn: fn
			};
			this._locateWaypoint(waypoint);
			this.waypoints.push(waypoint);
		},

		/**
		 * Count waypoint's scroll triggering position
		 * @param {{}} waypoint
		 * @private
		 */
		_locateWaypoint: function(waypoint){
			var elmTop = waypoint.$elm.offset().top,
				winHeight = this.$window.height(),
				offset = (typeof waypoint.offset == 'number') ? waypoint.offset : (winHeight * parseInt(waypoint.offset) / 100);
			waypoint.scrollPos = elmTop - winHeight + offset;
		},

		/**
		 * Count all the scroll-related positions
		 * @private
		 */
		locateAll: function(){
			for (var i = 0; i < this.waypoints.length; i++) {
				this._locateWaypoint(this.waypoints[i]);
			}
		},

		/**
		 * Scroll handler
		 */
		scroll: function(){
			var scrollTop = parseInt(this.$window.scrollTop());
			// Handling waypoints
			for (var i = 0; i < this.waypoints.length; i++) {
				if (this.waypoints[i].scrollPos < scrollTop) {
					this.waypoints[i].fn(this.waypoints[i].$elm);
					this.waypoints.splice(i, 1);
					i--;
				}
			}
		},

		/**
		 * Resize handler
		 */
		resize: function(){
			// TODO Some of the 3-rd party elements are resized smoothly. How to handle them?
			// TODO Some of the 3-rd party elements may be resized during scroll. How to handle them?
			this.locateAll();
			this.scroll();
		}
	};

	if (window.$cl === undefined) window.$cl = {};
	window.$cl.scroll = new CLScroll();
}(jQuery);
