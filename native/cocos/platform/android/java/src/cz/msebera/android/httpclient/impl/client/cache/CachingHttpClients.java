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

import java.io.File;

import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.impl.client.CloseableHttpClient;

/**
 * Factory methods for {@link CloseableHttpClient} instances
 * capable of client-side caching.
 *
 * @since 4.3
 */
@Immutable
public class CachingHttpClients {

    private CachingHttpClients() {
        super();
    }

    /**
     * Creates builder object for construction of custom
     * {@link CloseableHttpClient} instances.
     */
    public static CachingHttpClientBuilder custom() {
        return CachingHttpClientBuilder.create();
    }

    /**
     * Creates {@link CloseableHttpClient} instance that uses a memory bound
     * response cache.
     */
    public static CloseableHttpClient createMemoryBound() {
        return CachingHttpClientBuilder.create().build();
    }

    /**
     * Creates {@link CloseableHttpClient} instance that uses a file system
     * bound response cache.
     *
     * @param cacheDir location of response cache.
     */
    public static CloseableHttpClient createFileBound(final File cacheDir) {
        return CachingHttpClientBuilder.create().setCacheDir(cacheDir).build();
    }

}
