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

package cz.msebera.android.httpclient.client.methods;

import cz.msebera.android.httpclient.conn.ClientConnectionRequest;
import cz.msebera.android.httpclient.conn.ConnectionReleaseTrigger;

import java.io.IOException;


/**
 * Interface representing an HTTP request that can be aborted by shutting
 * down the underlying HTTP connection.
 *
 * @since 4.0
 *
 * @deprecated (4.3) use {@link HttpExecutionAware}
 */
@Deprecated
public interface AbortableHttpRequest {

    /**
     * Sets the {@link cz.msebera.android.httpclient.conn.ClientConnectionRequest}
     * callback that can be used to abort a long-lived request for a connection.
     * If the request is already aborted, throws an {@link IOException}.
     *
     * @see cz.msebera.android.httpclient.conn.ClientConnectionManager
     */
    void setConnectionRequest(ClientConnectionRequest connRequest) throws IOException;

    /**
     * Sets the {@link ConnectionReleaseTrigger} callback that can
     * be used to abort an active connection.
     * Typically, this will be the
     *   {@link cz.msebera.android.httpclient.conn.ManagedClientConnection} itself.
     * If the request is already aborted, throws an {@link IOException}.
     */
    void setReleaseTrigger(ConnectionReleaseTrigger releaseTrigger) throws IOException;

    /**
     * Aborts this http request. Any active execution of this method should
     * return immediately. If the request has not started, it will abort after
     * the next execution. Aborting this request will cause all subsequent
     * executions with this request to fail.
     *
     * @see cz.msebera.android.httpclient.client.HttpClient#execute(HttpUriRequest)
     * @see cz.msebera.android.httpclient.client.HttpClient#execute(cz.msebera.android.httpclient.HttpHost,
     *      cz.msebera.android.httpclient.HttpRequest)
     * @see cz.msebera.android.httpclient.client.HttpClient#execute(HttpUriRequest,
     *      cz.msebera.android.httpclient.protocol.HttpContext)
     * @see cz.msebera.android.httpclient.client.HttpClient#execute(cz.msebera.android.httpclient.HttpHost,
     *      cz.msebera.android.httpclient.HttpRequest, cz.msebera.android.httpclient.protocol.HttpContext)
     */
    void abort();

}

