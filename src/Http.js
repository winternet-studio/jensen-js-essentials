/**
 * HTTP tools
 */
export default class Http {

	static defaultTexts = {
		textSuccess: 'Operation completed successfully.',
		textErrorBecause: 'Sorry, operation could not be completed because:',
		textError: 'Sorry, the operation failed.',
		textPleaseNote: 'Please note',
		textSelectionCleared: 'Please note that current selection ({value}) in dropdown box was not re-selected after changing its options.',
	};

	/**
	 * Standard HTTP request handler
	 *
	 * Based on same ideas as appJS.doAjax() in yii2-libs.
	 *
	 * @param {string} method : GET, POST, PUT, etc.
	 * @param {string} url : URL/endpoint to call
	 * @param {object} options : Available options:
	 *   - {object} jsonBody - Object of data/parameters to send in a POST/PUT/PATCH request. Will be JSON stringified and sent as `application/json`
	 *   - {object} urlencodedBody - Object of data/parameters to send in a POST/PUT/PATCH request. Will be sent as `application/x-www-form-urlencoded`
	 *   - {object} formDataBody - FormData object to send in a POST/PUT/PATCH request. Will be sent as `multipart/form-data`
	 *   - {string|object} responseFormat
	 *   - {string|object} formFieldNames - Array of strings with attributes/field names in the form. Set this to when using responseFormat `resultError` or `resultErrorQuiet` and processForm, so that error messages for specific fields are only shown next to the field in the form and not in the generic alert box
	 *   - {object|string|callable} postActions - Actions to be done after the request has completed. Object with any of the following keys, (DISABLED UNTIL WE NEED IT: or array of objects each with a single of the following keys):
	 *   	- NOT IMPLEMENTED YET! `successMessage` : set value with a message to the user if operation succeeds, eg. "Thank you for contacting us."
	 *   	- NOT IMPLEMENTED YET! `errorMessage` : set value with a message to the user if operation fails, eg. "Sorry, you message could not be sent."
	 *   	- NOT IMPLEMENTED YET! `reloadPage` : set to true to reload the page if operation succeeds (must be the last action to perform)
	 *   	- NOT IMPLEMENTED YET! `previousPage` : set to true to go back to the previous page in the browser history (must be the last action to perform)
	 *   	- NOT IMPLEMENTED YET! `redirectUrl` : set value to a URL to redirect to if operation succeeds (must be the last action to perform)
	 *   	- NOT IMPLEMENTED YET! `setHtml` : set to true to set the HTML (innerHtml property) for an element on the page if operation succeeds. Additional required keys:
	 *   		- `selector` : selector for the element to set HTML for
	 *   		- `html` : HTML to be set
	 *   	- `processForm` : object with properties `errors` (object) and `formGroupCss` (object)
	 *   	- `successCallback` : set value to a string with function name or an anonymous function to call if operation succeeds. One argument is passed which will be an object with the following properties:
	 *   		- `data` : response from server
	 *   		- `success` : boolean true or false based on response from server
	 *   		- `origOptions` : original options passed to this standardRequest() function
	 *   	- `errorCallback` : set value to a string with function name or an anonymous function to call if operation fails (not called if request itself fails due to network error or invalid response, since this function is suppose to handle that). One argument is passed which will be an object with the following properties:
	 *   		- `data` : response from server
	 *   		- `success` : boolean true or false based on response from server
	 *   		- `origOptions` : original options passed to this standardRequest() function
	 *   	- `alwaysCallback` : set value to a string with function name or an anonymous function to always call. If this is the only actions the function can be provided directly as the postActions value. One argument is passed which will be an object with the following properties:
	 *   		- `data` : response from server
	 *   		- `success` : boolean true or false based on response from server
	 *   		- `origOptions` : original options passed to this standardRequest() function
	 *   	- as a shortcut for specifying just a single action you can pass the strings `reloadPage` or `previousPage`
	 *   - {object} fetchOptions : Options to pass to Javascript fetch() method
	 *   - {object} config - Object with any of these config/options:
	 *   	- NOT IMPLEMENTED YET! `confirmMessage` : set a string with message to have the user confirm before executing the AJAX call
	 *   	- NOT IMPLEMENTED YET! `skipShowProcess` : set to true to not dim the page and show process status
	 *   	- NOT IMPLEMENTED YET! `requireSsl` : set to true to require SSL for transmitting this request to the server
	 *   	- `skipNamedErrors` : array of attributes which we don't want to have the general popup error message (usually because we show the error next to the input fields)
	 *   	- `textSuccess` : set custom message
	 *   	- `textErrorBecause` : set custom message
	 *   	- `textError` : set custom message
	 *   	- `textPleaseNote` : set custom message
	 *   	- `textSelectionCleared` : set custom message
	 */
	static standardRequest(method, url, options) {
		if (typeof options == 'undefined') options = {};
		if (typeof options.config == 'undefined') options.config = {};
		if (typeof options.postActions == 'string') {
			if (options.postActions == 'reloadPage') {
				options.postActions = [ {reloadPage: true} ];
			} else if (options.postActions == 'previousPage') {
				options.postActions = [ {previousPage: true} ];
			} else {
				alert('CONFIGURATION ERROR! Http.standardRequest() postActions is an invalid string: '+ options.postActions);
			}
		}

		options.config = {
			...this.defaultTexts,
			confirmMessage: null,
			...options.config,
		};

		if (typeof options.fetchOptions === 'undefined') options.fetchOptions = {};
		options.fetchOptions.method = method;

		if (typeof options.jsonBody !== 'undefined') {
			options.fetchOptions.headers = {'Content-Type': 'application/json'};
			options.fetchOptions.body = JSON.stringify(options.jsonBody);
		} else if (typeof options.urlencodedBody !== 'undefined') {
			if (method == 'GET') {
				url += (url.indexOf('?') == -1 ? '?' : '&') + this.toUrlEncoded(options.urlencodedBody);
			} else {
				options.fetchOptions.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
				options.fetchOptions.body = this.toUrlEncoded(options.urlencodedBody);
			}
		} else if (typeof options.formDataBody !== 'undefined') {
			options.fetchOptions.body = options.formDataBody;
		}

		var isInCallback = false, processedNormally = false;
		this.executeFetch(url, options.fetchOptions)
			.then(response => {
				if (!response.ok) {
					return Promise.reject(response);
				}
				return response.json();
			})
			.then(data => {
				isInCallback = true;

				// Determine success/error
				var success = this.processErrorsNotices(options.responseFormat, data, {texts: options.config, skipNamedErrors: options.formFieldNames});
				if (['boolean', 'booleanQuiet'].indexOf(options.responseFormat) > -1) {
					if (data && options.responseFormat !== 'booleanQuiet') {
						alert(options.config.textSuccess);
						// TODO: refactor to Vue
						// var effActions = postModalActions();
						// appJS.showModal({
						// 	html: '<div class="ws-ajax-result">'+ options.config.textSuccess +'</div>',
						// 	closedCallback: function() {
						// 		modalClosedCallback(effActions, success);
						// 	}
						// });
					} else if (!data) {
						success = false;

						alert(options.config.textError);
						// TODO: refactor to Vue
						// var effActions = postModalActions();
						// appJS.showModal({
						// 	html: '<div class="ws-ajax-result">'+ options.config.textError +'</div>',
						// 	closedCallback: function() {
						// 		modalClosedCallback(effActions, success);
						// 	}
						// });
					}
				} else if (typeof options.responseFormat === 'object' && typeof options.responseFormat.fillDropDown !== 'undefined') {
					throw 'fillDropDown option not yet implemented';
					// TODO: refactor to Vue
					// var obj = $(options.responseFormat.selectSelector)[0];
					// // Some code below here is copied from dropdown_clear_options(JS) and dropdown_add(JS)
					// var s,cVal,cLbl,cSel,cSet=false;
					// if (obj.options.length == 0) {
					// 	cVal = cLbl = '';
					// } else {
					// 	s=obj.options[obj.selectedIndex];
					// 	cVal=s.value;
					// 	cLbl=s.text;
					// }
					// obj.options.length = 0;
					// if (data.length > 0) {
					// 	obj.options[0] = new Option('', '');  //add blank option in top
					// 	var nextIndex;
					// 	for (i in data) {
					// 		nextIndex = obj.options.length;
					// 		if (cVal.length>0 && cVal==data[i][options.responseFormat.valueColumn]) {
					// 			cSel=true;
					// 			cSet=true;
					// 		} else {
					// 			cSel=false;
					// 		}
					// 		obj.options[nextIndex] = new Option(data[i][options.responseFormat.labelColumn],data[i][options.responseFormat.valueColumn],cSel,cSel);
					// 	}
					// }
					// if (cVal.length>0 && cSet==false) {
					// 	var effActions = postModalActions();
					// 	appJS.showModal({
					// 		html: options.config.textSelectionCleared.replace('{value}', cLbl),
					// 		closedCallback: function() {
					// 			modalClosedCallback(effActions, success);
					// 		}
					// 	});
					// }
				}

				var resultObject = {
					data: data,
					success: success,
					origOptions: options,
				};

				if (options.postActions) {
					if (typeof options.postActions === 'function') {
						options.postActions(resultObject);
					} else {
						if (!Array.isArray(options.postActions)) {  //convert object to array of objects (if we eventually determine we never need the array we can remove the whole array handling)
							var actionsArray = [];
							Object.keys(options.postActions).forEach(item => {
								var obj = {};
								obj[item] = options.postActions[item];
								actionsArray.push(obj);
							});
							options.postActions = actionsArray;
						} else {
							throw 'Passing postActions as an array to Http.standardRequest() has been disabled until the need arises.';
						}
						Object.values(options.postActions).forEach((action) => {
							// TODO: process the different actions - copy and adapt from appJS.doAjax() in yii2-libs.

							if (typeof action.processForm !== 'undefined') {
								this.processServerSideFormValidation(resultObject, action.processForm.formGroupCss, action.processForm.errors, action.processForm.triggerField, options);

							} else if (typeof action.successCallback === 'function' && resultObject.success) {
								action.successCallback(resultObject);

							} else if (typeof action.errorCallback === 'function' && !resultObject.success) {
								action.errorCallback(resultObject);

							} else if (typeof action.alwaysCallback === 'function') {
								action.alwaysCallback(resultObject);
							}
						});
					}
				}
				processedNormally = true;
			})
			.catch(error => {
				if (typeof error.json === 'function') {
					error.json().then(responseData => {   //or: error.text()....
						if (responseData.errors) {
							alert('ERROR: '+ responseData.errors.join(' '));
						} else {
							alert('HTTP error code: '+ error.status +' '+ error.statusText +'\n\n'+ responseData.message);
						}
						// console.log(responseData);
					}).catch(genericError => {
						alert('HTTP error code: '+ error.status +' '+ error.statusText +' (Invalid JSON from API)');
					});
				} else {
					if (isInCallback) {
						alert(error + ' - see console');
						throw error;
					} else {
						console.log(error);
						alert('Network error. Please try again later.');
					}
				}
				// MAYBE: Should we call errorCallback here as well? Or maybe not since the whole purpose of standardRequest is to auto-handle errors? If we DO end up collecting errors here we should store them `data.errors` and `data.errorsItemized` to match the expected response (either to be used in errorCallback or alwaysCallback in finally block)
			})
			.finally(() => {
				if (!processedNormally) {  // Is basically only for when an error occurred and we went to .catch() instead
					if (options.postActions) {
						var resultObject = {
							data: null,  // MAYBE: Try to collect response from catch() and pass it here?
							success: false,
							origOptions: options,
							abnormal: true,
						};
						if (typeof options.postActions === 'function') {
							options.postActions(resultObject);
						} else {
							if (!Array.isArray(options.postActions)) {  //convert object to array of objects (if we eventually determine we never need the array we can remove the whole array handling)
								if (typeof options.postActions.alwaysCallback === 'function') {
									options.postActions.alwaysCallback(resultObject);
								}
							} else {
								throw 'Passing postActions as an array to Http.standardRequest() has been disabled until the need arises.';
							}
						}
					}
				}
			});
	}

