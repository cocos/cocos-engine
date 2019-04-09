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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HeaderElement;
import cz.msebera.android.httpclient.HttpEntityEnclosingRequest;
import cz.msebera.android.httpclient.HttpRequest;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpVersion;
import cz.msebera.android.httpclient.ProtocolVersion;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.ClientProtocolException;
import cz.msebera.android.httpclient.client.cache.HeaderConstants;
import cz.msebera.android.httpclient.client.methods.HttpRequestWrapper;
import cz.msebera.android.httpclient.entity.AbstractHttpEntity;
import cz.msebera.android.httpclient.entity.ContentType;
import cz.msebera.android.httpclient.message.BasicHeader;
import cz.msebera.android.httpclient.message.BasicHttpResponse;
import cz.msebera.android.httpclient.message.BasicStatusLine;
import cz.msebera.android.httpclient.protocol.HTTP;

/**
 * @since 4.1
 */
@Immutable
class RequestProtocolCompliance {
    private final boolean weakETagOnPutDeleteAllowed;

    public RequestProtocolCompliance() {
        super();
        this.weakETagOnPutDeleteAllowed = false;
    }

    public RequestProtocolCompliance(final boolean weakETagOnPutDeleteAllowed) {
        super();
        this.weakETagOnPutDeleteAllowed = weakETagOnPutDeleteAllowed;
    }

    private static final List<String> disallowedWithNoCache =
        Arrays.asList(HeaderConstants.CACHE_CONTROL_MIN_FRESH, HeaderConstants.CACHE_CONTROL_MAX_STALE, HeaderConstants.CACHE_CONTROL_MAX_AGE);

    /**
     * Test to see if the {@link HttpRequest} is HTTP1.1 compliant or not
     * and if not, we can not continue.
     *
     * @param request the HttpRequest Object
     * @return list of {@link RequestProtocolError}
     */
    public List<RequestProtocolError> requestIsFatallyNonCompliant(final HttpRequest request) {
        final List<RequestProtocolError> theErrors = new ArrayList<RequestProtocolError>();

        RequestProtocolError anError = requestHasWeakETagAndRange(request);
        if (anError != null) {
            theErrors.add(anError);
        }

        if (!weakETagOnPutDeleteAllowed) {
            anError = requestHasWeekETagForPUTOrDELETEIfMatch(request);
            if (anError != null) {
                theErrors.add(anError);
            }
        }

        anError = requestContainsNoCacheDirectiveWithFieldName(request);
        if (anError != null) {
            theErrors.add(anError);
        }

        return theErrors;
    }

    /**
     * If the {@link HttpRequest} is non-compliant but 'fixable' we go ahead and
     * fix the request here.
     *
     * @param request the request to check for compliance
     * @throws ClientProtocolException when we have trouble making the request compliant
     */
    public void makeRequestCompliant(final HttpRequestWrapper request)
        throws ClientProtocolException {

        if (requestMustNotHaveEntity(request)) {
            ((HttpEntityEnclosingRequest) request).setEntity(null);
        }

        verifyRequestWithExpectContinueFlagHas100continueHeader(request);
        verifyOPTIONSRequestWithBodyHasContentType(request);
        decrementOPTIONSMaxForwardsIfGreaterThen0(request);
        stripOtherFreshnessDirectivesWithNoCache(request);

        if (requestVersionIsTooLow(request)
                || requestMinorVersionIsTooHighMajorVersionsMatch(request)) {
            request.setProtocolVersion(HttpVersion.HTTP_1_1);
        }
    }

    private void stripOtherFreshnessDirectivesWithNoCache(final HttpRequest request) {
        final List<HeaderElement> outElts = new ArrayList<HeaderElement>();
        boolean shouldStrip = false;
        for(final Header h : request.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for(final HeaderElement elt : h.getElements()) {
                if (!disallowedWithNoCache.contains(elt.getName())) {
                    outElts.add(elt);
                }
                if (HeaderConstants.CACHE_CONTROL_NO_CACHE.equals(elt.getName())) {
                    shouldStrip = true;
                }
            }
        }
        if (!shouldStrip) {
            return;
        }
        request.removeHeaders(HeaderConstants.CACHE_CONTROL);
        request.setHeader(HeaderConstants.CACHE_CONTROL, buildHeaderFromElements(outElts));
    }

