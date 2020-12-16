const localStorage = {
  get length() {
    const { keys } = tt.getStorageInfoSync()

    return keys.length
  },

  key(n) {
    const { keys } = tt.getStorageInfoSync()

    return keys[n]
  },

  getItem(key) {
    return tt.getStorageSync(key)
  },

  setItem(key, value) {
    return tt.setStorageSync(key, value)
  },

  removeItem(key) {
    tt.removeStorageSync(key)
  },

  clear() {
    tt.clearStorageSync()
  }
}

export default localStorage
