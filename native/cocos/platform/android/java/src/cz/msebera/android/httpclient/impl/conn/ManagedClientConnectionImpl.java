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
import java.net.InetAddress;
import java.net.Socket;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;

import cz.msebera.android.httpclient.HttpConnectionMetrics;
import cz.msebera.android.httpclient.HttpEntityEnclosingRequest;
import cz.msebera.android.httpclient.HttpException;
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.annotation.NotThreadSafe;
import cz.msebera.android.httpclient.conn.ClientConnectionManager;
import cz.msebera.android.httpclient.conn.ClientConnectionOperator;
import cz.msebera.android.httpclient.conn.ManagedClientConnection;
import cz.msebera.android.httpclient.conn.OperatedClientConnection;
import cz.msebera.android.httpclient.conn.routing.HttpRoute;
import cz.msebera.android.httpclient.conn.routing.RouteTracker;
import cz.msebera.android.httpclient.params.HttpParams;
import cz.msebera.android.httpclient.protocol.HttpContext;
import cz.msebera.android.httpclient.util.Args;
import cz.msebera.android.httpclient.util.Asserts;

/**
 * @since 4.2
 *
 * @deprecated (4.3) use {@link ManagedHttpClientConnectionFactory}.
 */
@Deprecated
@NotThreadSafe
class ManagedClientConnectionImpl implements ManagedClientConnection {

    private final ClientConnectionManager manager;
    private final ClientConnectionOperator operator;
    private volatile HttpPoolEntry poolEntry;
    private volatile boolean reusable;
    private volatile long duration;

    ManagedClientConnectionImpl(
            final ClientConnectionManager manager,
            final ClientConnectionOperator operator,
            final HttpPoolEntry entry) {
        super();
        Args.notNull(manager, "Connection manager");
        Args.notNull(operator, "Connection operator");
        Args.notNull(entry, "HTTP pool entry");
        this.manager = manager;
        this.operator = operator;
        this.poolEntry = entry;
        this.reusable = false;
        this.duration = Long.MAX_VALUE;
    }

    public String getId() {
        return null;
    }

    HttpPoolEntry getPoolEntry() {
        return this.poolEntry;
    }

    HttpPoolEntry detach() {
        final HttpPoolEntry local = this.poolEntry;
        this.poolEntry = null;
        return local;
    }

    public ClientConnectionManager getManager() {
        return this.manager;
    }

    private OperatedClientConnection getConnection() {
        final HttpPoolEntry local = this.poolEntry;
        if (local == null) {
            return null;
        }
        return local.getConnection();
    }

    private OperatedClientConnection ensureConnection() {
        final HttpPoolEntry local = this.poolEntry;
        if (local == null) {
            throw new ConnectionShutdownException();
        }
        return local.getConnection();
    }

    private HttpPoolEntry ensurePoolEntry() {
        final HttpPoolEntry local = this.poolEntry;
        if (local == null) {
            throw new ConnectionShutdownException();
        }
        return local;
    }

    public void close() throws IOException {
        final HttpPoolEntry local = this.poolEntry;
        if (local != null) {
            final OperatedClientConnection conn = local.getConnection();
            local.getTracker().reset();
            conn.close();
        }
    }

    public void shutdown() throws IOException {
        final HttpPoolEntry local = this.poolEntry;
        if (local != null) {
            final OperatedClientConnection conn = local.getConnection();
            local.getTracker().reset();
            conn.shutdown();
        }
    }

    public boolean isOpen() {
        final OperatedClientConnection conn = getConnection();
        if (conn != null) {
            return conn.isOpen();
        } else {
            return false;
        }
    }

    public boolean isStale() {
        final OperatedClientConnection conn = getConnection();
        if (conn != null) {
            return conn.isStale();
        } else {
            return true;
        }
    }

    public void setSocketTimeout(final int timeout) {
        final OperatedClientConnection conn = ensureConnection();
        conn.setSocketTimeout(timeout);
    }