    private String buildHeaderFromElements(final List<HeaderElement> outElts) {
        final StringBuilder newHdr = new StringBuilder("");
        boolean first = true;
        for(final HeaderElement elt : outElts) {
            if (!first) {
                newHdr.append(",");
            } else {
                first = false;
            }
            newHdr.append(elt.toString());
        }
        return newHdr.toString();
    }

    private boolean requestMustNotHaveEntity(final HttpRequest request) {
        return HeaderConstants.TRACE_METHOD.equals(request.getRequestLine().getMethod())
                && request instanceof HttpEntityEnclosingRequest;
    }

    private void decrementOPTIONSMaxForwardsIfGreaterThen0(final HttpRequest request) {
        if (!HeaderConstants.OPTIONS_METHOD.equals(request.getRequestLine().getMethod())) {
            return;
        }

        final Header maxForwards = request.getFirstHeader(HeaderConstants.MAX_FORWARDS);
        if (maxForwards == null) {
            return;
        }

        request.removeHeaders(HeaderConstants.MAX_FORWARDS);
        final int currentMaxForwards = Integer.parseInt(maxForwards.getValue());

        request.setHeader(HeaderConstants.MAX_FORWARDS, Integer.toString(currentMaxForwards - 1));
    }

    private void verifyOPTIONSRequestWithBodyHasContentType(final HttpRequest request) {
        if (!HeaderConstants.OPTIONS_METHOD.equals(request.getRequestLine().getMethod())) {
            return;
        }

        if (!(request instanceof HttpEntityEnclosingRequest)) {
            return;
        }

        addContentTypeHeaderIfMissing((HttpEntityEnclosingRequest) request);
    }

    private void addContentTypeHeaderIfMissing(final HttpEntityEnclosingRequest request) {
        if (request.getEntity().getContentType() == null) {
            ((AbstractHttpEntity) request.getEntity()).setContentType(
                    ContentType.APPLICATION_OCTET_STREAM.getMimeType());
        }
    }

    private void verifyRequestWithExpectContinueFlagHas100continueHeader(final HttpRequest request) {
        if (request instanceof HttpEntityEnclosingRequest) {

            if (((HttpEntityEnclosingRequest) request).expectContinue()
                    && ((HttpEntityEnclosingRequest) request).getEntity() != null) {
                add100ContinueHeaderIfMissing(request);
            } else {
                remove100ContinueHeaderIfExists(request);
            }
        } else {
            remove100ContinueHeaderIfExists(request);
        }
    }

    private void remove100ContinueHeaderIfExists(final HttpRequest request) {
        boolean hasHeader = false;

        final Header[] expectHeaders = request.getHeaders(HTTP.EXPECT_DIRECTIVE);
        List<HeaderElement> expectElementsThatAreNot100Continue = new ArrayList<HeaderElement>();

        for (final Header h : expectHeaders) {
            for (final HeaderElement elt : h.getElements()) {
                if (!(HTTP.EXPECT_CONTINUE.equalsIgnoreCase(elt.getName()))) {
                    expectElementsThatAreNot100Continue.add(elt);
                } else {
                    hasHeader = true;
                }
            }

            if (hasHeader) {
                request.removeHeader(h);
                for (final HeaderElement elt : expectElementsThatAreNot100Continue) {
                    final BasicHeader newHeader = new BasicHeader(HTTP.EXPECT_DIRECTIVE, elt.getName());
                    request.addHeader(newHeader);
                }
                return;
            } else {
                expectElementsThatAreNot100Continue = new ArrayList<HeaderElement>();
            }
        }
    }

    private void add100ContinueHeaderIfMissing(final HttpRequest request) {
        boolean hasHeader = false;

        for (final Header h : request.getHeaders(HTTP.EXPECT_DIRECTIVE)) {
            for (final HeaderElement elt : h.getElements()) {
                if (HTTP.EXPECT_CONTINUE.equalsIgnoreCase(elt.getName())) {
                    hasHeader = true;
                }
            }
        }

        if (!hasHeader) {
            request.addHeader(HTTP.EXPECT_DIRECTIVE, HTTP.EXPECT_CONTINUE);
        }
    }

