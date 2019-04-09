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

import java.util.Map;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HeaderElement;
import cz.msebera.android.httpclient.ProtocolException;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;

/**
 * @since 4.1
 */
@Immutable
class ConditionalRequestBuilder {

    /**
     * When a {@link HttpCacheEntry} is stale but 'might' be used as a response
     * to an {@link cz.msebera.android.httpclient.HttpRequest} we will attempt to revalidate
     * the entry with the origin.  Build the origin {@link cz.msebera.android.httpclient.HttpRequest}
     * here and return it.
     *
     * @param request the original request from the caller
     * @param cacheEntry the entry that needs to be re-validated
     * @return the wrapped request
     * @throws ProtocolException when I am unable to build a new origin request.
     */
    public HttpRequestWrapper buildConditionalRequest(final HttpRequestWrapper request, final HttpCacheEntry cacheEntry)
            throws ProtocolException {
        final HttpRequestWrapper newRequest = HttpRequestWrapper.wrap(request.getOriginal());
        newRequest.setHeaders(request.getAllHeaders());
        final Header eTag = cacheEntry.getFirstHeader(HeaderConstants.ETAG);
        if (eTag != null) {
            newRequest.setHeader(HeaderConstants.IF_NONE_MATCH, eTag.getValue());
        }
        final Header lastModified = cacheEntry.getFirstHeader(HeaderConstants.LAST_MODIFIED);
        if (lastModified != null) {
            newRequest.setHeader(HeaderConstants.IF_MODIFIED_SINCE, lastModified.getValue());
        }
        boolean mustRevalidate = false;
        for(final Header h : cacheEntry.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for(final HeaderElement elt : h.getElements()) {
                if (HeaderConstants.CACHE_CONTROL_MUST_REVALIDATE.equalsIgnoreCase(elt.getName())
                    || HeaderConstants.CACHE_CONTROL_PROXY_REVALIDATE.equalsIgnoreCase(elt.getName())) {
                    mustRevalidate = true;
                    break;
                }
            }
        }
        if (mustRevalidate) {
            newRequest.addHeader(HeaderConstants.CACHE_CONTROL, HeaderConstants.CACHE_CONTROL_MAX_AGE + "=0");
        }
        return newRequest;

    }

    /**
     * When a {@link HttpCacheEntry} does not exist for a specific
     * {@link cz.msebera.android.httpclient.HttpRequest} we attempt to see if an existing
     * {@link HttpCacheEntry} is appropriate by building a conditional
     * {@link cz.msebera.android.httpclient.HttpRequest} using the variants' ETag values.
     * If no such values exist, the request is unmodified
     *
     * @param request the original request from the caller
     * @param variants
     * @return the wrapped request
     */
    public HttpRequestWrapper buildConditionalRequestFromVariants(final HttpRequestWrapper request,
            final Map<String, Variant> variants) {
        final HttpRequestWrapper newRequest = HttpRequestWrapper.wrap(request.getOriginal());
        newRequest.setHeaders(request.getAllHeaders());

        // we do not support partial content so all etags are used
        final StringBuilder etags = new StringBuilder();
        boolean first = true;
        for(final String etag : variants.keySet()) {
            if (!first) {
                etags.append(",");
            }
            first = false;
            etags.append(etag);
        }

        newRequest.setHeader(HeaderConstants.IF_NONE_MATCH, etags.toString());
        return newRequest;
    }

    /**
     * Returns a request to unconditionally validate a cache entry with
     * the origin. In certain cases (due to multiple intervening caches)
     * our cache may actually receive a response to a normal conditional
     * validation where the Date header is actually older than that of
     * our current cache entry. In this case, the protocol recommendation
     * is to retry the validation and force syncup with the origin.
     * @param request client request we are trying to satisfy
     * @param entry existing cache entry we are trying to validate
     * @return an unconditional validation request
     */
    public HttpRequestWrapper buildUnconditionalRequest(final HttpRequestWrapper request, final HttpCacheEntry entry) {
        final HttpRequestWrapper newRequest = HttpRequestWrapper.wrap(request.getOriginal());
        newRequest.setHeaders(request.getAllHeaders());
        newRequest.addHeader(HeaderConstants.CACHE_CONTROL,HeaderConstants.CACHE_CONTROL_NO_CACHE);
        newRequest.addHeader(HeaderConstants.PRAGMA,HeaderConstants.CACHE_CONTROL_NO_CACHE);
        newRequest.removeHeaders(HeaderConstants.IF_RANGE);
        newRequest.removeHeaders(HeaderConstants.IF_MATCH);
        newRequest.removeHeaders(HeaderConstants.IF_NONE_MATCH);
        newRequest.removeHeaders(HeaderConstants.IF_UNMODIFIED_SINCE);
        newRequest.removeHeaders(HeaderConstants.IF_MODIFIED_SINCE);
        return newRequest;
    }

}
