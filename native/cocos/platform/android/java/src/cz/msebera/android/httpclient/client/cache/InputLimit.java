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
package cz.msebera.android.httpclient.client.cache;

import cz.msebera.android.httpclient.annotation.NotThreadSafe;

/**
 * Used to limiting the size of an incoming response body of
 * unknown size that is optimistically being read in anticipation
 * of caching it.
 * @since 4.1
 */
@NotThreadSafe // reached
public class InputLimit {

    private final long value;
    private boolean reached;

    /**
     * Create a limit for how many bytes of a response body to
     * read.
     * @param value maximum length in bytes
     */
    public InputLimit(final long value) {
        super();
        this.value = value;
        this.reached = false;
    }

    /**
     * Returns the current maximum limit that was set on
     * creation.
     */
    public long getValue() {
        return this.value;
    }

    /**
     * Used to report that the limit has been reached.
     */
    public void reached() {
        this.reached = true;
    }

    /**
     * Returns {@code true} if the input limit has been reached.
     */
    public boolean isReached() {
        return this.reached;
    }

}
