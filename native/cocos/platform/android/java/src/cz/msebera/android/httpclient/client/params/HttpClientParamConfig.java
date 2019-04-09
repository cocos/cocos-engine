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

package cz.msebera.android.httpclient.client.params;

import java.net.InetAddress;
import java.util.Collection;

import cz.msebera.android.httpclient.HttpHost;
import cz.msebera.android.httpclient.auth.params.AuthPNames;
import cz.msebera.android.httpclient.client.config.RequestConfig;
import cz.msebera.android.httpclient.conn.params.ConnRoutePNames;
import cz.msebera.android.httpclient.params.CoreConnectionPNames;
import cz.msebera.android.httpclient.params.CoreProtocolPNames;
import cz.msebera.android.httpclient.params.HttpParams;

/**
 * @deprecated (4.3) provided for compatibility with {@link HttpParams}. Do not use.
 *
 * @since 4.3
 */
@Deprecated
public final class HttpClientParamConfig {

    private HttpClientParamConfig() {
    }

    @SuppressWarnings("unchecked")
    public static RequestConfig getRequestConfig(final HttpParams params) {
        return RequestConfig.custom()
                .setSocketTimeout(params.getIntParameter(
                        CoreConnectionPNames.SO_TIMEOUT, 0))
                .setStaleConnectionCheckEnabled(params.getBooleanParameter(
                        CoreConnectionPNames.STALE_CONNECTION_CHECK, true))
                .setConnectTimeout(params.getIntParameter(
                        CoreConnectionPNames.CONNECTION_TIMEOUT, 0))
                .setExpectContinueEnabled(params.getBooleanParameter(
                        CoreProtocolPNames.USE_EXPECT_CONTINUE, false))
                .setProxy((HttpHost) params.getParameter(
                        ConnRoutePNames.DEFAULT_PROXY))
                .setLocalAddress((InetAddress) params.getParameter(
                        ConnRoutePNames.LOCAL_ADDRESS))
                .setProxyPreferredAuthSchemes((Collection<String>) params.getParameter(
                        AuthPNames.PROXY_AUTH_PREF))
                .setTargetPreferredAuthSchemes((Collection<String>) params.getParameter(
                        AuthPNames.TARGET_AUTH_PREF))
                .setAuthenticationEnabled(params.getBooleanParameter(
                        ClientPNames.HANDLE_AUTHENTICATION, true))
                .setCircularRedirectsAllowed(params.getBooleanParameter(
                        ClientPNames.ALLOW_CIRCULAR_REDIRECTS, false))
                .setConnectionRequestTimeout((int) params.getLongParameter(
                        ClientPNames.CONN_MANAGER_TIMEOUT, 0))
                .setCookieSpec((String) params.getParameter(
                        ClientPNames.COOKIE_POLICY))
                .setMaxRedirects(params.getIntParameter(
                        ClientPNames.MAX_REDIRECTS, 50))
                .setRedirectsEnabled(params.getBooleanParameter(
                        ClientPNames.HANDLE_REDIRECTS, true))
                .setRelativeRedirectsAllowed(!params.getBooleanParameter(
                        ClientPNames.REJECT_RELATIVE_REDIRECT, false))
                .build();
    }

}
