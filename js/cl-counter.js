/**
 * CodeLights: Counter
 */
!function($){
	var CLCounter = function(container){
		// Commonly used DOM elements
		this.$container = $(container);


	};
	CLCounter.prototype = {
		/**
		 * Get number format based on initial and final number strings
		 * @param initial string
		 * @param final string
		 * @returns {{groupMark, decMark, accounting, zerofill, indian}}
		 */
		getFormat: function(initial, final){
			var iFormat = this._getFormat(initial),
				fFormat = this._getFormat(final),
				// Final format has more priority
				format = $.extend({}, iFormat, fFormat);
			// Group marks detector is more precise, so using it in controversary cases
			if (format.groupMark == format.decMark) delete format.groupMark;
			return format;
		},
		/**
		 * Get number format based on a single number string
		 * @param str string
		 * @returns {{groupMark, decMark, accounting, zerofill, indian}}
		 * @private
		 */
		_getFormat: function(str){
			var marks = str.replace(/[0-9\(\)\-]+/g, ''),
				format = {};
			if (str.charAt(0) == '(') format.accounting = true;
			if (/^0[0-9]/.test(str)) format.zerofill = true;
			str = str.replace(/[\(\)\-]/g, '');
			if (marks.length == 0) return format;
			if (marks.length > 1) {
				format.groupMark = marks.charAt(0);
				if (marks.charAt(0) != marks.charAt(marks.length - 1)) format.decMark = marks.charAt(marks.length - 1);
				if ( ! format.decMark && str.split(format.groupMark)[1].length == 2) format.indian = true;
			} else/*if (marks.length == 1)*/ {
				if (str.indexOf(marks) == 1){
					format[(str.length == 5)?'groupMark':'decMark'] = marks;
				}else{
					format.groupMark = marks;
				}
			}
			return format;
		}
	};
	$.fn.clCounter = function(){
		this.each(function(index, container){
			$(container).data('clCounter', new CLCounter(container));
		});
	};
	$(function(){
		$('.cl-counter').clCounter();
	});
}(jQuery);


!function($){
	var $number = $('.cl-counter-text-part.type_number:first'),
		initial = $number.html() + '',
		final = $number.data('final') + '';
	var getFormat = function(str){

	};
	var iFormat = getFormat(initial),
		fFormat = getFormat(final),
		format = $.extend({}, fFormat, iFormat);
	// Group marks detector is more precise, so using it in controversary cases
	if (format.groupMark == format.decMark) delete format.groupMark;

	window.theFormat = function(initial, final){

		console.log(format);
	};
}(jQuery);
!function($){
	var $words = $('.cl-counter-text-part.type_words:first');


}(jQuery);
