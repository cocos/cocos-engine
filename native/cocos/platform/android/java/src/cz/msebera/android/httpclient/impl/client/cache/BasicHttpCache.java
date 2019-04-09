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
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpVersion;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.cache.HttpCacheInvalidator;
import cz.msebera.android.httpclient.client.cache.HttpCacheStorage;
import cz.msebera.android.httpclient.client.cache.HttpCacheUpdateCallback;
import cz.msebera.android.httpclient.client.cache.HttpCacheUpdateException;
import cz.msebera.android.httpclient.client.cache.Resource;
import cz.msebera.android.httpclient.client.cache.ResourceFactory;
import cz.msebera.android.httpclient.client.methods.CloseableHttpResponse;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;
import cz.msebera.android.httpclient.entity.ByteArrayEntity;
import cz.msebera.android.httpclient.message.BasicHttpResponse;
import cz.msebera.android.httpclient.protocol.HTTP;

class BasicHttpCache implements HttpCache {
    private static final Set<String> safeRequestMethods = new HashSet<String>(
            Arrays.asList(HeaderConstants.HEAD_METHOD,
                    HeaderConstants.GET_METHOD, HeaderConstants.OPTIONS_METHOD,
                    HeaderConstants.TRACE_METHOD));

    private final CacheKeyGenerator uriExtractor;
    private final ResourceFactory resourceFactory;
    private final long maxObjectSizeBytes;
    private final CacheEntryUpdater cacheEntryUpdater;
    private final CachedHttpResponseGenerator responseGenerator;
    private final HttpCacheInvalidator cacheInvalidator;
    private final HttpCacheStorage storage;

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());

    public BasicHttpCache(
            final ResourceFactory resourceFactory,
            final HttpCacheStorage storage,
            final CacheConfig config,
            final CacheKeyGenerator uriExtractor,
            final HttpCacheInvalidator cacheInvalidator) {
        this.resourceFactory = resourceFactory;
        this.uriExtractor = uriExtractor;
        this.cacheEntryUpdater = new CacheEntryUpdater(resourceFactory);
        this.maxObjectSizeBytes = config.getMaxObjectSize();
        this.responseGenerator = new CachedHttpResponseGenerator();
        this.storage = storage;
        this.cacheInvalidator = cacheInvalidator;
    }

    public BasicHttpCache(
            final ResourceFactory resourceFactory,
            final HttpCacheStorage storage,
            final CacheConfig config,
            final CacheKeyGenerator uriExtractor) {
        this( resourceFactory, storage, config, uriExtractor,
                new CacheInvalidator(uriExtractor, storage));
    }

    public BasicHttpCache(
            final ResourceFactory resourceFactory,
            final HttpCacheStorage storage,
            final CacheConfig config) {
        this( resourceFactory, storage, config, new CacheKeyGenerator());
    }

    public BasicHttpCache(final CacheConfig config) {
        this(new HeapResourceFactory(), new BasicHttpCacheStorage(config), config);
    }

    public BasicHttpCache() {
        this(CacheConfig.DEFAULT);
    }

    @Override
    public void flushCacheEntriesFor(final HttpHost host, final HttpRequest request)
            throws IOException {
        if (!safeRequestMethods.contains(request.getRequestLine().getMethod())) {
            final String uri = uriExtractor.getURI(host, request);
            storage.removeEntry(uri);
        }
    }

    @Override
    public void flushInvalidatedCacheEntriesFor(final HttpHost host, final HttpRequest request, final HttpResponse response) {
        if (!safeRequestMethods.contains(request.getRequestLine().getMethod())) {
            cacheInvalidator.flushInvalidatedCacheEntries(host, request, response);
        }
    }

    void storeInCache(
            final HttpHost target, final HttpRequest request, final HttpCacheEntry entry) throws IOException {
        if (entry.hasVariants()) {
            storeVariantEntry(target, request, entry);
        } else {
            storeNonVariantEntry(target, request, entry);
        }
    }

    void storeNonVariantEntry(
            final HttpHost target, final HttpRequest req, final HttpCacheEntry entry) throws IOException {
        final String uri = uriExtractor.getURI(target, req);
        storage.putEntry(uri, entry);
    }

    void storeVariantEntry(
            final HttpHost target,
            final HttpRequest req,
            final HttpCacheEntry entry) throws IOException {
        final String parentURI = uriExtractor.getURI(target, req);
        final String variantURI = uriExtractor.getVariantURI(target, req, entry);
        storage.putEntry(variantURI, entry);

        final HttpCacheUpdateCallback callback = new HttpCacheUpdateCallback() {

            @Override
            public HttpCacheEntry update(final HttpCacheEntry existing) throws IOException {
                return doGetUpdatedParentEntry(
                        req.getRequestLine().getUri(), existing, entry,
                        uriExtractor.getVariantKey(req, entry),
                        variantURI);
            }

        };

        try {
            storage.updateEntry(parentURI, callback);
        } catch (final HttpCacheUpdateException e) {
            log.warn("Could not update key [" + parentURI + "]", e);
        }
    }

    @Override
    public void reuseVariantEntryFor(final HttpHost target, final HttpRequest req,
            final Variant variant) throws IOException {
        final String parentCacheKey = uriExtractor.getURI(target, req);
        final HttpCacheEntry entry = variant.getEntry();
        final String variantKey = uriExtractor.getVariantKey(req, entry);
        final String variantCacheKey = variant.getCacheKey();

        final HttpCacheUpdateCallback callback = new HttpCacheUpdateCallback() {
            @Override
            public HttpCacheEntry update(final HttpCacheEntry existing)
                    throws IOException {
                return doGetUpdatedParentEntry(req.getRequestLine().getUri(),
                        existing, entry, variantKey, variantCacheKey);
            }
        };

        try {
            storage.updateEntry(parentCacheKey, callback);
        } catch (final HttpCacheUpdateException e) {
            log.warn("Could not update key [" + parentCacheKey + "]", e);
        }
    }

    boolean isIncompleteResponse(final HttpResponse resp, final Resource resource) {
        final int status = resp.getStatusLine().getStatusCode();
        if (status != HttpStatus.SC_OK
            && status != HttpStatus.SC_PARTIAL_CONTENT) {
            return false;
        }
        final Header hdr = resp.getFirstHeader(HTTP.CONTENT_LEN);
        if (hdr == null) {
            return false;
        }
        final int contentLength;
        try {
            contentLength = Integer.parseInt(hdr.getValue());
        } catch (final NumberFormatException nfe) {
            return false;
        }
        if (resource == null) {
            return false;
        }
        return (resource.length() < contentLength);
    }

    CloseableHttpResponse generateIncompleteResponseError(
            final HttpResponse response, final Resource resource) {
        final Integer contentLength = Integer.valueOf(response.getFirstHeader(HTTP.CONTENT_LEN).getValue());
        final HttpResponse error =
            new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_BAD_GATEWAY, "Bad Gateway");
        error.setHeader("Content-Type","text/plain;charset=UTF-8");
        final String msg = String.format("Received incomplete response " +
                "with Content-Length %d but actual body length %d",
                contentLength, resource.length());
        final byte[] msgBytes = msg.getBytes();
        error.setHeader("Content-Length", Integer.toString(msgBytes.length));
        error.setEntity(new ByteArrayEntity(msgBytes));
        return Proxies.enhanceResponse(error);
    }

    HttpCacheEntry doGetUpdatedParentEntry(
            final String requestId,
            final HttpCacheEntry existing,
            final HttpCacheEntry entry,
            final String variantKey,
            final String variantCacheKey) throws IOException {
        HttpCacheEntry src = existing;
        if (src == null) {
            src = entry;
        }

        Resource resource = null;
        if (src.getResource() != null) {
            resource = resourceFactory.copy(requestId, src.getResource());
        }
        final Map<String,String> variantMap = new HashMap<String,String>(src.getVariantMap());
        variantMap.put(variantKey, variantCacheKey);
        return new HttpCacheEntry(
                src.getRequestDate(),
                src.getResponseDate(),
                src.getStatusLine(),
                src.getAllHeaders(),
                resource,
                variantMap,
                src.getRequestMethod());
    }

    @Override
    public HttpCacheEntry updateCacheEntry(final HttpHost target, final HttpRequest request,
            final HttpCacheEntry stale, final HttpResponse originResponse,
            final Date requestSent, final Date responseReceived) throws IOException {
        final HttpCacheEntry updatedEntry = cacheEntryUpdater.updateCacheEntry(
                request.getRequestLine().getUri(),
                stale,
                requestSent,
                responseReceived,
                originResponse);
        storeInCache(target, request, updatedEntry);
        return updatedEntry;
    }

    @Override
    public HttpCacheEntry updateVariantCacheEntry(final HttpHost target, final HttpRequest request,
            final HttpCacheEntry stale, final HttpResponse originResponse,
            final Date requestSent, final Date responseReceived, final String cacheKey) throws IOException {
        final HttpCacheEntry updatedEntry = cacheEntryUpdater.updateCacheEntry(
                request.getRequestLine().getUri(),
                stale,
                requestSent,
                responseReceived,
                originResponse);
        storage.putEntry(cacheKey, updatedEntry);
        return updatedEntry;
    }

    @Override
    public HttpResponse cacheAndReturnResponse(final HttpHost host, final HttpRequest request,
            final HttpResponse originResponse, final Date requestSent, final Date responseReceived)
            throws IOException {
        return cacheAndReturnResponse(host, request,
                Proxies.enhanceResponse(originResponse), requestSent,
                responseReceived);
    }

    @Override
    public CloseableHttpResponse cacheAndReturnResponse(
            final HttpHost host,
            final HttpRequest request,
            final CloseableHttpResponse originResponse,
            final Date requestSent,
            final Date responseReceived) throws IOException {

        boolean closeOriginResponse = true;
        final SizeLimitedResponseReader responseReader = getResponseReader(request, originResponse);
        try {
            responseReader.readResponse();

            if (responseReader.isLimitReached()) {
                closeOriginResponse = false;
                return responseReader.getReconstructedResponse();
            }

            final Resource resource = responseReader.getResource();
            if (isIncompleteResponse(originResponse, resource)) {
                return generateIncompleteResponseError(originResponse, resource);
            }

            final HttpCacheEntry entry = new HttpCacheEntry(
                    requestSent,
                    responseReceived,
                    originResponse.getStatusLine(),
                    originResponse.getAllHeaders(),
                    resource,
                    request.getRequestLine().getMethod());
            storeInCache(host, request, entry);
            return responseGenerator.generateResponse(HttpRequestWrapper.wrap(request, host), entry);
        } finally {
            if (closeOriginResponse) {
                originResponse.close();
            }
        }
    }

    SizeLimitedResponseReader getResponseReader(final HttpRequest request,
            final CloseableHttpResponse backEndResponse) {
        return new SizeLimitedResponseReader(
                resourceFactory, maxObjectSizeBytes, request, backEndResponse);
    }

    @Override
    public HttpCacheEntry getCacheEntry(final HttpHost host, final HttpRequest request) throws IOException {
        final HttpCacheEntry root = storage.getEntry(uriExtractor.getURI(host, request));
        if (root == null) {
            return null;
        }
        if (!root.hasVariants()) {
            return root;
        }
        final String variantCacheKey = root.getVariantMap().get(uriExtractor.getVariantKey(request, root));
        if (variantCacheKey == null) {
            return null;
        }
        return storage.getEntry(variantCacheKey);
    }

    @Override
    public void flushInvalidatedCacheEntriesFor(final HttpHost host,
            final HttpRequest request) throws IOException {
        cacheInvalidator.flushInvalidatedCacheEntries(host, request);
    }

    @Override
    public Map<String, Variant> getVariantCacheEntriesWithEtags(final HttpHost host, final HttpRequest request)
            throws IOException {
        final Map<String,Variant> variants = new HashMap<String,Variant>();
        final HttpCacheEntry root = storage.getEntry(uriExtractor.getURI(host, request));
        if (root == null || !root.hasVariants()) {
            return variants;
        }
        for(final Map.Entry<String, String> variant : root.getVariantMap().entrySet()) {
            final String variantKey = variant.getKey();
            final String variantCacheKey = variant.getValue();
            addVariantWithEtag(variantKey, variantCacheKey, variants);
        }
        return variants;
    }

    private void addVariantWithEtag(final String variantKey,
            final String variantCacheKey, final Map<String, Variant> variants)
            throws IOException {
        final HttpCacheEntry entry = storage.getEntry(variantCacheKey);
        if (entry == null) {
            return;
        }
        final Header etagHeader = entry.getFirstHeader(HeaderConstants.ETAG);
        if (etagHeader == null) {
            return;
        }
        variants.put(etagHeader.getValue(), new Variant(variantKey, variantCacheKey, entry));
    }

}
