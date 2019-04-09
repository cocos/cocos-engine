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

import java.io.IOException;
import java.io.InputStream;

/**
 * Generates {@link Resource} instances for handling cached
 * HTTP response bodies.
 *
 * @since 4.1
 */
public interface ResourceFactory {

    /**
     * Creates a {@link Resource} from a given response body.
     * @param requestId a unique identifier for this particular
     *   response body
     * @param instream the original {@link InputStream}
     *   containing the response body of the origin HTTP response.
     * @param limit maximum number of bytes to consume of the
     *   response body; if this limit is reached before the
     *   response body is fully consumed, mark the limit has
     *   having been reached and return a {@code Resource}
     *   containing the data read to that point.
     * @return a {@code Resource} containing however much of
     *   the response body was successfully read.
     * @throws IOException
     */
    Resource generate(String requestId, InputStream instream, InputLimit limit) throws IOException;

    /**
     * Clones an existing {@link Resource}.
     * @param requestId unique identifier provided to associate
     *   with the cloned response body.
     * @param resource the original response body to clone.
     * @return the {@code Resource} copy
     * @throws IOException
     */
    Resource copy(String requestId, Resource resource) throws IOException;

}
