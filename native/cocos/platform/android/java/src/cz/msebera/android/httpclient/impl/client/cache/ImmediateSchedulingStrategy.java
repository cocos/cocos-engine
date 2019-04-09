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

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Immediately schedules any incoming validation request. Relies on
 * {@link CacheConfig} to configure the used {@link java.util.concurrent.ThreadPoolExecutor}.
 *
 * @since 4.3
 */
@ThreadSafe
public class ImmediateSchedulingStrategy implements SchedulingStrategy {

    private final ExecutorService executor;

    /**
     * Uses a {@link java.util.concurrent.ThreadPoolExecutor} which is configured according to the
     * given {@link CacheConfig}.
     * @param cacheConfig specifies thread pool settings. See
     * {@link CacheConfig#getAsynchronousWorkersMax()},
     * {@link CacheConfig#getAsynchronousWorkersCore()},
     * {@link CacheConfig#getAsynchronousWorkerIdleLifetimeSecs()},
     * and {@link CacheConfig#getRevalidationQueueSize()}.
     */
    public ImmediateSchedulingStrategy(final CacheConfig cacheConfig) {
        this(new ThreadPoolExecutor(
                cacheConfig.getAsynchronousWorkersCore(),
                cacheConfig.getAsynchronousWorkersMax(),
                cacheConfig.getAsynchronousWorkerIdleLifetimeSecs(),
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(cacheConfig.getRevalidationQueueSize()))
        );
    }

    ImmediateSchedulingStrategy(final ExecutorService executor) {
        this.executor = executor;
    }

    @Override
    public void schedule(final AsynchronousValidationRequest revalidationRequest) {
        Args.notNull(revalidationRequest, "AsynchronousValidationRequest");
        executor.execute(revalidationRequest);
    }

    @Override
    public void close() {
        executor.shutdown();
    }

    /**
     * Visible for testing.
     */
    void awaitTermination(final long timeout, final TimeUnit unit) throws InterruptedException {
        executor.awaitTermination(timeout, unit);
    }
}
