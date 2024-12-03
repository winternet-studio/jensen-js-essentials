import { assert, expect } from 'chai';
import Http from '../src/Http.js';

describe('Http', function() {

	describe('standardRequest()', function() {
		it('', function(done) {
			// var response = await Http.executeFetch('https://httpbin.org/get');
			// assert.equal(response, 'OK');

			Http.standardRequest('POST', 'https://httpbin.org/post', {
				jsonBody: {firstname: 'John', lastname: 'Doe'},
				postActions: (response) => {
					try {
						assert.equal(response.data.json.firstname, 'John');
						assert.equal(response.data.json.lastname, 'Doe');
						assert.equal(response.data.url, 'https://httpbin.org/post');
						done();
					} catch (err) {
						done(err);
					}
				},
			});
		});
	});

	describe('standardRequest()', function() {
		it('', function(done) {
			Http.standardRequest('POST', 'https://httpbin.org/post', {
				urlencodedBody: {firstname: 'John', lastname: 'Doe'},
				postActions: (response) => {
					try {
						assert.equal(response.data.form.firstname, 'John');
						assert.equal(response.data.form.lastname, 'Doe');
						assert.equal(response.data.url, 'https://httpbin.org/post');
						done();
					} catch (err) {
						done(err);
					}
				},
			});
		});
	});

	describe('standardRequest()', function() {
		it('should call successCallback with postActions object', function(done) {
			Http.standardRequest('GET', 'https://httpbin.org/get', {
				urlencodedBody: {firstname: 'John', lastname: 'Doe'},
				postActions: {
					successCallback: (result) => {
						try {
							assert.equal(result.data.url, 'https://httpbin.org/get?firstname=John&lastname=Doe');
							done();
						} catch (err) {
							done(err);
						}
					},
					errorCallback: (result) => {
						try {
							throw 'Incorrect callback was called';
						} catch (err) {
							done(err);
						}
					},
				},
			});
		});
	});

	/*
	describe('standardRequest() ', function() {
		it('should call successCallback with postActions array', function(done) {
			Http.standardRequest('GET', 'https://httpbin.org/get', {
				urlencodedBody: {firstname: 'John', lastname: 'Doe'},
				postActions: [
					{
						successCallback: (result) => {
							try {
								assert.equal(result.data.url, 'https://httpbin.org/get?firstname=John&lastname=Doe');
								done();
							} catch (err) {
								done(err);
							}
						},
					},
					{
						errorCallback: (result) => {
							try {
								throw 'Incorrect callback was called';
							} catch (err) {
								done(err);
							}
						},
					},
				],
			});
		});
	});
	*/

	describe('standardRequest()', function() {
		it('should call alwaysCallback', function(done) {
			Http.standardRequest('GET', 'https://httpbin.org/get?type=person', {
				urlencodedBody: {firstname: 'John', lastname: 'Doe'},
				postActions: {
					alwaysCallback: (result) => {
						try {
							assert.equal(result.data.url, 'https://httpbin.org/get?type=person&firstname=John&lastname=Doe');
							done();
						} catch (err) {
							done(err);
						}
					},
				},
			});
		});
	});

});
