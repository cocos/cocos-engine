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

import cz.msebera.android.httpclient.Consts;

import java.nio.charset.Charset;

/**
 *
 * @since 4.0
 */
public final class MIME {

    public static final String CONTENT_TYPE          = "Content-Type";
    public static final String CONTENT_TRANSFER_ENC  = "Content-Transfer-Encoding";
    public static final String CONTENT_DISPOSITION   = "Content-Disposition";

    public static final String ENC_8BIT              = "8bit";
    public static final String ENC_BINARY            = "binary";

    /** The default character set to be used, i.e. "US-ASCII" */
    public static final Charset DEFAULT_CHARSET      = Consts.ASCII;

    /** UTF-8 is used for RFC6532 */
    public static final Charset UTF8_CHARSET         = Consts.UTF_8;

}
