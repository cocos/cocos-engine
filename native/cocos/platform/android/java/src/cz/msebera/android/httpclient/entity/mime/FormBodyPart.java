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

package cz.msebera.android.httpclient.entity.mime;

import cz.msebera.android.httpclient.entity.ContentType;
import cz.msebera.android.httpclient.entity.mime.content.AbstractContentBody;
import cz.msebera.android.httpclient.entity.mime.content.ContentBody;
import cz.msebera.android.httpclient.util.Args;

/**
 * FormBodyPart class represents a content body that can be used as a part of multipart encoded
 * entities. This class automatically populates the header with standard fields based on
 * the content description of the enclosed body.
 *
 * @since 4.0
 */
public class FormBodyPart {

    private final String name;
    private final Header header;
    private final ContentBody body;

    FormBodyPart(final String name, final ContentBody body, final Header header) {
        super();
        Args.notNull(name, "Name");
        Args.notNull(body, "Body");
        this.name = name;
        this.body = body;
        this.header = header != null ? header : new Header();
    }

    /**
     * @deprecated (4.4) use {@link cz.msebera.android.httpclient.entity.mime.FormBodyPartBuilder}.
     */
    @Deprecated
    public FormBodyPart(final String name, final ContentBody body) {
        super();
        Args.notNull(name, "Name");
        Args.notNull(body, "Body");
        this.name = name;
        this.body = body;
        this.header = new Header();

        generateContentDisp(body);
        generateContentType(body);
        generateTransferEncoding(body);
    }

    public String getName() {
        return this.name;
    }

    public ContentBody getBody() {
        return this.body;
    }

    public Header getHeader() {
        return this.header;
    }

    public void addField(final String name, final String value) {
        Args.notNull(name, "Field name");
        this.header.addField(new MinimalField(name, value));
    }

    /**
     * @deprecated (4.4) use {@link cz.msebera.android.httpclient.entity.mime.FormBodyPartBuilder}.
     */
    @Deprecated
    protected void generateContentDisp(final ContentBody body) {
        final StringBuilder buffer = new StringBuilder();
        buffer.append("form-data; name=\"");
        buffer.append(getName());
        buffer.append("\"");
        if (body.getFilename() != null) {
            buffer.append("; filename=\"");
            buffer.append(body.getFilename());
            buffer.append("\"");
        }
        addField(MIME.CONTENT_DISPOSITION, buffer.toString());
    }

    /**
     * @deprecated (4.4) use {@link cz.msebera.android.httpclient.entity.mime.FormBodyPartBuilder}.
     */
    @Deprecated
    protected void generateContentType(final ContentBody body) {
        final ContentType contentType;
        if (body instanceof AbstractContentBody) {
            contentType = ((AbstractContentBody) body).getContentType();
        } else {
            contentType = null;
        }
        if (contentType != null) {
            addField(MIME.CONTENT_TYPE, contentType.toString());
        } else {
            final StringBuilder buffer = new StringBuilder();
            buffer.append(body.getMimeType()); // MimeType cannot be null
            if (body.getCharset() != null) { // charset may legitimately be null
                buffer.append("; charset=");
                buffer.append(body.getCharset());
            }
            addField(MIME.CONTENT_TYPE, buffer.toString());
        }
    }

    /**
     * @deprecated (4.4) use {@link cz.msebera.android.httpclient.entity.mime.FormBodyPartBuilder}.
     */
    @Deprecated
    protected void generateTransferEncoding(final ContentBody body) {
        addField(MIME.CONTENT_TRANSFER_ENC, body.getTransferEncoding()); // TE cannot be null
    }

}