    public int getSocketTimeout() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getSocketTimeout();
    }

    public HttpConnectionMetrics getMetrics() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getMetrics();
    }

    public void flush() throws IOException {
        final OperatedClientConnection conn = ensureConnection();
        conn.flush();
    }

    public boolean isResponseAvailable(final int timeout) throws IOException {
        final OperatedClientConnection conn = ensureConnection();
        return conn.isResponseAvailable(timeout);
    }

    public void receiveResponseEntity(
            final HttpResponse response) throws HttpException, IOException {
        final OperatedClientConnection conn = ensureConnection();
        conn.receiveResponseEntity(response);
    }

    public HttpResponse receiveResponseHeader() throws HttpException, IOException {
        final OperatedClientConnection conn = ensureConnection();
        return conn.receiveResponseHeader();
    }

    public void sendRequestEntity(
            final HttpEntityEnclosingRequest request) throws HttpException, IOException {
        final OperatedClientConnection conn = ensureConnection();
        conn.sendRequestEntity(request);
    }

    public void sendRequestHeader(
            final HttpRequest request) throws HttpException, IOException {
        final OperatedClientConnection conn = ensureConnection();
        conn.sendRequestHeader(request);
    }

    public InetAddress getLocalAddress() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getLocalAddress();
    }

    public int getLocalPort() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getLocalPort();
    }

    public InetAddress getRemoteAddress() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getRemoteAddress();
    }

    public int getRemotePort() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getRemotePort();
    }

    public boolean isSecure() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.isSecure();
    }

    public void bind(final Socket socket) throws IOException {
        throw new UnsupportedOperationException();
    }

    public Socket getSocket() {
        final OperatedClientConnection conn = ensureConnection();
        return conn.getSocket();
    }

    public SSLSession getSSLSession() {
        final OperatedClientConnection conn = ensureConnection();
        SSLSession result = null;
        final Socket sock = conn.getSocket();
        if (sock instanceof SSLSocket) {
            result = ((SSLSocket)sock).getSession();
        }
        return result;
    }

    public Object getAttribute(final String id) {
        final OperatedClientConnection conn = ensureConnection();
        if (conn instanceof HttpContext) {
            return ((HttpContext) conn).getAttribute(id);
        } else {
            return null;
        }
    }

    public Object removeAttribute(final String id) {
        final OperatedClientConnection conn = ensureConnection();
        if (conn instanceof HttpContext) {
            return ((HttpContext) conn).removeAttribute(id);
        } else {
            return null;
        }
    }

    public void setAttribute(final String id, final Object obj) {
        final OperatedClientConnection conn = ensureConnection();
        if (conn instanceof HttpContext) {
            ((HttpContext) conn).setAttribute(id, obj);
        }
    }

    public HttpRoute getRoute() {
        final HttpPoolEntry local = ensurePoolEntry();
        return local.getEffectiveRoute();
    }

    public void open(
            final HttpRoute route,
            final HttpContext context,
            final HttpParams params) throws IOException {
        Args.notNull(route, "Route");
        Args.notNull(params, "HTTP parameters");
        final OperatedClientConnection conn;
        synchronized (this) {
            if (this.poolEntry == null) {
                throw new ConnectionShutdownException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            Asserts.notNull(tracker, "Route tracker");
            Asserts.check(!tracker.isConnected(), "Connection already open");
            conn = this.poolEntry.getConnection();
        }

        final HttpHost proxy  = route.getProxyHost();
        this.operator.openConnection(
                conn,
                (proxy != null) ? proxy : route.getTargetHost(),
                route.getLocalAddress(),
                context, params);

        synchronized (this) {
            if (this.poolEntry == null) {
                throw new InterruptedIOException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            if (proxy == null) {
                tracker.connectTarget(conn.isSecure());
            } else {
                tracker.connectProxy(proxy, conn.isSecure());
            }
        }
    }

    public void tunnelTarget(
            final boolean secure, final HttpParams params) throws IOException {
        Args.notNull(params, "HTTP parameters");
        final HttpHost target;
        final OperatedClientConnection conn;
        synchronized (this) {
            if (this.poolEntry == null) {
                throw new ConnectionShutdownException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            Asserts.notNull(tracker, "Route tracker");
            Asserts.check(tracker.isConnected(), "Connection not open");
            Asserts.check(!tracker.isTunnelled(), "Connection is already tunnelled");
            target = tracker.getTargetHost();
            conn = this.poolEntry.getConnection();
        }

        conn.update(null, target, secure, params);

        synchronized (this) {
            if (this.poolEntry == null) {
                throw new InterruptedIOException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            tracker.tunnelTarget(secure);
        }
    }

    public void tunnelProxy(
            final HttpHost next, final boolean secure, final HttpParams params) throws IOException {
        Args.notNull(next, "Next proxy");
        Args.notNull(params, "HTTP parameters");
        final OperatedClientConnection conn;
        synchronized (this) {
            if (this.poolEntry == null) {
                throw new ConnectionShutdownException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            Asserts.notNull(tracker, "Route tracker");
            Asserts.check(tracker.isConnected(), "Connection not open");
            conn = this.poolEntry.getConnection();
        }

        conn.update(null, next, secure, params);

        synchronized (this) {
            if (this.poolEntry == null) {
                throw new InterruptedIOException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            tracker.tunnelProxy(next, secure);
        }
    }

    public void layerProtocol(
            final HttpContext context, final HttpParams params) throws IOException {
        Args.notNull(params, "HTTP parameters");
        final HttpHost target;
        final OperatedClientConnection conn;
        synchronized (this) {
            if (this.poolEntry == null) {
                throw new ConnectionShutdownException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            Asserts.notNull(tracker, "Route tracker");
            Asserts.check(tracker.isConnected(), "Connection not open");
            Asserts.check(tracker.isTunnelled(), "Protocol layering without a tunnel not supported");
            Asserts.check(!tracker.isLayered(), "Multiple protocol layering not supported");
            target = tracker.getTargetHost();
            conn = this.poolEntry.getConnection();
        }
        this.operator.updateSecureConnection(conn, target, context, params);

        synchronized (this) {
            if (this.poolEntry == null) {
                throw new InterruptedIOException();
            }
            final RouteTracker tracker = this.poolEntry.getTracker();
            tracker.layerProtocol(conn.isSecure());
        }
    }

    public Object getState() {
        final HttpPoolEntry local = ensurePoolEntry();
        return local.getState();
    }

    public void setState(final Object state) {
        final HttpPoolEntry local = ensurePoolEntry();
        local.setState(state);
    }

    public void markReusable() {
        this.reusable = true;
    }

    public void unmarkReusable() {
        this.reusable = false;
    }

    public boolean isMarkedReusable() {
        return this.reusable;
    }

    public void setIdleDuration(final long duration, final TimeUnit unit) {
        if(duration > 0) {
            this.duration = unit.toMillis(duration);
        } else {
            this.duration = -1;
        }
    }

    public void releaseConnection() {
        synchronized (this) {
            if (this.poolEntry == null) {
                return;
            }
            this.manager.releaseConnection(this, this.duration, TimeUnit.MILLISECONDS);
            this.poolEntry = null;
        }
    }

    public void abortConnection() {
        synchronized (this) {
            if (this.poolEntry == null) {
                return;
            }
            this.reusable = false;
            final OperatedClientConnection conn = this.poolEntry.getConnection();
            try {
                conn.shutdown();
            } catch (final IOException ignore) {
            }
            this.manager.releaseConnection(this, this.duration, TimeUnit.MILLISECONDS);
            this.poolEntry = null;
        }
    }

}
