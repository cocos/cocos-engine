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
package cz.msebera.android.httpclient.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * The field or method to which this annotation is applied can only be accessed
 * when holding a particular lock, which may be a built-in (synchronization) lock,
 * or may be an explicit java.util.concurrent.Lock.
 *
 * <p>
 * The argument determines which lock guards the annotated field or method:
 * </p>
 * <ul>
 * <li>
 * {@code this} : The intrinsic lock of the object in whose class the field is defined.
 * </li>
 * <li>
 * {@code class-name.this} : For inner classes, it may be necessary to disambiguate 'this';
 * the <em>class-name.this</em> designation allows you to specify which 'this' reference is intended
 * </li>
 * <li>
 * {@code itself} : For reference fields only; the object to which the field refers.
 * </li>
 * <li>
 * {@code field-name} : The lock object is referenced by the (instance or static) field
 * specified by <em>field-name</em>.
 * </li>
 * <li>
 * {@code class-name.field-name} : The lock object is reference by the static field specified
 * by <em>class-name.field-name</em>.
 * </li>
 * <li>
 * {@code method-name()} : The lock object is returned by calling the named nil-ary method.
 * </li>
 * <li>
 * {@code class-name.class} : The Class object for the specified class should be used as the lock object.
 * </li>
 * </ul>
 * <p>
 * Based on code developed by Brian Goetz and Tim Peierls and concepts
 * published in 'Java Concurrency in Practice' by Brian Goetz, Tim Peierls,
 * Joshua Bloch, Joseph Bowbeer, David Holmes and Doug Lea.
 * </p>
 */
@Documented
@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.CLASS) // The original version used RUNTIME
public @interface GuardedBy {
    String value();
}
