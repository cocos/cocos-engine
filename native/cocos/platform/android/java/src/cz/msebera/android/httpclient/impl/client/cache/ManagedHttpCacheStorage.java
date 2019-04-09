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
import java.lang.ref.ReferenceQueue;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import cz.msebera.android.httpclient.annotation.ThreadSafe;
import cz.msebera.android.httpclient.client.cache.HttpCacheEntry;
import cz.msebera.android.httpclient.client.cache.HttpCacheStorage;
import cz.msebera.android.httpclient.client.cache.HttpCacheUpdateCallback;
import cz.msebera.android.httpclient.client.cache.Resource;
import cz.msebera.android.httpclient.util.Args;

/**
 * <p>
 * {@link HttpCacheStorage} implementation capable of deallocating resources associated with
 * the cache entries.
 * <p>
 * This cache keeps track of cache entries using
 * {@link java.lang.ref.PhantomReference} and maintains a collection of all resources that
 * are no longer in use. The cache, however, does not automatically deallocates associated
 * resources by invoking {@link Resource#dispose()} method. The consumer MUST periodically
 * call {@link #cleanResources()} method to trigger resource deallocation. The cache can be
 * permanently shut down using {@link #shutdown()} method. All resources associated with
 * the entries used by the cache will be deallocated.
 * </p>
 * <p>
 * This {@link HttpCacheStorage} implementation is intended for use with {@link FileResource}
 * and similar.
 * </p>
 * <p>
 * Compatibility note. Prior to version 4.4 this storage implementation used to dispose of
 * all resource entries upon {@link #close()}. As of version 4.4 the {@link #close()} method
 * disposes only of those resources that have been explicitly removed from the cache with
 * {@link #removeEntry(String)} method.
 * </p>
 * <p>
 * The {@link #shutdown()} ()} method can still be used to shut down the storage and dispose of
 * all resources currently managed by it.
 * </p>
 *
 * @since 4.1
 */
@ThreadSafe
public class ManagedHttpCacheStorage implements HttpCacheStorage, Closeable {

    private final CacheMap entries;
    private final ReferenceQueue<HttpCacheEntry> morque;
    private final Set<ResourceReference> resources;
    private final AtomicBoolean active;

    public ManagedHttpCacheStorage(final CacheConfig config) {
        super();
        this.entries = new CacheMap(config.getMaxCacheEntries());
        this.morque = new ReferenceQueue<HttpCacheEntry>();
        this.resources = new HashSet<ResourceReference>();
        this.active = new AtomicBoolean(true);
    }

    private void ensureValidState() throws IllegalStateException {
        if (!this.active.get()) {
            throw new IllegalStateException("Cache has been shut down");
        }
    }

    private void keepResourceReference(final HttpCacheEntry entry) {
        final Resource resource = entry.getResource();
        if (resource != null) {
            // Must deallocate the resource when the entry is no longer in used
            final ResourceReference ref = new ResourceReference(entry, this.morque);
            this.resources.add(ref);
        }
    }

    @Override
    public void putEntry(final String url, final HttpCacheEntry entry) throws IOException {
        Args.notNull(url, "URL");
        Args.notNull(entry, "Cache entry");
        ensureValidState();
        synchronized (this) {
            this.entries.put(url, entry);
            keepResourceReference(entry);
        }
    }

    @Override
    public HttpCacheEntry getEntry(final String url) throws IOException {
        Args.notNull(url, "URL");
        ensureValidState();
        synchronized (this) {
            return this.entries.get(url);
        }
    }

    @Override
    public void removeEntry(final String url) throws IOException {
        Args.notNull(url, "URL");
        ensureValidState();
        synchronized (this) {
            // Cannot deallocate the associated resources immediately as the
            // cache entry may still be in use
            this.entries.remove(url);
        }
    }

    @Override
    public void updateEntry(
            final String url,
            final HttpCacheUpdateCallback callback) throws IOException {
        Args.notNull(url, "URL");
        Args.notNull(callback, "Callback");
        ensureValidState();
        synchronized (this) {
            final HttpCacheEntry existing = this.entries.get(url);
            final HttpCacheEntry updated = callback.update(existing);
            this.entries.put(url, updated);
            if (existing != updated) {
                keepResourceReference(updated);
            }
        }
    }

    public void cleanResources() {
        if (this.active.get()) {
            ResourceReference ref;
            while ((ref = (ResourceReference) this.morque.poll()) != null) {
                synchronized (this) {
                    this.resources.remove(ref);
                }
                ref.getResource().dispose();
            }
        }
    }

    public void shutdown() {
        if (this.active.compareAndSet(true, false)) {
            synchronized (this) {
                this.entries.clear();
                for (final ResourceReference ref: this.resources) {
                    ref.getResource().dispose();
                }
                this.resources.clear();
                while (this.morque.poll() != null) {
                }
            }
        }
    }

    @Override
    public void close() {
        if (this.active.compareAndSet(true, false)) {
            synchronized (this) {
                ResourceReference ref;
                while ((ref = (ResourceReference) this.morque.poll()) != null) {
                    this.resources.remove(ref);
                    ref.getResource().dispose();
                }
            }
        }
    }

}
