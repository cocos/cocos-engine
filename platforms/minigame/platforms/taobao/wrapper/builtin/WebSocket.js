const _utils = require('../utils');

export default class WebSocket {
  static CONNECTING = 0 // The connection is not yet open.
  static OPEN = 1 // The connection is open and ready to communicate.
  static CLOSING = 2 // The connection is in the process of closing.
  static CLOSED = 3 // The connection is closed or couldn't be opened.

  binaryType = '' // TODO 更新 binaryType
  bufferedAmount = 0 // TODO 更新 bufferedAmount
  extensions = ''

  onopen = null
  onmessage = null
  onerror = null
  onclose = null

  _onmessage = null
  _onopen = null
  _onerror = null
  _onclose = null

  protocol = '' // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
  readyState = 3

  constructor(url, protocols = []) {
    if (typeof url !== 'string' || !(/(^ws:\/\/)|(^wss:\/\/)/).test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`)
    }

    this.url = url
    this.readyState = WebSocket.CONNECTING

    my.connectSocket({
      url,
      fail: function fail(res) {
        this._triggerEvent('error', res)
      }
    })

    this._onopen = () => {
      this.readyState = WebSocket.OPEN
      this._triggerEvent('open')
    }
    my.onSocketOpen(this._onopen)

    this._onmessage = (res) => {
      if (res && res.data && res.isBuffer) {
        res.data = _utils.base64ToArrayBuffer(res.data);
      }
      this._triggerEvent('message', res)
    }
    my.onSocketMessage(this._onmessage)

    this._onerror = (res) => {
      this._triggerEvent('error', res)
    }
    my.onSocketError(this._onerror)

    this._onclose = () => {
      this.readyState = WebSocket.CLOSED
      this._triggerEvent('close')
      this._removeAllSocketListenr();
    }
    my.onSocketClose(this._onclose)

    return this
  }

  close() {
    this.readyState = WebSocket.CLOSING
    my.closeSocket()
  }

  send(data) {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`)
    }else{
      var isBuffer = false;
      if (data instanceof ArrayBuffer) {
          data = _utils.arrayBufferToBase64(data);
          isBuffer = true;
      }
  
      my.sendSocketMessage({
          data,
          isBuffer,
          fail: function (res) {
            this._triggerEvent('error', res)
          }
      });
    }
  }

  _triggerEvent(type, ...args) {
    if (typeof this[`on${type}`] === 'function') {
      this[`on${type}`].apply(this, args)
    }
  }

  _removeAllSocketListenr(){
    my.offSocketOpen(this._onopen)
    my.offSocketMessage(this._onmessage)
    my.offSocketError(this._onerror)
    my.offSocketClose(this._onclose)

    this._onopen = null;
    this._onmessage = null;
    this._onerror = null;
    this._onclose = null;
  }
}
