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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import cz.msebera.android.httpclient.entity.ContentType;
import cz.msebera.android.httpclient.entity.mime.MIME;
import cz.msebera.android.httpclient.util.Args;

/**
 * Binary body part backed by a file.
 *
 * @see cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder
 *
 * @since 4.0
 */
public class FileBody extends AbstractContentBody {

    private final File file;
    private final String filename;

    /**
     * @since 4.1
     *
     * @deprecated (4.3) use {@link FileBody#FileBody(File, ContentType, String)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public FileBody(final File file,
                    final String filename,
                    final String mimeType,
                    final String charset) {
        this(file, ContentType.create(mimeType, charset), filename);
    }

    /**
     * @since 4.1
     *
     * @deprecated (4.3) use {@link FileBody#FileBody(File, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public FileBody(final File file,
                    final String mimeType,
                    final String charset) {
        this(file, null, mimeType, charset);
    }

    /**
     * @deprecated (4.3) use {@link FileBody#FileBody(File, ContentType)}
     *   or {@link cz.msebera.android.httpclient.entity.mime.MultipartEntityBuilder}
     */
    @Deprecated
    public FileBody(final File file, final String mimeType) {
        this(file, ContentType.create(mimeType), null);
    }

    public FileBody(final File file) {
        this(file, ContentType.DEFAULT_BINARY, file != null ? file.getName() : null);
    }

    /**
     * @since 4.3
     */
    public FileBody(final File file, final ContentType contentType, final String filename) {
        super(contentType);
        Args.notNull(file, "File");
        this.file = file;
        this.filename = filename;
    }

    /**
     * @since 4.3
     */
    public FileBody(final File file, final ContentType contentType) {
        this(file, contentType, file != null ? file.getName() : null);
    }

    public InputStream getInputStream() throws IOException {
        return new FileInputStream(this.file);
    }

    @Override
    public void writeTo(final OutputStream out) throws IOException {
        Args.notNull(out, "Output stream");
        final InputStream in = new FileInputStream(this.file);
        try {
            final byte[] tmp = new byte[4096];
            int l;
            while ((l = in.read(tmp)) != -1) {
                out.write(tmp, 0, l);
            }
            out.flush();
        } finally {
            in.close();
        }
    }

    @Override
    public String getTransferEncoding() {
        return MIME.ENC_BINARY;
    }

    @Override
    public long getContentLength() {
        return this.file.length();
    }

    @Override
    public String getFilename() {
        return filename;
    }

    public File getFile() {
        return this.file;
    }

}
