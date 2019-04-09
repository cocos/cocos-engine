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

import cz.msebera.android.httpclient.annotation.Immutable;

/**
 * The error count with a creation timestamp and its associated key.
 *
 * @since 4.3
 */
@Immutable
public class FailureCacheValue {

    private final long creationTimeInNanos;
    private final String key;
    private final int errorCount;

    public FailureCacheValue(final String key, final int errorCount) {
        this.creationTimeInNanos = System.nanoTime();
        this.key = key;
        this.errorCount = errorCount;
    }

    public long getCreationTimeInNanos() {
        return creationTimeInNanos;
    }

    public String getKey()
    {
        return key;
    }

    public int getErrorCount() {
        return errorCount;
    }

    @Override
    public String toString() {
        return "[entry creationTimeInNanos=" + creationTimeInNanos + "; " +
                "key=" + key + "; errorCount=" + errorCount + ']';
    }
}
