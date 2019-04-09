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

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.cache.HttpCacheInvalidator;
import cz.msebera.android.httpclient.client.cache.HttpCacheStorage;
import cz.msebera.android.httpclient.client.utils.DateUtils;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * Given a particular HttpRequest, flush any cache entries that this request
 * would invalidate.
 *
 * @since 4.1
 */
@Immutable
class CacheInvalidator implements HttpCacheInvalidator {

    private final HttpCacheStorage storage;
    private final CacheKeyGenerator cacheKeyGenerator;

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());

    /**
     * Create a new {@link CacheInvalidator} for a given {@link HttpCache} and
     * {@link CacheKeyGenerator}.
     *
     * @param uriExtractor Provides identifiers for the keys to store cache entries
     * @param storage the cache to store items away in
     */
    public CacheInvalidator(
            final CacheKeyGenerator uriExtractor,
            final HttpCacheStorage storage) {
        this.cacheKeyGenerator = uriExtractor;
        this.storage = storage;
    }

    /**
     * Remove cache entries from the cache that are no longer fresh or
     * have been invalidated in some way.
     *
     * @param host The backend host we are talking to
     * @param req The HttpRequest to that host
     */
    @Override
    public void flushInvalidatedCacheEntries(final HttpHost host, final HttpRequest req)  {
        final String theUri = cacheKeyGenerator.getURI(host, req);
        final HttpCacheEntry parent = getEntry(theUri);

        if (requestShouldNotBeCached(req) || shouldInvalidateHeadCacheEntry(req, parent)) {
            log.debug("Invalidating parent cache entry: " + parent);
            if (parent != null) {
                for (final String variantURI : parent.getVariantMap().values()) {
                    flushEntry(variantURI);
                }
                flushEntry(theUri);
            }
            final URL reqURL = getAbsoluteURL(theUri);
            if (reqURL == null) {
                log.error("Couldn't transform request into valid URL");
                return;
            }
            final Header clHdr = req.getFirstHeader("Content-Location");
            if (clHdr != null) {
                final String contentLocation = clHdr.getValue();
                if (!flushAbsoluteUriFromSameHost(reqURL, contentLocation)) {
                    flushRelativeUriFromSameHost(reqURL, contentLocation);
                }
            }
            final Header lHdr = req.getFirstHeader("Location");
            if (lHdr != null) {
                flushAbsoluteUriFromSameHost(reqURL, lHdr.getValue());
            }
        }
    }

    private boolean shouldInvalidateHeadCacheEntry(final HttpRequest req, final HttpCacheEntry parentCacheEntry) {
        return requestIsGet(req) && isAHeadCacheEntry(parentCacheEntry);
    }

    private boolean requestIsGet(final HttpRequest req) {
        return req.getRequestLine().getMethod().equals((HeaderConstants.GET_METHOD));
    }

    private boolean isAHeadCacheEntry(final HttpCacheEntry parentCacheEntry) {
        return parentCacheEntry != null && parentCacheEntry.getRequestMethod().equals(HeaderConstants.HEAD_METHOD);
    }

    private void flushEntry(final String uri) {
        try {
            storage.removeEntry(uri);
        } catch (final IOException ioe) {
            log.warn("unable to flush cache entry", ioe);
        }
    }

    private HttpCacheEntry getEntry(final String theUri) {
        try {
            return storage.getEntry(theUri);
        } catch (final IOException ioe) {
            log.warn("could not retrieve entry from storage", ioe);
        }
        return null;
    }

    protected void flushUriIfSameHost(final URL requestURL, final URL targetURL) {
        final URL canonicalTarget = getAbsoluteURL(cacheKeyGenerator.canonicalizeUri(targetURL.toString()));
        if (canonicalTarget == null) {
            return;
        }
        if (canonicalTarget.getAuthority().equalsIgnoreCase(requestURL.getAuthority())) {
            flushEntry(canonicalTarget.toString());
        }
    }

    protected void flushRelativeUriFromSameHost(final URL reqURL, final String relUri) {
        final URL relURL = getRelativeURL(reqURL, relUri);
        if (relURL == null) {
            return;
        }
        flushUriIfSameHost(reqURL, relURL);
    }


    protected boolean flushAbsoluteUriFromSameHost(final URL reqURL, final String uri) {
        final URL absURL = getAbsoluteURL(uri);
        if (absURL == null) {
            return false;
        }
        flushUriIfSameHost(reqURL,absURL);
        return true;
    }

    private URL getAbsoluteURL(final String uri) {
        URL absURL = null;
        try {
            absURL = new URL(uri);
        } catch (final MalformedURLException mue) {
            // nop
        }
        return absURL;
    }

    private URL getRelativeURL(final URL reqURL, final String relUri) {
        URL relURL = null;
        try {
            relURL = new URL(reqURL,relUri);
        } catch (final MalformedURLException e) {
            // nop
        }
        return relURL;
    }

    protected boolean requestShouldNotBeCached(final HttpRequest req) {
        final String method = req.getRequestLine().getMethod();
        return notGetOrHeadRequest(method);
    }

    private boolean notGetOrHeadRequest(final String method) {
        return !(HeaderConstants.GET_METHOD.equals(method) || HeaderConstants.HEAD_METHOD
                .equals(method));
    }

    /** Flushes entries that were invalidated by the given response
     * received for the given host/request pair.
     */
    @Override
    public void flushInvalidatedCacheEntries(final HttpHost host,
            final HttpRequest request, final HttpResponse response) {
        final int status = response.getStatusLine().getStatusCode();
        if (status < 200 || status > 299) {
            return;
        }
        final URL reqURL = getAbsoluteURL(cacheKeyGenerator.getURI(host, request));
        if (reqURL == null) {
            return;
        }
        final URL contentLocation = getContentLocationURL(reqURL, response);
        if (contentLocation != null) {
            flushLocationCacheEntry(reqURL, response, contentLocation);
        }
        final URL location = getLocationURL(reqURL, response);
        if (location != null) {
            flushLocationCacheEntry(reqURL, response, location);
        }
    }

    private void flushLocationCacheEntry(final URL reqURL,
            final HttpResponse response, final URL location) {
        final String cacheKey = cacheKeyGenerator.canonicalizeUri(location.toString());
        final HttpCacheEntry entry = getEntry(cacheKey);
        if (entry == null) {
            return;
        }

        // do not invalidate if response is strictly older than entry
        // or if the etags match

        if (responseDateOlderThanEntryDate(response, entry)) {
            return;
        }
        if (!responseAndEntryEtagsDiffer(response, entry)) {
            return;
        }

        flushUriIfSameHost(reqURL, location);
    }

    private URL getContentLocationURL(final URL reqURL, final HttpResponse response) {
        final Header clHeader = response.getFirstHeader("Content-Location");
        if (clHeader == null) {
            return null;
        }
        final String contentLocation = clHeader.getValue();
        final URL canonURL = getAbsoluteURL(contentLocation);
        if (canonURL != null) {
            return canonURL;
        }
        return getRelativeURL(reqURL, contentLocation);
    }

    private URL getLocationURL(final URL reqURL, final HttpResponse response) {
        final Header clHeader = response.getFirstHeader("Location");
        if (clHeader == null) {
            return null;
        }
        final String location = clHeader.getValue();
        final URL canonURL = getAbsoluteURL(location);
        if (canonURL != null) {
            return canonURL;
        }
        return getRelativeURL(reqURL, location);
    }

    private boolean responseAndEntryEtagsDiffer(final HttpResponse response,
            final HttpCacheEntry entry) {
        final Header entryEtag = entry.getFirstHeader(HeaderConstants.ETAG);
        final Header responseEtag = response.getFirstHeader(HeaderConstants.ETAG);
        if (entryEtag == null || responseEtag == null) {
            return false;
        }
        return (!entryEtag.getValue().equals(responseEtag.getValue()));
    }

    private boolean responseDateOlderThanEntryDate(final HttpResponse response,
            final HttpCacheEntry entry) {
        final Header entryDateHeader = entry.getFirstHeader(HTTP.DATE_HEADER);
        final Header responseDateHeader = response.getFirstHeader(HTTP.DATE_HEADER);
        if (entryDateHeader == null || responseDateHeader == null) {
            /* be conservative; should probably flush */
            return false;
        }
        final Date entryDate = DateUtils.parseDate(entryDateHeader.getValue());
        final Date responseDate = DateUtils.parseDate(responseDateHeader.getValue());
        if (entryDate == null || responseDate == null) {
            return false;
        }
        return responseDate.before(entryDate);
    }
}
