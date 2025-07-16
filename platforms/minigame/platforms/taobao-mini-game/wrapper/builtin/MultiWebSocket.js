const _utils = require('../utils');

export default class MultiWebSocket {
  static CONNECTING = 0 // The connection is not yet open.
  static OPEN = 1 // The connection is open and ready to communicate.
  static CLOSING = 2 // The connection is in the process of closing.
  static CLOSED = 3 // The connection is closed or couldn't be opened.

  binaryType = '' // TODO: update binaryType
  bufferedAmount = 0 // TODO: update bufferedAmount
  extensions = ''

  onclose = null
  onerror = null
  onmessage = null
  onopen = null

  protocol = '' // TODO: It is not currently available within the applet, but actually needs to be returned according to the sub-protocol selected by the server
  readyState = 3

  constructor(url, protocols = []) {
    if (typeof url !== 'string' || !(/(^ws:\/\/)|(^wss:\/\/)/).test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`)
    }

    this.url = url
    this.readyState = MultiWebSocket.CONNECTING

    const socketTask = my.connectSocket({
      url,
      multiple: true
    })

    this._socketTask = socketTask;

    socketTask.onClose((res) => {
      this.readyState = MultiWebSocket.CLOSED
      if (typeof this.onclose === 'function') {
        this.onclose(res)
      }
    })

    socketTask.onMessage((res) => {
      if (typeof this.onmessage === 'function') {
        if (res && res.data && res.data.data && res.data.isBuffer) {
          res.isBuffer = res.data.isBuffer;
          res.data = _utils.base64ToArrayBuffer(res.data.data);
        }
        this.onmessage(res)
      }
    })

    socketTask.onOpen((res) => {
      this.readyState = MultiWebSocket.OPEN
      if (typeof this.onopen === 'function') {
        this.onopen(res)
      }
    })

    socketTask.onError((res) => {
      if (typeof this.onerror === 'function') {
        this.onerror(new Error(res.errMsg))
      }
    })
  }

  close(code, reason) {
    this.readyState = MultiWebSocket.CLOSING

    this._socketTask.close({
      code,
      reason
    })
  }

  send(data) {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`)
    }
    var isBuffer = false;
    if (data instanceof ArrayBuffer) {
      data = _utils.arrayBufferToBase64(data)
      isBuffer = true
    }

    this._socketTask.send({
      data,
      isBuffer
    })
  }
}