    protected boolean requestMinorVersionIsTooHighMajorVersionsMatch(final HttpRequest request) {
        final ProtocolVersion requestProtocol = request.getProtocolVersion();
        if (requestProtocol.getMajor() != HttpVersion.HTTP_1_1.getMajor()) {
            return false;
        }

        if (requestProtocol.getMinor() > HttpVersion.HTTP_1_1.getMinor()) {
            return true;
        }

        return false;
    }

    protected boolean requestVersionIsTooLow(final HttpRequest request) {
        return request.getProtocolVersion().compareToVersion(HttpVersion.HTTP_1_1) < 0;
    }

    /**
     * Extract error information about the {@link HttpRequest} telling the 'caller'
     * that a problem occured.
     *
     * @param errorCheck What type of error should I get
     * @return The {@link HttpResponse} that is the error generated
     */
    public HttpResponse getErrorForRequest(final RequestProtocolError errorCheck) {
        switch (errorCheck) {
            case BODY_BUT_NO_LENGTH_ERROR:
                return new BasicHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1,
                        HttpStatus.SC_LENGTH_REQUIRED, ""));

            case WEAK_ETAG_AND_RANGE_ERROR:
                return new BasicHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1,
                        HttpStatus.SC_BAD_REQUEST, "Weak eTag not compatible with byte range"));

            case WEAK_ETAG_ON_PUTDELETE_METHOD_ERROR:
                return new BasicHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1,
                        HttpStatus.SC_BAD_REQUEST,
                        "Weak eTag not compatible with PUT or DELETE requests"));

            case NO_CACHE_DIRECTIVE_WITH_FIELD_NAME:
                return new BasicHttpResponse(new BasicStatusLine(HttpVersion.HTTP_1_1,
                        HttpStatus.SC_BAD_REQUEST,
                        "No-Cache directive MUST NOT include a field name"));

            default:
                throw new IllegalStateException(
                        "The request was compliant, therefore no error can be generated for it.");

        }
    }

    private RequestProtocolError requestHasWeakETagAndRange(final HttpRequest request) {
        // TODO: Should these be looking at all the headers marked as Range?
        final String method = request.getRequestLine().getMethod();
        if (!(HeaderConstants.GET_METHOD.equals(method))) {
            return null;
        }

        final Header range = request.getFirstHeader(HeaderConstants.RANGE);
        if (range == null) {
            return null;
        }

        final Header ifRange = request.getFirstHeader(HeaderConstants.IF_RANGE);
        if (ifRange == null) {
            return null;
        }

        final String val = ifRange.getValue();
        if (val.startsWith("W/")) {
            return RequestProtocolError.WEAK_ETAG_AND_RANGE_ERROR;
        }

        return null;
    }

    private RequestProtocolError requestHasWeekETagForPUTOrDELETEIfMatch(final HttpRequest request) {
        // TODO: Should these be looking at all the headers marked as If-Match/If-None-Match?

        final String method = request.getRequestLine().getMethod();
        if (!(HeaderConstants.PUT_METHOD.equals(method) || HeaderConstants.DELETE_METHOD
                .equals(method))) {
            return null;
        }

        final Header ifMatch = request.getFirstHeader(HeaderConstants.IF_MATCH);
        if (ifMatch != null) {
            final String val = ifMatch.getValue();
            if (val.startsWith("W/")) {
                return RequestProtocolError.WEAK_ETAG_ON_PUTDELETE_METHOD_ERROR;
            }
        } else {
            final Header ifNoneMatch = request.getFirstHeader(HeaderConstants.IF_NONE_MATCH);
            if (ifNoneMatch == null) {
                return null;
            }

            final String val2 = ifNoneMatch.getValue();
            if (val2.startsWith("W/")) {
                return RequestProtocolError.WEAK_ETAG_ON_PUTDELETE_METHOD_ERROR;
            }
        }

        return null;
    }

    private RequestProtocolError requestContainsNoCacheDirectiveWithFieldName(final HttpRequest request) {
        for(final Header h : request.getHeaders(HeaderConstants.CACHE_CONTROL)) {
            for(final HeaderElement elt : h.getElements()) {
                if (HeaderConstants.CACHE_CONTROL_NO_CACHE.equalsIgnoreCase(elt.getName())
                    && elt.getValue() != null) {
                    return RequestProtocolError.NO_CACHE_DIRECTIVE_WITH_FIELD_NAME;
                }
            }
        }
        return null;
    }
}
