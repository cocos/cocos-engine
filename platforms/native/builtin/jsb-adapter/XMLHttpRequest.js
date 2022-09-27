
let httpStatusCodeMap = {
    "100" : "Continue",
    "101" : "Switching Protocols",
    "102" : "Processing",
    "200" : "OK",
    "201" : "Created",
    "202" : "Accepted",
    "203" : "Non-authoritative Information",
    "204" : "No Content",
    "205" : "Reset Content",
    "206" : "Partial Content",
    "207" : "Multi-Status",
    "208" : "Already Reported",
    "226" : "IM Used",
    "300" : "Multiple Choices",
    "301" : "Moved Permanently",
    "302" : "Found",
    "303" : "See Other",
    "304" : "Not Modified",
    "305" : "Use Proxy",
    "307" : "Temporary Redirect",
    "308" : "Permanent Redirect",
    "400" : "Bad Request",
    "401" : "Unauthorized",
    "402" : "Payment Required",
    "403" : "Forbidden",
    "404" : "Not Found",
    "405" : "Method Not Allowed",
    "406" : "Not Acceptable",
    "407" : "Proxy Authentication Required",
    "408" : "Request Timeout",
    "409" : "Conflict",
    "410" : "Gone",
    "411" : "Length Required",
    "412" : "Precondition Failed",
    "413" : "Payload Too Large",
    "414" : "Request-URI Too Long",
    "415" : "Unsupported Media Type",
    "416" : "Requested Range Not Satisfiable",
    "417" : "Expectation Failed",
    "418" : "I'm a teapot",
    "421" : "Misdirected Request",
    "422" : "Unprocessable Entity",
    "423" : "Locked",
    "424" : "Failed Dependency",
    "426" : "Upgrade Required",
    "428" : "Precondition Required",
    "429" : "Too Many Requests",
    "431" : "Request Header Fields Too Large",
    "444" : "Connection Closed Without Response",
    "451" : "Unavailable For Legal Reasons",
    "499" : "Client Closed Request",
    "500" : "Internal Server Error",
    "501" : "Not Implemented",
    "502" : "Bad Gateway",
    "503" : "Service Unavailable",
    "504" : "Gateway Timeout",
    "505" : "HTTP Version Not Supported",
    "506" : "Variant Also Negotiates",
    "507" : "Insufficient Storage",
    "508" : "Loop Detected",
    "510" : "Not Extended",
    "511" : "Network Authentication Required",
    "599" : "Network Connect Timeout Error"};

