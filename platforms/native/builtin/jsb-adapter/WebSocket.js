if (window.oh) {
    const ohWebSocket = window.oh.WebSocket;
    class WebSocket {
        constructor(url, ...args) {
            this.readyState = WebSocket.CLOSED;
            this.binaryType = "";

            this._url = url;
            this._instance = ohWebSocket.createWebSocket();
            if (args.length >= 1) {
                this._proto = args[0];
            }

            this._instance.on('close', this.innerClose);
            this._instance.on('error', this.innerError);
            this._instance.on('message', this.innerMessage);
            this._instance.on('open', this.innerOpen);

            this.connect();
        }

        connect() {
            this.readyState = WebSocket.CONNECTING;
            this._instance.connect(this._url, (err, value) => {
                if (err) {
                    this.onerror(err);
                } else {
                    this.readyState = WebSocket.OPEN;  
                }
            });
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

        //origin event
        onclose(evt) { }

        onerror(evt) { }

        onmessage(evt) { }

        onopen(evt) { }

        //methed
        send(data) {
            this._instance.send(data, (err, value) => {
                if (err) {
                    this.onerror(err);
                }
            });
        }

        close(...args) {
            this.readyState = WebSocket.CLOSING;
            this._instance.close((err, value) => {
                if (err) {
                    this.onerror(err);
                } else {
                    this.readyState = WebSocket.CLOSED;
                }
            });
        }
    }

    //Constant
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;

    window.WebSocket = WebSocket;

}