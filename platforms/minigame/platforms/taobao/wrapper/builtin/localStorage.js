const localStorage = {
  get length() {
    const { keys } = my.getStorageInfoSync()

    return keys.length
  },

  key(n) {
    const { keys } = my.getStorageInfoSync()

    return keys[n]
  },

  getItem(key) {
    let ret =  my.getStorageSync({
      key,
    });
    return ret && ret.data;
  },

  setItem(key, data) {
    return my.setStorageSync({
      key,
      data,
    });
  },

  removeItem(key) {
    my.removeStorageSync(key)
  },

  clear() {
    my.clearStorageSync()
  }
}

export default localStorage
