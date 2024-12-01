import { assert, expect } from 'chai';
import Core from '../src/Core.js';

describe('Core', function() {

	describe('trim()', function() {
		it('', function() {
			assert.equal(Core.trim('   Hello, World!   '), 'Hello, World!');
			assert.equal(Core.trim(123), 123);
			assert.equal(Core.trim(true), true);
			assert.deepEqual(Core.trim({ key: 'value' }), { key: 'value' });
		});
	});

	describe('ucFirst()', function() {
		it('', function() {
			assert.equal(Core.ucFirst('hello, world'), 'Hello, world');
			assert.equal(Core.ucFirst('Hello, world'), 'Hello, world');
			assert.equal(Core.ucFirst(null), null);
		});
	});

	describe('countWords()', function() {
		it('', function() {
			assert.equal(Core.countWords('   hello, world  '), 2);
			assert.equal(Core.countWords('hello,  world'), 2);
			assert.equal(Core.countWords('hello. How goes?'), 3);
		});
	});

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


	describe('roundDecimals()', function() {
		it('', function() {
			assert.equal(Core.roundDecimals(5.684128, 2), 5.68);
			assert.equal(Core.roundDecimals(5.1, 2), 5.1);
			assert.equal(Core.roundDecimals(5, 2), 5);
			assert.equal(Core.roundDecimals(-5.15874, 2), -5.16);
		});
	});

	describe('numberFormat()', function() {
		it('', function() {
			assert.equal(Core.numberFormat(1234.5678, 2, '.', ''), '1234.57');
			assert.equal(Core.numberFormat(1234.5678, 0, '.', ''), '1235');
			assert.equal(Core.numberFormat(12345654, 2, ',', '.'), '12.345.654,00');
			assert.equal(Core.numberFormat(-1234.5678, 2, '.', ''), '-1234.57');
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

	describe('arraySum()', function() {
		it('', function() {
			assert.deepEqual(Core.arraySum([4, 8, 15]), 27);
		});
	});

	describe('toYaml()', function() {
		it('', function() {
			assert.equal(Core.toYaml({details: {name: 'John', age: 45}}), 'details:\n  name: John\n  age: 45');
			assert.equal(Core.toYaml(null), 'null');
			assert.equal(Core.toYaml(false), 'false');
			assert.equal(Core.toYaml(''), '');
			assert.equal(Core.toYaml('John'), 'John');
			assert.equal(Core.toYaml({details: {name: 'John', age: 45}}, {encloseStrings: true}), 'details:\n  name: "John"\n  age: 45');
			assert.equal(Core.toYaml({details: {name: 'John "Doe" Johnson', age: 45}}, {encloseStrings: true}), 'details:\n  name: John "Doe" Johnson\n  age: 45');
			assert.equal(Core.toYaml([4, 8, 15]), '- 4\n- 8\n- 15');
		});
	});

});
