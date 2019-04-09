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
package cz.msebera.android.httpclient.impl.client.cache;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import cz.msebera.android.httpclient.Consts;
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HeaderElement;
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.utils.URIUtils;

/**
 * @since 4.1
 */
@Immutable
class CacheKeyGenerator {

    private static final URI BASE_URI = URI.create("http://example.com/");

    /**
     * For a given {@link HttpHost} and {@link HttpRequest} get a URI from the
     * pair that I can use as an identifier KEY into my HttpCache
     *
     * @param host The host for this request
     * @param req the {@link HttpRequest}
     * @return String the extracted URI
     */
    public String getURI(final HttpHost host, final HttpRequest req) {
        if (isRelativeRequest(req)) {
            return canonicalizeUri(String.format("%s%s", host.toString(), req.getRequestLine().getUri()));
        }
        return canonicalizeUri(req.getRequestLine().getUri());
    }

    public String canonicalizeUri(final String uri) {
        try {
            final URI normalized = URIUtils.resolve(BASE_URI, uri);
            final URL u = new URL(normalized.toASCIIString());
            final String protocol = u.getProtocol();
            final String hostname = u.getHost();
            final int port = canonicalizePort(u.getPort(), protocol);
            final String path = u.getPath();
            final String query = u.getQuery();
            final String file = (query != null) ? (path + "?" + query) : path;
            final URL out = new URL(protocol, hostname, port, file);
            return out.toString();
        } catch (final IllegalArgumentException e) {
            return uri;
        } catch (final MalformedURLException e) {
            return uri;
        }
    }

    private int canonicalizePort(final int port, final String protocol) {
        if (port == -1 && "http".equalsIgnoreCase(protocol)) {
            return 80;
        } else if (port == -1 && "https".equalsIgnoreCase(protocol)) {
            return 443;
        }
        return port;
    }

    private boolean isRelativeRequest(final HttpRequest req) {
        final String requestUri = req.getRequestLine().getUri();
        return ("*".equals(requestUri) || requestUri.startsWith("/"));
    }

    protected String getFullHeaderValue(final Header[] headers) {
        if (headers == null) {
            return "";
        }

        final StringBuilder buf = new StringBuilder("");
        boolean first = true;
        for (final Header hdr : headers) {
            if (!first) {
                buf.append(", ");
            }
            buf.append(hdr.getValue().trim());
            first = false;

        }
        return buf.toString();
    }

    /**
     * For a given {@link HttpHost} and {@link HttpRequest} if the request has a
     * VARY header - I need to get an additional URI from the pair of host and
     * request so that I can also store the variant into my HttpCache.
     *
     * @param host The host for this request
     * @param req the {@link HttpRequest}
     * @param entry the parent entry used to track the variants
     * @return String the extracted variant URI
     */
    public String getVariantURI(final HttpHost host, final HttpRequest req, final HttpCacheEntry entry) {
        if (!entry.hasVariants()) {
            return getURI(host, req);
        }
        return getVariantKey(req, entry) + getURI(host, req);
    }

    /**
     * Compute a "variant key" from the headers of a given request that are
     * covered by the Vary header of a given cache entry. Any request whose
     * varying headers match those of this request should have the same
     * variant key.
     * @param req originating request
     * @param entry cache entry in question that has variants
     * @return a {@code String} variant key
     */
    public String getVariantKey(final HttpRequest req, final HttpCacheEntry entry) {
        final List<String> variantHeaderNames = new ArrayList<String>();
        for (final Header varyHdr : entry.getHeaders(HeaderConstants.VARY)) {
            for (final HeaderElement elt : varyHdr.getElements()) {
                variantHeaderNames.add(elt.getName());
            }
        }
        Collections.sort(variantHeaderNames);

        StringBuilder buf;
        try {
            buf = new StringBuilder("{");
            boolean first = true;
            for (final String headerName : variantHeaderNames) {
                if (!first) {
                    buf.append("&");
                }
                buf.append(URLEncoder.encode(headerName, Consts.UTF_8.name()));
                buf.append("=");
                buf.append(URLEncoder.encode(getFullHeaderValue(req.getHeaders(headerName)),
                        Consts.UTF_8.name()));
                first = false;
            }
            buf.append("}");
        } catch (final UnsupportedEncodingException uee) {
            throw new RuntimeException("couldn't encode to UTF-8", uee);
        }
        return buf.toString();
    }

}
