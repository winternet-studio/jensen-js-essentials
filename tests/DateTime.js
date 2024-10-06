import { assert, expect } from 'chai';
import DateTime from '../src/DateTime.js';
import Core from '../src/Core.js';

describe('DateTime', function() {

	describe('toMysqlDateTime()', function() {
		it('', function() {
			assert.equal(DateTime.toMysqlDateTime('5/25/1982', 'mdy/'), '1982-05-25');
			assert.equal(DateTime.toMysqlDateTime('22/4/2020 2:48pm', 'dmy/', 'Hm:'), '2020-04-22 14:48:00');
			assert.equal(DateTime.toMysqlDateTime('22/4/2020 2:48:23pm', 'dmy/', 'Hms:'), '2020-04-22 14:48:23');
		});
	});

	describe('checkDate()', function() {
		it('', function() {
			assert.isTrue( DateTime.checkDate(12, 31, 2000));
			assert.isFalse(DateTime.checkDate(2, 29, 2001));
			assert.isTrue( DateTime.checkDate(2, 29, 2024));
			assert.isTrue( DateTime.checkDate(3, 31, 2008));
			assert.isFalse(DateTime.checkDate(1, 390, 2000));
		});
	});

	describe('timePeriodSingleUnit()', function() {
		it('', function() {
			const result = DateTime.timePeriodSingleUnit({seconds: 5400});
			assert.equal(result.minutes, 90);
			assert.equal(result.hours, 1.5);
			assert.equal(result.generalGuide, '2 hrs');
			assert.equal(result.appropiateUnit, 'hours');
		});
	});

	describe('timeDiffServerClient()', function() {
		it('', function() {
			assert.isTrue(Core.isInteger(DateTime.timeDiffServerClient(1728205488)));
		});
	});

	describe('getTime()', function() {
		it('', function() {
			assert.isTrue(DateTime.getTime() instanceof Date);
		});
	});

	describe('calculateAge()', function() {
		it('', function() {
			assert.equal(DateTime.calculateAge(DateTime.dateToJsDate('2024-05-28', 'ymd-'), 1982, 8, 28), 41);
			assert.isTrue(Core.isInteger(DateTime.calculateAge(null, 1982, 8, 28)));
		});
	});

});
