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
import cz.msebera.android.httpclient.HeaderElement;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.utils.DateUtils;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * @since 4.1
 */
@Immutable
class CacheValidityPolicy {

    public static final long MAX_AGE = 2147483648L;

    CacheValidityPolicy() {
        super();
    }

    public long getCurrentAgeSecs(final HttpCacheEntry entry, final Date now) {
        return getCorrectedInitialAgeSecs(entry) + getResidentTimeSecs(entry, now);
    }

    public long getFreshnessLifetimeSecs(final HttpCacheEntry entry) {
        final long maxage = getMaxAge(entry);
        if (maxage > -1) {
            return maxage;
        }

        final Date dateValue = entry.getDate();
        if (dateValue == null) {
            return 0L;
        }

        final Date expiry = getExpirationDate(entry);
        if (expiry == null) {
            return 0;
        }
        final long diff = expiry.getTime() - dateValue.getTime();
        return (diff / 1000);
    }

    public boolean isResponseFresh(final HttpCacheEntry entry, final Date now) {
        return (getCurrentAgeSecs(entry, now) < getFreshnessLifetimeSecs(entry));
    }

    /**
     * Decides if this response is fresh enough based Last-Modified and Date, if available.
     * This entry is meant to be used when isResponseFresh returns false.  The algorithm is as follows:
     *
     * if last-modified and date are defined, freshness lifetime is coefficient*(date-lastModified),
     * else freshness lifetime is defaultLifetime
     *
     * @param entry the cache entry
     * @param now what time is it currently (When is right NOW)
     * @param coefficient Part of the heuristic for cache entry freshness
     * @param defaultLifetime How long can I assume a cache entry is default TTL
     * @return {@code true} if the response is fresh
     */
    public boolean isResponseHeuristicallyFresh(final HttpCacheEntry entry,
            final Date now, final float coefficient, final long defaultLifetime) {
        return (getCurrentAgeSecs(entry, now) < getHeuristicFreshnessLifetimeSecs(entry, coefficient, defaultLifetime));
    }

    public long getHeuristicFreshnessLifetimeSecs(final HttpCacheEntry entry,
            final float coefficient, final long defaultLifetime) {
        final Date dateValue = entry.getDate();
        final Date lastModifiedValue = getLastModifiedValue(entry);

        if (dateValue != null && lastModifiedValue != null) {
            final long diff = dateValue.getTime() - lastModifiedValue.getTime();
            if (diff < 0) {
                return 0;
            }
            return (long)(coefficient * (diff / 1000));
        }

        return defaultLifetime;
    }

    public boolean isRevalidatable(final HttpCacheEntry entry) {
        return entry.getFirstHeader(HeaderConstants.ETAG) != null
                || entry.getFirstHeader(HeaderConstants.LAST_MODIFIED) != null;
    }

    public boolean mustRevalidate(final HttpCacheEntry entry) {
        return hasCacheControlDirective(entry, HeaderConstants.CACHE_CONTROL_MUST_REVALIDATE);
    }

    public boolean proxyRevalidate(final HttpCacheEntry entry) {
        return hasCacheControlDirective(entry, HeaderConstants.CACHE_CONTROL_PROXY_REVALIDATE);
    }

    public boolean mayReturnStaleWhileRevalidating(final HttpCacheEntry entry, final Date now) {
        for (final Header h : entry.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for(final HeaderElement elt : h.getElements()) {
                if (HeaderConstants.STALE_WHILE_REVALIDATE.equalsIgnoreCase(elt.getName())) {
                    try {
                        final int allowedStalenessLifetime = Integer.parseInt(elt.getValue());
                        if (getStalenessSecs(entry, now) <= allowedStalenessLifetime) {
                            return true;
                        }
                    } catch (final NumberFormatException nfe) {
                        // skip malformed directive
                    }
                }
            }
        }

        return false;
    }

    public boolean mayReturnStaleIfError(final HttpRequest request,
            final HttpCacheEntry entry, final Date now) {
        final long stalenessSecs = getStalenessSecs(entry, now);
        return mayReturnStaleIfError(request.getHeaders(HeaderConstants.CACHE_CONTROL),
                                     stalenessSecs)
                || mayReturnStaleIfError(entry.getHeaders(HeaderConstants.CACHE_CONTROL),
                                         stalenessSecs);
    }

    private boolean mayReturnStaleIfError(final Header[] headers, final long stalenessSecs) {
        boolean result = false;
        for(final Header h : headers) {
            for(final HeaderElement elt : h.getElements()) {
                if (HeaderConstants.STALE_IF_ERROR.equals(elt.getName())) {
                    try {
                        final int staleIfErrorSecs = Integer.parseInt(elt.getValue());
                        if (stalenessSecs <= staleIfErrorSecs) {
                            result = true;
                            break;
                        }
                    } catch (final NumberFormatException nfe) {
                        // skip malformed directive
                    }
                }
            }
        }
        return result;
    }

