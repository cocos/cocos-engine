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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HeaderElement;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpEntityEnclosingRequest;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpVersion;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.ClientProtocolException;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;
import cz.msebera.android.httpclient.client.utils.DateUtils;
import cz.msebera.android.httpclient.message.BasicHeader;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * @since 4.1
 */
@Immutable
class ResponseProtocolCompliance {

    private static final String UNEXPECTED_100_CONTINUE = "The incoming request did not contain a "
                    + "100-continue header, but the response was a Status 100, continue.";
    private static final String UNEXPECTED_PARTIAL_CONTENT = "partial content was returned for a request that did not ask for it";

    /**
     * When we get a response from a down stream server (Origin Server)
     * we attempt to see if it is HTTP 1.1 Compliant and if not, attempt to
     * make it so.
     *
     * @param request The {@link HttpRequest} that generated an origin hit and response
     * @param response The {@link HttpResponse} from the origin server
     * @throws IOException Bad things happened
     */
    public void ensureProtocolCompliance(final HttpRequestWrapper request, final HttpResponse response)
            throws IOException {
        if (backendResponseMustNotHaveBody(request, response)) {
            consumeBody(response);
            response.setEntity(null);
        }

        requestDidNotExpect100ContinueButResponseIsOne(request, response);

        transferEncodingIsNotReturnedTo1_0Client(request, response);

        ensurePartialContentIsNotSentToAClientThatDidNotRequestIt(request, response);

        ensure200ForOPTIONSRequestWithNoBodyHasContentLengthZero(request, response);

        ensure206ContainsDateHeader(response);

        ensure304DoesNotContainExtraEntityHeaders(response);

        identityIsNotUsedInContentEncoding(response);

        warningsWithNonMatchingWarnDatesAreRemoved(response);
    }

    private void consumeBody(final HttpResponse response) throws IOException {
        final HttpEntity body = response.getEntity();
        if (body != null) {
            IOUtils.consume(body);
        }
    }

    private void warningsWithNonMatchingWarnDatesAreRemoved(
            final HttpResponse response) {
        final Date responseDate = DateUtils.parseDate(response.getFirstHeader(HTTP.DATE_HEADER).getValue());
        if (responseDate == null) {
            return;
        }

        final Header[] warningHeaders = response.getHeaders(HeaderConstants.WARNING);

        if (warningHeaders == null || warningHeaders.length == 0) {
            return;
        }

        final List<Header> newWarningHeaders = new ArrayList<Header>();
        boolean modified = false;
        for(final Header h : warningHeaders) {
            for(final WarningValue wv : WarningValue.getWarningValues(h)) {
                final Date warnDate = wv.getWarnDate();
                if (warnDate == null || warnDate.equals(responseDate)) {
                    newWarningHeaders.add(new BasicHeader(HeaderConstants.WARNING,wv.toString()));
                } else {
                    modified = true;
                }
            }
        }
        if (modified) {
            response.removeHeaders(HeaderConstants.WARNING);
            for(final Header h : newWarningHeaders) {
                response.addHeader(h);
            }
        }
    }

    private void identityIsNotUsedInContentEncoding(final HttpResponse response) {
        final Header[] hdrs = response.getHeaders(HTTP.CONTENT_ENCODING);
        if (hdrs == null || hdrs.length == 0) {
            return;
        }
        final List<Header> newHeaders = new ArrayList<Header>();
        boolean modified = false;
        for (final Header h : hdrs) {
            final StringBuilder buf = new StringBuilder();
            boolean first = true;
            for (final HeaderElement elt : h.getElements()) {
                if ("identity".equalsIgnoreCase(elt.getName())) {
                    modified = true;
                } else {
                    if (!first) {
                        buf.append(",");
                    }
                    buf.append(elt.toString());
                    first = false;
                }
            }
            final String newHeaderValue = buf.toString();
            if (!"".equals(newHeaderValue)) {
                newHeaders.add(new BasicHeader(HTTP.CONTENT_ENCODING, newHeaderValue));
            }
        }
        if (!modified) {
            return;
        }
        response.removeHeaders(HTTP.CONTENT_ENCODING);
        for (final Header h : newHeaders) {
            response.addHeader(h);
        }
    }

    private void ensure206ContainsDateHeader(final HttpResponse response) {
        if (response.getFirstHeader(HTTP.DATE_HEADER) == null) {
            response.addHeader(HTTP.DATE_HEADER, DateUtils.formatDate(new Date()));
        }

    }

    private void ensurePartialContentIsNotSentToAClientThatDidNotRequestIt(final HttpRequest request,
            final HttpResponse response) throws IOException {
        if (request.getFirstHeader(HeaderConstants.RANGE) != null
                || response.getStatusLine().getStatusCode() != HttpStatus.SC_PARTIAL_CONTENT) {
            return;
        }

        consumeBody(response);
        throw new ClientProtocolException(UNEXPECTED_PARTIAL_CONTENT);
    }

    private void ensure200ForOPTIONSRequestWithNoBodyHasContentLengthZero(final HttpRequest request,
            final HttpResponse response) {
        if (!request.getRequestLine().getMethod().equalsIgnoreCase(HeaderConstants.OPTIONS_METHOD)) {
            return;
        }

        if (response.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
            return;
        }

        if (response.getFirstHeader(HTTP.CONTENT_LEN) == null) {
            response.addHeader(HTTP.CONTENT_LEN, "0");
        }
    }

    private void ensure304DoesNotContainExtraEntityHeaders(final HttpResponse response) {
        final String[] disallowedEntityHeaders = { HeaderConstants.ALLOW, HTTP.CONTENT_ENCODING,
                "Content-Language", HTTP.CONTENT_LEN, "Content-MD5",
                "Content-Range", HTTP.CONTENT_TYPE, HeaderConstants.LAST_MODIFIED
        };
        if (response.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_MODIFIED) {
            for(final String hdr : disallowedEntityHeaders) {
                response.removeHeaders(hdr);
            }
        }
    }

    private boolean backendResponseMustNotHaveBody(final HttpRequest request, final HttpResponse backendResponse) {
        return HeaderConstants.HEAD_METHOD.equals(request.getRequestLine().getMethod())
                || backendResponse.getStatusLine().getStatusCode() == HttpStatus.SC_NO_CONTENT
                || backendResponse.getStatusLine().getStatusCode() == HttpStatus.SC_RESET_CONTENT
                || backendResponse.getStatusLine().getStatusCode() == HttpStatus.SC_NOT_MODIFIED;
    }

    private void requestDidNotExpect100ContinueButResponseIsOne(final HttpRequestWrapper request,
            final HttpResponse response) throws IOException {
        if (response.getStatusLine().getStatusCode() != HttpStatus.SC_CONTINUE) {
            return;
        }

        final HttpRequest originalRequest = request.getOriginal();
        if (originalRequest instanceof HttpEntityEnclosingRequest) {
            if (((HttpEntityEnclosingRequest)originalRequest).expectContinue()) {
                return;
            }
        }
        consumeBody(response);
        throw new ClientProtocolException(UNEXPECTED_100_CONTINUE);
    }

    private void transferEncodingIsNotReturnedTo1_0Client(final HttpRequestWrapper request,
            final HttpResponse response) {
        final HttpRequest originalRequest = request.getOriginal();
        if (originalRequest.getProtocolVersion().compareToVersion(HttpVersion.HTTP_1_1) >= 0) {
            return;
        }

        removeResponseTransferEncoding(response);
    }

    private void removeResponseTransferEncoding(final HttpResponse response) {
        response.removeHeaders("TE");
        response.removeHeaders(HTTP.TRANSFER_ENCODING);
    }

}
