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
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.client.utils.DateUtils;

/** This class provides for parsing and understanding Warning headers. As
 * the Warning header can be multi-valued, but the values can contain
 * separators like commas inside quoted strings, we cannot use the regular
 * {@link Header#getElements()} call to access the values.
 */
class WarningValue {

    private int offs;
    private int init_offs;
    private final String src;
    private int warnCode;
    private String warnAgent;
    private String warnText;
    private Date warnDate;

    WarningValue(final String s) {
        this(s, 0);
    }

    WarningValue(final String s, final int offs) {
        this.offs = this.init_offs = offs;
        this.src = s;
        consumeWarnValue();
    }

    /** Returns an array of the parseable warning values contained
     * in the given header value, which is assumed to be a
     * Warning header. Improperly formatted warning values will be
     * skipped, in keeping with the philosophy of "ignore what you
     * cannot understand."
     * @param h Warning {@link Header} to parse
     * @return array of {@code WarnValue} objects
     */
    public static WarningValue[] getWarningValues(final Header h) {
        final List<WarningValue> out = new ArrayList<WarningValue>();
        final String src = h.getValue();
        int offs = 0;
        while(offs < src.length()) {
            try {
                final WarningValue wv = new WarningValue(src, offs);
                out.add(wv);
                offs = wv.offs;
            } catch (final IllegalArgumentException e) {
                final int nextComma = src.indexOf(',', offs);
                if (nextComma == -1) {
                    break;
                }
                offs = nextComma + 1;
            }
        }
        final WarningValue[] wvs = {};
        return out.toArray(wvs);
    }

    /*
     * LWS            = [CRLF] 1*( SP | HT )
     * CRLF           = CR LF
     */
    protected void consumeLinearWhitespace() {
        while(offs < src.length()) {
            switch(src.charAt(offs)) {
            case '\r':
                if (offs+2 >= src.length()
                    || src.charAt(offs+1) != '\n'
                    || (src.charAt(offs+2) != ' '
                        && src.charAt(offs+2) != '\t')) {
                    return;
                }
                offs += 2;
                break;
            case ' ':
            case '\t':
                break;
            default:
                return;
            }
            offs++;
        }
    }

    /*
     * CHAR           = <any US-ASCII character (octets 0 - 127)>
     */
    private boolean isChar(final char c) {
        final int i = c;
        return (i >= 0 && i <= 127);
    }

    /*
     * CTL            = <any US-ASCII control character
                        (octets 0 - 31) and DEL (127)>
     */
    private boolean isControl(final char c) {
        final int i = c;
        return (i == 127 || (i >=0 && i <= 31));
    }

    /*
     * separators     = "(" | ")" | "<" | ">" | "@"
     *                | "," | ";" | ":" | "\" | <">
     *                | "/" | "[" | "]" | "?" | "="
     *                | "{" | "}" | SP | HT
     */
    private boolean isSeparator(final char c) {
        return (c == '(' || c == ')' || c == '<' || c == '>'
                || c == '@' || c == ',' || c == ';' || c == ':'
                || c == '\\' || c == '\"' || c == '/'
                || c == '[' || c == ']' || c == '?' || c == '='
                || c == '{' || c == '}' || c == ' ' || c == '\t');
    }

    /*
     * token          = 1*<any CHAR except CTLs or separators>
     */
    protected void consumeToken() {
        if (!isTokenChar(src.charAt(offs))) {
            parseError();
        }
        while(offs < src.length()) {
            if (!isTokenChar(src.charAt(offs))) {
                break;
            }
            offs++;
        }
    }

    private boolean isTokenChar(final char c) {
        return (isChar(c) && !isControl(c) && !isSeparator(c));
    }

    private static final String TOPLABEL = "\\p{Alpha}([\\p{Alnum}-]*\\p{Alnum})?";
    private static final String DOMAINLABEL = "\\p{Alnum}([\\p{Alnum}-]*\\p{Alnum})?";
    private static final String HOSTNAME = "(" + DOMAINLABEL + "\\.)*" + TOPLABEL + "\\.?";
    private static final String IPV4ADDRESS = "\\d+\\.\\d+\\.\\d+\\.\\d+";
    private static final String HOST = "(" + HOSTNAME + ")|(" + IPV4ADDRESS + ")";
    private static final String PORT = "\\d*";
    private static final String HOSTPORT = "(" + HOST + ")(\\:" + PORT + ")?";
    private static final Pattern HOSTPORT_PATTERN = Pattern.compile(HOSTPORT);

    protected void consumeHostPort() {
        final Matcher m = HOSTPORT_PATTERN.matcher(src.substring(offs));
        if (!m.find()) {
            parseError();
        }
        if (m.start() != 0) {
            parseError();
        }
        offs += m.end();
    }


    /*
     * warn-agent = ( host [ ":" port ] ) | pseudonym
     * pseudonym         = token
     */
    protected void consumeWarnAgent() {
        final int curr_offs = offs;
        try {
            consumeHostPort();
            warnAgent = src.substring(curr_offs, offs);
            consumeCharacter(' ');
            return;
        } catch (final IllegalArgumentException e) {
            offs = curr_offs;
        }
        consumeToken();
        warnAgent = src.substring(curr_offs, offs);
        consumeCharacter(' ');
    }

