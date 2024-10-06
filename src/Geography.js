/**
 * Geography tools
 *
 * Calculations with latitude/longitude etc.
 */
export default class DateTime {

	/**
	 * Calculate the bearing of a rhumb-line (straight line on map)
	 *
	 * In degrees, from starting Point A to remote Point B. The bearing for a rhumb-line is constant all the way.
	 *
	 * Source: http://webcache.googleusercontent.com/search?q=cache:o-7HcMkYfh0J:https://www.dougv.com/2009/07/13/calculating-the-bearing-and-compass-rose-direction-between-two-latitude-longitude-coordinates-in-php/+&cd=2&hl=no&ct=clnk
	 *
	 * @param {number} lat1 : Latitude of Point A
	 * @param {number} lng1 : Longitude of Point A
	 * @param {number} lat2 : Latitude of Point B
	 * @param {number} lng2 : Longitude of Point B
	 * @return {number} : The bearing
	 */
	static bearingRhumbline(lat1, lng1, lat2, lng2) {
		// Difference in longitudinal coordinates
		dLon = this.deg2rad(lng2) - this.deg2rad(lng1);

		// Difference in the phi of latitudinal coordinates
		dPhi = Math.log(Math.tan(this.deg2rad(lat2) / 2 + Math.PI / 4) / Math.tan(this.deg2rad(lat1) / 2 + Math.PI / 4));

		// We need to recalculate dLon if it is greater than pi
		if (Math.abs(dLon) > Math.PI) {
			if (dLon > 0) {
				dLon = (2 * Math.PI - dLon) * -1;
			} else {
				dLon = 2 * Math.PI + dLon;
			}
		}

		// Return the angle, normalized
		return (this.rad2deg(Math.atan2(dLon, dPhi)) + 360) % 360;
	}

	/**
	 * Calculate the point (latitude/longitude) given a point of origin, a bearing, and a distance
	 *
	 * Source: http://www.etechpulse.com/2014/02/calculate-latitude-and-longitude-based.html
	 *
	 * @param {number} latitude
	 * @param {number} longitude
	 * @param {number} angle : Bearing in degrees (0-360)
	 * @param {number} distanceKm : Distance from the point in kilometers
	 * @return {Array} : First entry is the new latitude, second entry the new longitude. Example: `[60.6793281, 8.6953779]`
	 */
	static pointFromBearingDistance(latitude, longitude, angle, distanceKm) {
		newLatLng = [];
		distanceKm = distanceKm / 6371;
		angle = this.deg2rad(angle);

		lat1 = this.deg2rad(latitude);
		lng1 = this.deg2rad(longitude);

		newLat = Math.asin(Math.sin(lat1) * Math.cos(distanceKm) +
					  Math.cos(lat1) * Math.sin(distanceKm) * Math.cos(angle));

		newLng = lng1 + Math.atan2(Math.sin(angle) * Math.sin(distanceKm) * Math.cos(lat1),
							  Math.cos(distanceKm) - Math.sin(lat1) * Math.sin(newLat));

		if (isNaN(newLat) || isNaN(newLng)) {
			return null;
		}

		newLatLng[0] = this.rad2deg(newLat);
		newLatLng[1] = this.rad2deg(newLng);

		return newLatLng;
	}
	static deg2rad(input) {  //equivalent to PHP deg2rad()
		return input * Math.PI / 180;
	}
	static rad2deg(input) {  //equivalent to PHP rad2deg()
		return input * 180 / Math.PI;
	}

	/**
	 * Convert a latitude or longitude from Decimal Degrees to Degrees Minutes Seconds
	 *
	 * Eg. 55.68052, 12.56223  ===>  {degrees: 55, minutes: 40, seconds: 49, direction: 'N'}, {degrees: 12, minutes: 33, seconds: 44, direction: 'E'}
	 * To be shown eg. as `N 55° 40' 49.872", E 12° 33' 44.028"`
	 *
	 * @param {float} coordinate : The decimal degrees, eg. `59.7682642` or `-122.4726193`
	 * @param {string} type : Whether the decimal degrees is for a latitude or longitude: `lat` or `lng`
	 * @return {array} : Array with keys `degrees`, `minutes`, `seconds`, `direction`
	 */
	static convertCoordinateDecimalToDMS(coordinate, type) {
		var absolute = Math.abs(coordinate);
		var degrees = Math.floor(absolute);
		var minutesNotTruncated = (absolute - degrees) * 60;
		var minutes = Math.floor(minutesNotTruncated);
		var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

		var cardinalDirection;
		if (type == 'lat') {
			cardinalDirection = coordinate >= 0 ? 'N' : 'S';
		} else {
			cardinalDirection = coordinate >= 0 ? 'E' : 'W';
		}

		return {
			degrees: degrees,
			minutes: minutes,
			seconds: seconds,
			direction: cardinalDirection,
			textual: ''+ cardinalDirection +' '+ degrees +'° '+ minutes +"' "+ seconds +'"',
		}
	}

	static convertCoordinateDMSToDecimal(degrees, minutes, seconds, direction) {  //source: https://stackoverflow.com/a/1140335/2404541
		var dd = degrees + minutes/60 + seconds/(60*60);

		if (direction == 'S' || direction == 'W') {
			dd = dd * -1;
		} // Don't do anything for N or E
		return dd;
	}

}