if (window.oh) {
    const ohHttp = window.oh.http;
    const defaultTimeOut = 60000; //ms
    class XMLHttpRequestAdapter {
        constructor() {
            this._method = "";
            this._url = "";
            this._recvDataText = "";
            this._async = true;
            this._user = null;
            this._password = null;
            this._responseType = "";
            this.onreadystatechange = function(){};
            this.onload = function(){};
            this.onerror = function(){};
            this.onprogress = function(evt){};
            this._readyState = XMLHttpRequest.UNSENT;
            this._httpRequest = ohHttp.createHttp();
            this._timeout = defaultTimeOut;
            this.initStatus();
            this._httpRequest.on('headersReceive', (function(header) {this._headersReceive(header)}).bind(this));
        }

        initStatus() {
            this._responseText = ""; //old version
            this._response = "";
            this._requestHeader = {};
            this._status = 0;
            this._statusText = "";
            this._contentLength = -1;
            this._recvLength = 0;
            this._recvDataText = "";
            this._responseType = "";
            this._headers = {};
            this._isAborted = false;
        }

        open(method, url, ...args) {
            if (this._readyState != XMLHttpRequest.UNSENT) {
                return;
            }
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
            this.initStatus();
            this._readyState = XMLHttpRequest.OPENED;
        }

        send(body) {
            var options = {};
            if (this._method == "GET") {
                options = {header : this._requestHeader, method : ohHttp.RequestMethod.GET};
            } else if (this._method == "POST") {
                options = {header : this._requestHeader, method : ohHttp.RequestMethod.POST, extraData : {"data" : body}};
            }
            options['connectTimeout'] = this._timeout;
            options['readTimeout'] = this._timeout;

            this._httpRequest.request(this._url, options, (err, data) => {this._requestCallback(err, data)});
        }

        abort() {
            this._httpRequest.destroy();
            this._readyState = XMLHttpRequest.DONE;
            this._isAborted = true;
        }

        setRequestHeader(header, value) {
            if (header in this._requestHeader) {
                this._requestHeader[header] += (', ' + value);
            } else {
                this._requestHeader[header] = value;
            }
        }

        _onload() {
            if (this._responseType == 'json') {
                try {
                    this._response = JSON.parse(this._recvDataText);
                } catch(e) {
                    this._response = this._recvDataText;
                    this._responseText = this._recvDataText;
                }
            } else {
                this._response = this._recvDataText;
                this._responseText = this._recvDataText;
            }
            this.onload();
        }
        _requestCallback(err, data) {
            if (data && data.responseCode) {
                this._status = data.responseCode;
                if (data.responseCode in httpStatusCodeMap) {
                    this._statusText = httpStatusCodeMap[data.responseCode];
                }
            }
            if (err) {
                this._readyState = XMLHttpRequest.UNSENT;
                this.onerror();
                return;
            }
            this._recvDataText += data.result;

            let callLoaded = false;
            if (this._recvLength == 0) {
                this._readyState = XMLHttpRequest.LOADING;
                callLoaded = true;
            }
            this._recvLength += parseInt(data.header['content-length']);
            if (!this._recvLength) {
                this._recvLength = data.result.length;
            }

            let event = {loaded:this._recvLength};
            if (this._contentLength && (this._contentLength >0)) {
                event['total'] = this._contentLength;
                event['lengthComputable'] = true;
            }
            this.onprogress(event);

            //first call when loading
            if (callLoaded) {
                this.onreadystatechange();
            }

            if (!this._contentLength || this._recvLength == this._contentLength) {
                this._readyState = XMLHttpRequest.DONE;
                this.onreadystatechange();
                this._onload();
            }
            }

        _headersReceive(header) {
            this._readyState = XMLHttpRequest.HEADERS_RECEIVED;
            this._contentLength = parseInt(header['content-length']);

            if (header instanceof Object) {
                for (const [key, value] of Object.entries(header)) {
                    this._headers[key] = value;
                }
            }
            this.onreadystatechange();
        }

        getResponseHeader(name) {
            if (name in this._headers) {
                return this._headers[name];
            }
            return "";
        }

        getAllResponseHeaders() {
            var responseHeaderText = "";
            if (this._headers instanceof Object) {
                for (const [key, value] of Object.entries(header)) {
                    responseHeaderText += ([key, value].join(': '));
                    responseHeaderText += '\r\n';
                }
            }
            return  responseHeaderText;
        }
    }

    class XMLHttpRequest {
        constructor() {
            this._xmlHttpRequest = new XMLHttpRequestAdapter();
            this._xmlHttpRequest.onreadystatechange = (function() {this.onreadystatechange()}).bind(this);
            this._xmlHttpRequest.onload = (function() {this.onload()}).bind(this);
            this._xmlHttpRequest.onprogress = (function(evt) {this.onprogress(evt)}).bind(this);
        }

        open(method, url, ...args) {
            this._xmlHttpRequest.open(method, url, ...args);
        }

        send(body) {
            this._xmlHttpRequest.send(body);
        }

        abort() {
            this._xmlHttpRequest.abort();
        }

        setRequestHeader(header, value) {
            this._xmlHttpRequest.setRequestHeader(header, value);
        }

        getAllResponseHeaders() {
            this._xmlHttpRequest.getAllResponseHeaders();
        }

        getResponseHeader(name) {
            this._xmlHttpRequest.getResponseHeader(name);
        }

        onreadystatechange() {
        }

        onload() {}

        onprogress() {}

        get responseText() {
            return this._xmlHttpRequest._responseText;
        }

        get response() {
            return this._xmlHttpRequest._response;
        }

        get readyState() {
            return this._xmlHttpRequest._readyState;
        }

        get status() {
            return this._xmlHttpRequest._status;
        }

        set responseType(t) {
            return this._xmlHttpRequest._responseType = t;
        }

        get timeout() {
            return this._xmlHttpRequest.timeout;
        }

        set timeout(t) {
            this._xmlHttpRequest.timeout = t;
        }
    }

    XMLHttpRequest.UNSENT = 0;
    XMLHttpRequest.OPENED = 1;
    XMLHttpRequest.HEADERS_RECEIVED = 2;
    XMLHttpRequest.LOADING = 3;
    XMLHttpRequest.DONE = 4;

    window.XMLHttpRequest = XMLHttpRequest;
}