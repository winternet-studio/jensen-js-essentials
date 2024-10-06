/**
 * Core tools for numbers, arrays etc.
 */
export default class Core {

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

}
