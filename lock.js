'use strict';
/* globals Time */

var Lock = class {
  static tryLock() {
		if (!LockService.getScriptLock().tryLock(Time.kMilisecondsInSecond)) {
			console.warn('Failed to aquire lock');
			return false;
		}
		console.log('Lock aquired');
		return true;
	}
	
	// Attempts to acquire the lock, timing out with an exception after 5 minutes.
	static waitLock() {
		if (!LockService.getScriptLock().tryLock(5 * Time.kMilisecondsInMinute)) {
			console.error('Failed to aquire lock');
			throw Error('Failed to aquire lock');
		}
		console.log('Lock aquired');
	}
	
	static releaseLock() {
		console.log('Releasing Lock');
		LockService.getScriptLock().releaseLock();
	}		
};
