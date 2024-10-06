import { assert, expect } from 'chai';
import Geography from '../src/Geography.js';

describe('Geography', function() {
	describe('convertCoordinateDecimalToDMS()', function() {
		it('should convert latitude/longitude correctly', function() {
			assert.equal(Geography.convertCoordinateDecimalToDMS(52.8457, 'lat').textual, 'N 52° 50\' 44"');
			assert.equal(Geography.convertCoordinateDecimalToDMS(9.57845, 'lng').textual, 'E 9° 34\' 42"');
		});
	});
});
