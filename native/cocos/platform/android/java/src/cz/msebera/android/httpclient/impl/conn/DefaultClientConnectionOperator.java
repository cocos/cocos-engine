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
import java.net.ConnectException;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.annotation.ThreadSafe;
import cz.msebera.android.httpclient.client.protocol.ClientContext;
import cz.msebera.android.httpclient.conn.ClientConnectionOperator;
import cz.msebera.android.httpclient.conn.ConnectTimeoutException;
import cz.msebera.android.httpclient.conn.DnsResolver;
import cz.msebera.android.httpclient.conn.HttpInetSocketAddress;
import cz.msebera.android.httpclient.conn.OperatedClientConnection;
import cz.msebera.android.httpclient.conn.scheme.Scheme;
import cz.msebera.android.httpclient.conn.scheme.SchemeLayeredSocketFactory;
import cz.msebera.android.httpclient.conn.scheme.SchemeRegistry;
import cz.msebera.android.httpclient.conn.scheme.SchemeSocketFactory;
import cz.msebera.android.httpclient.params.HttpConnectionParams;
import cz.msebera.android.httpclient.params.HttpParams;
import cz.msebera.android.httpclient.protocol.HttpContext;
import cz.msebera.android.httpclient.util.Args;
import cz.msebera.android.httpclient.util.Asserts;

/**
 * Default implementation of a {@link ClientConnectionOperator}. It uses a {@link SchemeRegistry}
 * to look up {@link SchemeSocketFactory} objects.
 * <p>
 * This connection operator is multihome network aware and will attempt to retry failed connects
 * against all known IP addresses sequentially until the connect is successful or all known
 * addresses fail to respond. Please note the same
 * {@link cz.msebera.android.httpclient.params.CoreConnectionPNames#CONNECTION_TIMEOUT} value will be used
 * for each connection attempt, so in the worst case the total elapsed time before timeout
 * can be {@code CONNECTION_TIMEOUT * n} where {@code n} is the number of IP addresses
 * of the given host. One can disable multihome support by overriding
 * the {@link #resolveHostname(String)} method and returning only one IP address for the given
 * host name.
 * <p>
 * The following parameters can be used to customize the behavior of this
 * class:
 * <ul>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreProtocolPNames#HTTP_ELEMENT_CHARSET}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#SO_TIMEOUT}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#SO_LINGER}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#SO_REUSEADDR}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#TCP_NODELAY}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#SOCKET_BUFFER_SIZE}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#CONNECTION_TIMEOUT}</li>
 *  <li>{@link cz.msebera.android.httpclient.params.CoreConnectionPNames#MAX_LINE_LENGTH}</li>
 * </ul>
 *
 * @since 4.0
 *
 * @deprecated (4.3) use {@link PoolingHttpClientConnectionManager}.
 */
