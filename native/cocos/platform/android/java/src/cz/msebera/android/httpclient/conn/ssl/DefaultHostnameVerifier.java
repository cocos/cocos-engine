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

package cz.msebera.android.httpclient.conn.ssl;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.cert.Certificate;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

/* Javax.Naming package removed by HttpClient for Android script. */
/* Javax.Naming package removed by HttpClient for Android script. */
/* Javax.Naming package removed by HttpClient for Android script. */
/* Javax.Naming package removed by HttpClient for Android script. */
/* Javax.Naming package removed by HttpClient for Android script. */
/* Javax.Naming package removed by HttpClient for Android script. */
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.security.auth.x500.X500Principal;

import cz.msebera.android.httpclient.extras.HttpClientAndroidLog;
/* LogFactory removed by HttpClient for Android script. */
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.conn.util.InetAddressUtils;
import cz.msebera.android.httpclient.conn.util.PublicSuffixMatcher;

/**
 * Default {@link javax.net.ssl.HostnameVerifier} implementation.
 *
 * @since 4.4
 */
@Immutable
public final class DefaultHostnameVerifier implements HostnameVerifier {

    final static int DNS_NAME_TYPE        = 2;
    final static int IP_ADDRESS_TYPE      = 7;

    public HttpClientAndroidLog log = new HttpClientAndroidLog(getClass());

    private final PublicSuffixMatcher publicSuffixMatcher;

    public DefaultHostnameVerifier(final PublicSuffixMatcher publicSuffixMatcher) {
        this.publicSuffixMatcher = publicSuffixMatcher;
    }

    public DefaultHostnameVerifier() {
        this(null);
    }

    @Override
    public final boolean verify(final String host, final SSLSession session) {
        try {
            final Certificate[] certs = session.getPeerCertificates();
            final X509Certificate x509 = (X509Certificate) certs[0];
            verify(host, x509);
            return true;
        } catch(final SSLException ex) {
            if (log.isDebugEnabled()) {
                log.debug(ex.getMessage(), ex);
            }
            return false;
        }
    }

    public final void verify(
            final String host, final X509Certificate cert) throws SSLException {
        final boolean ipv4 = InetAddressUtils.isIPv4Address(host);
        final boolean ipv6 = InetAddressUtils.isIPv6Address(host);
        final int subjectType = ipv4 || ipv6 ? IP_ADDRESS_TYPE : DNS_NAME_TYPE;
        final List<String> subjectAlts = extractSubjectAlts(cert, subjectType);
        if (subjectAlts != null && !subjectAlts.isEmpty()) {
            if (ipv4) {
                matchIPAddress(host, subjectAlts);
            } else if (ipv6) {
                matchIPv6Address(host, subjectAlts);
            } else {
                matchDNSName(host, subjectAlts, this.publicSuffixMatcher);
            }
        } else {
            // CN matching has been deprecated by rfc2818 and can be used
            // as fallback only when no subjectAlts are available
            final X500Principal subjectPrincipal = cert.getSubjectX500Principal();
            final String cn = new DistinguishedNameParser(subjectPrincipal).findMostSpecific("cn");
            if (cn == null) {
                throw new SSLException("Certificate subject for <" + host + "> doesn't contain " +
                        "a common name and does not have alternative names");
            }
            matchCN(host, cn, this.publicSuffixMatcher);
        }
    }

    static void matchIPAddress(final String host, final List<String> subjectAlts) throws SSLException {
        for (int i = 0; i < subjectAlts.size(); i++) {
            final String subjectAlt = subjectAlts.get(i);
            if (host.equals(subjectAlt)) {
                return;
            }
        }
        throw new SSLException("Certificate for <" + host + "> doesn't match any " +
                "of the subject alternative names: " + subjectAlts);
    }

    static void matchIPv6Address(final String host, final List<String> subjectAlts) throws SSLException {
        final String normalisedHost = normaliseAddress(host);
        for (int i = 0; i < subjectAlts.size(); i++) {
            final String subjectAlt = subjectAlts.get(i);
            final String normalizedSubjectAlt = normaliseAddress(subjectAlt);
            if (normalisedHost.equals(normalizedSubjectAlt)) {
                return;
            }
        }
        throw new SSLException("Certificate for <" + host + "> doesn't match any " +
                "of the subject alternative names: " + subjectAlts);
    }

