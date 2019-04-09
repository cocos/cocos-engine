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
package cz.msebera.android.httpclient.conn.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.annotation.Immutable;

/**
 * Parses the list from <a href="http://publicsuffix.org/">publicsuffix.org</a>
 * and configures a PublicSuffixFilter.
 *
 * @since 4.4
 */
@Immutable
public final class PublicSuffixListParser {

    private static final int MAX_LINE_LEN = 256;

    public PublicSuffixListParser() {
    }

    /**
     * Parses the public suffix list format. When creating the reader from the file, make sure to
     * use the correct encoding (the original list is in UTF-8).
     *
     * @param reader the data reader. The caller is responsible for closing the reader.
     * @throws java.io.IOException on error while reading from list
     */
    public PublicSuffixList parse(final Reader reader) throws IOException {
        final List<String> rules = new ArrayList<String>();
        final List<String> exceptions = new ArrayList<String>();
        final BufferedReader r = new BufferedReader(reader);
        final StringBuilder sb = new StringBuilder(256);
        boolean more = true;
        while (more) {
            more = readLine(r, sb);
            String line = sb.toString();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("//")) {
                continue; //entire lines can also be commented using //
            }
            if (line.startsWith(".")) {
                line = line.substring(1); // A leading dot is optional
            }
            // An exclamation mark (!) at the start of a rule marks an exception to a previous wildcard rule
            final boolean isException = line.startsWith("!");
            if (isException) {
                line = line.substring(1);
            }

            if (isException) {
                exceptions.add(line);
            } else {
                rules.add(line);
            }
        }
        return new PublicSuffixList(rules, exceptions);
    }

    private boolean readLine(final Reader r, final StringBuilder sb) throws IOException {
        sb.setLength(0);
        int b;
        boolean hitWhitespace = false;
        while ((b = r.read()) != -1) {
            final char c = (char) b;
            if (c == '\n') {
                break;
            }
            // Each line is only read up to the first whitespace
            if (Character.isWhitespace(c)) {
                hitWhitespace = true;
            }
            if (!hitWhitespace) {
                sb.append(c);
            }
            if (sb.length() > MAX_LINE_LEN) {
                return false; // prevent excess memory usage
            }
        }
        return (b != -1);
    }

}
