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

import cz.msebera.android.httpclient.util.Args;

/**
 * <p>Java Beans-style configuration for a {@link CachingHttpClient}. Any class
 * in the caching module that has configuration options should take a
 * {@link CacheConfig} argument in one of its constructors. A
 * {@code CacheConfig} instance has sane and conservative defaults, so the
 * easiest way to specify options is to get an instance and then set just
 * the options you want to modify from their defaults.</p>
 *
 * <p><b>N.B.</b> This class is only for caching-specific configuration; to
 * configure the behavior of the rest of the client, configure the
 * {@link cz.msebera.android.httpclient.client.HttpClient} used as the &quot;backend&quot;
 * for the {@code CachingHttpClient}.</p>
 *
 * <p>Cache configuration can be grouped into the following categories:</p>
 *
 * <p><b>Cache size.</b> If the backend storage supports these limits, you
 * can specify the {@link CacheConfig#getMaxCacheEntries maximum number of
 * cache entries} as well as the {@link CacheConfig#getMaxObjectSizeBytes
 * maximum cacheable response body size}.</p>
 *
 * <p><b>Public/private caching.</b> By default, the caching module considers
 * itself to be a shared (public) cache, and will not, for example, cache
 * responses to requests with {@code Authorization} headers or responses
 * marked with {@code Cache-Control: private}. If, however, the cache
 * is only going to be used by one logical "user" (behaving similarly to a
 * browser cache), then you will want to {@link
 * CacheConfig#setSharedCache(boolean) turn off the shared cache setting}.</p>
 *
 * <p><b>303 caching</b>. RFC2616 explicitly disallows caching 303 responses;
 * however, the HTTPbis working group says they can be cached
 * if explicitly indicated in the response headers and permitted by the request method.
 * (They also indicate that disallowing 303 caching is actually an unintended
 * spec error in RFC2616).
 * This behavior is off by default, to err on the side of a conservative
 * adherence to the existing standard, but you may want to
 * {@link Builder#setAllow303Caching(boolean) enable it}.
 *
 * <p><b>Weak ETags on PUT/DELETE If-Match requests</b>. RFC2616 explicitly
 * prohibits the use of weak validators in non-GET requests, however, the
 * HTTPbis working group says while the limitation for weak validators on ranged
 * requests makes sense, weak ETag validation is useful on full non-GET
 * requests; e.g., PUT with If-Match. This behavior is off by default, to err on
 * the side of a conservative adherence to the existing standard, but you may
 * want to {@link Builder#setWeakETagOnPutDeleteAllowed(boolean) enable it}.
 *
 * <p><b>Heuristic caching</b>. Per RFC2616, a cache may cache certain cache
 * entries even if no explicit cache control headers are set by the origin.
 * This behavior is off by default, but you may want to turn this on if you
 * are working with an origin that doesn't set proper headers but where you
 * still want to cache the responses. You will want to {@link
 * CacheConfig#setHeuristicCachingEnabled(boolean) enable heuristic caching},
 * then specify either a {@link CacheConfig#getHeuristicDefaultLifetime()
 * default freshness lifetime} and/or a {@link
 * CacheConfig#setHeuristicCoefficient(float) fraction of the time since
 * the resource was last modified}. See Sections
 * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.2">
 * 13.2.2</a> and <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.4">
 * 13.2.4</a> of the HTTP/1.1 RFC for more details on heuristic caching.</p>
 *
 * <p><b>Background validation</b>. The cache module supports the
 * {@code stale-while-revalidate} directive of
 * <a href="http://tools.ietf.org/html/rfc5861">RFC5861</a>, which allows
 * certain cache entry revalidations to happen in the background. You may
 * want to tweak the settings for the {@link
 * CacheConfig#getAsynchronousWorkersCore() minimum} and {@link
 * CacheConfig#getAsynchronousWorkersMax() maximum} number of background
 * worker threads, as well as the {@link
 * CacheConfig#getAsynchronousWorkerIdleLifetimeSecs() maximum time they
 * can be idle before being reclaimed}. You can also control the {@link
 * CacheConfig#getRevalidationQueueSize() size of the queue} used for
 * revalidations when there aren't enough workers to keep up with demand.</p>
 */
