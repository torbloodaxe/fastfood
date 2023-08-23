import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  /**
   *
   * @param key
   * @param value
   */
  setStorage(key, value) {
    Preferences.set({
      key,
      value,
    });
  }

  /**
   *
   * @param key
   * @returns
   */
  getStorage(key) {
    return Preferences.get({
      key,
    });
  }

  /**
   *
   * @param key
   */
  removeStorage(key) {
    Preferences.remove({
      key,
    });
  }
  /**
   *
   */
  clearStorage() {
    Preferences.clear();
  }
}
