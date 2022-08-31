if (window.oh) {
    const ohHttp = window.oh.http;
    class XMLHttpRequestAdapter {
        constructor() {
            this._method = "";
            this._url = "";
            this._async = true;
            this._user = null;
            this._password = null;
            this.onreadystatechange = null;
            this._readyState = XMLHttpRequest.UNSENT;
            this._httpRequest = http.createHttp();
            this._responseText = "";

            this._httpRequest.on('headersReceive', (header) => {this._headersReceive(header)});
        }

        open(method, url, ...args) {
            this._method = method;
            this._url = url;
            if (args.length >= 1) {
                this._async = args[0];
            }
            if (args.length >= 2) {
                this._user = args[1];
            }
            if (args.length == 3) {
                this._password = args[2];
            }

            this._readyState = XMLHttpRequest.OPENED;
        }

        send(body) {
            this._httpRequest.request(this._url, (err, data) => {this._requestCallback(err, data)});
        }

        _requestCallback(err, data) {
            if (err) {
                this._readyState = XMLHttpRequest.UNSENT;
            }
            this._readyState = XMLHttpRequest.LOADING;
            this._responseText = data.result;
            if (typeof this.onreadystatechange === 'function') {
                this.onreadystatechange();
            }
        }

        _headersReceive(header) {
            this._readyState = XMLHttpRequest.HEADERS_RECEIVED;
        }
    }

    class XMLHttpRequest {
        constructor() {
            this._xmlHttpRequest = new XMLHttpRequestAdapter();
            this.onreadystatechange = () => {this.onreadystatechange};
        }

        open(method, url, ...args) {
            this._xmlHttpRequest.open(method, url, ...args);
        }

        send(body) {
            this._xmlHttpRequest.send(body);
        }

        onreadystatechange() {

        }
    }

    XMLHttpRequest.UNSENT = 0;
    XMLHttpRequest.OPENED = 1;
    XMLHttpRequest.HEADERS_RECEIVED = 2;
    XMLHttpRequest.LOADING = 3;
    XMLHttpRequest.DONE = 4;

    window.XMLHttpRequest = XMLHttpRequest;
}