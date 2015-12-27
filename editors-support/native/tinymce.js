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
		 * Gets plain text representation of the current selection range and selection range positions within this
		 * plain text.
		 *
		 * @return {Array}
		 */
		getHandlerParams: function(){
			var range = this.ed.selection.getRng(),
				startTrigger = '!cl-selection-start!',
				endTrigger = '!cl-selection-end!',
				value = this.ed.getContent({format: 'html'}),
				startOffset, endOffset;
			this.ed.selection.setCursorLocation(range.startContainer, range.startOffset);
			this.ed.insertContent(startTrigger);
			startOffset = this.ed.getContent().indexOf(startTrigger);
			if (range.startContainer == range.endContainer && range.startOffset == range.endOffset) {
				// Just a cursor position
				endOffset = startOffset;
			} else {
				// The range is selected
				this.ed.selection.setCursorLocation(range.endContainer, range.endOffset);
				this.ed.insertContent(endTrigger);
				endOffset = this.ed.getContent().indexOf(endTrigger);
				if (startOffset != -1 && endOffset != -1 && endOffset > startOffset) endOffset -= startTrigger.length;
				if (endOffset != -1) this.ed.execCommand('undo');
			}
			if (startOffset != -1) this.ed.execCommand('undo');
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
				subValue = (curElm.nodeType == 3) ? curElm.nodeValue : "\n";
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
