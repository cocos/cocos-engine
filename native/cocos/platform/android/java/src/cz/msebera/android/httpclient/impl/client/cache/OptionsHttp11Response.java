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

import java.util.Locale;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HeaderIterator;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpVersion;
import cz.msebera.android.httpclient.ProtocolVersion;
import cz.msebera.android.httpclient.StatusLine;
import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.message.AbstractHttpMessage;
import cz.msebera.android.httpclient.message.BasicStatusLine;
import cz.msebera.android.httpclient.params.BasicHttpParams;
import cz.msebera.android.httpclient.params.HttpParams;

/**
 * @since 4.1
 */
@SuppressWarnings("deprecation")
@Immutable
final class OptionsHttp11Response extends AbstractHttpMessage implements HttpResponse {

    private final StatusLine statusLine = new BasicStatusLine(HttpVersion.HTTP_1_1,
            HttpStatus.SC_NOT_IMPLEMENTED, "");
    private final ProtocolVersion version = HttpVersion.HTTP_1_1;

    @Override
    public StatusLine getStatusLine() {
        return statusLine;
    }

    @Override
    public void setStatusLine(final StatusLine statusline) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setStatusLine(final ProtocolVersion ver, final int code) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setStatusLine(final ProtocolVersion ver, final int code, final String reason) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setStatusCode(final int code) throws IllegalStateException {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setReasonPhrase(final String reason) throws IllegalStateException {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public HttpEntity getEntity() {
        return null;
    }

    @Override
    public void setEntity(final HttpEntity entity) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public Locale getLocale() {
        return null;
    }

    @Override
    public void setLocale(final Locale loc) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public ProtocolVersion getProtocolVersion() {
        return version;
    }

    @Override
    public boolean containsHeader(final String name) {
        return this.headergroup.containsHeader(name);
    }

    @Override
    public Header[] getHeaders(final String name) {
        return this.headergroup.getHeaders(name);
    }

    @Override
    public Header getFirstHeader(final String name) {
        return this.headergroup.getFirstHeader(name);
    }

    @Override
    public Header getLastHeader(final String name) {
        return this.headergroup.getLastHeader(name);
    }

    @Override
    public Header[] getAllHeaders() {
        return this.headergroup.getAllHeaders();
    }

    @Override
    public void addHeader(final Header header) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void addHeader(final String name, final String value) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setHeader(final Header header) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setHeader(final String name, final String value) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void setHeaders(final Header[] headers) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void removeHeader(final Header header) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public void removeHeaders(final String name) {
        // No-op on purpose, this class is not going to be doing any work.
    }

    @Override
    public HeaderIterator headerIterator() {
        return this.headergroup.iterator();
    }

    @Override
    public HeaderIterator headerIterator(final String name) {
        return this.headergroup.iterator(name);
    }

    @Override
    public HttpParams getParams() {
        if (this.params == null) {
            this.params = new BasicHttpParams();
        }
        return this.params;
    }

    @Override
    public void setParams(final HttpParams params) {
        // No-op on purpose, this class is not going to be doing any work.
    }
}
