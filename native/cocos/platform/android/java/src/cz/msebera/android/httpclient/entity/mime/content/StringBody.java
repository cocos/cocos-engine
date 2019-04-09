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

package cz.msebera.android.httpclient.entity.mime.content;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;

import cz.msebera.android.httpclient.Consts;
import cz.msebera.android.httpclient.entity.ContentType;
import cz.msebera.android.httpclient.entity.mime.MIME;
import cz.msebera.android.httpclient.util.Args;

/**
 * Text body part backed by a byte array.
 *
 * @see cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder
 *
 * @since 4.0
 */
public class StringBody extends AbstractContentBody {

    private final byte[] content;

    /**
     * @since 4.1
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public static StringBody create(
            final String text,
            final String mimeType,
            final Charset charset) throws IllegalArgumentException {
        try {
            return new StringBody(text, mimeType, charset);
        } catch (final UnsupportedEncodingException ex) {
            throw new IllegalArgumentException("Charset " + charset + " is not supported", ex);
        }
    }

    /**
     * @since 4.1
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public static StringBody create(
            final String text, final Charset charset) throws IllegalArgumentException {
        return create(text, null, charset);
    }

    /**
     * @since 4.1
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public static StringBody create(final String text) throws IllegalArgumentException {
        return create(text, null, null);
    }

    /**
     * Create a StringBody from the specified text, MIME type and character set.
     *
     * @param text to be used for the body, not {@code null}
     * @param mimeType the MIME type, not {@code null}
     * @param charset the character set, may be {@code null}, in which case the US-ASCII charset is used
     * @throws UnsupportedEncodingException
     * @throws IllegalArgumentException if the {@code text} parameter is null
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public StringBody(
            final String text,
            final String mimeType,
            final Charset charset) throws UnsupportedEncodingException {
        this(text, ContentType.create(mimeType, charset));
    }

    /**
     * Create a StringBody from the specified text and character set.
     * The MIME type is set to "text/plain".
     *
     * @param text to be used for the body, not {@code null}
     * @param charset the character set, may be {@code null}, in which case the US-ASCII charset is used
     * @throws UnsupportedEncodingException
     * @throws IllegalArgumentException if the {@code text} parameter is null
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public StringBody(final String text, final Charset charset) throws UnsupportedEncodingException {
        this(text, "text/plain", charset);
    }

    /**
     * Create a StringBody from the specified text.
     * The MIME type is set to "text/plain".
     * The {@linkplain Consts#ASCII ASCII} charset is used.
     *
     * @param text to be used for the body, not {@code null}
     * @throws UnsupportedEncodingException
     * @throws IllegalArgumentException if the {@code text} parameter is null
     *
     * @deprecated (4.3) use {@link StringBody#StringBody(String, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public StringBody(final String text) throws UnsupportedEncodingException {
        this(text, "text/plain", Consts.ASCII);
    }

    /**
     * @since 4.3
     */
    public StringBody(final String text, final ContentType contentType) {
        super(contentType);
        Args.notNull(text, "Text");
        final Charset charset = contentType.getCharset();
        this.content = text.getBytes(charset != null ? charset : Consts.ASCII);
    }

    public Reader getReader() {
        final Charset charset = getContentType().getCharset();
        return new InputStreamReader(
                new ByteArrayInputStream(this.content),
                charset != null ? charset : Consts.ASCII);
    }

    @Override
    public void writeTo(final OutputStream out) throws IOException {
        Args.notNull(out, "Output stream");
        final InputStream in = new ByteArrayInputStream(this.content);
        final byte[] tmp = new byte[4096];
        int l;
        while ((l = in.read(tmp)) != -1) {
            out.write(tmp, 0, l);
        }
        out.flush();
    }

    @Override
    public String getTransferEncoding() {
        return MIME.ENC_8BIT;
    }

    @Override
    public long getContentLength() {
        return this.content.length;
    }

    @Override
    public String getFilename() {
        return null;
    }

}