    /**
     * @deprecated (4.3) use {@link HttpCacheEntry#getDate()}.
     * @param entry
     * @return
     */
    @Deprecated
    protected Date getDateValue(final HttpCacheEntry entry) {
        return entry.getDate();
    }

    protected Date getLastModifiedValue(final HttpCacheEntry entry) {
        final Header dateHdr = entry.getFirstHeader(HeaderConstants.LAST_MODIFIED);
        if (dateHdr == null) {
            return null;
        }
        return DateUtils.parseDate(dateHdr.getValue());
    }

    protected long getContentLengthValue(final HttpCacheEntry entry) {
        final Header cl = entry.getFirstHeader(HTTP.CONTENT_LEN);
        if (cl == null) {
            return -1;
        }

        try {
            return Long.parseLong(cl.getValue());
        } catch (final NumberFormatException ex) {
            return -1;
        }
    }

    protected boolean hasContentLengthHeader(final HttpCacheEntry entry) {
        return null != entry.getFirstHeader(HTTP.CONTENT_LEN);
    }

    /**
     * This matters for deciding whether the cache entry is valid to serve as a
     * response. If these values do not match, we might have a partial response
     *
     * @param entry The cache entry we are currently working with
     * @return boolean indicating whether actual length matches Content-Length
     */
    protected boolean contentLengthHeaderMatchesActualLength(final HttpCacheEntry entry) {
        return !hasContentLengthHeader(entry) ||
                (entry.getResource() != null && getContentLengthValue(entry) == entry.getResource().length());
    }

    protected long getApparentAgeSecs(final HttpCacheEntry entry) {
        final Date dateValue = entry.getDate();
        if (dateValue == null) {
            return MAX_AGE;
        }
        final long diff = entry.getResponseDate().getTime() - dateValue.getTime();
        if (diff < 0L) {
            return 0;
        }
        return (diff / 1000);
    }

    protected long getAgeValue(final HttpCacheEntry entry) {
        long ageValue = 0;
        for (final Header hdr : entry.getHeaders(HeaderConstants.AGE)) {
            long hdrAge;
            try {
                hdrAge = Long.parseLong(hdr.getValue());
                if (hdrAge < 0) {
                    hdrAge = MAX_AGE;
                }
            } catch (final NumberFormatException nfe) {
                hdrAge = MAX_AGE;
            }
            ageValue = (hdrAge > ageValue) ? hdrAge : ageValue;
        }
        return ageValue;
    }

    protected long getCorrectedReceivedAgeSecs(final HttpCacheEntry entry) {
        final long apparentAge = getApparentAgeSecs(entry);
        final long ageValue = getAgeValue(entry);
        return (apparentAge > ageValue) ? apparentAge : ageValue;
    }

    protected long getResponseDelaySecs(final HttpCacheEntry entry) {
        final long diff = entry.getResponseDate().getTime() - entry.getRequestDate().getTime();
        return (diff / 1000L);
    }

    protected long getCorrectedInitialAgeSecs(final HttpCacheEntry entry) {
        return getCorrectedReceivedAgeSecs(entry) + getResponseDelaySecs(entry);
    }

    protected long getResidentTimeSecs(final HttpCacheEntry entry, final Date now) {
        final long diff = now.getTime() - entry.getResponseDate().getTime();
        return (diff / 1000L);
    }

    protected long getMaxAge(final HttpCacheEntry entry) {
        long maxage = -1;
        for (final Header hdr : entry.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for (final HeaderElement elt : hdr.getElements()) {
                if (HeaderConstants.CACHE_CONTROL_MAX_AGE.equals(elt.getName())
                        || "s-maxage".equals(elt.getName())) {
                    try {
                        final long currMaxAge = Long.parseLong(elt.getValue());
                        if (maxage == -1 || currMaxAge < maxage) {
                            maxage = currMaxAge;
                        }
                    } catch (final NumberFormatException nfe) {
                        // be conservative if can't parse
                        maxage = 0;
                    }
                }
            }
        }
        return maxage;
    }

    protected Date getExpirationDate(final HttpCacheEntry entry) {
        final Header expiresHeader = entry.getFirstHeader(HeaderConstants.EXPIRES);
        if (expiresHeader == null) {
            return null;
        }
        return DateUtils.parseDate(expiresHeader.getValue());
    }

    public boolean hasCacheControlDirective(final HttpCacheEntry entry,
            final String directive) {
        for (final Header h : entry.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for(final HeaderElement elt : h.getElements()) {
                if (directive.equalsIgnoreCase(elt.getName())) {
                    return true;
                }
            }
        }
        return false;
    }

    public long getStalenessSecs(final HttpCacheEntry entry, final Date now) {
        final long age = getCurrentAgeSecs(entry, now);
        final long freshness = getFreshnessLifetimeSecs(entry);
        if (age <= freshness) {
            return 0L;
        }
        return (age - freshness);
    }


}
