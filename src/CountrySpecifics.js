import Core from '../src/Core.js';

/**
 * Functions related to information that is specific to a country, eg. address formatting, use of state and postal code fields etc.
 *
 * See also: http://stackoverflow.com/questions/13438461/formatting-a-shipping-address-by-country-in-php-or-perl
 */
export default class CountrySpecifics {

	static addressFieldOrder(country, options) {
		if (!options) options = {};
		var order;
		if (['US', 'CA', 'AU'].indexOf(country) > -1) {
			order = ['city', 'state', 'zip'];
			if (options.jQuery && options.cityStateZipContainerSelector) {
				options.jQuery(options.cityStateZipContainerSelector, options.optionalContext)
					.append(options.jQuery(options.citySelector, options.optionalContext))
					.append(options.jQuery(options.stateSelector, options.optionalContext))
					.append(options.jQuery(options.zipSelector, options.optionalContext));
			}
		} else if (['GB'].indexOf(country) > -1) {
			order = ['city', 'zip'];
			if (options.jQuery && options.cityStateZipContainerSelector) {
				options.jQuery(options.cityStateZipContainerSelector, options.optionalContext)
					.append(options.jQuery(options.citySelector, options.optionalContext))
					.append(options.jQuery(options.zipSelector, options.optionalContext));
			}
		} else {
			order = ['zip', 'city', 'state'];
			if (options.jQuery && options.cityStateZipContainerSelector) {
				options.jQuery(options.cityStateZipContainerSelector, options.optionalContext)
					.append(options.jQuery(options.zipSelector, options.optionalContext))
					.append(options.jQuery(options.citySelector, options.optionalContext))
					.append(options.jQuery(options.stateSelector, options.optionalContext));
			}
		}
		return order;
	}

	static addressFieldLabels(country, options) {
		if (!options) options = {};
		var labels;
		if (country == 'US') {
			labels = {
				city: 'City', _city: 'City',
				state: 'State', _state: 'State',
				zip: 'ZIP', _zip: 'Zip',
			};
		} else if (country == 'CA') {
			labels = {
				city: 'City', _city: 'City',
				state: 'Province', _state: 'Province',
				zip: 'Postal Code', _zip: 'Postal_Code',
			};
		} else if (country == 'AU') {
			labels = {
				city: 'Town / Suburb', _city: 'Town_Suburb',
				state: 'State / Territory', _state: 'State_Territory',
				zip: 'Postcode', _zip: 'Postcode',
			};
		} else if (country == 'GB') {
			labels = {
				city: 'Town / City', _city: 'Town_City',
				state: '', _state: '',
				zip: 'Postcode', _zip: 'Postcode',
			};
		} else {
			labels = {
				city: 'City', _city: 'City',
				state: 'State / Province / Region (if required)', _state: 'State_Province_Region',
				zip: 'Postal Code', _zip: 'Postal_Code',
			};
		}

		if (options.jQuery && options.cityLabel) options.jQuery(options.cityLabel, options.optionalContext).html(labels.city);
		if (options.jQuery && options.stateLabel) options.jQuery(options.stateLabel, options.optionalContext).html(labels.state);
		if (options.jQuery && options.zipLabel) options.jQuery(options.zipLabel, options.optionalContext).html(labels.zip);

		return labels;
	}

	/**
	 * Get countries that require state/province in address
	 *
	 * Countries not listed here and not listed in countriesWithoutStateProvince() are countries where using state/province is optional.
	 *
	 * @see http://webmasters.stackexchange.com/questions/3206/what-countries-require-a-state-province-in-the-mailing-address
	 *
	 * @return {array}
	 */
	static countriesRequiringStateProvince() {
		return ['US','CA','AU','CN','CZ','MX','MY','IT'];  //currently not an exhaustive list
	}

	/**
	 * Get countries that do not use state/province in address at all
	 *
	 * @return {array}
	 */
	static countriesWithoutStateProvince() {
		return ['GB','DK','NO','SE'];  //not an exhaustive list at all!
	}

	/**
	 * Get countries that do not use postal codes
	 *
	 * @see https://gist.github.com/bradydan/e172c3f99e211e6e47ad84f08f83dfe3
	 *
	 * @return {array}
	 */
	static countriesWithoutPostalcodes() {
		return ['AO','AG','AW','BS','BZ','BJ','BW','BF','BI','CM','CF','KM','CG','CD','CK','CI','DJ','DM','GQ','ER','FJ','TF','GM','GH','GD','GN','GY','HK','IE','JM','KE','KI','MO','MW','ML','MR','MU','MS','NR','AN','NU','KP','PA','QA','RW','KN','LC','ST','SC','SL','SB','SO','ZA','SR','SY','TZ','TL','TK','TO','TT','TV','UG','AE','VU','YE','ZW'];
	}