    static void matchDNSName(final String host, final List<String> subjectAlts,
                             final PublicSuffixMatcher publicSuffixMatcher) throws SSLException {
        final String normalizedHost = host.toLowerCase(Locale.ROOT);
        for (int i = 0; i < subjectAlts.size(); i++) {
            final String subjectAlt = subjectAlts.get(i);
            final String normalizedSubjectAlt = subjectAlt.toLowerCase(Locale.ROOT);
            if (matchIdentityStrict(normalizedHost, normalizedSubjectAlt, publicSuffixMatcher)) {
                return;
            }
        }
        throw new SSLException("Certificate for <" + host + "> doesn't match any " +
                "of the subject alternative names: " + subjectAlts);
    }

    static void matchCN(final String host, final String cn,
                 final PublicSuffixMatcher publicSuffixMatcher) throws SSLException {
        if (!matchIdentityStrict(host, cn, publicSuffixMatcher)) {
            throw new SSLException("Certificate for <" + host + "> doesn't match " +
                    "common name of the certificate subject: " + cn);
        }
    }

    static boolean matchDomainRoot(final String host, final String domainRoot) {
        if (domainRoot == null) {
            return false;
        }
        return host.endsWith(domainRoot) && (host.length() == domainRoot.length()
                || host.charAt(host.length() - domainRoot.length() - 1) == '.');
    }

    private static boolean matchIdentity(final String host, final String identity,
                                         final PublicSuffixMatcher publicSuffixMatcher,
                                         final boolean strict) {
        if (publicSuffixMatcher != null && host.contains(".")) {
            if (!matchDomainRoot(host, publicSuffixMatcher.getDomainRoot(identity))) {
                return false;
            }
        }

        // RFC 2818, 3.1. Server Identity
        // "...Names may contain the wildcard
        // character * which is considered to match any single domain name
        // component or component fragment..."
        // Based on this statement presuming only singular wildcard is legal
        final int asteriskIdx = identity.indexOf('*');
        if (asteriskIdx != -1) {
            final String prefix = identity.substring(0, asteriskIdx);
            final String suffix = identity.substring(asteriskIdx + 1);
            if (!prefix.isEmpty() && !host.startsWith(prefix)) {
                return false;
            }
            if (!suffix.isEmpty() && !host.endsWith(suffix)) {
                return false;
            }
            // Additional sanity checks on content selected by wildcard can be done here
            if (strict) {
                final String remainder = host.substring(
                        prefix.length(), host.length() - suffix.length());
                if (remainder.contains(".")) {
                    return false;
                }
            }
            return true;
        }
        return host.equalsIgnoreCase(identity);
    }

    static boolean matchIdentity(final String host, final String identity,
                                 final PublicSuffixMatcher publicSuffixMatcher) {
        return matchIdentity(host, identity, publicSuffixMatcher, false);
    }

    static boolean matchIdentity(final String host, final String identity) {
        return matchIdentity(host, identity, null, false);
    }

    static boolean matchIdentityStrict(final String host, final String identity,
                                       final PublicSuffixMatcher publicSuffixMatcher) {
        return matchIdentity(host, identity, publicSuffixMatcher, true);
    }

    static boolean matchIdentityStrict(final String host, final String identity) {
        return matchIdentity(host, identity, null, true);
    }

    static List<String> extractSubjectAlts(final X509Certificate cert, final int subjectType) {
        Collection<List<?>> c = null;
        try {
            c = cert.getSubjectAlternativeNames();
        } catch(final CertificateParsingException ignore) {
        }
        List<String> subjectAltList = null;
        if (c != null) {
            for (final List<?> aC : c) {
                final List<?> list = aC;
                final int type = ((Integer) list.get(0)).intValue();
                if (type == subjectType) {
                    final String s = (String) list.get(1);
                    if (subjectAltList == null) {
                        subjectAltList = new ArrayList<String>();
                    }
                    subjectAltList.add(s);
                }
            }
        }
        return subjectAltList;
    }

    /*
     * Normalize IPv6 or DNS name.
     */
    static String normaliseAddress(final String hostname) {
        if (hostname == null) {
            return hostname;
        }
        try {
            final InetAddress inetAddress = InetAddress.getByName(hostname);
            return inetAddress.getHostAddress();
        } catch (final UnknownHostException unexpected) { // Should not happen, because we check for IPv6 address above
            return hostname;
        }
    }
}
