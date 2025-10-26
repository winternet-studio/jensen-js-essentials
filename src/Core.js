/**
 * Core tools for strings, numbers, arrays etc.
 */
export default class Core {

	/**
	 * Trim a string
	 *
	 * Safe to pass any type of variable.
	 */
	static trim(input) {
		if (typeof input === 'string') {
			return input.trim();  // use built-in String.prototype.trim()
		}
		return input;
	}

	/**
	 * Capitalize first letter
	 */
	static ucFirst(string) {  //source: https://stackoverflow.com/a/1026087/2404541
		if (!string) return string;
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	static countWords(str) {
		str = str.replace(/[,!\.\?\-]/g, '');  //avoid ". - , why ? !" counting as 6 words instead of 1!
		str = str.replace(/[\r\n]+/g, ' ');  //ensure space between last one on line and first word on next line
		str = this.trim(str);
		return str.split(/\s+/).length;
	}

	/**
	 * Check if variable is numeric
	 *
	 * Both a string of numbers as well as integers and floats will return true
	 *
	 * @param {mixed} value
	 * @return {boolean}
	 */
	static isNumeric(value) {
		if (value === null || value === undefined || value === "" || typeof value === 'boolean' || Array.isArray(value)) {
			return false;
		}
		if (isNaN(+value)) {  //use the unary plus operator (+) to convert the value to a number
			return false;
		}
		return true;
	}

	/**
	 * Check if variable is a integer
	 *
	 * Both a string of numbers as well as integers will return true
	 *
	 * @param {mixed} value
	 * @return {boolean}
	 */
	static isInteger(v) {
		if(v===null||typeof v=='undefined'||v.length==0)return false;
		if(isNaN(v))return false;
		return(parseInt(v,10)===parseFloat(v)?true:false);
	}

	static roundDecimals(number, numOfDecimals) {
		var precisionNumber = Math.pow(10, numOfDecimals);
		return Math.round(number * precisionNumber)/precisionNumber;
	}

	static toInt(number) {
		return parseInt(number, 10);
	}

	/**
	 * Format a number
	 *
	 * Equivalent to PHP number_format().
	 * Source: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
	 *
	 * @return {string} - Formatted string
	 */
	static numberFormat(number, decimals, decimalPoint, thousandsSep) {
		// http://kevin.vanzonneveld.net
		// + original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
		// + improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// + bugfix by: Michael White (http://crestidg.com)
		// + bugfix by: Benjamin Lupton
		// + bugfix by: Allan Jensen (http://www.winternet.no) (fixed formatting negative numbers)
		// * example 1: number_format(1234.5678, 2, '.', '');
		// * returns 1: 1234.57

	    var i, j, kw, kd, km;
		var neg = '';

		// Input sanitation & defaults
		if ( isNaN(decimals = Math.abs(decimals)) ) {
			decimals = 2;
		}
		if (decimalPoint == undefined) {
			decimalPoint = '.';
		}
		if (thousandsSep == undefined) {
			thousandsSep = ',';
		}

		i = parseInt(number = (+number || 0).toFixed(decimals)) + '';
		if (i.substr(0,1) == '-') {
			number = Math.abs(number);
			neg = '-';
			i = i.substr(1);
		}

		if ((j = i.length) > 3 ) {
			j = j % 3;
		} else {
			j = 0;
		}

		km = (j ? i.substr(0, j) + thousandsSep : '');
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
		//kd = (decimals ? decimalPoint + Math.abs(number - i).toFixed(decimals).slice(2) : '');
		kd = (decimals ? decimalPoint + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');
		return neg + km + kw + kd;
	}

	/**
	 * Sort a "two-dimensional" array by a value in the objects
	 *
	 * @param {array} array - Array to be sorted
	 * @param {string} sortBy - Name of key in object with value to sort by
	 * @param {boolean} descending - Set to true to sort descendingly instead of ascendingly
	 * @return {array}
	 */
	static arrayColumnSort(array, sortBy, descending) {
		return array.sort(this._dynamicSort(sortBy, descending));
	}
	static _dynamicSort(property, descending) {
		var sortOrder = 1;
		if (descending) {
			sortOrder = -1;
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

	/**
	 * Sort array items in a given explicit order
	 *
	 * Items not mentioned in the given order will be placed last.
	 *
	 * @param {array} array : Array to be sorted
	 * @param {string} property : Name of property in which you'll be specifying the order of items in `explicitOrder`
	 * @param {array} explicitOrder : Array of property values in the order you want the items
	 */
	static arrayExplicitSort(array, property, explicitOrder) {
		const orderMap = new Map(explicitOrder.map((value, index) => [value, index]));

		return array.slice().sort((a, b) => {
			const aOrder = orderMap.has(a[property]) ? orderMap.get(a[property]) : Infinity;
			const bOrder = orderMap.has(b[property]) ? orderMap.get(b[property]) : Infinity;

			return aOrder - bOrder;
		});
	}

	/**
	 * Remove duplicates in an array
	 *
	 * Source: http://www.martienus.com/code/javascript-remove-duplicates-from-array.html
	 *
	 * @param {array} array - Array to be sorted
	 * @return {array}
	 */
	static uniqueArray(array) {
		var r=new Array();
		o:for(var i=0,n=array.length;i<n;i++) {
			for(var x=0,y=r.length;x<y;x++) {
				if(r[x]==array[i]) {
					continue o;
				}
			}
			r[r.length]=array[i];
		}
		return r;
	}

	static arraySum(array) {
		return array.reduce(function(accumulator, a) {
			return accumulator + a;
		}, 0);
	}

	/**
	 * Simple conversion of basic variables to YAML
	 *
	 * For more advanced conversion use a library like `js-yaml` or `yaml` from npm.
	 *
	 * @param {object} options : Available options:
	 *   - `indent` : Custom number of spaces as indentation. Default: 2
	 *   - `encloseStrings` : Set true to enclose string with "" (except if string itself contains a ") so you know it's a string and not a number or boolean
	 */
	static toYaml(variable, options = {}, level = 0) {
		const indent = options.indent ?? 2;  // number of spaces for YAML indentation
		const spaces = ' '.repeat(indent).repeat(level);
		if (typeof variable === 'object' && variable !== null) {
			if (Array.isArray(variable)) {
				// Handle arrays
				return variable
					.map(item => `${spaces}- ${this.toYaml(item, options, level + 1).trim()}`)
					.join('\n');
			} else {
				// Handle objects
				return Object.keys(variable)
					.map(key => `${spaces}${key}:${typeof variable[key] === 'object' ? `\n${this.toYaml(variable[key], options, level + 1)}` : ` ${this.toYaml(variable[key], options, 0)}`}`)
					.join('\n');
			}
		} else {
			// Handle primitive values
			if (typeof variable == 'string') {
				if (!options.encloseStrings || variable.indexOf('"') > -1) {
					return variable;  //will be confused if the string itself also has "
				} else {
					return '"'+ variable +'"';  //makes strings be enclosed with "" and quotes escaped within the string
				}
			} else {
				return JSON.stringify(variable);  //makes strings be enclosed with "" and quotes escaped within the string
			}
			// return variable === null ? 'null' : variable.toString();  //throws strange error "TypeError: Cannot read properties of undefined (reading 'toString')"
		}
	}

}
