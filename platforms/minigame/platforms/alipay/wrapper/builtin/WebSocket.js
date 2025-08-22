import { transformArrayBufferToBase64, base64ToArrayBuffer } from "./utils/util";

const _taskMap = new WeakMap();

class WebSocket {

    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    constructor(url, protocols = []) {
        this.OPEN = WebSocket.OPEN;
        this.CONNECTING = WebSocket.CONNECTING;
        this.CLOSING = WebSocket.CLOSING;
        this.CLOSED = WebSocket.CLOSED;


        this.binaryType = '';
        this.bufferedAmount = 0;
        this.extensions = '';

        this.onclose = null;
        this.onerror = null;
        this.onmessage = null;
        this.onopen = null;

        this.protocol = '';
        this.readyState = this.CLOSED;

        if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
            throw new TypeError(`Failed to construct 'WebSocket': The URL='${url}' is invalid`);
        }

        this.url = url;
        this.readyState = this.CONNECTING;

        var task = my.connectSocket({
            url: url,
            multiple: true,
            protocols: Array.isArray(protocols) ? protocols : [protocols],
            fail: (res) => {
                if (typeof this.onerror === 'function') {
                    this.onerror(new Error(res.errorMessage))
                }
            },
        });
        _taskMap.set(this, task);

        task.onOpen((res) => {
            this.readyState = this.OPEN;
            if (typeof this.onopen === 'function') {
                this.onopen(res)
            }
        });

        task.onError(res => {
            if (typeof this.onerror === 'function') {
                this.onerror(new Error(res.errorMessage))
            }
        });

        task.onMessage(res => {
            if (typeof this.onmessage === 'function') {
                if(res.data) {
                    var data = res.data;
                    if (data.isBuffer) {
                        // 对齐web转成arrayBuffer;
                        data.data = base64ToArrayBuffer(data.data);
                    }
                    this.onmessage(data);
                } else {
                    this.onmessage(null);
                }
              }
        });

        task.onClose((res) => {
            this.readyState = this.CLOSED;
            if (typeof this.onclose === 'function') {
                this.onclose(res);
              }
        })
    }

    send(data) {
        if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
            throw new TypeError('Failed to send message: The data ' + data + ' is invalid');
        }
        let p = {}
        if (data instanceof ArrayBuffer) {
            data = transformArrayBufferToBase64(data);
            p.isBuffer = true;
        }
        p.data = data;
        p.fail = (res) => {
            if (typeof this.onerror === 'function') {
                this.onerror(new Error(res.errorMessage))
            }
        };
        const task = _taskMap.get(this);
        task.send(p);
    }

    close() {
        this.readyState = this.CLOSING;
        const task = _taskMap.get(this);
        task.close();
    }
}

export default WebSocket;