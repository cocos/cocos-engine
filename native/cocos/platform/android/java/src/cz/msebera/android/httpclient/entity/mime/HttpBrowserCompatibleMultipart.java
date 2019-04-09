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

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.List;

/**
 * HttpBrowserCompatibleMultipart represents a collection of MIME multipart encoded
 * content bodies. This class is emulates browser compatibility, e.g. IE 5 or earlier.
 *
 * @since 4.3
 */
class HttpBrowserCompatibleMultipart extends AbstractMultipartForm {

    private final List<FormBodyPart> parts;

    public HttpBrowserCompatibleMultipart(
            final Charset charset,
            final String boundary,
            final List<FormBodyPart> parts) {
        super(charset, boundary);
        this.parts = parts;
    }

    @Override
    public List<FormBodyPart> getBodyParts() {
        return this.parts;
    }

    /**
      * Write the multipart header fields; depends on the style.
      */
    @Override
    protected void formatMultipartHeader(
            final FormBodyPart part,
            final OutputStream out) throws IOException {
        // For browser-compatible, only write Content-Disposition
        // Use content charset
        final Header header = part.getHeader();
        final MinimalField cd = header.getField(MIME.CONTENT_DISPOSITION);
        writeField(cd, this.charset, out);
        final String filename = part.getBody().getFilename();
        if (filename != null) {
            final MinimalField ct = header.getField(MIME.CONTENT_TYPE);
            writeField(ct, this.charset, out);
        }

    }

}
