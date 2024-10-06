/**
 * HTML tools
 */
export default class Html {

	/**
	 * Decode HTML entities
	 *
	 * Works currently ONLY in the browser!
	 */
	static decodeEntities(encodedString) {
		// source: http://stackoverflow.com/a/1395954/2404541
		if (typeof document == 'undefined') {
			alert('Html.decodeEntities() in jensen-js-essentials can currently only be used in the browser.');
			return;
		}
		var textArea = document.createElement('textarea');
		textArea.innerHTML = encodedString;
		return textArea.value;
	}

	/**
	 * Strip tags from HTML string
	 *
	 * Works currently ONLY in the browser!
	 */
	static stripTags(html) {
		// source: http://stackoverflow.com/a/5002618/2404541
		if (typeof document == 'undefined') {
			alert('Html.stripTags() in jensen-js-essentials can currently only be used in the browser.');
			return;
		}
		var div = document.createElement('div');
		html = html.replace(/<br\s*\/?>/g, '\n');  //if we don't convert new-lines SwiftApp.countWords() will not be correct as last word on one line will be smashed together with first word on next line
		div.innerHTML = html;
		return div.textContent || div.innerText || '';
	}

	/*
	static parseCssStyle {
		// See Swiftlayout...
	}

	static buildCssStyle {
		// See Swiftlayout...
	}
	*/

}
