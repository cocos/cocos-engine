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

/**
 * This enumeration represents the various ways a response can be generated
 * by the {@link cz.msebera.android.httpclient.impl.client.cache.CachingHttpClient};
 * if a request is executed with an {@link cz.msebera.android.httpclient.protocol.HttpContext}
 * then a parameter with one of these values will be registered in the
 * context under the key
 * {@link cz.msebera.android.httpclient.impl.client.cache.CachingHttpClient#CACHE_RESPONSE_STATUS}.
 */
public enum CacheResponseStatus {

    /** The response was generated directly by the caching module. */
    CACHE_MODULE_RESPONSE,

    /** A response was generated from the cache with no requests sent
     * upstream.
     */
    CACHE_HIT,

    /** The response came from an upstream server. */
    CACHE_MISS,

    /** The response was generated from the cache after validating the
     * entry with the origin server.
     */
    VALIDATED

}
