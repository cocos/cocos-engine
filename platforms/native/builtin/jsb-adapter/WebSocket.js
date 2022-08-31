if (window.oh) {
    const ohWebSocket = window.oh.WebSocket;

    class WebSocketAdapter {
        constructor(url, ...args) {
            this.readyState = WebSocket.CLOSED;
            this.binaryType = "";

            this._url = url;
            this._instance = ohWebSocket.createWebSocket();
            if (args.length >= 1) {
                this._proto = args[0];
            }

            this._instance.on('close', this.innerClose.bind(this));
            this._instance.on('error', this.innerError.bind(this));
            this._instance.on('message', this.innerMessage.bind(this));
            this._instance.on('open', this.innerOpen.bind(this));

            this.connect();
        }

        connect() {
            this.readyState = WebSocket.CONNECTING;
            var callback = function(err, value) {
                if (err) {
                    this.onerror(err);
                } else {
                    this.readyState = WebSocket.OPEN;  
                }
            };
            var bindCallback = callback.bind(this);
            this._instance.connect(this._url, bindCallback);
        }

        //
        innerClose(err, value) {
            if (this.onclose) {
                this.onclose(err);
            }
        }

        innerError(err, value) {
            if (this.onerror) {
                this.onerror(err);
            }
        }

        innerMessage(err, value) {
            if (this.onmessage) {
                let evt = {};
                evt.data = value;
                this.onmessage(evt);
            }
        }

        innerOpen(err, value) {
            if (this.onopen) {
                this.onopen(err);
            }
        }

        //methed
        send(data) {
            var callback = function(err, value) {
                if (err) {
                    this.onerror(err);
                }
            }
            var bindCallback = callback.bind(this);
            this._instance.send(data, bindCallback);
        }

        close(...args) {
            this.readyState = WebSocket.CLOSING;
            this._instance.close.bind(this)((err, value) => {
                if (err) {
                    this.onerror(err);
                } else {
                    this.readyState = WebSocket.CLOSED;
                }
            });
        }

    }
    class WebSocket {
        constructor(url, ...args) {
            this._websocketAdapter = new WebSocketAdapter(url, args);
            this._websocketAdapter.onopen = (function(evt) {this.onopen(evt)}).bind(this);
            this._websocketAdapter.onerror = (function(evt) {this.onerror(evt)}).bind(this);
            this._websocketAdapter.onmessage = (function(evt) {this.onmessage(evt)}).bind(this);
            this._websocketAdapter.onclose = (function(evt) {this.onclose(evt)}).bind(this);
        }


        //origin event
        onclose(evt) { }

        onerror(evt) { }

        onmessage(evt) { }

        onopen(evt) { }

        //prop
        get readyState() {
            return this._websocketAdapter.readyState;
        }

        get binaryType() {
            return this._websocketAdapter.binaryType;
        }

        set binaryType(binaryType) {
            this._websocketAdapter.binaryType = binaryType;
        }

        //methed
        send(data) {
            this._websocketAdapter.send(data);
        }

        close(...args) {
            this._websocketAdapter.close(...args);
        }
    }

    //Constant
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;

    window.WebSocket = WebSocket;

}