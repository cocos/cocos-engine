
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#import <Foundation/Foundation.h>
#include "cocos/core/filesystem/apple/AppleFileSystem.h"
#include <ftw.h>
#include <stack>
#include "base/Log.h"
#include "base/memory/Memory.h"
#include "base/std/container/string.h"
#include "platform/FileUtils.h"
#include "platform/SAXParser.h"

namespace cc {
struct AppleFileSystem::IMPL {
    IMPL(NSBundle *bundle) : bundle_([NSBundle mainBundle]) {}
    void setBundle(NSBundle *bundle) {
        bundle_ = bundle;
    }
    NSBundle *getBundle() const {
        return bundle_;
    }

private:
    NSBundle *bundle_;
};

static id convertCCValueToNSObject(const cc::Value &value);
static cc::Value convertNSObjectToCCValue(id object);

static void addNSObjectToCCMap(id nsKey, id nsValue, ValueMap &dict);
static void addCCValueToNSDictionary(const std::string &key, const Value &value, NSMutableDictionary *dict);
static void addNSObjectToCCVector(id item, ValueVector &array);
static void addCCValueToNSArray(const Value &value, NSMutableArray *array);

static id convertCCValueToNSObject(const cc::Value &value) {
    switch (value.getType()) {
        case Value::Type::NONE:
            return [NSNull null];

        case Value::Type::STRING:
            return [NSString stringWithCString:value.asString().c_str() encoding:NSUTF8StringEncoding];

        case Value::Type::BYTE:
            return [NSNumber numberWithInt:value.asByte()];

        case Value::Type::INTEGER:
            return [NSNumber numberWithInt:value.asInt()];

        case Value::Type::UNSIGNED:
            return [NSNumber numberWithUnsignedInt:value.asUnsignedInt()];

        case Value::Type::FLOAT:
            return [NSNumber numberWithFloat:value.asFloat()];

        case Value::Type::DOUBLE:
            return [NSNumber numberWithDouble:value.asDouble()];

        case Value::Type::BOOLEAN:
            return [NSNumber numberWithBool:value.asBool()];

        case Value::Type::VECTOR: {
            NSMutableArray *array = [NSMutableArray array];
            const ValueVector &vector = value.asValueVector();
            for (const auto &e : vector) {
                addCCValueToNSArray(e, array);
            }
            return array;
        }

        case Value::Type::MAP: {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            const ValueMap &map = value.asValueMap();
            for (auto iter = map.begin(); iter != map.end(); ++iter) {
                addCCValueToNSDictionary(iter->first, iter->second, dictionary);
            }
            return dictionary;
        }

        case Value::Type::INT_KEY_MAP:
            break;
    }

    return [NSNull null];
}

static cc::Value convertNSObjectToCCValue(id item) {
    // add string value into array
    if ([item isKindOfClass:[NSString class]]) {
        return Value([item UTF8String]);
    }

    // add number value into array(such as int, float, bool and so on)
    // the value is a number
    if ([item isKindOfClass:[NSNumber class]]) {
        NSNumber *num = item;
        const char *numType = [num objCType];
        if (num == (void *)kCFBooleanFalse || num == (void *)kCFBooleanTrue) {
            bool v = [num boolValue];
            return Value(v);
        } else if (strcmp(numType, @encode(float)) == 0) {
            return Value([num floatValue]);
        } else if (strcmp(numType, @encode(double)) == 0) {
            return Value([num doubleValue]);
        } else {
            return Value([num intValue]);
        }
    }

    // add dictionary value into array
    if ([item isKindOfClass:[NSDictionary class]]) {
        ValueMap dict;
        for (id subKey in [item allKeys]) {
            id subValue = [item objectForKey:subKey];
            addNSObjectToCCMap(subKey, subValue, dict);
        }

        return Value(dict);
    }

    // add array value into array
    if ([item isKindOfClass:[NSArray class]]) {
        ValueVector subArray;
        for (id subItem in item) {
            addNSObjectToCCVector(subItem, subArray);
        }
        return Value(subArray);
    }

    return Value::VALUE_NULL;
}

static void addNSObjectToCCVector(id item, ValueVector &array) {
    array.push_back(convertNSObjectToCCValue(item));
}

static void addCCValueToNSArray(const Value &value, NSMutableArray *array) {
    [array addObject:convertCCValueToNSObject(value)];
}

static void addNSObjectToCCMap(id nsKey, id nsValue, ValueMap &dict) {
    // the key must be a string
    CC_ASSERT([nsKey isKindOfClass:[NSString class]]);
    std::string key = [nsKey UTF8String];
    dict[key] = convertNSObjectToCCValue(nsValue);
}

static void addCCValueToNSDictionary(const std::string &key, const Value &value, NSMutableDictionary *dict) {
    NSString *NSkey = [NSString stringWithCString:key.c_str() encoding:NSUTF8StringEncoding];
    [dict setObject:convertCCValueToNSObject(value) forKey:NSkey];
}

bool FileUtils::writeValueMapToFile(const ValueMap &dict, const ccstd::string &fullPath) {
    valueMapCompact(const_cast<ValueMap &>(dict));
    //CC_LOG_DEBUG("iOS||Mac Dictionary %d write to file %s", dict->_ID, fullPath.c_str());
    NSMutableDictionary *nsDict = [NSMutableDictionary dictionary];

    for (auto iter = dict.begin(); iter != dict.end(); ++iter) {
        addCCValueToNSDictionary(iter->first, iter->second, nsDict);
    }

    NSString *file = [NSString stringWithUTF8String:fullPath.c_str()];
    // do it atomically
    return [nsDict writeToFile:file atomically:YES];
}

bool FileUtils::writeValueVectorToFile(const ValueVector &vecData, const ccstd::string &fullPath) {
    NSString *path = [NSString stringWithUTF8String:fullPath.c_str()];
    NSMutableArray *array = [NSMutableArray array];

    for (const auto &e : vecData) {
        addCCValueToNSArray(e, array);
    }

    [array writeToFile:path atomically:YES];

    return true;
}

static NSFileManager *s_fileManager = [NSFileManager defaultManager];

AppleFileSystem::AppleFileSystem():_impl(ccnew IMPL([NSBundle mainBundle])) {

}

AppleFileSystem::~AppleFileSystem() {

}

#if CC_FILEUTILS_APPLE_ENABLE_OBJC
void AppleFileSystem::setBundle(NSBundle *bundle) {
    pimpl_->setBundle(bundle);
}
#endif

bool AppleFileSystem::createDirectory(const FilePath &path) {
    CC_ASSERT(!path.value().empty());

    //if (isDirectoryExist(path))
     //   return true;

    NSError *error;

    bool result = [s_fileManager createDirectoryAtPath:[NSString stringWithUTF8String:path.value().c_str()] withIntermediateDirectories:YES attributes:nil error:&error];

    if (!result && error != nil) {
        CC_LOG_ERROR("Fail to create directory \"%s\": %s", path.value().c_str(), [error.localizedDescription UTF8String]);
    }

    return result;
}

static int unlink_cb(const char *fpath, const struct stat *sb, int typeflag, struct FTW *ftwbuf) {
    auto ret = remove(fpath);
    if (ret) {
        CC_LOG_INFO("Fail to remove: %s ", fpath);
    }

    return ret;
}

bool AppleFileSystem::removeDirectory(const FilePath&path) {
    if (path.value().empty()) {
        CC_LOG_ERROR("Fail to remove directory, path is empty!");
        return false;
    }

    if (nftw(path.value().c_str(), unlink_cb, 64, FTW_DEPTH | FTW_PHYS))
        return false;
    else
        return true;
}

bool AppleFileSystem::existInternal(const FilePath &filePathIn) const {
    std::string filePath = filePathIn.value();
    if (filePath.empty()) {
        return false;
    }

    bool ret = false;
    
    if (filePath[0] != '/') {
        std::string path;
        std::string file;
        size_t pos = filePath.find_last_of("/");
        if (pos != std::string::npos) {
            file = filePath.substr(pos + 1);
            path = filePath.substr(0, pos + 1);
        } else {
            file = filePath;
        }

        NSString *fullpath = [_impl->getBundle() pathForResource:[NSString stringWithUTF8String:file.c_str()]
                                                           ofType:nil
                                                      inDirectory:[NSString stringWithUTF8String:path.c_str()]];
        if (fullpath != nil) {
            ret = true;
        }
    } else {
        // Search path is an absolute path.
        if ([s_fileManager fileExistsAtPath:[NSString stringWithUTF8String:filePath.c_str()]]) {
            ret = true;
        }
    }

    return ret;
}

std::string AppleFileSystem::getUserAppDataPath() const {
    if (_writablePath.length()) {
        return _writablePath;
    }

    // save to document folder
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    std::string strRet = [documentsDirectory UTF8String];
    strRet.append("/");
    return strRet;
}


std::string AppleFileSystem::getFullPathForDirectoryAndFilename(const std::string &directory, const std::string &filename) const {
    if (directory[0] != '/') {
        NSString *dirStr = [NSString stringWithUTF8String:directory.c_str()];
        // The following logic is used for remove the "../" in the directory
        // Because method "pathForResource" will return nil if the directory contains "../".
        auto theIdx = directory.find("..");
        if (theIdx != std::string::npos && theIdx > 0) {
            NSMutableArray<NSString *> *pathComps = [NSMutableArray arrayWithArray:[dirStr pathComponents]];
            NSUInteger idx = [pathComps indexOfObject:@".."];
            while (idx != NSNotFound && idx > 0) {       // if found ".." & it's not at the beginning of the string
                [pathComps removeObjectAtIndex:idx];     // remove the item ".."
                [pathComps removeObjectAtIndex:idx - 1]; // remove the item before ".."
                idx = [pathComps indexOfObject:@".."];   // find ".." again
            }
            dirStr = [NSString pathWithComponents:pathComps];
        }

        NSString *fullpath = [_impl->getBundle() pathForResource:[NSString stringWithUTF8String:filename.c_str()]
                                                           ofType:nil
                                                      inDirectory:dirStr];
        if (fullpath != nil) {
            return [fullpath UTF8String];
        }
    } else {
        std::string fullPath = directory + filename;
        // Search path is an absolute path.
        if ([s_fileManager fileExistsAtPath:[NSString stringWithUTF8String:fullPath.c_str()]]) {
            return fullPath;
        }
    }
    return "";
}


}
