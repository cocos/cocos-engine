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

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import cz.msebera.android.httpclient.annotation.Immutable;
import cz.msebera.android.httpclient.client.cache.Resource;

/**
 * Cache resource backed by a byte array on the heap.
 *
 * @since 4.1
 */
@Immutable
public class HeapResource implements Resource {

    private static final long serialVersionUID = -2078599905620463394L;

    private final byte[] b;

    public HeapResource(final byte[] b) {
        super();
        this.b = b;
    }

    byte[] getByteArray() {
        return this.b;
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(this.b);
    }

    @Override
    public long length() {
        return this.b.length;
    }

    @Override
    public void dispose() {
    }

}
