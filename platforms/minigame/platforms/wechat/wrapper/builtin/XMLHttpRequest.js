import EventTarget from './EventTarget.js'

const _url = new WeakMap()
const _method = new WeakMap()
const _requestHeader = new WeakMap()
const _responseHeader = new WeakMap()
const _requestTask = new WeakMap()

function _triggerEvent(type, ...args) {
  if (typeof this[`on${type}`] === 'function') {
    this[`on${type}`].apply(this, args)
  }
}

function _changeReadyState(readyState) {
  this.readyState = readyState
  _triggerEvent.call(this, 'readystatechange')
}

export default class XMLHttpRequest extends EventTarget {
  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
  static UNSEND = 0
  static OPENED = 1
  static HEADERS_RECEIVED = 2
  static LOADING = 3
  static DONE = 4

  timeout = 0;
  /*
   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
   */
  onabort = null
  onerror = null
  onload = null
  onloadstart = null
  onprogress = null
  ontimeout = null
  onloadend = null

  onreadystatechange = null
  readyState = 0
  response = null
  responseText = null
  responseType = ''
  responseXML = null
  status = 0
  statusText = ''
  upload = {}
  withCredentials = false

  constructor() {
    super();

    _requestHeader.set(this, {
      'content-type': 'application/x-www-form-urlencoded'
    })
    _responseHeader.set(this, {})
  }

  abort() {
    const myRequestTask =  _requestTask.get(this)

    if (myRequestTask) {
      myRequestTask.abort()
    }
  }

  getAllResponseHeaders() {
    const responseHeader = _responseHeader.get(this)

    return Object.keys(responseHeader).map((header) => {
      return `${header}: ${responseHeader[header]}`
    }).join('\n')
  }

  getResponseHeader(header) {
    return _responseHeader.get(this)[header]
  }

  open(method, url/* async, user, password 这几个参数在小程序内不支持*/) {
    _method.set(this, method)
    _url.set(this, url)
    _changeReadyState.call(this, XMLHttpRequest.OPENED)
  }

  overrideMimeType() {
  }

  send(data = '') {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.")
    } else {
      let myRequestTask = wx.request({
        data,
        url: _url.get(this),
        method: _method.get(this),
        header: _requestHeader.get(this),
        dataType: 'other',
        responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
        timeout: this.timeout || undefined,
        success: ({ data, statusCode, header }) => {
          this.status = statusCode
          _responseHeader.set(this, header)
          _triggerEvent.call(this, 'loadstart')
          _changeReadyState.call(this, XMLHttpRequest.HEADERS_RECEIVED)
          _changeReadyState.call(this, XMLHttpRequest.LOADING)

          switch (this.responseType) {
            case 'json':
              this.responseText = data;
              try {
                this.response = JSON.parse(data);
              }
              catch (e) {
                this.response = null;
              }
              break;
            case '':
            case 'text':
              this.responseText = this.response = data;
              break;
            case 'arraybuffer': 
              this.response = data;
              this.responseText = '';
              var bytes = new Uint8Array(data);
              var len = bytes.byteLength;

              for (var i = 0; i < len; i++) {
                this.responseText += String.fromCharCode(bytes[i]);
              }
              break;
            default:
              this.response = null;
          }
          _changeReadyState.call(this, XMLHttpRequest.DONE)
          _triggerEvent.call(this, 'load')
          _triggerEvent.call(this, 'loadend')
        },
        fail: ({ errMsg }) => {
          // TODO 规范错误
          if (errMsg.indexOf('abort') !== -1) {
            _triggerEvent.call(this, 'abort')
          } else if (errMsg.indexOf('timeout') !== -1) {
            _triggerEvent.call(this, 'timeout')
          } else {
            _triggerEvent.call(this, 'error', errMsg)
          }
          _triggerEvent.call(this, 'loadend')
        }
      })

      _requestTask.set(this, myRequestTask);
    }
  }

  setRequestHeader(header, value) {
    const myHeader = _requestHeader.get(this)

    myHeader[header] = value
    _requestHeader.set(this, myHeader)
  }

  addEventListener(type, listener) {
      if (typeof listener === 'function') {
          let _this = this
          let event = { target: _this }
          this['on' + type] = function (event) {
              listener.call(_this, event)
          }
      }
  }
}
