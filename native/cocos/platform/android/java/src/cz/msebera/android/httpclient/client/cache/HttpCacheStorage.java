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
package cz.msebera.android.httpclient.client.cache;

import java.io.IOException;

/**
 * New storage backends should implement this {@link HttpCacheStorage}
 * interface. They can then be plugged into the existing
 * {@link cz.msebera.android.httpclient.impl.client.cache.CachingHttpClient}
 * implementation.
 *
 * @since 4.1
 */
public interface HttpCacheStorage {

    /**
     * Store a given cache entry under the given key.
     * @param key where in the cache to store the entry
     * @param entry cached response to store
     * @throws IOException
     */
    void putEntry(String key, HttpCacheEntry entry) throws IOException;

    /**
     * Retrieves the cache entry stored under the given key
     * or null if no entry exists under that key.
     * @param key cache key
     * @return an {@link HttpCacheEntry} or {@code null} if no
     *   entry exists
     * @throws IOException
     */
    HttpCacheEntry getEntry(String key) throws IOException;

    /**
     * Deletes/invalidates/removes any cache entries currently
     * stored under the given key.
     * @param key
     * @throws IOException
     */
    void removeEntry(String key) throws IOException;

    /**
     * Atomically applies the given callback to update an existing cache
     * entry under a given key.
     * @param key indicates which entry to modify
     * @param callback performs the update; see
     *   {@link HttpCacheUpdateCallback} for details, but roughly the
     *   callback expects to be handed the current entry and will return
     *   the new value for the entry.
     * @throws IOException
     * @throws HttpCacheUpdateException
     */
    void updateEntry(
            String key, HttpCacheUpdateCallback callback) throws IOException, HttpCacheUpdateException;

}
