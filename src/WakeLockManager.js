/**
 * Example:
 * ```
 * let wakeLockManager = null;
 * ...
 * wakeLockManager.requestKeepScreenOn();
 * ...
 * wakeLockManager.releaseKeepScreenOn();
 * ...
 * onMounted(() => {
 * 	wakeLockManager = new WakeLockManager();
 *
 *  window.addEventListener('WakeLockManager.logMessage', (ev) => {
 *  	if (ev.detail.type == 'info') return;
 *  	ElementPlus.ElMessage({
 *  		message: ev.detail.message,
 *  		type: 'success',  // 'success' | 'warning' | 'info' | 'error'
 *  	});
 *  });
 * });
 * ```
 */
export default class WakeLockManager {

	constructor() {
		this.wakeLock = null;
		this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
	}

	// Request the wake lock
	async requestKeepScreenOn() {
		if (!('wakeLock' in navigator)) {
			this.logMessage('Wake Lock API not supported in this browser.', 'warn');
			return;
		}

		try {
			if (!this.wakeLock) {
				this.wakeLock = await navigator.wakeLock.request('screen');
				this.logMessage('Wake Lock active');

				this.wakeLock.addEventListener('release', () => {
					this.logMessage('Wake Lock released');
					this.wakeLock = null;
				});

				// Listen to visibility changes
				document.addEventListener('visibilitychange', this.visibilityChangeHandler);
			}
		} catch (err) {
			this.logMessage('Wake Lock request failed:', 'error', err);
		}
	}

	// Release the wake lock
	async releaseKeepScreenOn() {
		if (this.wakeLock) {
			try {
				await this.wakeLock.release();
				this.wakeLock = null;
				this.logMessage('Wake Lock released manually');
				document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
			} catch (err) {
				this.logMessage('Wake Lock release failed:', 'error', err);
			}
		}
	}

	// Handle tab visibility changes
	async handleVisibilityChange() {
		this.logMessage('Wake Lock: visibility change');
		if (document.visibilityState === 'visible' && !this.wakeLock) {
			await this.requestKeepScreenOn();
		}
	}

	logMessage(message, type, err) {
		if (type == 'warn') {
			console.warn(message);
		} else if (type == 'error') {
			console.error(message, err);
		} else {
			console.log(message);
		}

		// For easy debugging on phones/tablets
		const event = new CustomEvent('WakeLockManager.logMessage', {
			detail: { message, type: type ?? 'info', err },
		});
		window.dispatchEvent(event);
	}

}
