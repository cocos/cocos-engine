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
#include "utils.h"

#include "base/StringUtil.h"
#include "core/utils/Path.h"

using namespace cc;

TEST(CoreUtilsPathTest, join) {
    EXPECT_EQ(join({"a", "b", "c", "d"}), "a/b/c/d");
    EXPECT_EQ(join({"a/", "b/", "c", "d"}), "a/b/c/d");
    EXPECT_EQ(join({"a//", "b/", "c", "d"}), "a//b/c/d");
    EXPECT_EQ(join({"a\\", "b\\", "c\\", "d"}), "a/b/c/d");
}

TEST(CoreUtilsPathTest, extname) {
    EXPECT_EQ(extname("?"), "");
    EXPECT_EQ(extname("."), ".");
    EXPECT_EQ(extname("a/b/c/d.png"), ".png");
    EXPECT_EQ(extname("a/b/c/d.png?hello=1&world=22"), ".png");
    EXPECT_EQ(extname(""), "");
    EXPECT_EQ(extname("a"), "");
    EXPECT_EQ(extname("a.png"), ".png");
    EXPECT_EQ(extname("/a.png"), ".png");
    EXPECT_EQ(extname("\\a.png"), ".png");
}

TEST(CoreUtilsPathTest, mainFileName) {
    EXPECT_EQ(mainFileName("a/b/c/d.png"), "a/b/c/d");
    EXPECT_EQ(mainFileName(""), "");
    EXPECT_EQ(mainFileName("a"), "a");
    EXPECT_EQ(mainFileName("a.png"), "a");
    EXPECT_EQ(mainFileName("/a.png"), "/a");
    EXPECT_EQ(mainFileName("\\a.png"), "\\a");
}

TEST(CoreUtilsPathTest, basename) {
    EXPECT_EQ(basename("?"), "?");
    EXPECT_EQ(basename("aa/bb/cc.js/ee.js", "xxxyyyyyyyyyyyyyyyzzzzzzzzzzjhhhhhhhhhh.js"), "ee.js");
    EXPECT_EQ(basename("aa/bb/cc.js?hello=1&world=200", ".js"), "cc");
    EXPECT_EQ(basename("aa/bb/cc.js?hello=1&world=200", ".wrongext"), "cc.js");

    EXPECT_EQ(basename("aa/bb/cc.js", ".js"), "cc");
    EXPECT_EQ(basename("aa/bb/cc_cc.js", ".js"), "cc_cc");
    EXPECT_EQ(basename("aa/bb/cc/"), "cc");
    EXPECT_EQ(basename("D:\\aa\\bb\\cc"), "cc");
    EXPECT_EQ(basename("aa/bb/cc(cc).js", ".js"), "cc(cc)");
    EXPECT_EQ(basename("aa/bb/cc[cc].js", ".js"), "cc[cc]");
    EXPECT_EQ(basename("aa/bb/cc.js/ee.js", ".js"), "ee");
    EXPECT_EQ(basename("aa/bb/.github"), ".github");
    EXPECT_EQ(basename("aa"), "aa");
    // ios only, and linux not suggest
    EXPECT_EQ(basename("aa/bb/cc|cc.js", ".js"), "cc|cc");
}

TEST(CoreUtilsPathTest, dirname) {
    EXPECT_EQ(dirname("aa/bb/cc"), "aa/bb");
    EXPECT_EQ(dirname("aa/bb/cc.png"), "aa/bb");
    EXPECT_EQ(dirname("aa/bb/cc/"), "aa/bb/cc");
    EXPECT_EQ(dirname("aa/bb/cc.png/ee.png"), "aa/bb/cc.png");
    EXPECT_EQ(dirname("D:\\aa\\bb"), "D:\\aa");
    EXPECT_EQ(dirname("aa/bb/.github/.gitignore"), "aa/bb/.github");
}

