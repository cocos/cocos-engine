/*
 * ====================================================================
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 * ====================================================================
 *
 * This software consists of voluntary contributions made by many
 * individuals on behalf of the Apache Software Foundation.  For more
 * information on the Apache Software Foundation, please see
 * <http://www.apache.org/>.
 *
 */

package cz.msebera.android.httpclient.impl.conn;

import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpException;
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpResponseFactory;
import cz.msebera.android.httpclient.annotation.NotThreadSafe;
import cz.msebera.android.httpclient.conn.OperatedClientConnection;
import cz.msebera.android.httpclient.conn.ManagedHttpClientConnection;
import cz.msebera.android.httpclient.impl.SocketHttpClientConnection;
import cz.msebera.android.httpclient.io.HttpMessageParser;
import cz.msebera.android.httpclient.io.SessionInputBuffer;
import cz.msebera.android.httpclient.io.SessionOutputBuffer;
import cz.msebera.android.httpclient.params.BasicHttpParams;
import cz.msebera.android.httpclient.params.HttpParams;
import cz.msebera.android.httpclient.params.HttpProtocolParams;
import cz.msebera.android.httpclient.protocol.HttpContext;
import cz.msebera.android.httpclient.util.Args;

/**
 * Default implementation of an operated client connection.
 *
 * @since 4.0
 *
 * @deprecated (4.3) use {@link ManagedHttpClientConnectionFactory}.
 */
