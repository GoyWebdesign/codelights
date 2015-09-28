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
