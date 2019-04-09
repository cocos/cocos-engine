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

import java.util.Date;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpVersion;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.methods.CloseableHttpResponse;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;
import cz.msebera.android.httpclient.client.utils.DateUtils;
import cz.msebera.android.httpclient.message.BasicHeader;
import cz.msebera.android.httpclient.message.BasicHttpResponse;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * Rebuilds an {@link HttpResponse} from a {@link net.sf.ehcache.CacheEntry}
 *
 * @since 4.1
 */
@Immutable
class CachedHttpResponseGenerator {

    private final CacheValidityPolicy validityStrategy;

    CachedHttpResponseGenerator(final CacheValidityPolicy validityStrategy) {
        super();
        this.validityStrategy = validityStrategy;
    }

    CachedHttpResponseGenerator() {
        this(new CacheValidityPolicy());
    }

    /**
     * If I was able to use a {@link CacheEntity} to response to the {@link cz.msebera.android.httpclient.HttpRequest} then
     * generate an {@link HttpResponse} based on the cache entry.
     * @param request {@link HttpRequestWrapper} to generate the response for
     * @param entry {@link CacheEntity} to transform into an {@link HttpResponse}
     * @return {@link HttpResponse} that was constructed
     */
    CloseableHttpResponse generateResponse(final HttpRequestWrapper request, final HttpCacheEntry entry) {
        final Date now = new Date();
        final HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1, entry
                .getStatusCode(), entry.getReasonPhrase());

        response.setHeaders(entry.getAllHeaders());

        if (responseShouldContainEntity(request, entry)) {
            final HttpEntity entity = new CacheEntity(entry);
            addMissingContentLengthHeader(response, entity);
            response.setEntity(entity);
        }

        final long age = this.validityStrategy.getCurrentAgeSecs(entry, now);
        if (age > 0) {
            if (age >= Integer.MAX_VALUE) {
                response.setHeader(HeaderConstants.AGE, "2147483648");
            } else {
                response.setHeader(HeaderConstants.AGE, "" + ((int) age));
            }
        }

        return Proxies.enhanceResponse(response);
    }

    /**
     * Generate a 304 - Not Modified response from a {@link CacheEntity}.  This should be
     * used to respond to conditional requests, when the entry exists or has been re-validated.
     */
    CloseableHttpResponse generateNotModifiedResponse(final HttpCacheEntry entry) {

        final HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1,
                HttpStatus.SC_NOT_MODIFIED, "Not Modified");

        // The response MUST include the following headers
        //  (http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

        // - Date, unless its omission is required by section 14.8.1
        Header dateHeader = entry.getFirstHeader(HTTP.DATE_HEADER);
        if (dateHeader == null) {
             dateHeader = new BasicHeader(HTTP.DATE_HEADER, DateUtils.formatDate(new Date()));
        }
        response.addHeader(dateHeader);

        // - ETag and/or Content-Location, if the header would have been sent
        //   in a 200 response to the same request
        final Header etagHeader = entry.getFirstHeader(HeaderConstants.ETAG);
        if (etagHeader != null) {
            response.addHeader(etagHeader);
        }

        final Header contentLocationHeader = entry.getFirstHeader("Content-Location");
        if (contentLocationHeader != null) {
            response.addHeader(contentLocationHeader);
        }

        // - Expires, Cache-Control, and/or Vary, if the field-value might
        //   differ from that sent in any previous response for the same
        //   variant
        final Header expiresHeader = entry.getFirstHeader(HeaderConstants.EXPIRES);
        if (expiresHeader != null) {
            response.addHeader(expiresHeader);
        }

        final Header cacheControlHeader = entry.getFirstHeader(HeaderConstants.CACHE_CONTROL);
        if (cacheControlHeader != null) {
            response.addHeader(cacheControlHeader);
        }

        final Header varyHeader = entry.getFirstHeader(HeaderConstants.VARY);
        if (varyHeader != null) {
            response.addHeader(varyHeader);
        }

        return Proxies.enhanceResponse(response);
    }

    private void addMissingContentLengthHeader(final HttpResponse response, final HttpEntity entity) {
        if (transferEncodingIsPresent(response)) {
            return;
        }

        Header contentLength = response.getFirstHeader(HTTP.CONTENT_LEN);
        if (contentLength == null) {
            contentLength = new BasicHeader(HTTP.CONTENT_LEN, Long.toString(entity
                    .getContentLength()));
            response.setHeader(contentLength);
        }
    }

    private boolean transferEncodingIsPresent(final HttpResponse response) {
        final Header hdr = response.getFirstHeader(HTTP.TRANSFER_ENCODING);
        return hdr != null;
    }

    private boolean responseShouldContainEntity(final HttpRequestWrapper request, final HttpCacheEntry cacheEntry) {
        return request.getRequestLine().getMethod().equals(HeaderConstants.GET_METHOD) &&
               cacheEntry.getResource() != null;
    }

}
