/* eslint-disable */
const _socketTask = new WeakMap()

export default class WebSocket {
  constructor(url, protocols = []) {
    this.binaryType = '' // TODO 更新 binaryType
    this.bufferedAmount = 0 // TODO 更新 bufferedAmount
    this.extensions = ''

    this.onclose = null
    this.onerror = null
    this.onmessage = null
    this.onopen = null

    this.protocol = '' // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
    this.readyState = 3

    if (typeof url !== 'string' || !(/(^ws:\/\/)|(^wss:\/\/)/).test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`)
    }

    this.url = url
    this.readyState = WebSocket.CONNECTING

    const socketTask = swan.connectSocket({
      url,
      protocols: Array.isArray(protocols) ? protocols : [protocols]
    })

    _socketTask.set(this, socketTask)

    socketTask.onClose((res) => {
      this.readyState = WebSocket.CLOSED
      if (typeof this.onclose === 'function') {
        this.onclose(res)
      }
    })

    socketTask.onMessage((res) => {
      if (typeof this.onmessage === 'function') {
        this.onmessage(res)
      }
    })

    socketTask.onOpen(() => {
      this.readyState = WebSocket.OPEN
      if (typeof this.onopen === 'function') {
        this.onopen()
      }
    })

    socketTask.onError((res) => {
      if (typeof this.onerror === 'function') {
        this.onerror(new Error(res.errMsg))
      }
    })

    return this
  }

  close(code, reason) {
    this.readyState = WebSocket.CLOSING
    const socketTask = _socketTask.get(this)

    socketTask.close({
      code,
      reason
    })
  }

  send(data) {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`)
    }

    const socketTask = _socketTask.get(this)

    socketTask.send({
      data
    })
  }
}

WebSocket.CONNECTING = 0 // The connection is not yet open.
WebSocket.OPEN = 1 // The connection is open and ready to communicate.
WebSocket.CLOSING = 2 // The connection is in the process of closing.
WebSocket.CLOSED = 3 // The connection is closed or couldn't be opened.
