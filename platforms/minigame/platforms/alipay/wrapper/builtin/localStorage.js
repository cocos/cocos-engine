const localStorage = {
    get length() {
        const { keys } = my.getStorageInfoSync()
        console.log("getStorageInfoSync: " + JSON.stringify(my.getStorageInfoSync()));
        return keys.length
    },

    key(n) {
        const { keys } = my.getStorageInfoSync()

        return keys[n]
    },

    getItem(key) {
        const value = my.getStorageSync({key});
        return value.data === null ? null : value.data;
    },

    setItem(key, value) {
        if (window.asyncStorage) {
            return my.setStorage({
                key: key,
                data: value
            })
        }
        return my.setStorageSync({key, data: value})
    },

    removeItem(key) {
        if (window.asyncStorage) {
            return my.removeStorage({
                key
            })
        }
        return my.removeStorageSync({key})
    },

    clear() {
        if (window.asyncStorage) {
            return my.clearStorage()
        }
        return my.clearStorageSync()
    }
}

export default localStorage
