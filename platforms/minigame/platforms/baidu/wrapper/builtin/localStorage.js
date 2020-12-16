/* eslint-disable */
const localStorage = {
    get length() {
        const { keys } = swan.getStorageInfoSync()
        return keys.length
    },

    key(n) {
        const { keys } = swan.getStorageInfoSync()

        return keys[n]
    },

    getItem(key) {
        const value = swan.getStorageSync(key);
        return value === "" ? null : value;
    },

    setItem(key, value) {
        return swan.setStorageSync(key, value)
    },

    removeItem(key) {
        swan.removeStorageSync(key)
    },

    clear() {
        swan.clearStorageSync()
    }
}

export default localStorage