public class CacheConfig implements Cloneable {

    /** Default setting for the maximum object size that will be
     * cached, in bytes.
     */
    public final static int DEFAULT_MAX_OBJECT_SIZE_BYTES = 8192;

    /** Default setting for the maximum number of cache entries
     * that will be retained.
     */
    public final static int DEFAULT_MAX_CACHE_ENTRIES = 1000;

    /** Default setting for the number of retries on a failed
     * cache update
     */
    public final static int DEFAULT_MAX_UPDATE_RETRIES = 1;

    /** Default setting for 303 caching
     */
    public final static boolean DEFAULT_303_CACHING_ENABLED = false;

    /** Default setting to allow weak tags on PUT/DELETE methods
     */
    public final static boolean DEFAULT_WEAK_ETAG_ON_PUTDELETE_ALLOWED = false;

    /** Default setting for heuristic caching
     */
    public final static boolean DEFAULT_HEURISTIC_CACHING_ENABLED = false;

    /** Default coefficient used to heuristically determine freshness
     * lifetime from the Last-Modified time of a cache entry.
     */
    public final static float DEFAULT_HEURISTIC_COEFFICIENT = 0.1f;

    /** Default lifetime in seconds to be assumed when we cannot calculate
     * freshness heuristically.
     */
    public final static long DEFAULT_HEURISTIC_LIFETIME = 0;

    /** Default number of worker threads to allow for background revalidations
     * resulting from the stale-while-revalidate directive.
     */
    public static final int DEFAULT_ASYNCHRONOUS_WORKERS_MAX = 1;

    /** Default minimum number of worker threads to allow for background
     * revalidations resulting from the stale-while-revalidate directive.
     */
    public static final int DEFAULT_ASYNCHRONOUS_WORKERS_CORE = 1;

    /** Default maximum idle lifetime for a background revalidation thread
     * before it gets reclaimed.
     */
    public static final int DEFAULT_ASYNCHRONOUS_WORKER_IDLE_LIFETIME_SECS = 60;

    /** Default maximum queue length for background revalidation requests.
     */
    public static final int DEFAULT_REVALIDATION_QUEUE_SIZE = 100;

    public static final CacheConfig DEFAULT = new Builder().build();

    // TODO: make final
    private long maxObjectSize;
    private int maxCacheEntries;
    private int maxUpdateRetries;
    private boolean allow303Caching;
    private boolean weakETagOnPutDeleteAllowed;
    private boolean heuristicCachingEnabled;
    private float heuristicCoefficient;
    private long heuristicDefaultLifetime;
    private boolean isSharedCache;
    private int asynchronousWorkersMax;
    private int asynchronousWorkersCore;
    private int asynchronousWorkerIdleLifetimeSecs;
    private int revalidationQueueSize;
    private boolean neverCacheHTTP10ResponsesWithQuery;

