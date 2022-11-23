const _utils = require('../utils');

const MAX_AMOUNT_WEBSOCKET = 1   // The maximum number of WEBSOCKET
let CURR_AMOUNT_WEBSOCKET = 0    // The current number of WEBSOCKET

export default class WebSocket {
  static CONNECTING = 0 // The connection is not yet open.
  static OPEN = 1 // The connection is open and ready to communicate.
  static CLOSING = 2 // The connection is in the process of closing.
  static CLOSED = 3 // The connection is closed or couldn't be opened.

  binaryType = '' // TODO: update binaryType
  bufferedAmount = 0 // TODO: update bufferedAmount
  extensions = ''

  onopen = null
  onmessage = null
  onerror = null
  onclose = null

  _onMessage = null
  _onOpen = null
  _onError = null
  _onClose = null
  _isReduced = false

  protocol = '' // TODO: It is not currently available within the applet, but actually needs to be returned according to the sub-protocol selected by the server
  readyState = 3

  constructor(url, protocols = []) {
    if(this._isMaxCount()){
      console.warn(`Failed to construct 'WebSocket': Only ${CURR_AMOUNT_WEBSOCKET} WebSocket can be created at the same time on TaoBao.`);
      return this;
    }

    if (typeof url !== 'string' || !(/(^ws:\/\/)|(^wss:\/\/)/).test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`)
    }

    this.url = url
    this.readyState = WebSocket.CONNECTING
    this._increaseCount();

    my.connectSocket({
      url,
      fail: function fail(res) {
        this._triggerEvent('error', res)
      }
    })

    this._onOpen = (res) => {
      this.readyState = WebSocket.OPEN
      this._triggerEvent('open')
    }
    my.onSocketOpen(this._onOpen)

    this._onMessage = (res) => {
      if (res && res.data && res.isBuffer) {
        res.data = _utils.base64ToArrayBuffer(res.data)
      }
      this._triggerEvent('message', res)
    }
    my.onSocketMessage(this._onMessage)

    this._onError = (res) => {
      this._triggerEvent('error', res)
      this._decreaseCount();
    }
    my.onSocketError(this._onError)

    this._onClose = (res) => {
      this.readyState = WebSocket.CLOSED
      this._triggerEvent('close')
      this._removeAllSocketListenr()
      this._decreaseCount();
    }
    my.onSocketClose(this._onClose)

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
          data = _utils.arrayBufferToBase64(data)
          isBuffer = true
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
    my.offSocketOpen(this._onOpen)
    my.offSocketMessage(this._onMessage)
    my.offSocketError(this._onError)
    my.offSocketClose(this._onClose)

    this._onOpen = null
    this._onMessage = null
    this._onError = null
    this._onClose = null
  }

  _increaseCount(){
    CURR_AMOUNT_WEBSOCKET += 1
  }

  _decreaseCount(){
    if(!this._isReduced){
      CURR_AMOUNT_WEBSOCKET -= 1
      this._isReduced = true
    }
  }

  _isMaxCount(){
    return CURR_AMOUNT_WEBSOCKET >= MAX_AMOUNT_WEBSOCKET
  }
}
