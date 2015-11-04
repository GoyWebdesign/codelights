!function($){
	tinymce.create('tinymce.plugins.codelights', {
		init: function(ed, url){
			ed.addButton('codelights', {
				title: 'Insert / Edit CodeLights Shortcode',
				cmd: 'codelights',
				image: url + '/icon.png'
			});

			var btnAction = function(){
				// Determine if we're adding the new one or editing the existing shortcode
				var range = ed.selection.getRng(),
				// If several dom elements are selected, selection is handled as a single cursor position
					startOffset = range[(range.startContainer == range.endContainer) ? 'startOffset' : 'endOffset'],
					handler = $cl.fn.handleShortcodeCall(range.endContainer.nodeValue, startOffset, range.endOffset);
				if (handler.selection !== undefined) {
					// Updating selection
					if (handler.selection[0] == handler.selection[1]) {
						// Cursor position
						ed.selection.setCursorLocation(range.endContainer, handler.selection[0]);
					} else {
						// Select range
						var rng = document.createRange();
						rng.setStart(range.startContainer, handler.selection[0]);
						rng.setEnd(range.endContainer, handler.selection[1]);
						ed.selection.setRng(rng);
					}
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
						ed.insertContent(shortcode);
					});
					$cl.ebuilder.show(handler.shortcode, handler.values);
				}
			};

			ed.addCommand('codelights', btnAction);
		},

		getInfo: function(){
			return {
				longname: 'CodeLighs Elements',
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
