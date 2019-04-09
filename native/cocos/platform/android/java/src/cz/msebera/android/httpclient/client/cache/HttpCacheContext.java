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

import cz.msebera.android.httpclient.annotation.NotThreadSafe;
import cz.msebera.android.httpclient.client.protocol.HttpClientContext;
import cz.msebera.android.httpclient.protocol.BasicHttpContext;
import cz.msebera.android.httpclient.protocol.HttpContext;

/**
 * @since 4.3
 */
@NotThreadSafe
public class HttpCacheContext extends HttpClientContext {

    /**
     * This is the name under which the {@link CacheResponseStatus} of a request
     * (for example, whether it resulted in a cache hit) will be recorded if an
     * {@link HttpContext} is provided during execution.
     */
    public static final String CACHE_RESPONSE_STATUS = "http.cache.response.status";

    public static HttpCacheContext adapt(final HttpContext context) {
        if (context instanceof HttpCacheContext) {
            return (HttpCacheContext) context;
        } else {
            return new HttpCacheContext(context);
        }
    }

    public static HttpCacheContext create() {
        return new HttpCacheContext(new BasicHttpContext());
    }

    public HttpCacheContext(final HttpContext context) {
        super(context);
    }

    public HttpCacheContext() {
        super();
    }

    public CacheResponseStatus getCacheResponseStatus() {
        return getAttribute(CACHE_RESPONSE_STATUS, CacheResponseStatus.class);
    }

}
