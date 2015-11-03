// Note: this file is embedded inline
QTags.addButton(
	'codelights',
	'CodeLights',
	function(btn, textarea, ed){
		var shortcode = $cl.fn.handleShortcodeCall(textarea.value, textarea.selectionStart, textarea.selectionEnd);
		if (shortcode.selection !== undefined) {
			textarea.setSelectionRange(shortcode.selection[0], shortcode.selection[1]);
		}
	}
);
