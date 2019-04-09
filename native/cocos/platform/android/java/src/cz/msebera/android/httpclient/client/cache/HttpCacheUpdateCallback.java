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
 * Used for atomically updating entries in a {@link HttpCacheStorage}
 * implementation. The current entry (if any) is fed into an implementation
 * of this interface, and the new, possibly updated entry (if any)
 * should be returned.
 */
public interface HttpCacheUpdateCallback {

    /**
     * Returns the new cache entry that should replace an existing one.
     *
     * @param existing
     *            the cache entry currently in-place in the cache, possibly
     *            {@code null} if nonexistent
     * @return the cache entry that should replace it, again,
     *         possibly {@code null} if the entry should be deleted
     *
     * @since 4.1
     */
    HttpCacheEntry update(HttpCacheEntry existing) throws IOException;

}
