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

import cz.msebera.android.httpclient.annotation.ThreadSafe;
import cz.msebera.android.httpclient.util.Args;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * An implementation that backs off exponentially based on the number of
 * consecutive failed attempts stored in the
 * {@link AsynchronousValidationRequest}. It uses the following defaults:
 * <pre>
 *         no delay in case it was never tried or didn't fail so far
 *     6 secs delay for one failed attempt (= {@link #getInitialExpiryInMillis()})
 *    60 secs delay for two failed attempts
 *    10 mins delay for three failed attempts
 *   100 mins delay for four failed attempts
 *  ~16 hours delay for five failed attempts
 *   24 hours delay for six or more failed attempts (= {@link #getMaxExpiryInMillis()})
 * </pre>
 *
 * The following equation is used to calculate the delay for a specific revalidation request:
 * <pre>
 *     delay = {@link #getInitialExpiryInMillis()} * Math.pow({@link #getBackOffRate()},
 *     {@link AsynchronousValidationRequest#getConsecutiveFailedAttempts()} - 1))
 * </pre>
 * The resulting delay won't exceed {@link #getMaxExpiryInMillis()}.
 *
 * @since 4.3
 */
@ThreadSafe
public class ExponentialBackOffSchedulingStrategy implements SchedulingStrategy {

    public static final long DEFAULT_BACK_OFF_RATE = 10;
    public static final long DEFAULT_INITIAL_EXPIRY_IN_MILLIS = TimeUnit.SECONDS.toMillis(6);
    public static final long DEFAULT_MAX_EXPIRY_IN_MILLIS = TimeUnit.SECONDS.toMillis(86400);

    private final long backOffRate;
    private final long initialExpiryInMillis;
    private final long maxExpiryInMillis;

    private final ScheduledExecutorService executor;

    /**
     * Create a new scheduling strategy using a fixed pool of worker threads.
     * @param cacheConfig the thread pool configuration to be used; not {@code null}
     * @see cz.msebera.android.httpclient.impl.client.cache.CacheConfig#getAsynchronousWorkersMax()
     * @see #DEFAULT_BACK_OFF_RATE
     * @see #DEFAULT_INITIAL_EXPIRY_IN_MILLIS
     * @see #DEFAULT_MAX_EXPIRY_IN_MILLIS
     */
    public ExponentialBackOffSchedulingStrategy(final CacheConfig cacheConfig) {
        this(cacheConfig,
                DEFAULT_BACK_OFF_RATE,
                DEFAULT_INITIAL_EXPIRY_IN_MILLIS,
                DEFAULT_MAX_EXPIRY_IN_MILLIS);
    }

    /**
     * Create a new scheduling strategy by using a fixed pool of worker threads and the
     * given parameters to calculated the delay.
     *
     * @param cacheConfig the thread pool configuration to be used; not {@code null}
     * @param backOffRate the back off rate to be used; not negative
     * @param initialExpiryInMillis the initial expiry in milli seconds; not negative
     * @param maxExpiryInMillis the upper limit of the delay in milli seconds; not negative
     * @see cz.msebera.android.httpclient.impl.client.cache.CacheConfig#getAsynchronousWorkersMax()
     * @see ExponentialBackOffSchedulingStrategy
     */
    public ExponentialBackOffSchedulingStrategy(
            final CacheConfig cacheConfig,
            final long backOffRate,
            final long initialExpiryInMillis,
            final long maxExpiryInMillis) {
        this(createThreadPoolFromCacheConfig(cacheConfig),
                backOffRate,
                initialExpiryInMillis,
                maxExpiryInMillis);
    }

    private static ScheduledThreadPoolExecutor createThreadPoolFromCacheConfig(
            final CacheConfig cacheConfig) {
        final ScheduledThreadPoolExecutor scheduledThreadPoolExecutor = new ScheduledThreadPoolExecutor(
                cacheConfig.getAsynchronousWorkersMax());
        scheduledThreadPoolExecutor.setExecuteExistingDelayedTasksAfterShutdownPolicy(false);
        return scheduledThreadPoolExecutor;
    }

    ExponentialBackOffSchedulingStrategy(
            final ScheduledExecutorService executor,
            final long backOffRate,
            final long initialExpiryInMillis,
            final long maxExpiryInMillis) {
        this.executor = Args.notNull(executor, "Executor");
        this.backOffRate = Args.notNegative(backOffRate, "BackOffRate");
        this.initialExpiryInMillis = Args.notNegative(initialExpiryInMillis, "InitialExpiryInMillis");
        this.maxExpiryInMillis = Args.notNegative(maxExpiryInMillis, "MaxExpiryInMillis");
    }

    @Override
    public void schedule(
            final AsynchronousValidationRequest revalidationRequest) {
        Args.notNull(revalidationRequest, "RevalidationRequest");
        final int consecutiveFailedAttempts = revalidationRequest.getConsecutiveFailedAttempts();
        final long delayInMillis = calculateDelayInMillis(consecutiveFailedAttempts);
        executor.schedule(revalidationRequest, delayInMillis, TimeUnit.MILLISECONDS);
    }

    @Override
    public void close() {
        executor.shutdown();
    }

    public long getBackOffRate() {
        return backOffRate;
    }

    public long getInitialExpiryInMillis() {
        return initialExpiryInMillis;
    }

    public long getMaxExpiryInMillis() {
        return maxExpiryInMillis;
    }

    protected long calculateDelayInMillis(final int consecutiveFailedAttempts) {
        if (consecutiveFailedAttempts > 0) {
            final long delayInSeconds = (long) (initialExpiryInMillis *
                    Math.pow(backOffRate, consecutiveFailedAttempts - 1));
            return Math.min(delayInSeconds, maxExpiryInMillis);
        }
        else {
            return 0;
        }
    }

    /**
     * @deprecated Use {@link cz.msebera.android.httpclient.util.Args#notNull(Object, String)}
     */
    @Deprecated
    protected static <T> T checkNotNull(final String parameterName, final T value) {
        if (value == null) {
            throw new IllegalArgumentException(parameterName + " may not be null");
        }
        return value;
    }

    /**
     * @deprecated Use {@link cz.msebera.android.httpclient.util.Args#notNegative(long, String)}
     */
    @Deprecated
    protected static long checkNotNegative(final String parameterName, final long value) {
        if (value < 0) {
            throw new IllegalArgumentException(parameterName + " may not be negative");
        }
        return value;
    }
}