	/**
	 * Validate the zip/postal code for at specific country
	 *
	 * @see https://gist.github.com/bradydan/e172c3f99e211e6e47ad84f08f83dfe3
	 *
	 * @param {object} options - Available options (opt.):
	 * 	- `reformat` : reformat the value according to the country's format, eg. for Canada "K1G6Z3" or "k1g-6z3" would be converted to "K1G 6Z3"
	 * 		- this flag can also cause less strict validation rules since we can now automatically fix small inconsistencies!
	 * 		- when used the reformatted value is returned if valid and false if returned if value is not valid
	 * 	- `allowUSZip4` : allow the format #####-#### in United States (http://en.wikipedia.org/wiki/ZIP_code)
	 * @return {boolean|string} - Normally boolean but if reformat flag is used: reformatted value if valid or false if invalid
	 */
	static validateZip(country, zipValue, options) {
		var isValid = false;
		if (!options) options = {};

		if (options.reformat) {
			zipValue = (zipValue === null ? '' : Core.trim(String(zipValue)));
		} else {
			zipValue = (zipValue === null ? '' : String(zipValue));
		}

		if (country == 'US') {
			//exactly 5 digits or 5+4 if flag is set
			if (/^\d{5}$/.test(zipValue)) {
				isValid = true;
			} else if (options.allowUSZip4 && /^\d{5}\-\d{4}$/.test(zipValue)) {
				isValid = true;
			}
		} else if (country == 'CA') {
			//require format "A1A 1A1", where A is a letter and 1 is a digit and with a space in the middle
			if (/^[A-Z]\d[A-Z][\.\- ]?\d[A-Z]\d$/i.test(zipValue)) {
				isValid = true;
				if (options.reformat) {
					zipValue = zipValue.substr(0, 3).toUpperCase() +' '+ zipValue.slice(-3).toUpperCase();
				}
			}
		} else if (country == 'GB') {
			//require format specified on http://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
			if (/^([A-Z]{1,2}\d[A-Z]?|[A-Z]{1,2}\d{2})[\.\- ]?\d[A-Z][A-Z]$/i.test(zipValue)) {
				isValid = true;
				if (options.reformat) {
					zipValue = zipValue.replace(/[^[A-Z]\d]/gi, '').slice(0, -3).toUpperCase() +' '+ zipValue.slice(-3).toUpperCase();
				}
			}
		} else if (country == 'AU' || country == 'DK' || country == 'NO' || country == 'AT' || country == 'CH') {
			//exactly 4 digits
			if (/^\d{4}$/.test(zipValue)) {
				isValid = true;
			}
		} else if (country == 'SE' || country == 'DE' || country == 'FI' || country == 'ES' || country == 'IT' || country == 'FR') {
			//exactly 5 digits
			if (/^\d{5}$/.test(zipValue)) {
				isValid = true;
			}
		} else if (country == 'NL') {
			//4 digits followed by 2 uppercase letters (http://en.wikipedia.org/wiki/Postal_codes_in_the_Netherlands)
			if (options.reformat) {
				if (/^\d{4}[ \-]?[A-Z]{2}$/.test(zipValue)) {
					isValid = true;
				}
				zipValue = zipValue.substr(0, 4) +' '+ zipValue.slice(-2).toUpperCase();
			} else {
				if (/^\d{4} ?[A-Z]{2}$/.test(zipValue)) {
					isValid = true;
				}
			}
		} else if (country == 'BR') {
			//5 digits, a dash, then 3 digits (http://en.wikipedia.org/wiki/List_of_postal_codes_in_Brazil)
			zipValue = zipValue.replace('.', '');  //some people seem to put a dot after the first two digits
			if (/^\d{5}-?\d{3}$/.test(zipValue)) {
				isValid = true;
				if (options.reformat) {
					zipValue = zipValue.substr(0, 5) +'-'+ zipValue.slice(-3);
				}
			}
		} else if (country == 'KR') {
			//3 digits, a dash, then 3 digits
			if (options.reformat) {
				if (/^\d{3}[^\d]?\d{3}$/.test(zipValue)) {
					isValid = true;
					zipValue = zipValue.substr(0, 3) +'-'+ zipValue.slice(-3);
				}
			} else {
				if (/^\d{3}\-?\d{3}$/.test(zipValue)) {
					isValid = true;
				}
			}
		} else {
			//for all other countries don't do validation and assume it is valid
			isValid = true;
		}
		if (isValid && options.reformat) {
			isValid = zipValue;
		}
		return isValid;
	}