@Deprecated
@ThreadSafe
public class DefaultClientConnectionOperator implements ClientConnectionOperator {

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());

    /** The scheme registry for looking up socket factories. */
    protected final SchemeRegistry schemeRegistry; // @ThreadSafe

    /** the custom-configured DNS lookup mechanism. */
    protected final DnsResolver dnsResolver;

    /**
     * Creates a new client connection operator for the given scheme registry.
     *
     * @param schemes   the scheme registry
     *
     * @since 4.2
     */
    public DefaultClientConnectionOperator(final SchemeRegistry schemes) {
        Args.notNull(schemes, "Scheme registry");
        this.schemeRegistry = schemes;
        this.dnsResolver = SystemDefaultDnsResolver.INSTANCE;
    }

    /**
    * Creates a new client connection operator for the given scheme registry
    * and the given custom DNS lookup mechanism.
    *
    * @param schemes
    *            the scheme registry
    * @param dnsResolver
    *            the custom DNS lookup mechanism
    */
    public DefaultClientConnectionOperator(final SchemeRegistry schemes,final DnsResolver dnsResolver) {
        Args.notNull(schemes, "Scheme registry");

        Args.notNull(dnsResolver, "DNS resolver");

        this.schemeRegistry = schemes;
        this.dnsResolver = dnsResolver;
    }

    public OperatedClientConnection createConnection() {
        return new DefaultClientConnection();
    }

    private SchemeRegistry getSchemeRegistry(final HttpContext context) {
        SchemeRegistry reg = (SchemeRegistry) context.getAttribute(
                ClientContext.SCHEME_REGISTRY);
        if (reg == null) {
            reg = this.schemeRegistry;
        }
        return reg;
    }

    /**
     * Collect ipv6 addresses from all network interfaces.
     *
     * Return the first item in the collection.
     */
    private Inet6Address getIPV6AddressLocal() throws SocketException {
        Enumeration<NetworkInterface> list = NetworkInterface.getNetworkInterfaces();
        List<Inet6Address> result = new ArrayList<>();
        while (list.hasMoreElements()) {
            NetworkInterface element = list.nextElement();
            if(element.isLoopback() || element.getName().startsWith("dummy") || !element.isUp()) {
                continue;
            }

            Enumeration<InetAddress> addresses = element.getInetAddresses();
            while(addresses.hasMoreElements()) {
                InetAddress addr = addresses.nextElement();
                if(addr instanceof Inet6Address && !addr.isLoopbackAddress() && addr.isLinkLocalAddress()) {
                    result.add((Inet6Address)addr);
                }
            }
        }
        //return first Inet6Address in list
        return result.size() > 0 ? result.get(0) : null;
    }

    public void openConnection(
            final OperatedClientConnection conn,
            final HttpHost target,
            final InetAddress local,
            final HttpContext context,
            final HttpParams params) throws IOException {
        Args.notNull(conn, "Connection");
        Args.notNull(target, "Target host");
        Args.notNull(params, "HTTP parameters");
        Asserts.check(!conn.isOpen(), "Connection must not be open");

        final SchemeRegistry registry = getSchemeRegistry(context);
        final Scheme schm = registry.getScheme(target.getSchemeName());
        final SchemeSocketFactory sf = schm.getSchemeSocketFactory();

        final InetAddress[] addresses = resolveHostname(target.getHostName());
        final int port = schm.resolvePort(target.getPort());
        for (int i = 0; i < addresses.length; i++) {
            final InetAddress address = addresses[i];
            final boolean last = i == addresses.length - 1;

            Socket sock = sf.createSocket(params);
            conn.opening(sock, target);

            final InetSocketAddress remoteAddress = new HttpInetSocketAddress(target, address, port);
            InetSocketAddress localAddress = null;
            if (local != null) {
                localAddress = new InetSocketAddress(local, 0);
            }

            // bind local IPV6 address
            if(localAddress == null && address instanceof Inet6Address) {
                Inet6Address localAddrIPV6 = getIPV6AddressLocal();
                localAddress = new InetSocketAddress(localAddrIPV6, 0);
            }

            if (this.log.isDebugEnabled()) {
                this.log.debug("Connecting to " + remoteAddress);
            }
            try {
                final Socket connsock = sf.connectSocket(sock, remoteAddress, localAddress, params);
                if (sock != connsock) {
                    sock = connsock;
                    conn.opening(sock, target);
                }
                prepareSocket(sock, context, params);
                conn.openCompleted(sf.isSecure(sock), params);
                return;
            } catch (final ConnectException ex) {
                if (last) {
                    throw ex;
                }
            } catch (final ConnectTimeoutException ex) {
                if (last) {
                    throw ex;
                }
            }
            if (this.log.isDebugEnabled()) {
                this.log.debug("Connect to " + remoteAddress + " timed out. " +
                        "Connection will be retried using another IP address");
            }
        }
    }

    public void updateSecureConnection(
            final OperatedClientConnection conn,
            final HttpHost target,
            final HttpContext context,
            final HttpParams params) throws IOException {
        Args.notNull(conn, "Connection");
        Args.notNull(target, "Target host");
        Args.notNull(params, "Parameters");
        Asserts.check(conn.isOpen(), "Connection must be open");

        final SchemeRegistry registry = getSchemeRegistry(context);
        final Scheme schm = registry.getScheme(target.getSchemeName());
        Asserts.check(schm.getSchemeSocketFactory() instanceof SchemeLayeredSocketFactory,
            "Socket factory must implement SchemeLayeredSocketFactory");
        final SchemeLayeredSocketFactory lsf = (SchemeLayeredSocketFactory) schm.getSchemeSocketFactory();
        final Socket sock = lsf.createLayeredSocket(
                conn.getSocket(), target.getHostName(), schm.resolvePort(target.getPort()), params);
        prepareSocket(sock, context, params);
        conn.update(sock, target, lsf.isSecure(sock), params);
    }

    /**
     * Performs standard initializations on a newly created socket.
     *
     * @param sock      the socket to prepare
     * @param context   the context for the connection
     * @param params    the parameters from which to prepare the socket
     *
     * @throws IOException      in case of an IO problem
     */
    protected void prepareSocket(
            final Socket sock,
            final HttpContext context,
            final HttpParams params) throws IOException {
        sock.setTcpNoDelay(HttpConnectionParams.getTcpNoDelay(params));
        sock.setSoTimeout(HttpConnectionParams.getSoTimeout(params));

        final int linger = HttpConnectionParams.getLinger(params);
        if (linger >= 0) {
            sock.setSoLinger(linger > 0, linger);
        }
    }

    /**
     * Resolves the given host name to an array of corresponding IP addresses, based on the
     * configured name service on the provided DNS resolver. If one wasn't provided, the system
     * configuration is used.
     *
     * @param host host name to resolve
     * @return array of IP addresses
     * @exception  UnknownHostException  if no IP address for the host could be determined.
     *
     * @see DnsResolver
     * @see SystemDefaultDnsResolver
     *
     * @since 4.1
     */
    protected InetAddress[] resolveHostname(final String host) throws UnknownHostException {
            return dnsResolver.resolve(host);
    }

}

