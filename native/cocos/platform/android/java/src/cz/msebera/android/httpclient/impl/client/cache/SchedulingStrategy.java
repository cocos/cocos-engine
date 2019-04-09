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

/**
 * Specifies when revalidation requests are scheduled.
 *
 * @since 4.3
 */
public interface SchedulingStrategy extends Closeable
{
    /**
     * Schedule an {@link AsynchronousValidationRequest} to be executed.
     *
     * @param revalidationRequest the request to be executed; not {@code null}
     * @throws java.util.concurrent.RejectedExecutionException if the request could not be scheduled for execution
     */
    void schedule(AsynchronousValidationRequest revalidationRequest);
}
