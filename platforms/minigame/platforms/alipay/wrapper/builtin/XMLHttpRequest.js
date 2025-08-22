import EventTarget from "./EventTarget";

let _url = new WeakMap()
let _method = new WeakMap()
let _requestHeader = new WeakMap()
let _responseHeader = new WeakMap()
let _requestTask = new WeakMap()

function _triggerEvent(type, event={}) {
  event.target = event.target || this;
  if (typeof this['on' + type] === 'function') {
    this['on' + type].apply(this, event);
  }
}
  

function _changeReadyState(readyState, event={}) {
    this.readyState = readyState;
    event.readyState = readyState;
    _triggerEvent.call(this, 'readystatechange', event);
}

const UNSEND = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2;
const LOADING = 3;
const DONE = 4;

class XMLHttpRequest extends EventTarget{
    
    constructor() {
        super()
        this.onabort = null;
        this.onerror = null;
        this.onload = null;
        this.onloadstart = null;
        this.onprogress = null;
        this.ontimeout = null;
        this.onloadend = null;

        this.onreadystatechange = null;
        this.readyState = 0;
        this.response = null;
        this.responseText = null;
        this.responseType = '';
        this.dataType = 'string';
        this.responseXML = null;
        this.status = 0;
        this.statusText = '';
        this.upload = {};
        this.withCredentials = false;
        this.timeout = 0;

        _requestHeader.set(this, {
            'content-type': 'application/x-www-form-urlencoded'
        })
        _responseHeader.set(this, {})
    }

    abort() {
        const myRequestTask = _requestTask.get(this);

        if (myRequestTask) {
            myRequestTask.abort();
        }
    }

    getAllResponseHeaders() {
        const responseHeader = _responseHeader.get(this);
  
        return Object.keys(responseHeader).map((header) => {
          return header + ': ' + responseHeader[header];
        }).join('\n');
    }

    /* async, user, password 这几个参数在小程序内不支持*/
    open(method, url) {
        _method.set(this, method)
        _url.set(this, url)
        _changeReadyState.call(this, OPENED);
    }

    overrideMimeType() {}

    send(data = "") {
  
        if (this.readyState !== OPENED) {
          throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
        } else {
          // https://opendocs.alipay.com/mini-game/08uy1c?pathHash=79945623
          var task = my.request({
            data: data,
            url: _url.get(this),
            method: _method.get(this),
            headers: _requestHeader.get(this),
            timeout: this.timeout,
            dataType: this.responseType || 'text',
            success: (res) => {
              var { data, status, headers } = res;
  
              this.status = status;
              _responseHeader.set(this, headers || {});
              _triggerEvent.call(this, 'loadstart');
              _changeReadyState.call(this, HEADERS_RECEIVED);
              _changeReadyState.call(this, LOADING);
  
              this.response = data;
              this.responseText = !this.responseType || this.responseType === 'text' ? data : '';
              _changeReadyState.call(this, DONE);
              _triggerEvent.call(this, 'load');
              _triggerEvent.call(this, 'loadend');
            },

            fail: (res) => {
              var { errorMessage = "", error = -1 } = res;
              if (error === 9) {
                _triggerEvent.call(this, 'abort');
              } else if (errorMessage.includes("超时") || error === 13) {
                _triggerEvent.call(this, 'timeout');
              } else {
                _triggerEvent.call(this, 'error');
              }
              _triggerEvent.call(this, 'loadend');
            }
          });

          _requestTask.set(this, task)
        }
    }

    setRequestHeader(header, value) {
        const myHeader = _requestHeader.get(this);
        myHeader[header] = value;
        _requestHeader.set(this, myHeader);
    } 

    addEventListener(type, listener) {
        if (typeof listener === 'function') {
          this['on' + type] = (event = {}) => {
            event.target = event.target || this;
            listener.call(this, event);
          };
        }
    }

    removeEventListener(type, listener) {
      if(this['on' + type] === listener) {
        this['on' + type] = null;
      }
    }
}

export default XMLHttpRequest;