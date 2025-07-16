/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.cocos.lib;

import ohos.data.DatabaseHelper;
import ohos.data.rdb.*;
import ohos.data.resultset.ResultSet;

public class CocosLocalStorage {

    private static String DATABASE_NAME = "jsb.storage.db";
    private static String TABLE_NAME = "data";
    private static final int DATABASE_VERSION = 1;

    private static DatabaseHelper mDatabaseOpenHelper = null;
    private static RdbStore mDatabase = null;

    private static RdbOpenCallback rdbOpenCallback = new RdbOpenCallback() {
        @Override
        public void onCreate(RdbStore rdbStore) {
            rdbStore.executeSql("CREATE TABLE IF NOT EXISTS "+TABLE_NAME+"(key TEXT PRIMARY KEY,value TEXT);");
        }

        @Override
        public void onUpgrade(RdbStore rdbStore, int i, int i1) {

        }
    };

    public static boolean init(String dbName, String tableName) {
        if (GlobalObject.getAbilitySlice() != null) {
            DATABASE_NAME = dbName;
            TABLE_NAME = tableName;
            mDatabaseOpenHelper = new DatabaseHelper(GlobalObject.getAbilitySlice());
            StoreConfig cfg = StoreConfig.newDefaultConfig(DATABASE_NAME);
            mDatabase = mDatabaseOpenHelper.getRdbStore(cfg, DATABASE_VERSION, rdbOpenCallback, null);
            return true;
        }
        return false;
    }

    private static String getTableName() {
        return DATABASE_NAME + "." + TABLE_NAME;
    }

    public static void destroy() {
        if (mDatabase != null) {
            mDatabaseOpenHelper.deleteRdbStore(DATABASE_NAME);
        }
    }

    public static void setItem(String key, String value) {
        ValuesBucket valuesBucket = new ValuesBucket();
        valuesBucket.putString("key", key);
        valuesBucket.putString("value", value);
        mDatabase.insert(TABLE_NAME, valuesBucket);
    }

    public static String getItem(String key) {
        String[] columes = new String[] {"value"};
        RdbPredicates rdbPredicates = new RdbPredicates(TABLE_NAME).equalTo("key", key);
        ResultSet resultSet = mDatabase.query(rdbPredicates, columes);
        if(resultSet.goToNextRow()) {
            return resultSet.getString(0);
        }
        return null;
    }

    public static void removeItem(String key) {
        RdbPredicates rdbPredicates = new RdbPredicates(TABLE_NAME).equalTo("key", key);
        mDatabase.delete(rdbPredicates);
    }

    public static void clear() {
        RdbPredicates rdbPredicates = new RdbPredicates(TABLE_NAME);
        mDatabase.delete(rdbPredicates);
    }
    @SuppressWarnings("unused")
    public static String getKey(int nIndex) {

        ResultSet result = mDatabase.querySql("SELECT key from "+TABLE_NAME + " LIMIT 1 OFFSET " + nIndex, null);
        if(result.goToNextRow()){
            return result.getString(result.getColumnIndexForName("key"));
        }
        return null;
    }

    public static int getLength() {
        ResultSet result = mDatabase.querySql("SELECT count(key) as cnt FROM  "+TABLE_NAME, null);
        if(result.goToNextRow()) {
            return result.getInt(result.getColumnIndexForName("cnt"));
        }
        return 0;
    }
}