	static async executeFetch(url, options) {
		const finalOptions = { ...options };
		if (typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')) {
			finalOptions.headers = {
				...finalOptions.headers,
				'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
			};
		}
		return await fetch(url, finalOptions);
	}

	static toUrlEncoded(obj) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(obj)) {
			params.append(key, value);
		}
		return params.toString();
	}


	/**
	 * @param {string} responseFormat : `resultError`, `resultErrorQuiet`, `resultOnly`, or `resultOnlyQuiet`
	 * @param {object} data : Response data from back-end
	 * @param {object} options : Available options:
	 *   - `skipNamedErrors` : array of attributes which we don't want to have the general popup error message (usually because we show the error next to the input fields)
	 *   - `texts` : object with properties:
	 *   	- `textSuccess` : set custom message
	 *   	- `textErrorBecause` : set custom message
	 *   	- `textError` : set custom message
	 *   	- `textPleaseNote` : set custom message
	 *   	- `textSelectionCleared` : set custom message
	 * @return boolean : Success or error
	 */
	static processErrorsNotices(responseFormat, data, options) {
		var success = true;

		options = {
			skipNamedErrors: [],
			...options,
		};
		var texts = {
			...this.defaultTexts,
			...options.texts,
		};
		if (typeof options.skipNamedErrors !== 'object') options.skipNamedErrors = [];

		if (['resultError', 'resultErrorQuiet', 'resultOnly', 'resultOnlyQuiet'].indexOf(responseFormat) > -1) {
			var isQuiet = (['resultErrorQuiet', 'resultOnlyQuiet'].indexOf(responseFormat) > -1 ? true : false);
			var errors = (typeof data.err_msg !== 'undefined' ? data.err_msg : data.errors);
			var notices = (typeof data.result_msg !== 'undefined' ? data.result_msg : data.notices);
			if (data.status == 'ok') {
				var msgCount = notices.length;
				if (msgCount == 0) {  //check if it's an object with properties (= text keys) instead of an array (= numeric keys)
					msgCount = Object.keys(notices).length;
				}
				if (!isQuiet || msgCount > 0) {
					var resultMsg = '<span class="result-text success-text">'+ texts.textSuccess;
					var resultMsgPlain = texts.textSuccess;
					if (msgCount > 0) {
						resultMsg += ' '+ texts.textPleaseNote +':</span><br><br><span class="messages result-messages"><ul>';
						resultMsgPlain += ' '+ texts.textPleaseNote +':\n';
						Object.values(notices).forEach(notice => {
							resultMsg += '<li>'+ notice +'</li>';
							resultMsgPlain += '\n - '+ notice;
						});
						resultMsg += '</ul></span>';
					} else {
						resultMsg += '</span>';
					}

					alert(resultMsgPlain);
					// TODO: refactor to Vue - maybe this is the way? https://vuejs.org/guide/components/slots.html#slot-content-and-outlet
					// var effActions = postModalActions();
					// appJS.showModal({
					// 	html: '<div class="ws-ajax-result">'+ resultMsg +'</div>',
					// 	closedCallback: function() {
					// 		modalClosedCallback(effActions, success);
					// 	}
					// });
				}
			} else {
				success = false;
				if (['resultOnly', 'resultOnlyQuiet'].indexOf(responseFormat) === -1) {
					var errMsg = '<span class="result-text error-text">'+ texts.textErrorBecause +'</span><br><br><span class="messages error-messages"><ul>';
					var errMsgPlain = texts.textErrorBecause +'\n';
					var count = 0;
					Object.keys(errors).forEach(attribute => {
						if (options.skipNamedErrors.indexOf(attribute) == -1) {
							count++;
							errMsg += '<li>'+ errors[attribute] +'</li>';
							errMsgPlain += '\n - '+ errors[attribute];
						} else {
							console.info('Skipped '+ attribute +' error msg in general alert: '+ errors[attribute]);
						}
					});
					errMsg += '</ul></span>';

					if (count > 0) {
						alert(errMsgPlain);
						// TODO: refactor to Vue
						// var effActions = postModalActions();
						// appJS.showModal({
						// 	html: '<div class="ws-ajax-result">'+ errMsg +'</div>',
						// 	closedCallback: function() {
						// 		modalClosedCallback(effActions, success);
						// 	}
						// });
					}
				}
			}
		}
		return success;
	}

	/**
	 * @param {object} response : With properties `data` (object), `success` (boolean), and `origOptions` (object)
	 * @param {object} inputCss : Object for setting HTML classes regarding valid/invalid input values (a Vue ref)
	 * @param {object} errorContainer : Object for setting error messages into (a Vue ref)
	 * @param {object|null} triggerField : Name of field/attribute that triggerede this validation process, or null/undefined if none
	 */
	static processServerSideFormValidation(response, inputCss, errorContainer, triggerField, options) {
		if (typeof options == 'undefined') options = {};

		options = Object.assign(options, {
			successClass: 'has-success',  //this is a Bootstrap 3 class
			errorClass: 'has-error',  //this is a Bootstrap 3 class
		});

		Object.keys(errorContainer.value).forEach(function(fieldName) {  //clear any previous errors on this field
			if (typeof response.data.errorsItemized[fieldName] == 'undefined') {
				delete errorContainer.value[fieldName];
				delete inputCss.value[fieldName];
			}
		});
		Object.keys(response.data.errorsItemized).forEach(function(fieldName) {  //set new errors
			errorContainer.value[fieldName] = Object.values(response.data.errorsItemized[fieldName]).join(' ');
			inputCss.value[fieldName] = options.errorClass;
		});

		if (triggerField) {
			if (!errorContainer.value[triggerField]) {    // if (response.data.status == 'ok' || typeof response.data.errorsItemized[triggerField] == 'undefined') {
				inputCss.value[triggerField] = options.successClass;
			} else {
				inputCss.value[triggerField] = options.errorClass;
			}
		}
	}

};