@NotThreadSafe // connSecure, targetHost
@Deprecated
public class DefaultClientConnection extends SocketHttpClientConnection
    implements OperatedClientConnection, ManagedHttpClientConnection, HttpContext {

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());
    public HttpClientAndroidLog headerLog = new HttpClientAndroidLog("cz.msebera.android.httpclient.headers");
    public HttpClientAndroidLog wireLog = new HttpClientAndroidLog("cz.msebera.android.httpclient.wire");

    /** The unconnected socket */
    private volatile Socket socket;

    /** The target host of this connection. */
    private HttpHost targetHost;

    /** Whether this connection is secure. */
    private boolean connSecure;

    /** True if this connection was shutdown. */
    private volatile boolean shutdown;

    /** connection specific attributes */
    private final Map<String, Object> attributes;

    public DefaultClientConnection() {
        super();
        this.attributes = new HashMap<String, Object>();
    }

    public String getId() {
        return null;
    }

    public final HttpHost getTargetHost() {
        return this.targetHost;
    }

    public final boolean isSecure() {
        return this.connSecure;
    }

    @Override
    public final Socket getSocket() {
        return this.socket;
    }

    public SSLSession getSSLSession() {
        if (this.socket instanceof SSLSocket) {
            return ((SSLSocket) this.socket).getSession();
        } else {
            return null;
        }
    }

    public void opening(final Socket sock, final HttpHost target) throws IOException {
        assertNotOpen();
        this.socket = sock;
        this.targetHost = target;

        // Check for shutdown after assigning socket, so that
        if (this.shutdown) {
            sock.close(); // allow this to throw...
            // ...but if it doesn't, explicitly throw one ourselves.
            throw new InterruptedIOException("Connection already shutdown");
        }
    }

    public void openCompleted(final boolean secure, final HttpParams params) throws IOException {
        Args.notNull(params, "Parameters");
        assertNotOpen();
        this.connSecure = secure;
        bind(this.socket, params);
    }

    /**
     * Force-closes this connection.
     * If the connection is still in the process of being open (the method
     * {@link #opening opening} was already called but
     * {@link #openCompleted openCompleted} was not), the associated
     * socket that is being connected to a remote address will be closed.
     * That will interrupt a thread that is blocked on connecting
     * the socket.
     * If the connection is not yet open, this will prevent the connection
     * from being opened.
     *
     * @throws IOException      in case of a problem
     */
    @Override
    public void shutdown() throws IOException {
        shutdown = true;
        try {
            super.shutdown();
            if (log.isDebugEnabled()) {
                log.debug("Connection " + this + " shut down");
            }
            final Socket sock = this.socket; // copy volatile attribute
            if (sock != null) {
                sock.close();
            }
        } catch (final IOException ex) {
            log.debug("I/O error shutting down connection", ex);
        }
    }

    @Override
    public void close() throws IOException {
        try {
            super.close();
            if (log.isDebugEnabled()) {
                log.debug("Connection " + this + " closed");
            }
        } catch (final IOException ex) {
            log.debug("I/O error closing connection", ex);
        }
    }

    @Override
    protected SessionInputBuffer createSessionInputBuffer(
            final Socket socket,
            final int buffersize,
            final HttpParams params) throws IOException {
        SessionInputBuffer inbuffer = super.createSessionInputBuffer(
                socket,
                buffersize > 0 ? buffersize : 8192,
                params);
        if (wireLog.isDebugEnabled()) {
            inbuffer = new LoggingSessionInputBuffer(
                    inbuffer,
                    new Wire(wireLog),
                    HttpProtocolParams.getHttpElementCharset(params));
        }
        return inbuffer;
    }

    @Override
    protected SessionOutputBuffer createSessionOutputBuffer(
            final Socket socket,
            final int buffersize,
            final HttpParams params) throws IOException {
        SessionOutputBuffer outbuffer = super.createSessionOutputBuffer(
                socket,
                buffersize > 0 ? buffersize : 8192,
                params);
        if (wireLog.isDebugEnabled()) {
            outbuffer = new LoggingSessionOutputBuffer(
                    outbuffer,
                    new Wire(wireLog),
                    HttpProtocolParams.getHttpElementCharset(params));
        }
        return outbuffer;
    }

    @Override
    protected HttpMessageParser<HttpResponse> createResponseParser(
            final SessionInputBuffer buffer,
            final HttpResponseFactory responseFactory,
            final HttpParams params) {
        // override in derived class to specify a line parser
        return new DefaultHttpResponseParser
            (buffer, null, responseFactory, params);
    }

    public void bind(final Socket socket) throws IOException {
        bind(socket, new BasicHttpParams());
    }

    public void update(final Socket sock, final HttpHost target,
                       final boolean secure, final HttpParams params)
        throws IOException {

        assertOpen();
        Args.notNull(target, "Target host");
        Args.notNull(params, "Parameters");

        if (sock != null) {
            this.socket = sock;
            bind(sock, params);
        }
        targetHost = target;
        connSecure = secure;
    }

    @Override
    public HttpResponse receiveResponseHeader() throws HttpException, IOException {
        final HttpResponse response = super.receiveResponseHeader();
        if (log.isDebugEnabled()) {
            log.debug("Receiving response: " + response.getStatusLine());
        }
        if (headerLog.isDebugEnabled()) {
            headerLog.debug("<< " + response.getStatusLine().toString());
            final Header[] headers = response.getAllHeaders();
            for (final Header header : headers) {
                headerLog.debug("<< " + header.toString());
            }
        }
        return response;
    }

    @Override
    public void sendRequestHeader(final HttpRequest request) throws HttpException, IOException {
        if (log.isDebugEnabled()) {
            log.debug("Sending request: " + request.getRequestLine());
        }
        super.sendRequestHeader(request);
        if (headerLog.isDebugEnabled()) {
            headerLog.debug(">> " + request.getRequestLine().toString());
            final Header[] headers = request.getAllHeaders();
            for (final Header header : headers) {
                headerLog.debug(">> " + header.toString());
            }
        }
    }

    public Object getAttribute(final String id) {
        return this.attributes.get(id);
    }

    public Object removeAttribute(final String id) {
        return this.attributes.remove(id);
    }

    public void setAttribute(final String id, final Object obj) {
        this.attributes.put(id, obj);
    }

}
