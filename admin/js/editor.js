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

	// Tabs
	window.$cl.CLTabs = function(container){
		this.$container = $(container);
		this.$items = this.$container.find('.cl-tabs-item');
		this.$sections = this.$container.find('.cl-tabs-section');
		this.items = $.map(this.$items.toArray(), $);
		this.sections = $.map(this.$sections.toArray(), $);
		this.active = 0;
		$.each(this.items, function(index, $elm){
			$elm.on('click', this.open.bind(this, index));
		}.bind(this));
	};
	window.$cl.CLTabs.prototype = {
		open: function(index){
			if (index == this.active || this.sections[index] == undefined) return;
			if (this.sections[this.active] !== undefined){
				this.sections[this.active].hide();
				this.items[this.active].removeClass('active')
			}
			this.sections[index].show();
			this.items[index].addClass('active');
			this.active = index;
		}
	};

	$('.cl-tabs').each(function(){
		new $cl.CLTabs(this);
	});
}(jQuery);
