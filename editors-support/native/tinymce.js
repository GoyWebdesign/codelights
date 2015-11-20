!function($){
	tinymce.create('tinymce.plugins.codelights', {
		init: function(ed, url){

			ed.addButton('codelights', {
				title: 'Insert / Edit CodeLights Shortcode',
				cmd: 'codelights',
				image: url + '/icon.png'
			});
			this.ed = ed;
			this.url = url;

			var btnAction = function(){
				var handlerParams = this.getHandlerParams(),
					handler = $cl.fn.handleShortcodeCall.apply(window, handlerParams);
				if (handler.selection !== undefined) {
					// Updating selection: seeking DOM elements for each selection part
					this.applySelection(handler.selection[0], handler.selection[1]);
				}
				if (handler.action == 'insert') {
					$cl.elist.unbind('select').bind('select', function(name){
						ed.insertContent('[' + name + ']');
						range = ed.selection.getRng();
						ed.selection.setCursorLocation(range.endContainer, range.endOffset - 1);
						btnAction();
					});
					$cl.elist.show();
				} else if (handler.action == 'edit') {
					$cl.ebuilder.unbind('save').bind('save', function(values, defaults){
						var shortcode = $cl.fn.generateShortcode(handler.shortcode, values, defaults);
						shortcode = shortcode.replace(/\n/g, '<br> ');
						ed.insertContent(shortcode);
					});
					$cl.ebuilder.show(handler.shortcode, handler.values);
				}
			}.bind(this);

			ed.addCommand('codelights', btnAction);
		},

		/**
		 * Tinymce transforms line-breaks to <br> tags followed by space, this method gets plain text representation
		 * of the current selection range and selection range positions within this plain text.
		 *
		 * @return {Array}
		 */
		getHandlerParams: function(){
			// Determine if we're adding the new one or editing the existing shortcode
			var range = this.ed.selection.getRng(),
				value = range.startContainer.nodeValue || '',
				startOffset = range.startOffset,
				endOffset = null; // Will be null till the end element is actually found
			// Shortcode attributes may contain line breaks, that are transformed to <br> tags by tinymce,
			// so we're trying to handle this as a single shorcode traversing in both directions
			var prevElm = range.startContainer,
				subValue;
			while (prevElm.previousSibling && (prevElm.previousSibling.nodeType == 3 || prevElm.previousSibling.tagName == 'BR')) {
				prevElm = prevElm.previousSibling;
				value = (subValue = ((prevElm.nodeType == 3) ? prevElm.nodeValue : "\n")) + value;
				startOffset += subValue.length;
				if (prevElm == range.endContainer) {
					endOffset = range.endOffset;
				} else if (endOffset != null) {
					endOffset += subValue.length;
				}
			}
			var nextElm = range.startContainer;
			while (nextElm.nextSibling && (nextElm.nextSibling.nodeType == 3 || nextElm.nextSibling.tagName == 'BR')) {
				nextElm = nextElm.nextSibling;
				value += (subValue = (nextElm.nodeType == 3) ? nextElm.nodeValue : "\n");
				if (nextElm == range.endContainer) endOffset = value.length - subValue.length + range.endOffset;
			}
			if (endOffset === null) endOffset = startOffset;
			// Removing excess spaces insterted by tinymce after line breaks
			var breakPos;
			while ((breakPos = value.indexOf("\n ")) != -1) {
				value = value.substr(0, breakPos + 1) + value.substr(breakPos + 2);
				if (startOffset >= breakPos) startOffset--;
				if (endOffset >= breakPos) endOffset--;
			}
			return [value, startOffset, endOffset];
		},

		/**
		 * Apply selection within a group of current cursor siblings that are translatable to plain text (text nodes and <br> tags)
		 * @param {Number} start Range start from the plain text representation
		 * @param {Number} end Range end from the plain text representation
		 */
		applySelection: function(start, end){
			var range = this.ed.selection.getRng(),
				curElm = range.startContainer,
				prevElm = curElm;
			while (curElm.previousSibling && (curElm.previousSibling.nodeType == 3 || curElm.previousSibling.tagName == 'BR')) {
				curElm = curElm.previousSibling;
			}
			var prevOffset = 0,
				rng = document.createRange(),
				rngStartContainer, rngEndContainer, subValue;
			while (curElm && ( !rngStartContainer || !rngEndContainer)) {
				// TODO Replace N with \n
				subValue = (curElm.nodeType == 3) ? curElm.nodeValue : "N";
				// Taking into account spaces after line breaks
				if (prevElm.nodeType != 3 && subValue[0] == ' ') {
					if (start > prevOffset) start++;
					if (end > prevOffset) end++;
				}
				if (start >= prevOffset && start < prevOffset + subValue.length) {
					rng.setStart((rngStartContainer = curElm), start - prevOffset);
				}
				if (end > prevOffset && end <= prevOffset + subValue.length) {
					rng.setEnd((rngEndContainer = curElm), end - prevOffset);
				}
				prevOffset += subValue.length;
				prevElm = curElm;
				curElm = curElm.nextSibling;
			}
			if (start == end && rngStartContainer) {
				this.ed.selection.setCursorLocation(rngStartContainer, rng.startOffset);
			} else if (rngStartContainer && rngEndContainer) {
				this.ed.selection.setRng(rng);
			}
		},

		getInfo: function(){
			return {
				longname: 'CodeLighs Shortcodes and Widgets',
				author: 'CodeLights',
				authorurl: 'http://codelights.com/',
				infourl: 'http://codelights.com/',
				version: "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('codelights', tinymce.plugins.codelights);
}(jQuery);
