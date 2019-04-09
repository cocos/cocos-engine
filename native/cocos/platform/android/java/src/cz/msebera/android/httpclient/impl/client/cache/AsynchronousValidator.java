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

import java.io.Closeable;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.RejectedExecutionException;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.methods.HttpExecutionAware;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;
import cz.msebera.android.httpclient.client.protocol.HttpClientContext;
import cz.msebera.android.httpclient.conn.routing.HttpRoute;

/**
 * Class used for asynchronous revalidations to be used when the "stale-
 * while-revalidate" directive is present
 */
class AsynchronousValidator implements Closeable {
    private final SchedulingStrategy schedulingStrategy;
    private final Set<String> queued;
    private final CacheKeyGenerator cacheKeyGenerator;
    private final FailureCache failureCache;

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());

    /**
     * Create AsynchronousValidator which will make revalidation requests
     * using an {@link ImmediateSchedulingStrategy}. Its thread
     * pool will be configured according to the given {@link CacheConfig}.
     * @param config specifies thread pool settings. See
     * {@link CacheConfig#getAsynchronousWorkersMax()},
     * {@link CacheConfig#getAsynchronousWorkersCore()},
     * {@link CacheConfig#getAsynchronousWorkerIdleLifetimeSecs()},
     * and {@link CacheConfig#getRevalidationQueueSize()}.
     */
    public AsynchronousValidator(final CacheConfig config) {
        this(new ImmediateSchedulingStrategy(config));
    }

    /**
     * Create AsynchronousValidator which will make revalidation requests
     * using the supplied {@link SchedulingStrategy}. Closing the validator
     * will also close the given schedulingStrategy.
     * @param schedulingStrategy used to maintain a pool of worker threads and
     *                           schedules when requests are executed
     */
    AsynchronousValidator(final SchedulingStrategy schedulingStrategy) {
        this.schedulingStrategy = schedulingStrategy;
        this.queued = new HashSet<String>();
        this.cacheKeyGenerator = new CacheKeyGenerator();
        this.failureCache = new DefaultFailureCache();
    }

    @Override
    public void close() throws IOException {
        schedulingStrategy.close();
    }

    /**
     * Schedules an asynchronous revalidation
     */
    public synchronized void revalidateCacheEntry(
            final CachingExec cachingExec,
            final HttpRoute route,
            final HttpRequestWrapper request,
            final HttpClientContext context,
            final HttpExecutionAware execAware,
            final HttpCacheEntry entry) {
        // getVariantURI will fall back on getURI if no variants exist
        final String uri = cacheKeyGenerator.getVariantURI(context.getTargetHost(), request, entry);

        if (!queued.contains(uri)) {
            final int consecutiveFailedAttempts = failureCache.getErrorCount(uri);
            final AsynchronousValidationRequest revalidationRequest =
                new AsynchronousValidationRequest(
                        this, cachingExec, route, request, context, execAware, entry, uri, consecutiveFailedAttempts);

            try {
                schedulingStrategy.schedule(revalidationRequest);
                queued.add(uri);
            } catch (final RejectedExecutionException ree) {
                log.debug("Revalidation for [" + uri + "] not scheduled: " + ree);
            }
        }
    }

    /**
     * Removes an identifier from the internal list of revalidation jobs in
     * progress.  This is meant to be called by
     * {@link AsynchronousValidationRequest#run()} once the revalidation is
     * complete, using the identifier passed in during constructions.
     * @param identifier
     */
    synchronized void markComplete(final String identifier) {
        queued.remove(identifier);
    }

    /**
     * The revalidation job was successful thus the number of consecutive
     * failed attempts will be reset to zero. Should be called by
     * {@link AsynchronousValidationRequest#run()}.
     * @param identifier the revalidation job's unique identifier
     */
    void jobSuccessful(final String identifier) {
        failureCache.resetErrorCount(identifier);
    }

    /**
     * The revalidation job did fail and thus the number of consecutive failed
     * attempts will be increased. Should be called by
     * {@link AsynchronousValidationRequest#run()}.
     * @param identifier the revalidation job's unique identifier
     */
    void jobFailed(final String identifier) {
        failureCache.increaseErrorCount(identifier);
    }

    Set<String> getScheduledIdentifiers() {
        return Collections.unmodifiableSet(queued);
    }
}
