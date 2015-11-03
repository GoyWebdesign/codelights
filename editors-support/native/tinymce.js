(function(){
	tinymce.create('tinymce.plugins.codelights', {
		init: function(ed, url){
			ed.addButton('codelights', {
				title: 'Insert / Edit CodeLights Shortcode',
				cmd: 'codelights',
				image: url + '/icon.png'
			});

			ed.addCommand('codelights', function(){
				// Determine if we're adding the new one or editing the existing shortcode
				var range = ed.selection.getRng(),
				// If several dom elements are selected, selection is handled as a single cursor position
					startOffset = range[(range.startContainer == range.endContainer) ? 'startOffset' : 'endOffset'],
					shortcode = $cl.fn.handleShortcodeCall(range.endContainer.nodeValue, startOffset, range.endOffset);
				if (shortcode.selection !== undefined) {
					// Updating selection
					if (shortcode.selection[0] == shortcode.selection[1]) {
						// Cursor position
						ed.selection.setCursorLocation(range.endContainer, shortcode.selection[0]);
					} else {
						// Select range
						var rng = document.createRange();
						rng.setStart(range.startContainer, shortcode.selection[0]);
						rng.setEnd(range.endContainer, shortcode.selection[1]);
						ed.selection.setRng(rng);
					}
				}

				//ed.execCommand('mceInsertContent', 0, 'HELLO');
			});
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
})();
