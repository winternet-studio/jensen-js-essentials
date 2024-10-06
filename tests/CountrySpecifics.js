import { assert, expect } from 'chai';
import CountrySpecifics from '../src/CountrySpecifics.js';

describe('CountrySpecifics', function() {

	describe('validateZip()', function() {
		it('', function() {
			assert.isTrue(CountrySpecifics.validateZip('DK', '4690'));

			assert.isTrue(CountrySpecifics.validateZip('US', '85645'));
			assert.isFalse(CountrySpecifics.validateZip('US', '85645-1234'));
			assert.isTrue(CountrySpecifics.validateZip('US', '85645', {allowUSZip4: true}));
			assert.isTrue(CountrySpecifics.validateZip('US', '85645-1234', {allowUSZip4: true}));
			assert.isFalse(CountrySpecifics.validateZip('US', '856454'));
			assert.isFalse(CountrySpecifics.validateZip('US', '8866'));

			assert.isTrue(CountrySpecifics.validateZip('CA', 'V4C 6S3'));
			assert.isTrue(CountrySpecifics.validateZip('CA', 'V4C6S3'));
			assert.isTrue(CountrySpecifics.validateZip('CA', 'V4C-6S3'));
			assert.isTrue(CountrySpecifics.validateZip('CA', 'V4C.6S3'));
			assert.isFalse(CountrySpecifics.validateZip('CA', 'V4C_6S3'));
			assert.isFalse(CountrySpecifics.validateZip('CA', 'V4C56S3'));
			assert.isFalse(CountrySpecifics.validateZip('CA', 'V4CK6S3'));
			assert.equal(CountrySpecifics.validateZip('CA', 'V4C-6S3', {reformat: true}), 'V4C 6S3');
			assert.equal(CountrySpecifics.validateZip('CA', 'V4C.6S3', {reformat: true}), 'V4C 6S3');

			assert.isTrue(CountrySpecifics.validateZip('GB', 'EC1A 1BB'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'W1A 0AX'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'M1 1AE'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'B33 8TH'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'CR2 6XH'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'DN55 1PT'));
			assert.isTrue(CountrySpecifics.validateZip('GB', 'SS143SG'));
			assert.equal(CountrySpecifics.validateZip('GB', 'SS143SG', {reformat: true}), 'SS14 3SG');
			assert.isFalse(CountrySpecifics.validateZip('GB', 'DN55Y1PT'));

			assert.isFalse(CountrySpecifics.validateZip('NL', '1000-AP'));
			assert.equal(CountrySpecifics.validateZip('NL', '1000-AP', {reformat: true}), '1000 AP');
			assert.isTrue(CountrySpecifics.validateZip('NL', '1000 AP'));
			assert.isTrue(CountrySpecifics.validateZip('NL', '1000AP'));

			assert.isTrue(CountrySpecifics.validateZip('BR', '02649010'));
			assert.equal(CountrySpecifics.validateZip('BR', '02649010', {reformat: true}), '02649-010');
			assert.isTrue(CountrySpecifics.validateZip('BR', '02649-010'));
			assert.isTrue(CountrySpecifics.validateZip('BR', '13.840-000'));
			assert.isFalse(CountrySpecifics.validateZip('BR', '0055'));

			assert.isTrue(CountrySpecifics.validateZip('KR', '026-490'));
			assert.isTrue(CountrySpecifics.validateZip('KR', '026010'));
			assert.equal(CountrySpecifics.validateZip('KR', '026010', {reformat: true}), '026-010');
		});
	});

	describe('minimumPhoneNumDigits()', function() {
		it('', function() {
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('US'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits(1), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('1'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('CA'), 10);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('DK'), 8);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits(45), 8);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('BJ'), 5);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits('45'), 8);
			assert.equal(CountrySpecifics.minimumPhoneNumDigits(229), 5);
		});
	});

});
