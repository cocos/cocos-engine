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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * The header of an entity (see RFC 2045).
 */
public class Header implements Iterable<MinimalField> {

    private final List<MinimalField> fields;
    private final Map<String, List<MinimalField>> fieldMap;

    public Header() {
        super();
        this.fields = new LinkedList<MinimalField>();
        this.fieldMap = new HashMap<String, List<MinimalField>>();
    }

    public void addField(final MinimalField field) {
        if (field == null) {
            return;
        }
        final String key = field.getName().toLowerCase(Locale.ROOT);
        List<MinimalField> values = this.fieldMap.get(key);
        if (values == null) {
            values = new LinkedList<MinimalField>();
            this.fieldMap.put(key, values);
        }
        values.add(field);
        this.fields.add(field);
    }

    public List<MinimalField> getFields() {
        return new ArrayList<MinimalField>(this.fields);
    }

    public MinimalField getField(final String name) {
        if (name == null) {
            return null;
        }
        final String key = name.toLowerCase(Locale.ROOT);
        final List<MinimalField> list = this.fieldMap.get(key);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<MinimalField> getFields(final String name) {
        if (name == null) {
            return null;
        }
        final String key = name.toLowerCase(Locale.ROOT);
        final List<MinimalField> list = this.fieldMap.get(key);
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        } else {
            return new ArrayList<MinimalField>(list);
        }
    }

    public int removeFields(final String name) {
        if (name == null) {
            return 0;
        }
        final String key = name.toLowerCase(Locale.ROOT);
        final List<MinimalField> removed = fieldMap.remove(key);
        if (removed == null || removed.isEmpty()) {
            return 0;
        }
        this.fields.removeAll(removed);
        return removed.size();
    }

    public void setField(final MinimalField field) {
        if (field == null) {
            return;
        }
        final String key = field.getName().toLowerCase(Locale.ROOT);
        final List<MinimalField> list = fieldMap.get(key);
        if (list == null || list.isEmpty()) {
            addField(field);
            return;
        }
        list.clear();
        list.add(field);
        int firstOccurrence = -1;
        int index = 0;
        for (final Iterator<MinimalField> it = this.fields.iterator(); it.hasNext(); index++) {
            final MinimalField f = it.next();
            if (f.getName().equalsIgnoreCase(field.getName())) {
                it.remove();
                if (firstOccurrence == -1) {
                    firstOccurrence = index;
                }
            }
        }
        this.fields.add(firstOccurrence, field);
    }

    @Override
    public Iterator<MinimalField> iterator() {
        return Collections.unmodifiableList(fields).iterator();
    }

    @Override
    public String toString() {
        return this.fields.toString();
    }

}