    /*
     * quoted-string  = ( <"> *(qdtext | quoted-pair ) <"> )
     * qdtext         = <any TEXT except <">>
     */
    protected void consumeQuotedString() {
        if (src.charAt(offs) != '\"') {
            parseError();
        }
        offs++;
        boolean foundEnd = false;
        while(offs < src.length() && !foundEnd) {
            final char c = src.charAt(offs);
            if (offs + 1 < src.length() && c == '\\'
                && isChar(src.charAt(offs+1))) {
                offs += 2;    // consume quoted-pair
            } else if (c == '\"') {
                foundEnd = true;
                offs++;
            } else if (c != '\"' && !isControl(c)) {
                offs++;
            } else {
                parseError();
            }
        }
        if (!foundEnd) {
            parseError();
        }
    }

    /*
     * warn-text  = quoted-string
     */
    protected void consumeWarnText() {
        final int curr = offs;
        consumeQuotedString();
        warnText = src.substring(curr, offs);
    }

    private static final String MONTH = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";
    private static final String WEEKDAY = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday";
    private static final String WKDAY = "Mon|Tue|Wed|Thu|Fri|Sat|Sun";
    private static final String TIME = "\\d{2}:\\d{2}:\\d{2}";
    private static final String DATE3 = "(" + MONTH + ") ( |\\d)\\d";
    private static final String DATE2 = "\\d{2}-(" + MONTH + ")-\\d{2}";
    private static final String DATE1 = "\\d{2} (" + MONTH + ") \\d{4}";
    private static final String ASCTIME_DATE = "(" + WKDAY + ") (" + DATE3 + ") (" + TIME + ") \\d{4}";
    private static final String RFC850_DATE = "(" + WEEKDAY + "), (" + DATE2 + ") (" + TIME + ") GMT";
    private static final String RFC1123_DATE = "(" + WKDAY + "), (" + DATE1 + ") (" + TIME + ") GMT";
    private static final String HTTP_DATE = "(" + RFC1123_DATE + ")|(" + RFC850_DATE + ")|(" + ASCTIME_DATE + ")";
    private static final String WARN_DATE = "\"(" + HTTP_DATE + ")\"";
    private static final Pattern WARN_DATE_PATTERN = Pattern.compile(WARN_DATE);

    /*
     * warn-date  = <"> HTTP-date <">
     */
    protected void consumeWarnDate() {
        final int curr = offs;
        final Matcher m = WARN_DATE_PATTERN.matcher(src.substring(offs));
        if (!m.lookingAt()) {
            parseError();
        }
        offs += m.end();
        warnDate = DateUtils.parseDate(src.substring(curr+1,offs-1));
    }

    /*
     * warning-value = warn-code SP warn-agent SP warn-text [SP warn-date]
     */
    protected void consumeWarnValue() {
        consumeLinearWhitespace();
        consumeWarnCode();
        consumeWarnAgent();
        consumeWarnText();
        if (offs + 1 < src.length() && src.charAt(offs) == ' ' && src.charAt(offs+1) == '\"') {
            consumeCharacter(' ');
            consumeWarnDate();
        }
        consumeLinearWhitespace();
        if (offs != src.length()) {
            consumeCharacter(',');
        }
    }

    protected void consumeCharacter(final char c) {
        if (offs + 1 > src.length()
            || c != src.charAt(offs)) {
            parseError();
        }
        offs++;
    }

    /*
     * warn-code  = 3DIGIT
     */
    protected void consumeWarnCode() {
        if (offs + 4 > src.length()
            || !Character.isDigit(src.charAt(offs))
            || !Character.isDigit(src.charAt(offs + 1))
            || !Character.isDigit(src.charAt(offs + 2))
            || src.charAt(offs + 3) != ' ') {
            parseError();
        }
        warnCode = Integer.parseInt(src.substring(offs,offs+3));
        offs += 4;
    }

    private void parseError() {
        final String s = src.substring(init_offs);
        throw new IllegalArgumentException("Bad warn code \"" + s + "\"");
    }

    /** Returns the 3-digit code associated with this warning.
     * @return {@code int}
     */
    public int getWarnCode() { return warnCode; }

    /** Returns the "warn-agent" string associated with this warning,
     * which is either the name or pseudonym of the server that added
     * this particular Warning header.
     * @return {@link String}
     */
    public String getWarnAgent() { return warnAgent; }

    /** Returns the human-readable warning text for this warning. Note
     * that the original quoted-string is returned here, including
     * escaping for any contained characters. In other words, if the
     * header was:
     * <pre>
     *   Warning: 110 fred "Response is stale"
     * </pre>
     * then this method will return {@code "\"Response is stale\""}
     * (surrounding quotes included).
     * @return {@link String}
     */
    public String getWarnText() { return warnText; }

    /** Returns the date and time when this warning was added, or
     * {@code null} if a warning date was not supplied in the
     * header.
     * @return {@link Date}
     */
    public Date getWarnDate() { return warnDate; }

    /** Formats a {@code WarningValue} as a {@link String}
     * suitable for including in a header. For example, you can:
     * <pre>
     *   WarningValue wv = ...;
     *   HttpResponse resp = ...;
     *   resp.addHeader("Warning", wv.toString());
     * </pre>
     * @return {@link String}
     */
    @Override
    public String toString() {
        if (warnDate != null) {
            return String.format("%d %s %s \"%s\"", Integer.valueOf(warnCode),
                    warnAgent, warnText, DateUtils.formatDate(warnDate));
        } else {
            return String.format("%d %s %s", Integer.valueOf(warnCode), warnAgent, warnText);
        }
    }

}
