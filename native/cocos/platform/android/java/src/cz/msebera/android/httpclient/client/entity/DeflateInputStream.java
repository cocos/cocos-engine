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
package cz.msebera.android.httpclient.client.entity;

import java.io.IOException;
import java.io.InputStream;
import java.io.PushbackInputStream;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

/** Deflate input stream.    This class includes logic needed for various Rfc's in order
* to reasonably implement the "deflate" compression style.
*/
public class DeflateInputStream extends InputStream
{
    private InputStream sourceStream;

    public DeflateInputStream(final InputStream wrapped)
        throws IOException
    {
        /*
            * A zlib stream will have a header.
            *
            * CMF | FLG [| DICTID ] | ...compressed data | ADLER32 |
            *
            * * CMF is one byte.
            *
            * * FLG is one byte.
            *
            * * DICTID is four bytes, and only present if FLG.FDICT is set.
            *
            * Sniff the content. Does it look like a zlib stream, with a CMF, etc? c.f. RFC1950,
            * section 2.2. http://tools.ietf.org/html/rfc1950#page-4
            *
            * We need to see if it looks like a proper zlib stream, or whether it is just a deflate
            * stream. RFC2616 calls zlib streams deflate. Confusing, isn't it? That's why some servers
            * implement deflate Content-Encoding using deflate streams, rather than zlib streams.
            *
            * We could start looking at the bytes, but to be honest, someone else has already read
            * the RFCs and implemented that for us. So we'll just use the JDK libraries and exception
            * handling to do this. If that proves slow, then we could potentially change this to check
            * the first byte - does it look like a CMF? What about the second byte - does it look like
            * a FLG, etc.
            */

        /* We read a small buffer to sniff the content. */
        final byte[] peeked = new byte[6];

        final PushbackInputStream pushback = new PushbackInputStream(wrapped, peeked.length);

        final int headerLength = pushback.read(peeked);

        if (headerLength == -1) {
            throw new IOException("Unable to read the response");
        }

        /* We try to read the first uncompressed byte. */
        final byte[] dummy = new byte[1];

        final Inflater inf = new Inflater();

        try {
            int n;
            while ((n = inf.inflate(dummy)) == 0) {
                if (inf.finished()) {

                    /* Not expecting this, so fail loudly. */
                    throw new IOException("Unable to read the response");
                }

                if (inf.needsDictionary()) {

                    /* Need dictionary - then it must be zlib stream with DICTID part? */
                    break;
                }

                if (inf.needsInput()) {
                    inf.setInput(peeked);
                }
            }

            if (n == -1) {
                throw new IOException("Unable to read the response");
            }

            /*
                * We read something without a problem, so it's a valid zlib stream. Just need to reset
                * and return an unused InputStream now.
                */
            pushback.unread(peeked, 0, headerLength);
            sourceStream = new DeflateStream(pushback, new Inflater());
        } catch (final DataFormatException e) {

            /* Presume that it's an RFC1951 deflate stream rather than RFC1950 zlib stream and try
                * again. */
            pushback.unread(peeked, 0, headerLength);
            sourceStream = new DeflateStream(pushback, new Inflater(true));
        } finally {
            inf.end();
        }

    }

    /** Read a byte.
    */
    @Override
    public int read()
        throws IOException
    {
        return sourceStream.read();
    }

    /** Read lots of bytes.
    */
    @Override
    public int read(final byte[] b)
        throws IOException
    {
        return sourceStream.read(b);
    }

    /** Read lots of specific bytes.
    */
    @Override
    public int read(final byte[] b, final int off, final int len)
        throws IOException
    {
        return sourceStream.read(b,off,len);
    }

    /** Skip
    */
    @Override
    public long skip(final long n)
        throws IOException
    {
        return sourceStream.skip(n);
    }

    /** Get available.
    */
    @Override
    public int available()
        throws IOException
    {
        return sourceStream.available();
    }

    /** Mark.
    */
    @Override
    public void mark(final int readLimit)
    {
        sourceStream.mark(readLimit);
    }

    /** Reset.
    */
    @Override
    public void reset()
        throws IOException
    {
        sourceStream.reset();
    }

    /** Check if mark is supported.
    */
    @Override
    public boolean markSupported()
    {
        return sourceStream.markSupported();
    }

    /** Close.
    */
    @Override
    public void close()
        throws IOException
    {
        sourceStream.close();
    }

    static class DeflateStream extends InflaterInputStream {

        private boolean closed = false;

        public DeflateStream(final InputStream in, final Inflater inflater) {
            super(in, inflater);
        }

        @Override
        public void close() throws IOException {
            if (closed) {
                return;
            }
            closed = true;
            inf.end();
            super.close();
        }

    }

}