    /**
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public CacheConfig() {
        super();
        this.maxObjectSize = DEFAULT_MAX_OBJECT_SIZE_BYTES;
        this.maxCacheEntries = DEFAULT_MAX_CACHE_ENTRIES;
        this.maxUpdateRetries = DEFAULT_MAX_UPDATE_RETRIES;
        this.allow303Caching = DEFAULT_303_CACHING_ENABLED;
        this.weakETagOnPutDeleteAllowed = DEFAULT_WEAK_ETAG_ON_PUTDELETE_ALLOWED;
        this.heuristicCachingEnabled = DEFAULT_HEURISTIC_CACHING_ENABLED;
        this.heuristicCoefficient = DEFAULT_HEURISTIC_COEFFICIENT;
        this.heuristicDefaultLifetime = DEFAULT_HEURISTIC_LIFETIME;
        this.isSharedCache = true;
        this.asynchronousWorkersMax = DEFAULT_ASYNCHRONOUS_WORKERS_MAX;
        this.asynchronousWorkersCore = DEFAULT_ASYNCHRONOUS_WORKERS_CORE;
        this.asynchronousWorkerIdleLifetimeSecs = DEFAULT_ASYNCHRONOUS_WORKER_IDLE_LIFETIME_SECS;
        this.revalidationQueueSize = DEFAULT_REVALIDATION_QUEUE_SIZE;
    }

    CacheConfig(
            final long maxObjectSize,
            final int maxCacheEntries,
            final int maxUpdateRetries,
            final boolean allow303Caching,
            final boolean weakETagOnPutDeleteAllowed,
            final boolean heuristicCachingEnabled,
            final float heuristicCoefficient,
            final long heuristicDefaultLifetime,
            final boolean isSharedCache,
            final int asynchronousWorkersMax,
            final int asynchronousWorkersCore,
            final int asynchronousWorkerIdleLifetimeSecs,
            final int revalidationQueueSize,
            final boolean neverCacheHTTP10ResponsesWithQuery) {
        super();
        this.maxObjectSize = maxObjectSize;
        this.maxCacheEntries = maxCacheEntries;
        this.maxUpdateRetries = maxUpdateRetries;
        this.allow303Caching = allow303Caching;
        this.weakETagOnPutDeleteAllowed = weakETagOnPutDeleteAllowed;
        this.heuristicCachingEnabled = heuristicCachingEnabled;
        this.heuristicCoefficient = heuristicCoefficient;
        this.heuristicDefaultLifetime = heuristicDefaultLifetime;
        this.isSharedCache = isSharedCache;
        this.asynchronousWorkersMax = asynchronousWorkersMax;
        this.asynchronousWorkersCore = asynchronousWorkersCore;
        this.asynchronousWorkerIdleLifetimeSecs = asynchronousWorkerIdleLifetimeSecs;
        this.revalidationQueueSize = revalidationQueueSize;
    }

    /**
     * Returns the current maximum response body size that will be cached.
     * @return size in bytes
     *
     * @deprecated (4.2)  use {@link #getMaxObjectSize()}
     */
    @Deprecated
    public int getMaxObjectSizeBytes() {
        return maxObjectSize > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) maxObjectSize;
    }

    /**
     * Specifies the maximum response body size that will be eligible for caching.
     * @param maxObjectSizeBytes size in bytes
     *
     * @deprecated (4.2)  use {@link Builder}.
     */
    @Deprecated
    public void setMaxObjectSizeBytes(final int maxObjectSizeBytes) {
        if (maxObjectSizeBytes > Integer.MAX_VALUE) {
            this.maxObjectSize = Integer.MAX_VALUE;
        } else {
            this.maxObjectSize = maxObjectSizeBytes;
        }
    }

    /**
     * Returns the current maximum response body size that will be cached.
     * @return size in bytes
     *
     * @since 4.2
     */
    public long getMaxObjectSize() {
        return maxObjectSize;
    }

    /**
     * Specifies the maximum response body size that will be eligible for caching.
     * @param maxObjectSize size in bytes
     *
     * @since 4.2
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setMaxObjectSize(final long maxObjectSize) {
        this.maxObjectSize = maxObjectSize;
    }

    /**
     * Returns whether the cache will never cache HTTP 1.0 responses with a query string or not.
     * @return {@code true} to not cache query string responses, {@code false} to cache if explicit cache headers are
     * found
     */
    public boolean isNeverCacheHTTP10ResponsesWithQuery() {
        return neverCacheHTTP10ResponsesWithQuery;
    }

    /**
     * Returns the maximum number of cache entries the cache will retain.
     */
    public int getMaxCacheEntries() {
        return maxCacheEntries;
    }

    /**
     * Sets the maximum number of cache entries the cache will retain.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setMaxCacheEntries(final int maxCacheEntries) {
        this.maxCacheEntries = maxCacheEntries;
    }

    /**
     * Returns the number of times to retry a cache update on failure
     */
    public int getMaxUpdateRetries(){
        return maxUpdateRetries;
    }

    /**
     * Sets the number of times to retry a cache update on failure
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setMaxUpdateRetries(final int maxUpdateRetries){
        this.maxUpdateRetries = maxUpdateRetries;
    }

    /**
     * Returns whether 303 caching is enabled.
     * @return {@code true} if it is enabled.
     */
    public boolean is303CachingEnabled() {
        return allow303Caching;
    }

    /**
     * Returns whether weak etags is allowed with PUT/DELETE methods.
     * @return {@code true} if it is allowed.
     */
    public boolean isWeakETagOnPutDeleteAllowed() {
        return weakETagOnPutDeleteAllowed;
    }

    /**
     * Returns whether heuristic caching is enabled.
     * @return {@code true} if it is enabled.
     */
    public boolean isHeuristicCachingEnabled() {
        return heuristicCachingEnabled;
    }

    /**
     * Enables or disables heuristic caching.
     * @param heuristicCachingEnabled should be {@code true} to
     *   permit heuristic caching, {@code false} to disable it.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setHeuristicCachingEnabled(final boolean heuristicCachingEnabled) {
        this.heuristicCachingEnabled = heuristicCachingEnabled;
    }

    /**
     * Returns lifetime coefficient used in heuristic freshness caching.
     */
    public float getHeuristicCoefficient() {
        return heuristicCoefficient;
    }

    /**
     * Sets coefficient to be used in heuristic freshness caching. This is
     * interpreted as the fraction of the time between the {@code Last-Modified}
     * and {@code Date} headers of a cached response during which the cached
     * response will be considered heuristically fresh.
     * @param heuristicCoefficient should be between {@code 0.0} and
     *   {@code 1.0}.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setHeuristicCoefficient(final float heuristicCoefficient) {
        this.heuristicCoefficient = heuristicCoefficient;
    }

    /**
     * Get the default lifetime to be used if heuristic freshness calculation is
     * not possible.
     */
    public long getHeuristicDefaultLifetime() {
        return heuristicDefaultLifetime;
    }

    /**
     * Sets default lifetime in seconds to be used if heuristic freshness
     * calculation is not possible. Explicit cache control directives on
     * either the request or origin response will override this, as will
     * the heuristic {@code Last-Modified} freshness calculation if it is
     * available.
     * @param heuristicDefaultLifetimeSecs is the number of seconds to
     *   consider a cache-eligible response fresh in the absence of other
     *   information. Set this to {@code 0} to disable this style of
     *   heuristic caching.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setHeuristicDefaultLifetime(final long heuristicDefaultLifetimeSecs) {
        this.heuristicDefaultLifetime = heuristicDefaultLifetimeSecs;
    }

    /**
     * Returns whether the cache will behave as a shared cache or not.
     * @return {@code true} for a shared cache, {@code false} for a non-
     * shared (private) cache
     */
    public boolean isSharedCache() {
        return isSharedCache;
    }

    /**
     * Sets whether the cache should behave as a shared cache or not.
     * @param isSharedCache true to behave as a shared cache, false to
     * behave as a non-shared (private) cache. To have the cache
     * behave like a browser cache, you want to set this to {@code false}.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setSharedCache(final boolean isSharedCache) {
        this.isSharedCache = isSharedCache;
    }

    /**
     * Returns the maximum number of threads to allow for background
     * revalidations due to the {@code stale-while-revalidate} directive. A
     * value of 0 means background revalidations are disabled.
     */
    public int getAsynchronousWorkersMax() {
        return asynchronousWorkersMax;
    }

    /**
     * Sets the maximum number of threads to allow for background
     * revalidations due to the {@code stale-while-revalidate} directive.
     * @param max number of threads; a value of 0 disables background
     * revalidations.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setAsynchronousWorkersMax(final int max) {
        this.asynchronousWorkersMax = max;
    }

    /**
     * Returns the minimum number of threads to keep alive for background
     * revalidations due to the {@code stale-while-revalidate} directive.
     */
    public int getAsynchronousWorkersCore() {
        return asynchronousWorkersCore;
    }

    /**
     * Sets the minimum number of threads to keep alive for background
     * revalidations due to the {@code stale-while-revalidate} directive.
     * @param min should be greater than zero and less than or equal
     *   to {@code getAsynchronousWorkersMax()}
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setAsynchronousWorkersCore(final int min) {
        this.asynchronousWorkersCore = min;
    }

    /**
     * Returns the current maximum idle lifetime in seconds for a
     * background revalidation worker thread. If a worker thread is idle
     * for this long, and there are more than the core number of worker
     * threads alive, the worker will be reclaimed.
     */
    public int getAsynchronousWorkerIdleLifetimeSecs() {
        return asynchronousWorkerIdleLifetimeSecs;
    }

    /**
     * Sets the current maximum idle lifetime in seconds for a
     * background revalidation worker thread. If a worker thread is idle
     * for this long, and there are more than the core number of worker
     * threads alive, the worker will be reclaimed.
     * @param secs idle lifetime in seconds
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setAsynchronousWorkerIdleLifetimeSecs(final int secs) {
        this.asynchronousWorkerIdleLifetimeSecs = secs;
    }

    /**
     * Returns the current maximum queue size for background revalidations.
     */
    public int getRevalidationQueueSize() {
        return revalidationQueueSize;
    }

    /**
     * Sets the current maximum queue size for background revalidations.
     *
     * @deprecated (4.3) use {@link Builder}.
     */
    @Deprecated
    public void setRevalidationQueueSize(final int size) {
        this.revalidationQueueSize = size;
    }

    @Override
    protected CacheConfig clone() throws CloneNotSupportedException {
        return (CacheConfig) super.clone();
    }

    public static Builder custom() {
        return new Builder();
    }

    public static Builder copy(final CacheConfig config) {
        Args.notNull(config, "Cache config");
        return new Builder()
            .setMaxObjectSize(config.getMaxObjectSize())
            .setMaxCacheEntries(config.getMaxCacheEntries())
            .setMaxUpdateRetries(config.getMaxUpdateRetries())
            .setHeuristicCachingEnabled(config.isHeuristicCachingEnabled())
            .setHeuristicCoefficient(config.getHeuristicCoefficient())
            .setHeuristicDefaultLifetime(config.getHeuristicDefaultLifetime())
            .setSharedCache(config.isSharedCache())
            .setAsynchronousWorkersMax(config.getAsynchronousWorkersMax())
            .setAsynchronousWorkersCore(config.getAsynchronousWorkersCore())
            .setAsynchronousWorkerIdleLifetimeSecs(config.getAsynchronousWorkerIdleLifetimeSecs())
            .setRevalidationQueueSize(config.getRevalidationQueueSize())
            .setNeverCacheHTTP10ResponsesWithQueryString(config.isNeverCacheHTTP10ResponsesWithQuery());
    }


    public static class Builder {

        private long maxObjectSize;
        private int maxCacheEntries;
        private int maxUpdateRetries;
        private boolean allow303Caching;
        private boolean weakETagOnPutDeleteAllowed;
        private boolean heuristicCachingEnabled;
        private float heuristicCoefficient;
        private long heuristicDefaultLifetime;
        private boolean isSharedCache;
        private int asynchronousWorkersMax;
        private int asynchronousWorkersCore;
        private int asynchronousWorkerIdleLifetimeSecs;
        private int revalidationQueueSize;
        private boolean neverCacheHTTP10ResponsesWithQuery;

        Builder() {
            this.maxObjectSize = DEFAULT_MAX_OBJECT_SIZE_BYTES;
            this.maxCacheEntries = DEFAULT_MAX_CACHE_ENTRIES;
            this.maxUpdateRetries = DEFAULT_MAX_UPDATE_RETRIES;
            this.allow303Caching = DEFAULT_303_CACHING_ENABLED;
            this.weakETagOnPutDeleteAllowed = DEFAULT_WEAK_ETAG_ON_PUTDELETE_ALLOWED;
            this.heuristicCachingEnabled = false;
            this.heuristicCoefficient = DEFAULT_HEURISTIC_COEFFICIENT;
            this.heuristicDefaultLifetime = DEFAULT_HEURISTIC_LIFETIME;
            this.isSharedCache = true;
            this.asynchronousWorkersMax = DEFAULT_ASYNCHRONOUS_WORKERS_MAX;
            this.asynchronousWorkersCore = DEFAULT_ASYNCHRONOUS_WORKERS_CORE;
            this.asynchronousWorkerIdleLifetimeSecs = DEFAULT_ASYNCHRONOUS_WORKER_IDLE_LIFETIME_SECS;
            this.revalidationQueueSize = DEFAULT_REVALIDATION_QUEUE_SIZE;
        }

        /**
         * Specifies the maximum response body size that will be eligible for caching.
         * @param maxObjectSize size in bytes
         */
        public Builder setMaxObjectSize(final long maxObjectSize) {
            this.maxObjectSize = maxObjectSize;
            return this;
        }

        /**
         * Sets the maximum number of cache entries the cache will retain.
         */
        public Builder setMaxCacheEntries(final int maxCacheEntries) {
            this.maxCacheEntries = maxCacheEntries;
            return this;
        }

        /**
         * Sets the number of times to retry a cache update on failure
         */
        public Builder setMaxUpdateRetries(final int maxUpdateRetries) {
            this.maxUpdateRetries = maxUpdateRetries;
            return this;
        }

        /**
         * Enables or disables 303 caching.
         * @param allow303Caching should be {@code true} to
         *   permit 303 caching, {@code false} to disable it.
         */
        public Builder setAllow303Caching(final boolean allow303Caching) {
            this.allow303Caching = allow303Caching;
            return this;
        }

        /**
         * Allows or disallows weak etags to be used with PUT/DELETE If-Match requests.
         * @param weakETagOnPutDeleteAllowed should be {@code true} to
         *   permit weak etags, {@code false} to reject them.
         */
        public Builder setWeakETagOnPutDeleteAllowed(final boolean weakETagOnPutDeleteAllowed) {
            this.weakETagOnPutDeleteAllowed = weakETagOnPutDeleteAllowed;
            return this;
        }

        /**
         * Enables or disables heuristic caching.
         * @param heuristicCachingEnabled should be {@code true} to
         *   permit heuristic caching, {@code false} to enable it.
         */
        public Builder setHeuristicCachingEnabled(final boolean heuristicCachingEnabled) {
            this.heuristicCachingEnabled = heuristicCachingEnabled;
            return this;
        }

        /**
         * Sets coefficient to be used in heuristic freshness caching. This is
         * interpreted as the fraction of the time between the {@code Last-Modified}
         * and {@code Date} headers of a cached response during which the cached
         * response will be considered heuristically fresh.
         * @param heuristicCoefficient should be between {@code 0.0} and
         *   {@code 1.0}.
         */
        public Builder setHeuristicCoefficient(final float heuristicCoefficient) {
            this.heuristicCoefficient = heuristicCoefficient;
            return this;
        }

        /**
         * Sets default lifetime in seconds to be used if heuristic freshness
         * calculation is not possible. Explicit cache control directives on
         * either the request or origin response will override this, as will
         * the heuristic {@code Last-Modified} freshness calculation if it is
         * available.
         * @param heuristicDefaultLifetime is the number of seconds to
         *   consider a cache-eligible response fresh in the absence of other
         *   information. Set this to {@code 0} to disable this style of
         *   heuristic caching.
         */
        public Builder setHeuristicDefaultLifetime(final long heuristicDefaultLifetime) {
            this.heuristicDefaultLifetime = heuristicDefaultLifetime;
            return this;
        }

        /**
         * Sets whether the cache should behave as a shared cache or not.
         * @param isSharedCache true to behave as a shared cache, false to
         * behave as a non-shared (private) cache. To have the cache
         * behave like a browser cache, you want to set this to {@code false}.
         */
        public Builder setSharedCache(final boolean isSharedCache) {
            this.isSharedCache = isSharedCache;
            return this;
        }

        /**
         * Sets the maximum number of threads to allow for background
         * revalidations due to the {@code stale-while-revalidate} directive.
         * @param asynchronousWorkersMax number of threads; a value of 0 disables background
         * revalidations.
         */
        public Builder setAsynchronousWorkersMax(final int asynchronousWorkersMax) {
            this.asynchronousWorkersMax = asynchronousWorkersMax;
            return this;
        }

        /**
         * Sets the minimum number of threads to keep alive for background
         * revalidations due to the {@code stale-while-revalidate} directive.
         * @param asynchronousWorkersCore should be greater than zero and less than or equal
         *   to {@code getAsynchronousWorkersMax()}
         */
        public Builder setAsynchronousWorkersCore(final int asynchronousWorkersCore) {
            this.asynchronousWorkersCore = asynchronousWorkersCore;
            return this;
        }

        /**
         * Sets the current maximum idle lifetime in seconds for a
         * background revalidation worker thread. If a worker thread is idle
         * for this long, and there are more than the core number of worker
         * threads alive, the worker will be reclaimed.
         * @param asynchronousWorkerIdleLifetimeSecs idle lifetime in seconds
         */
        public Builder setAsynchronousWorkerIdleLifetimeSecs(final int asynchronousWorkerIdleLifetimeSecs) {
            this.asynchronousWorkerIdleLifetimeSecs = asynchronousWorkerIdleLifetimeSecs;
            return this;
        }

        /**
         * Sets the current maximum queue size for background revalidations.
         */
        public Builder setRevalidationQueueSize(final int revalidationQueueSize) {
            this.revalidationQueueSize = revalidationQueueSize;
            return this;
        }

        /**
         * Sets whether the cache should never cache HTTP 1.0 responses with a query string or not.
         * @param neverCacheHTTP10ResponsesWithQuery true to never cache responses with a query
         * string, false to cache if explicit cache headers are found.  Set this to {@code true}
         * to better emulate IE, which also never caches responses, regardless of what caching
         * headers may be present.
         */
        public Builder setNeverCacheHTTP10ResponsesWithQueryString(
                final boolean neverCacheHTTP10ResponsesWithQuery) {
            this.neverCacheHTTP10ResponsesWithQuery = neverCacheHTTP10ResponsesWithQuery;
            return this;
        }

        public CacheConfig build() {
            return new CacheConfig(
                    maxObjectSize,
                    maxCacheEntries,
                    maxUpdateRetries,
                    allow303Caching,
                    weakETagOnPutDeleteAllowed,
                    heuristicCachingEnabled,
                    heuristicCoefficient,
                    heuristicDefaultLifetime,
                    isSharedCache,
                    asynchronousWorkersMax,
                    asynchronousWorkersCore,
                    asynchronousWorkerIdleLifetimeSecs,
                    revalidationQueueSize,
                    neverCacheHTTP10ResponsesWithQuery);
        }

    }

    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("[maxObjectSize=").append(this.maxObjectSize)
                .append(", maxCacheEntries=").append(this.maxCacheEntries)
                .append(", maxUpdateRetries=").append(this.maxUpdateRetries)
                .append(", 303CachingEnabled=").append(this.allow303Caching)
                .append(", weakETagOnPutDeleteAllowed=").append(this.weakETagOnPutDeleteAllowed)
                .append(", heuristicCachingEnabled=").append(this.heuristicCachingEnabled)
                .append(", heuristicCoefficient=").append(this.heuristicCoefficient)
                .append(", heuristicDefaultLifetime=").append(this.heuristicDefaultLifetime)
                .append(", isSharedCache=").append(this.isSharedCache)
                .append(", asynchronousWorkersMax=").append(this.asynchronousWorkersMax)
                .append(", asynchronousWorkersCore=").append(this.asynchronousWorkersCore)
                .append(", asynchronousWorkerIdleLifetimeSecs=").append(this.asynchronousWorkerIdleLifetimeSecs)
                .append(", revalidationQueueSize=").append(this.revalidationQueueSize)
                .append(", neverCacheHTTP10ResponsesWithQuery=").append(this.neverCacheHTTP10ResponsesWithQuery)
                .append("]");
        return builder.toString();
    }

}