TEST(CoreUtilsPathTest, changeExtname) {
    EXPECT_EQ(changeExtname(""), "");
    EXPECT_EQ(changeExtname("?"), "?");
    EXPECT_EQ(changeExtname("a"), "a");
    EXPECT_EQ(changeExtname("aa/bb/cc"), "aa/bb/cc");
    EXPECT_EQ(changeExtname("aa/bb/cc.png"), "aa/bb/cc");
    EXPECT_EQ(changeExtname("aa/bb/cc", ".png"), "aa/bb/cc.png");
    EXPECT_EQ(changeExtname("aa/bb/cc.jpg", ".png"), "aa/bb/cc.png");
    EXPECT_EQ(changeExtname("aa/bb/cc.jpg?a=1&b=2", ".png"), "aa/bb/cc.png?a=1&b=2");
    EXPECT_EQ(changeExtname("aa/bb/cc.png/ee.png", ".gif"), "aa/bb/cc.png/ee.gif");
    EXPECT_EQ(changeExtname("D:\\aa\\bb\\cc.png\\ee.png", ".gif"), "D:\\aa\\bb\\cc.png\\ee.gif");
    EXPECT_EQ(changeExtname("aa/bb/.github/.gitignore"), "aa/bb/.github/");
    EXPECT_EQ(changeExtname("aa/bb/.github/.gitignore", ".png"), "aa/bb/.github/.png");
}

TEST(CoreUtilsPathTest, changeBasename) {
    EXPECT_EQ(changeBasename(".", "hello"), "hello");
    EXPECT_EQ(changeBasename(".", "hello", true), "hello.");
    EXPECT_EQ(changeBasename("", "abc"), "abc");
    EXPECT_EQ(changeBasename("", "abc", true), "abc");
    EXPECT_EQ(changeBasename("abc", "eee"), "eee");
    EXPECT_EQ(changeBasename("abc", "eee", true), "eee");
    EXPECT_EQ(changeBasename("abc", ".eee"), "abc.eee");

    EXPECT_EQ(changeBasename("?", ".eee"), "?.eee");
    EXPECT_EQ(changeBasename("?", ".eee", true), "?.eee");
    EXPECT_EQ(changeBasename("aa/bb/cc", "hello"), "aa/bb/hello");
    EXPECT_EQ(changeBasename("aa/bb/cc", "hello", true), "aa/bb/hello");
    EXPECT_EQ(changeBasename("aa/bb/cc.png", "hello"), "aa/bb/hello");
    EXPECT_EQ(changeBasename("aa/bb/cc.png", "hello", true), "aa/bb/hello.png");

    EXPECT_EQ(changeBasename("aa/bb/cc.jpg?a=1&b=2", "hello"), "aa/bb/hello?a=1&b=2");
    EXPECT_EQ(changeBasename("aa/bb/cc.jpg?a=1&b=2", "hello", true), "aa/bb/hello.jpg?a=1&b=2");
    EXPECT_EQ(changeBasename("aa/bb/cc.png/ee.png", "hello"), "aa/bb/cc.png/hello");
    EXPECT_EQ(changeBasename("aa/bb/cc.png/ee.png", "hello", true), "aa/bb/cc.png/hello.png");
    EXPECT_EQ(changeBasename("D:\\aa\\bb\\cc.png\\ee.png", "hello"), "D:\\aa\\bb\\cc.png\\hello");
    EXPECT_EQ(changeBasename("aa/bb/.github/.gitignore", "hello"), "aa/bb/.github/hello");
    EXPECT_EQ(changeBasename("aa/bb/.github/.gitignore", "hello", true), "aa/bb/.github/hello.gitignore");
}

TEST(CoreUtilsPathTest, normalize) {
    EXPECT_EQ(normalize("../aa.png"), "../aa.png");
    EXPECT_EQ(normalize("aa/../../aa.png"), "../aa.png");
    EXPECT_EQ(normalize("aa/../aa.png"), "aa.png");
    EXPECT_EQ(normalize("aa/bb/cc/../aa.png"), "aa/bb/aa.png");
    EXPECT_EQ(normalize("aa/bb/cc/../../aa.png"), "aa/aa.png");
    std::string normalizedStr = normalize("D:\\aa\\bb\\cc\\..\\ee.png");
    StringUtil::replaceAll(normalizedStr, "/", "\\");
    EXPECT_EQ(normalizedStr, "D:\\aa\\bb\\ee.png");
}

TEST(CoreUtilsPathTest, stripSep) {
    EXPECT_EQ(stripSep(""), "");
    EXPECT_EQ(stripSep("/"), "");
    EXPECT_EQ(stripSep("\\"), "");
    EXPECT_EQ(stripSep("a"), "a");
    EXPECT_EQ(stripSep("a/"), "a");
    EXPECT_EQ(stripSep("a\\"), "a");
    EXPECT_EQ(stripSep("a/b/c/"), "a/b/c");
    EXPECT_EQ(stripSep("a/b/c//"), "a/b/c/");
    EXPECT_EQ(stripSep("a\\b\\c\\"), "a\\b\\c");
}