	static firstnameLastnameOrder(country, options) {
		if (!options) options = {};
		if (['US', 'CA', 'AU', 'NZ', /*Western Europe from here: */ 'AD', 'AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'GR', 'IS', 'IE', 'IT', 'LI', 'LU', 'MT', 'MC', 'NL', 'NO', 'SM', 'SE', 'CH', 'GB'].indexOf(country) > -1) {  // Western Europe: http://en.wikipedia.org/wiki/Western_Europe#Western_European_and_Others_Group
			order = ['firstname', 'lastname'];
			if (options.jQuery) {
				options.jQuery(options.firstnameSelector, options.optionalContext).insertBefore(options.jQuery(options.lastnameSelector, options.optionalContext));
			}
		} else {
			order = ['lastname', 'firstname'];
			if (options.jQuery) {
				options.jQuery(options.lastnameSelector, options.optionalContext).insertBefore(options.jQuery(options.firstnameSelector, options.optionalContext));
			}
		}
		return order;
	}

	static dateFieldOrder(country, options) {
		if (!options) options = {};
		if (['US', 'CA'].indexOf(country) > -1) {  //NOTE: .insertBefore() only works with element are next to each other (http://stackoverflow.com/questions/698301/is-there-a-native-jquery-function-to-switch-elements)
			order = ['month', 'day', 'year'];
			if (options.jQuery && options.dateContainerSelector) {
				options.jQuery(options.dateContainerSelector, options.optionalContext)
					.append(options.jQuery(options.monthSelector, options.optionalContext))
					.append(options.jQuery(options.daySelector, options.optionalContext))
					.append(options.jQuery(options.yearSelector, options.optionalContext));
			}
		} else if (['CN', 'HK', 'TW', 'HU', 'JP', 'KR', 'LT', 'MN'].indexOf(country) > -1) {
			order = ['year', 'month', 'day'];
			if (options.jQuery && options.dateContainerSelector) {
				options.jQuery(options.dateContainerSelector, options.optionalContext)
					.append(options.jQuery(options.yearSelector, options.optionalContext))
					.append(options.jQuery(options.monthSelector, options.optionalContext))
					.append(options.jQuery(options.daySelector, options.optionalContext));
			}
		} else {
			order = ['day', 'month', 'year'];
			if (options.jQuery && options.dateContainerSelector) {
				options.jQuery(options.dateContainerSelector, options.optionalContext)
					.append(options.jQuery(options.daySelector, options.optionalContext))
					.append(options.jQuery(options.monthSelector, options.optionalContext))
					.append(options.jQuery(options.yearSelector, options.optionalContext));
			}
		}
	}

	/**
	 * Setup state input fields to automatically switch between text input and select based on the currently selected country
	 *
	 * !!! This currently requires jQuery and is therefore not compatible with reactive frameworks !!!
	 *
	 * Call this function once on page load.
	 *
	 * @param {options} options - Available options:
	 * 	- `jQuery` (req.) : set to the jQuery namespace
	 * 	- `stateList` (req.) : object with list of states for each country
	 * 		- key must match the possible country dropdown values (preferrably ISO-3166 country code) and it's value should be an array of subarrays where 1st value is state code (value) and 2nd value is state name (label)
	 * 	- `stateFieldSelector` (req.) :  jQuery selector for the state input field
	 * 	- `countryFieldSelector` (req.) :  jQuery selector for the country input field that should control the state
	 * 	- `ignoreNonExisting` : set to true to not add a non-existing state value to the dropdown when converting an existing text value
	 * 	- `hideStateWhenNotUsed` : set a jQuery selector in order to hide the state field for countries where it isn't used
	 * @return {void} - Only modifies DOM
	 */
	static stateInputHandling(options) {
		if (!options) options = {};
		if (!options.stateList) options.stateList = this.basicCountryStatesList();

		if (!options.jQuery) {
			alert('The method CountrySpecifics.stateInputHandling() in jensen-js-essentials library currently only supports jQuery.');
			return;
		}
		const $ = options.jQuery;
		const stateFieldSelector = options.stateFieldSelector;
		const countryFieldSelector = options.countryFieldSelector;

		var $state = $(stateFieldSelector);
		var $country = $(countryFieldSelector);
		var currMode = ($state.is('select') ? 'select' : 'input');  //source: https://stackoverflow.com/a/8388874/2404541
		var currStateValue = $state.val();
		var currCountryCode = $country.val();
		var foundSelected = false;

		if ((currMode == 'input' || currCountryCode !== $state.attr('data-country')) && options.stateList[currCountryCode]) {
			// Convert <input> to <select>

			var $select = $('<select>');
			$select.attr('data-country', currCountryCode);
			if ($state.attr('name')) $select.attr('name', $state.attr('name'));  //copy attributes from <input>
			if ($state.attr('class')) $select.attr('class', $state.attr('class'));
			if ($state.attr('style')) $select.attr('style', $state.attr('style'));
			if ($state.attr('id')) $select.attr('id', $state.attr('id'));
			if ($state.is(':disabled')) $select.prop('disabled', true);

			if (options.blankLabel !== false) {
				$select.append(
					$('<option>').val('').html( (options.blankLabel ? options.blankLabel : '') )
				);
			}

			$.each(options.stateList[currCountryCode], (indx, val) => {
				var isSelected = (currStateValue.toUpperCase() == val[0].toUpperCase() ? true : false);

				if (isSelected) foundSelected = true;

				$select.append(
					$('<option>').val(val[0]).html(val[1]).prop('selected', isSelected)
				);
			});

			if (currStateValue.length > 0 && foundSelected == false && options.ignoreNonExisting !== true) {
				$select.append(
					$('<option>').val(currStateValue).html(currStateValue).prop('selected', true)
				);
			}

			$($state).replaceWith($select);

		} else if (currMode == 'select' && typeof options.stateList[currCountryCode] == 'undefined') {
			// Convert <select> to <input>

			var $input = $('<input>');
			if ($state.attr('name')) $input.attr('name', $state.attr('name'));  //copy attributes from <input>
			if ($state.attr('class')) $input.attr('class', $state.attr('class'));
			if ($state.attr('style')) $input.attr('style', $state.attr('style'));
			if ($state.attr('id')) $input.attr('id', $state.attr('id'));
			if ($state.is(':disabled')) $input.prop('disabled', true);

			$input.val(currStateValue);

			$($state).replaceWith($input);
		}

		// Handle hiding the field
		if (options.hideStateWhenNotUsed) {
			if (currCountryCode && this.countriesWithoutStateProvince().indexOf(currCountryCode) > -1) {
				// state not used in the current country => hide it
				$(options.hideStateWhenNotUsed).hide();
			} else {
				// show it
				$(options.hideStateWhenNotUsed).show();
			}
		}

		// Setup calling the method again whenever country changes
		if (options.__eventSetupDone !== true) {
			$country.on('change', () => {
				options.__eventSetupDone = true;
				this.stateInputHandling(options);
			});
		}
	}

	/**
	 * List of states for a few selected countries
	 *
	 * Used as default if full list is not provided. Full list in Allan Jensen's file `Country states worldwide - my master list.sql`.
	 *
	 * @return {object}
	 */
	static basicCountryStatesList() {
		return {
			'AU':[
				['ACT','Australian Capital Territory'],['NSW','New South Wales'],['NT','Northern Territory'],['QLD','Queensland'],['SA','South Australia'],['TAS','Tasmania'],['VIC','Victoria'],['WA','Western Australia'],
			],
			'CA':[
				['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],['NL','Newfoundland and Labrador'],['NT','Northwest Territories'],['NS','Nova Scotia'],['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],['SK','Saskatchewan'],['YT','Yukon Territories'],
			],
			'US':[
				['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['AP','Armed Forces Pacific'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['GU','Guam'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['PR','Puerto Rico'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['VI','US Virgin Islands'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
			],
		};
	}

	/**
	 * Return the minimum number of digits in phone number for a given country or country dialing code
	 *
	 * @param {string|integer} country - ISO country code in upper case or country dialing code
	 * @return {number}
	 */
	static minimumPhoneNumDigits(country) {
		if (['US', 'CA'].indexOf(country) > -1 || [1].findIndex(item => item == country) > -1) {
			return 10;
		} else if (['DK', 'NO', 'SE'].indexOf(country) > -1 || [45, 47, 46].findIndex(item => item == country) > -1) {
			return 8;
		} else {
			// rest of the world (Solomon Islands have 5 digit phone numbers)
			return 5;
		}
	}

}
