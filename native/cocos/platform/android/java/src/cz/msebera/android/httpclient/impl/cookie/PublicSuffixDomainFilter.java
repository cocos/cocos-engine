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
package cz.msebera.android.httpclient.impl.cookie;

import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.conn.util.PublicSuffixList;
import cz.msebera.android.httpclient.conn.util.PublicSuffixMatcher;
import cz.msebera.android.httpclient.cookie.CommonCookieAttributeHandler;
import cz.msebera.android.httpclient.cookie.Cookie;
import cz.msebera.android.httpclient.cookie.CookieOrigin;
import cz.msebera.android.httpclient.cookie.MalformedCookieException;
import cz.msebera.android.httpclient.cookie.SetCookie;
import cz.msebera.android.httpclient.util.Args;

/**
 * Wraps a {@link cz.msebera.android.httpclient.cookie.CookieAttributeHandler} and leverages its match method
 * to never match a suffix from a black list. May be used to provide additional security for
 * cross-site attack types by preventing cookies from apparent domains that are not publicly
 * available.
 *
 *  @see cz.msebera.android.httpclient.conn.util.PublicSuffixList
 *  @see cz.msebera.android.httpclient.conn.util.PublicSuffixMatcher
 *
 * @since 4.4
 */
@Immutable // dependencies are expected to be immutable or thread-safe
public class PublicSuffixDomainFilter implements CommonCookieAttributeHandler {

    private final CommonCookieAttributeHandler handler;
    private final PublicSuffixMatcher publicSuffixMatcher;

    public PublicSuffixDomainFilter(
            final CommonCookieAttributeHandler handler, final PublicSuffixMatcher publicSuffixMatcher) {
        this.handler = Args.notNull(handler, "Cookie handler");
        this.publicSuffixMatcher = Args.notNull(publicSuffixMatcher, "Public suffix matcher");
    }

    public PublicSuffixDomainFilter(
            final CommonCookieAttributeHandler handler, final PublicSuffixList suffixList) {
        Args.notNull(handler, "Cookie handler");
        Args.notNull(suffixList, "Public suffix list");
        this.handler = handler;
        this.publicSuffixMatcher = new PublicSuffixMatcher(suffixList.getRules(), suffixList.getExceptions());
    }

    /**
     * Never matches if the cookie's domain is from the blacklist.
     */
    @Override
    public boolean match(final Cookie cookie, final CookieOrigin origin) {
        final String domain = cookie.getDomain();
        if (!domain.equalsIgnoreCase("localhost") && publicSuffixMatcher.matches(domain)) {
            return false;
        } else {
            return handler.match(cookie, origin);
        }
    }

    @Override
    public void parse(final SetCookie cookie, final String value) throws MalformedCookieException {
        handler.parse(cookie, value);
    }

    @Override
    public void validate(final Cookie cookie, final CookieOrigin origin) throws MalformedCookieException {
        handler.validate(cookie, origin);
    }

    @Override
    public String getAttributeName() {
        return handler.getAttributeName();
    }

    public static CommonCookieAttributeHandler decorate(
            final CommonCookieAttributeHandler handler, final PublicSuffixMatcher publicSuffixMatcher) {
        Args.notNull(handler, "Cookie attribute handler");
        return publicSuffixMatcher != null ? new PublicSuffixDomainFilter(handler, publicSuffixMatcher) : handler;
    }

}
