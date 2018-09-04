function _normalize (url) {
  return url
  .replace(/\\/g, '/')
  .replace(/[\/]+/g, '/')
  .replace(/\/\?/g, '?')
  .replace(/\/\#/g, '#')
  .replace(/\:\//g, '://');
}

export default {
  /**
   * @method normalize
   * @param {string} url
   */
  normalize(url) {
    return _normalize(url);
  },

  /**
   * @method join
   */
  join() {
    let joined = [].slice.call(arguments, 0).join('/');
    return _normalize(joined);
  },
};