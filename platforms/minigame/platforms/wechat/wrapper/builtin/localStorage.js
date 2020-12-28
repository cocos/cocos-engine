const localStorage = {
  get length() {
    const { keys } = wx.getStorageInfoSync()

    return keys.length
  },

  key(n) {
    const { keys } = wx.getStorageInfoSync()

    return keys[n]
  },

  getItem(key) {
    return wx.getStorageSync(key)
  },

  setItem(key, value) {
    return wx.setStorageSync(key, value)
  },

  removeItem(key) {
    wx.removeStorageSync(key)
  },

  clear() {
    wx.clearStorageSync()
  }
}

export default localStorage
