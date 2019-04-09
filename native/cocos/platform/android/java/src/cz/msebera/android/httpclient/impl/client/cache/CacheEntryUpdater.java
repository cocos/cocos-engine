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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.ListIterator;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.cache.Resource;
import cz.msebera.android.httpclient.client.cache.ResourceFactory;
import cz.msebera.android.httpclient.client.utils.DateUtils;
import cz.msebera.android.httpclient.protocol.HTTP;
import cz.msebera.android.httpclient.util.Args;

/**
 * Update a {@link HttpCacheEntry} with new or updated information based on the latest
 * 304 status response from the Server.  Use the {@link HttpResponse} to perform
 * the update.
 *
 * @since 4.1
 */
@Immutable
class CacheEntryUpdater {

    private final ResourceFactory resourceFactory;

    CacheEntryUpdater() {
        this(new HeapResourceFactory());
    }

    CacheEntryUpdater(final ResourceFactory resourceFactory) {
        super();
        this.resourceFactory = resourceFactory;
    }

    /**
     * Update the entry with the new information from the response.  Should only be used for
     * 304 responses.
     *
     * @param requestId
     * @param entry The cache Entry to be updated
     * @param requestDate When the request was performed
     * @param responseDate When the response was gotten
     * @param response The HttpResponse from the backend server call
     * @return HttpCacheEntry an updated version of the cache entry
     * @throws java.io.IOException if something bad happens while trying to read the body from the original entry
     */
    public HttpCacheEntry updateCacheEntry(
            final String requestId,
            final HttpCacheEntry entry,
            final Date requestDate,
            final Date responseDate,
            final HttpResponse response) throws IOException {
        Args.check(response.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_MODIFIED,
                "Response must have 304 status code");
        final Header[] mergedHeaders = mergeHeaders(entry, response);
        Resource resource = null;
        if (entry.getResource() != null) {
            resource = resourceFactory.copy(requestId, entry.getResource());
        }
        return new HttpCacheEntry(
                requestDate,
                responseDate,
                entry.getStatusLine(),
                mergedHeaders,
                resource,
                entry.getRequestMethod());
    }

    protected Header[] mergeHeaders(final HttpCacheEntry entry, final HttpResponse response) {

        if (entryAndResponseHaveDateHeader(entry, response)
                && entryDateHeaderNewerThenResponse(entry, response)) {
            // Don't merge headers, keep the entry's headers as they are newer.
            return entry.getAllHeaders();
        }

        final List<Header> cacheEntryHeaderList = new ArrayList<Header>(Arrays.asList(entry
                .getAllHeaders()));
        removeCacheHeadersThatMatchResponse(cacheEntryHeaderList, response);
        removeCacheEntry1xxWarnings(cacheEntryHeaderList, entry);
        cacheEntryHeaderList.addAll(Arrays.asList(response.getAllHeaders()));

        return cacheEntryHeaderList.toArray(new Header[cacheEntryHeaderList.size()]);
    }

    private void removeCacheHeadersThatMatchResponse(final List<Header> cacheEntryHeaderList,
            final HttpResponse response) {
        for (final Header responseHeader : response.getAllHeaders()) {
            final ListIterator<Header> cacheEntryHeaderListIter = cacheEntryHeaderList.listIterator();

            while (cacheEntryHeaderListIter.hasNext()) {
                final String cacheEntryHeaderName = cacheEntryHeaderListIter.next().getName();

                if (cacheEntryHeaderName.equals(responseHeader.getName())) {
                    cacheEntryHeaderListIter.remove();
                }
            }
        }
    }

    private void removeCacheEntry1xxWarnings(final List<Header> cacheEntryHeaderList, final HttpCacheEntry entry) {
        final ListIterator<Header> cacheEntryHeaderListIter = cacheEntryHeaderList.listIterator();

        while (cacheEntryHeaderListIter.hasNext()) {
            final String cacheEntryHeaderName = cacheEntryHeaderListIter.next().getName();

            if (HeaderConstants.WARNING.equals(cacheEntryHeaderName)) {
                for (final Header cacheEntryWarning : entry.getHeaders(HeaderConstants.WARNING)) {
                    if (cacheEntryWarning.getValue().startsWith("1")) {
                        cacheEntryHeaderListIter.remove();
                    }
                }
            }
        }
    }

    private boolean entryDateHeaderNewerThenResponse(final HttpCacheEntry entry, final HttpResponse response) {
        final Date entryDate = DateUtils.parseDate(entry.getFirstHeader(HTTP.DATE_HEADER)
                .getValue());
        final Date responseDate = DateUtils.parseDate(response.getFirstHeader(HTTP.DATE_HEADER)
                .getValue());
        if (entryDate == null || responseDate == null) {
            return false;
        }
        if (!entryDate.after(responseDate)) {
            return false;
        }
        return true;
    }

    private boolean entryAndResponseHaveDateHeader(final HttpCacheEntry entry, final HttpResponse response) {
        if (entry.getFirstHeader(HTTP.DATE_HEADER) != null
                && response.getFirstHeader(HTTP.DATE_HEADER) != null) {
            return true;
        }

        return false;
    }

}
