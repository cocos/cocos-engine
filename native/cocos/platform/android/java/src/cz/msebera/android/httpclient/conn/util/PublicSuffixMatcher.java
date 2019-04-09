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
package cz.msebera.android.httpclient.conn.util;

import java.net.IDN;
import java.util.Collection;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import cz.msebera.android.httpclient.annotation.ThreadSafe;
import cz.msebera.android.httpclient.util.Args;

/**
 * Utility class that can test if DNS names match the content of the Public Suffix List.
 * <p>
 * An up-to-date list of suffixes can be obtained from
 * <a href="http://publicsuffix.org/">publicsuffix.org</a>
 *
 * @see cz.msebera.android.httpclient.conn.util.PublicSuffixList
 *
 * @since 4.4
 */
@ThreadSafe
public final class PublicSuffixMatcher {

    private final Map<String, String> rules;
    private final Map<String, String> exceptions;

    public PublicSuffixMatcher(final Collection<String> rules, final Collection<String> exceptions) {
        Args.notNull(rules,  "Domain suffix rules");
        this.rules = new ConcurrentHashMap<String, String>(rules.size());
        for (String rule: rules) {
            this.rules.put(rule, rule);
        }
        if (exceptions != null) {
            this.exceptions = new ConcurrentHashMap<String, String>(exceptions.size());
            for (String exception: exceptions) {
                this.exceptions.put(exception, exception);
            }
        } else {
            this.exceptions = null;
        }
    }

    /**
     * Returns registrable part of the domain for the given domain name of {@code null}
     * if given domain represents a public suffix.
     *
     * @param domain
     * @return domain root
     */
    public String getDomainRoot(final String domain) {
        if (domain == null) {
            return null;
        }
        if (domain.startsWith(".")) {
            return null;
        }
        String domainName = null;
        String segment = domain.toLowerCase(Locale.ROOT);
        while (segment != null) {

            // An exception rule takes priority over any other matching rule.
            if (this.exceptions != null && this.exceptions.containsKey(IDN.toUnicode(segment))) {
                return segment;
            }

            if (this.rules.containsKey(IDN.toUnicode(segment))) {
                break;
            }

            final int nextdot = segment.indexOf('.');
            final String nextSegment = nextdot != -1 ? segment.substring(nextdot + 1) : null;

            if (nextSegment != null) {
                if (this.rules.containsKey("*." + IDN.toUnicode(nextSegment))) {
                    break;
                }
            }
            if (nextdot != -1) {
                domainName = segment;
            }
            segment = nextSegment;
        }
        return domainName;
    }

    public boolean matches(final String domain) {
        if (domain == null) {
            return false;
        }
        final String domainRoot = getDomainRoot(domain.startsWith(".") ? domain.substring(1) : domain);
        return domainRoot == null;
    }

}
