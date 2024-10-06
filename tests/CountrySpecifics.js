import { assert, expect } from 'chai';
import CountrySpecifics from '../src/CountrySpecifics.js';

describe('CountrySpecifics', function() {

	describe('minimumPhoneNumDigits()', function() {
		it('', function() {
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('US'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits(1), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('1'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('CA'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('DK'), 8);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits(45), 8);
		});
	});

});
