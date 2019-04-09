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

import java.io.Closeable;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;

import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.annotation.Immutable;

@Immutable
class IOUtils {

    static void consume(final HttpEntity entity) throws IOException {
        if (entity == null) {
            return;
        }
        if (entity.isStreaming()) {
            final InputStream instream = entity.getContent();
            if (instream != null) {
                instream.close();
            }
        }
    }

    static void copy(final InputStream in, final OutputStream out) throws IOException {
        final byte[] buf = new byte[2048];
        int len;
        while ((len = in.read(buf)) != -1) {
            out.write(buf, 0, len);
        }
    }

    static void closeSilently(final Closeable closable) {
        try {
            closable.close();
        } catch (final IOException ignore) {
        }
    }

    static void copyAndClose(final InputStream in, final OutputStream out) throws IOException {
        try {
            copy(in, out);
            in.close();
            out.close();
        } catch (final IOException ex) {
            closeSilently(in);
            closeSilently(out);
            // Propagate the original exception
            throw ex;
        }
    }

    static void copyFile(final File in, final File out) throws IOException {
        final RandomAccessFile f1 = new RandomAccessFile(in, "r");
        final RandomAccessFile f2 = new RandomAccessFile(out, "rw");
        try {
            final FileChannel c1 = f1.getChannel();
            final FileChannel c2 = f2.getChannel();
            try {
                c1.transferTo(0, f1.length(), c2);
                c1.close();
                c2.close();
            } catch (final IOException ex) {
                closeSilently(c1);
                closeSilently(c2);
                // Propagate the original exception
                throw ex;
            }
            f1.close();
            f2.close();
        } catch (final IOException ex) {
            closeSilently(f1);
            closeSilently(f2);
            // Propagate the original exception
            throw ex;
        }
    }

}
