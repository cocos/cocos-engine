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

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Implements a bounded failure cache. The oldest entries are discarded when
 * the maximum size is exceeded.
 *
 * @since 4.3
 */
@ThreadSafe
public class DefaultFailureCache implements FailureCache {

    static final int DEFAULT_MAX_SIZE = 1000;
    static final int MAX_UPDATE_TRIES = 10;

    private final int maxSize;
    private final ConcurrentMap<String, FailureCacheValue> storage;

    /**
     * Create a new failure cache with the maximum size of
     * {@link #DEFAULT_MAX_SIZE}.
     */
    public DefaultFailureCache() {
        this(DEFAULT_MAX_SIZE);
    }

    /**
     * Creates a new failure cache with the specified maximum size.
     * @param maxSize the maximum number of entries the cache should store
     */
    public DefaultFailureCache(final int maxSize) {
        this.maxSize = maxSize;
        this.storage = new ConcurrentHashMap<String, FailureCacheValue>();
    }

    @Override
    public int getErrorCount(final String identifier) {
        if (identifier == null) {
            throw new IllegalArgumentException("identifier may not be null");
        }
        final FailureCacheValue storedErrorCode = storage.get(identifier);
        return storedErrorCode != null ? storedErrorCode.getErrorCount() : 0;
    }

    @Override
    public void resetErrorCount(final String identifier) {
        if (identifier == null) {
            throw new IllegalArgumentException("identifier may not be null");
        }
        storage.remove(identifier);
    }

    @Override
    public void increaseErrorCount(final String identifier) {
        if (identifier == null) {
            throw new IllegalArgumentException("identifier may not be null");
        }
        updateValue(identifier);
        removeOldestEntryIfMapSizeExceeded();
    }

    private void updateValue(final String identifier) {
        /**
         * Due to concurrency it is possible that someone else is modifying an
         * entry before we could write back our updated value. So we keep
         * trying until it is our turn.
         *
         * In case there is a lot of contention on that identifier, a thread
         * might starve. Thus it gives up after a certain number of failed
         * update tries.
         */
        for (int i = 0; i < MAX_UPDATE_TRIES; i++) {
            final FailureCacheValue oldValue = storage.get(identifier);
            if (oldValue == null) {
                final FailureCacheValue newValue = new FailureCacheValue(identifier, 1);
                if (storage.putIfAbsent(identifier, newValue) == null) {
                    return;
                }
            }
            else {
                final int errorCount = oldValue.getErrorCount();
                if (errorCount == Integer.MAX_VALUE) {
                    return;
                }
                final FailureCacheValue newValue = new FailureCacheValue(identifier, errorCount + 1);
                if (storage.replace(identifier, oldValue, newValue)) {
                    return;
                }
            }
        }
    }

    private void removeOldestEntryIfMapSizeExceeded() {
        if (storage.size() > maxSize) {
            final FailureCacheValue valueWithOldestTimestamp = findValueWithOldestTimestamp();
            if (valueWithOldestTimestamp != null) {
                storage.remove(valueWithOldestTimestamp.getKey(), valueWithOldestTimestamp);
            }
        }
    }

    private FailureCacheValue findValueWithOldestTimestamp() {
        long oldestTimestamp = Long.MAX_VALUE;
        FailureCacheValue oldestValue = null;
        for (final Map.Entry<String, FailureCacheValue> storageEntry : storage.entrySet()) {
            final FailureCacheValue value = storageEntry.getValue();
            final long creationTimeInNanos = value.getCreationTimeInNanos();
            if (creationTimeInNanos < oldestTimestamp) {
                oldestTimestamp = creationTimeInNanos;
                oldestValue = storageEntry.getValue();
            }
        }
        return oldestValue;
    }
}
