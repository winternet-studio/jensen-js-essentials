import { assert, expect } from 'chai';
import Core from '../src/Core.js';

describe('Core', function() {

	describe('isNumeric()', function() {
		it('', function() {
			assert.equal(Core.isNumeric(0), true);
			assert.equal(Core.isNumeric(1), true);
			assert.equal(Core.isNumeric(1.5), true);
			assert.equal(Core.isNumeric('0'), true);
			assert.equal(Core.isNumeric('1'), true);
			assert.equal(Core.isNumeric('1.5'), true);
			assert.equal(Core.isNumeric('1,5'), false);
			assert.equal(Core.isNumeric('a1'), false);
			assert.equal(Core.isNumeric(''), false);
			assert.equal(Core.isNumeric({}), false);
			assert.equal(Core.isNumeric([]), false);
			assert.equal(Core.isNumeric(true), false);
			assert.equal(Core.isNumeric(false), false);
			assert.equal(Core.isNumeric(null), false);
			assert.equal(Core.isNumeric(undefined), false);
		});
	});

	describe('isInteger()', function() {
		it('', function() {
			assert.isTrue(Core.isInteger(0));
			assert.isTrue(Core.isInteger(1));
			assert.isTrue(!Core.isInteger(1.5));
			assert.isTrue(Core.isInteger('0'));
			assert.isTrue(Core.isInteger('1'));
			assert.isTrue(!Core.isInteger('1.5'));
			assert.isTrue(!Core.isInteger('1,5'));
			assert.isTrue(!Core.isInteger('a1'));
			assert.isTrue(!Core.isInteger(''));
			assert.isTrue(!Core.isInteger({}));
			assert.isTrue(!Core.isInteger([]));
			assert.isTrue(!Core.isInteger(true));
			assert.isTrue(!Core.isInteger(false));
			assert.isTrue(!Core.isInteger(null));
			assert.isTrue(!Core.isInteger(undefined));
		});
	});

	describe('arrayColumnSort()', function() {
		it('', function() {
			assert.deepEqual(Core.arrayColumnSort([{name: 'John', age: 25}, {name: 'Denver', age: 40}], 'name'), [{name: 'Denver', age: 40}, {name: 'John', age: 25}]);
			assert.notDeepEqual(Core.arrayColumnSort([{name: 'John', age: 25}, {name: 'Denver', age: 40}], 'name'), [{name: 'John', age: 25}, {name: 'Denver', age: 40}]);
		});
	});

	describe('uniqueArray()', function() {
		it('', function() {
			assert.deepEqual(Core.uniqueArray(['John', 'Michael', 'John', 'Nick']), ['John', 'Michael', 'Nick']);
		});
	});

});
