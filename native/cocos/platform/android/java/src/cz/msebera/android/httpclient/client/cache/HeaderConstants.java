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

import cz.msebera.android.httpclient.annotation.Immutable;

/**
 * Records static constants for various HTTP header names.
 * @since 4.1
 */
@Immutable
public class HeaderConstants {

    public static final String GET_METHOD = "GET";
    public static final String HEAD_METHOD = "HEAD";
    public static final String OPTIONS_METHOD = "OPTIONS";
    public static final String PUT_METHOD = "PUT";
    public static final String DELETE_METHOD = "DELETE";
    public static final String TRACE_METHOD = "TRACE";

    public static final String LAST_MODIFIED = "Last-Modified";
    public static final String IF_MATCH = "If-Match";
    public static final String IF_RANGE = "If-Range";
    public static final String IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
    public static final String IF_MODIFIED_SINCE = "If-Modified-Since";
    public static final String IF_NONE_MATCH = "If-None-Match";

    public static final String PRAGMA = "Pragma";
    public static final String MAX_FORWARDS = "Max-Forwards";
    public static final String ETAG = "ETag";
    public static final String EXPIRES = "Expires";
    public static final String AGE = "Age";
    public static final String VARY = "Vary";
    public static final String ALLOW = "Allow";
    public static final String VIA = "Via";
    public static final String PUBLIC = "public";
    public static final String PRIVATE = "private";

    public static final String CACHE_CONTROL = "Cache-Control";
    public static final String CACHE_CONTROL_NO_STORE = "no-store";
    public static final String CACHE_CONTROL_NO_CACHE = "no-cache";
    public static final String CACHE_CONTROL_MAX_AGE = "max-age";
    public static final String CACHE_CONTROL_MAX_STALE = "max-stale";
    public static final String CACHE_CONTROL_MIN_FRESH = "min-fresh";
    public static final String CACHE_CONTROL_MUST_REVALIDATE = "must-revalidate";
    public static final String CACHE_CONTROL_PROXY_REVALIDATE = "proxy-revalidate";
    public static final String STALE_IF_ERROR = "stale-if-error";
    public static final String STALE_WHILE_REVALIDATE = "stale-while-revalidate";

    public static final String WARNING = "Warning";
    public static final String RANGE = "Range";
    public static final String CONTENT_RANGE = "Content-Range";
    public static final String WWW_AUTHENTICATE = "WWW-Authenticate";
    public static final String PROXY_AUTHENTICATE = "Proxy-Authenticate";
    public static final String AUTHORIZATION = "Authorization";

}
