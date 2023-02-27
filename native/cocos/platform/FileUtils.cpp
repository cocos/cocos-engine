/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "platform/FileUtils.h"

#include <cstring>
#include <stack>

#include <cerrno>
#include <cstring>
#include <iostream>

#ifdef MINIZIP_FROM_SYSTEM
    #include <minizip/unzip.h>
#else // from our embedded sources
    #include "unzip/unzip.h"
#endif
#include <sys/stat.h>
#include <regex>

#include "base/Data.h"
#include "base/Log.h"
#include "base/memory/Memory.h"
#include "platform/SAXParser.h"

#include "tinydir/tinydir.h"
#include "tinyxml2/tinyxml2.h"

namespace cc {

// Implement DictMaker

#if (CC_PLATFORM != CC_PLATFORM_IOS) && (CC_PLATFORM != CC_PLATFORM_MACOS)

using SAXState = enum {
    SAX_NONE = 0,
    SAX_KEY,
    SAX_DICT,
    SAX_INT,
    SAX_REAL,
    SAX_STRING,
    SAX_ARRAY
};

using SAXResult = enum {
    SAX_RESULT_NONE = 0,
    SAX_RESULT_DICT,
    SAX_RESULT_ARRAY
};

class DictMaker : public SAXDelegator {
public:
    SAXResult _resultType{SAX_RESULT_NONE};
    ValueMap _rootDict;
    ValueVector _rootArray;

    ccstd::string _curKey;   ///< parsed key
    ccstd::string _curValue; // parsed value
    SAXState _state{SAX_NONE};

    ValueMap *_curDict;
    ValueVector *_curArray;

    std::stack<ValueMap *> _dictStack;
    std::stack<ValueVector *> _arrayStack;
    std::stack<SAXState> _stateStack;

    DictMaker() = default;

    ~DictMaker() override = default;

    ValueMap dictionaryWithContentsOfFile(const ccstd::string &fileName) {
        _resultType = SAX_RESULT_DICT;
        SAXParser parser;

        CC_ASSERT(parser.init("UTF-8"));
        parser.setDelegator(this);

        parser.parse(fileName);
        return _rootDict;
    }

    ValueMap dictionaryWithDataOfFile(const char *filedata, int filesize) {
        _resultType = SAX_RESULT_DICT;
        SAXParser parser;

        CC_ASSERT(parser.init("UTF-8"));
        parser.setDelegator(this);

        parser.parse(filedata, filesize);
        return _rootDict;
    }

    ValueVector arrayWithContentsOfFile(const ccstd::string &fileName) {
        _resultType = SAX_RESULT_ARRAY;
        SAXParser parser;

        CC_ASSERT(parser.init("UTF-8"));
        parser.setDelegator(this);

        parser.parse(fileName);
        return _rootArray;
    }

    void startElement(void *ctx, const char *name, const char **atts) override {
        CC_UNUSED_PARAM(ctx);
        CC_UNUSED_PARAM(atts);
        const ccstd::string sName(name);
        if (sName == "dict") {
            if (_resultType == SAX_RESULT_DICT && _rootDict.empty()) {
                _curDict = &_rootDict;
            }

            _state = SAX_DICT;

            SAXState preState = SAX_NONE;
            if (!_stateStack.empty()) {
                preState = _stateStack.top();
            }

            if (SAX_ARRAY == preState) {
                // add a new dictionary into the array
                _curArray->push_back(Value(ValueMap()));
                _curDict = &(_curArray->rbegin())->asValueMap();
            } else if (SAX_DICT == preState) {
                // add a new dictionary into the pre dictionary
                CC_ASSERT(!_dictStack.empty()); // The state is wrong.
                ValueMap *preDict = _dictStack.top();
                (*preDict)[_curKey] = Value(ValueMap());
                _curDict = &(*preDict)[_curKey].asValueMap();
            }

            // record the dict state
            _stateStack.push(_state);
            _dictStack.push(_curDict);
        } else if (sName == "key") {
            _state = SAX_KEY;
        } else if (sName == "integer") {
            _state = SAX_INT;
        } else if (sName == "real") {
            _state = SAX_REAL;
        } else if (sName == "string") {
            _state = SAX_STRING;
        } else if (sName == "array") {
            _state = SAX_ARRAY;

            if (_resultType == SAX_RESULT_ARRAY && _rootArray.empty()) {
                _curArray = &_rootArray;
            }
            SAXState preState = SAX_NONE;
            if (!_stateStack.empty()) {
                preState = _stateStack.top();
            }

            if (preState == SAX_DICT) {
                (*_curDict)[_curKey] = Value(ValueVector());
                _curArray = &(*_curDict)[_curKey].asValueVector();
            } else if (preState == SAX_ARRAY) {
                CC_ASSERT(!_arrayStack.empty()); // The state is wrong!
                ValueVector *preArray = _arrayStack.top();
                preArray->push_back(Value(ValueVector()));
                _curArray = &(_curArray->rbegin())->asValueVector();
            }
            // record the array state
            _stateStack.push(_state);
            _arrayStack.push(_curArray);
        } else {
            _state = SAX_NONE;
        }
    }

    void endElement(void *ctx, const char *name) override {
        CC_UNUSED_PARAM(ctx);
        SAXState curState = _stateStack.empty() ? SAX_DICT : _stateStack.top();
        const ccstd::string sName(const_cast<char *>(name));
        if (sName == "dict") {
            _stateStack.pop();
            _dictStack.pop();
            if (!_dictStack.empty()) {
                _curDict = _dictStack.top();
            }
        } else if (sName == "array") {
            _stateStack.pop();
            _arrayStack.pop();
            if (!_arrayStack.empty()) {
                _curArray = _arrayStack.top();
            }
        } else if (sName == "true") {
            if (SAX_ARRAY == curState) {
                _curArray->push_back(Value(true));
            } else if (SAX_DICT == curState) {
                (*_curDict)[_curKey] = Value(true);
            }
        } else if (sName == "false") {
            if (SAX_ARRAY == curState) {
                _curArray->push_back(Value(false));
            } else if (SAX_DICT == curState) {
                (*_curDict)[_curKey] = Value(false);
            }
        } else if (sName == "string" || sName == "integer" || sName == "real") {
            if (SAX_ARRAY == curState) {
                if (sName == "string") {
                    _curArray->push_back(Value(_curValue));
                } else if (sName == "integer") {
                    _curArray->push_back(Value(atoi(_curValue.c_str())));
                } else {
                    _curArray->push_back(Value(std::atof(_curValue.c_str())));
                }
            } else if (SAX_DICT == curState) {
                if (sName == "string") {
                    (*_curDict)[_curKey] = Value(_curValue);
                } else if (sName == "integer") {
                    (*_curDict)[_curKey] = Value(atoi(_curValue.c_str()));
                } else {
                    (*_curDict)[_curKey] = Value(std::atof(_curValue.c_str()));
                }
            }

            _curValue.clear();
        }

        _state = SAX_NONE;
    }

    void textHandler(void *ctx, const char *ch, int len) override {
        CC_UNUSED_PARAM(ctx);
        if (_state == SAX_NONE) {
            return;
        }

        SAXState curState = _stateStack.empty() ? SAX_DICT : _stateStack.top();
        const ccstd::string text = ccstd::string(const_cast<char *>(ch), len);

        switch (_state) {
            case SAX_KEY:
                _curKey = text;
                break;
            case SAX_INT:
            case SAX_REAL:
            case SAX_STRING: {
                if (curState == SAX_DICT) {
                    // "key not found : <integer/real>"
                    CC_ASSERT(!_curKey.empty());
                }

                _curValue.append(text);
            } break;
            default:
                break;
        }
    }
};

ValueMap FileUtils::getValueMapFromFile(const ccstd::string &filename) {
    const ccstd::string fullPath = fullPathForFilename(filename);
    if (fullPath.empty()) {
        ValueMap ret;
        return ret;
    }

    DictMaker tMaker;
    return tMaker.dictionaryWithContentsOfFile(fullPath);
}

ValueMap FileUtils::getValueMapFromData(const char *filedata, int filesize) {
    DictMaker tMaker;
    return tMaker.dictionaryWithDataOfFile(filedata, filesize);
}

ValueVector FileUtils::getValueVectorFromFile(const ccstd::string &filename) {
    const ccstd::string fullPath = fullPathForFilename(filename);
    DictMaker tMaker;
    return tMaker.arrayWithContentsOfFile(fullPath);
}

/*
 * forward statement
 */
static tinyxml2::XMLElement *generateElementForArray(const ValueVector &array, tinyxml2::XMLDocument *doc);
static tinyxml2::XMLElement *generateElementForDict(const ValueMap &dict, tinyxml2::XMLDocument *doc);

/*
 * Use tinyxml2 to write plist files
 */
bool FileUtils::writeToFile(const ValueMap &dict, const ccstd::string &fullPath) {
    return writeValueMapToFile(dict, fullPath);
}

bool FileUtils::writeValueMapToFile(const ValueMap &dict, const ccstd::string &fullPath) {
    auto *doc = ccnew tinyxml2::XMLDocument();
    if (nullptr == doc) {
        return false;
    }

    tinyxml2::XMLDeclaration *declaration = doc->NewDeclaration(R"(xml version="1.0" encoding="UTF-8")");
    if (nullptr == declaration) {
        delete doc;
        return false;
    }

    doc->LinkEndChild(declaration);
    tinyxml2::XMLElement *docType = doc->NewElement(R"(!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd")");
    doc->LinkEndChild(docType);

    tinyxml2::XMLElement *rootEle = doc->NewElement("plist");
    if (nullptr == rootEle) {
        delete doc;
        return false;
    }
    rootEle->SetAttribute("version", "1.0");
    doc->LinkEndChild(rootEle);

    tinyxml2::XMLElement *innerDict = generateElementForDict(dict, doc);
    if (nullptr == innerDict) {
        delete doc;
        return false;
    }
    rootEle->LinkEndChild(innerDict);

    bool ret = tinyxml2::XML_SUCCESS == doc->SaveFile(getSuitableFOpen(fullPath).c_str());

    delete doc;
    return ret;
}

bool FileUtils::writeValueVectorToFile(const ValueVector &vecData, const ccstd::string &fullPath) {
    auto *doc = ccnew tinyxml2::XMLDocument();
    if (nullptr == doc) {
        return false;
    }

    tinyxml2::XMLDeclaration *declaration = doc->NewDeclaration(R"(xml version="1.0" encoding="UTF-8")");
    if (nullptr == declaration) {
        delete doc;
        return false;
    }

    doc->LinkEndChild(declaration);
    tinyxml2::XMLElement *docType = doc->NewElement(R"(!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd")");
    doc->LinkEndChild(docType);

    tinyxml2::XMLElement *rootEle = doc->NewElement("plist");
    if (nullptr == rootEle) {
        delete doc;
        return false;
    }
    rootEle->SetAttribute("version", "1.0");
    doc->LinkEndChild(rootEle);

    tinyxml2::XMLElement *innerDict = generateElementForArray(vecData, doc);
    if (nullptr == innerDict) {
        delete doc;
        return false;
    }
    rootEle->LinkEndChild(innerDict);

    bool ret = tinyxml2::XML_SUCCESS == doc->SaveFile(getSuitableFOpen(fullPath).c_str());

    delete doc;
    return ret;
}

/*
 * Generate tinyxml2::XMLElement for Object through a tinyxml2::XMLDocument
 */
static tinyxml2::XMLElement *generateElementForObject(const Value &value, tinyxml2::XMLDocument *doc) { // NOLINT(misc-no-recursion)
    // object is String
    if (value.getType() == Value::Type::STRING) {
        tinyxml2::XMLElement *node = doc->NewElement("string");
        tinyxml2::XMLText *content = doc->NewText(value.asString().c_str());
        node->LinkEndChild(content);
        return node;
    }

    // object is integer
    if (value.getType() == Value::Type::INTEGER) {
        tinyxml2::XMLElement *node = doc->NewElement("integer");
        tinyxml2::XMLText *content = doc->NewText(value.asString().c_str());
        node->LinkEndChild(content);
        return node;
    }

    // object is real
    if (value.getType() == Value::Type::FLOAT || value.getType() == Value::Type::DOUBLE) {
        tinyxml2::XMLElement *node = doc->NewElement("real");
        tinyxml2::XMLText *content = doc->NewText(value.asString().c_str());
        node->LinkEndChild(content);
        return node;
    }

    // object is bool
    if (value.getType() == Value::Type::BOOLEAN) {
        tinyxml2::XMLElement *node = doc->NewElement(value.asString().c_str());
        return node;
    }

    // object is Array
    if (value.getType() == Value::Type::VECTOR) {
        return generateElementForArray(value.asValueVector(), doc);
    }

    // object is Dictionary
    if (value.getType() == Value::Type::MAP) {
        return generateElementForDict(value.asValueMap(), doc);
    }

    CC_LOG_DEBUG("This type cannot appear in property list");
    return nullptr;
}

/*
 * Generate tinyxml2::XMLElement for Dictionary through a tinyxml2::XMLDocument
 */
static tinyxml2::XMLElement *generateElementForDict(const ValueMap &dict, tinyxml2::XMLDocument *doc) { // NOLINT(misc-no-recursion)
    tinyxml2::XMLElement *rootNode = doc->NewElement("dict");

    for (const auto &iter : dict) {
        tinyxml2::XMLElement *tmpNode = doc->NewElement("key");
        rootNode->LinkEndChild(tmpNode);
        tinyxml2::XMLText *content = doc->NewText(iter.first.c_str());
        tmpNode->LinkEndChild(content);

        tinyxml2::XMLElement *element = generateElementForObject(iter.second, doc);
        if (element) {
            rootNode->LinkEndChild(element);
        }
    }
    return rootNode;
}

/*
 * Generate tinyxml2::XMLElement for Array through a tinyxml2::XMLDocument
 */
static tinyxml2::XMLElement *generateElementForArray(const ValueVector &array, tinyxml2::XMLDocument *pDoc) { // NOLINT(misc-no-recursion)
    tinyxml2::XMLElement *rootNode = pDoc->NewElement("array");

    for (const auto &value : array) {
        tinyxml2::XMLElement *element = generateElementForObject(value, pDoc);
        if (element) {
            rootNode->LinkEndChild(element);
        }
    }
    return rootNode;
}

#else

/* The subclass FileUtilsApple should override these two method. */
ValueMap FileUtils::getValueMapFromFile(const ccstd::string &filename) { return ValueMap(); }
ValueMap FileUtils::getValueMapFromData(const char *filedata, int filesize) { return ValueMap(); }
ValueVector FileUtils::getValueVectorFromFile(const ccstd::string &filename) { return ValueVector(); }
bool FileUtils::writeToFile(const ValueMap &dict, const ccstd::string &fullPath) { return false; }

#endif /* (CC_PLATFORM != CC_PLATFORM_IOS) && (CC_PLATFORM != CC_PLATFORM_MACOS) */

// Implement FileUtils
FileUtils *FileUtils::sharedFileUtils = nullptr;

FileUtils *FileUtils::getInstance() {
    return FileUtils::sharedFileUtils;
}

void FileUtils::destroyInstance() {
}

void FileUtils::setDelegate(FileUtils *delegate) {
    delete FileUtils::sharedFileUtils;
    FileUtils::sharedFileUtils = delegate;
}

FileUtils::FileUtils() {
    FileUtils::sharedFileUtils = this;
}

FileUtils::~FileUtils() {
    FileUtils::sharedFileUtils = nullptr;
}

bool FileUtils::writeStringToFile(const ccstd::string &dataStr, const ccstd::string &fullPath) {
    Data data;
    auto *dataP = const_cast<char *>(dataStr.data());
    data.fastSet(reinterpret_cast<unsigned char *>(dataP), static_cast<uint32_t>(dataStr.size()));

    bool rv = writeDataToFile(data, fullPath);

    // need to give up buffer ownership for temp using, or double free will occur
    data.takeBuffer();
    return rv;
}

bool FileUtils::writeDataToFile(const Data &data, const ccstd::string &fullPath) {
    size_t size = 0;
    const char *mode = "wb";

    CC_ASSERT(!fullPath.empty() && data.getSize() != 0);

    auto *fileutils = FileUtils::getInstance();
    do {
        // Read the file from hardware
        FILE *fp = fopen(fileutils->getSuitableFOpen(fullPath).c_str(), mode);
        CC_BREAK_IF(!fp);
        size = data.getSize();

        fwrite(data.getBytes(), size, 1, fp);

        fclose(fp);

        return true;
    } while (false);

    return false;
}

bool FileUtils::init() {
    addSearchPath("Resources", true);
    addSearchPath("data", true);
    _searchPathArray.push_back(_defaultResRootPath);
    return true;
}

void FileUtils::purgeCachedEntries() {
    _fullPathCache.clear();
}

ccstd::string FileUtils::getStringFromFile(const ccstd::string &filename) {
    ccstd::string s;
    getContents(filename, &s);
    return s;
}

Data FileUtils::getDataFromFile(const ccstd::string &filename) {
    Data d;
    getContents(filename, &d);
    return d;
}

FileUtils::Status FileUtils::getContents(const ccstd::string &filename, ResizableBuffer *buffer) {
    if (filename.empty()) {
        return Status::NOT_EXISTS;
    }

    auto *fs = FileUtils::getInstance();

    ccstd::string fullPath = fs->fullPathForFilename(filename);
    if (fullPath.empty()) {
        return Status::NOT_EXISTS;
    }

    FILE *fp = fopen(fs->getSuitableFOpen(fullPath).c_str(), "rb");
    if (!fp) {
        return Status::OPEN_FAILED;
    }

#if defined(_MSC_VER)
    auto descriptor = _fileno(fp);
#else
    auto descriptor = fileno(fp);
#endif
    struct stat statBuf;
    if (fstat(descriptor, &statBuf) == -1) {
        fclose(fp);
        return Status::READ_FAILED;
    }
    auto size = static_cast<size_t>(statBuf.st_size);

    buffer->resize(size);
    size_t readsize = fread(buffer->buffer(), 1, size, fp);
    fclose(fp);

    if (readsize < size) {
        buffer->resize(readsize);
        return Status::READ_FAILED;
    }

    return Status::OK;
}

unsigned char *FileUtils::getFileDataFromZip(const ccstd::string &zipFilePath, const ccstd::string &filename, uint32_t *size) {
    unsigned char *buffer = nullptr;
    unzFile file = nullptr;
    *size = 0;

    do {
        CC_BREAK_IF(zipFilePath.empty());

        file = unzOpen(FileUtils::getInstance()->getSuitableFOpen(zipFilePath).c_str());
        CC_BREAK_IF(!file);

        // minizip 1.2.0 is same with other platforms
        int ret = unzLocateFile(file, filename.c_str(), nullptr);
        CC_BREAK_IF(UNZ_OK != ret);

        char filePathA[260];
        unz_file_info fileInfo;
        ret = unzGetCurrentFileInfo(file, &fileInfo, filePathA, sizeof(filePathA), nullptr, 0, nullptr, 0);
        CC_BREAK_IF(UNZ_OK != ret);

        ret = unzOpenCurrentFile(file);
        CC_BREAK_IF(UNZ_OK != ret);

        buffer = static_cast<unsigned char *>(malloc(fileInfo.uncompressed_size));
        int CC_UNUSED readedSize = unzReadCurrentFile(file, buffer, static_cast<unsigned>(fileInfo.uncompressed_size));
        CC_ASSERT(readedSize == 0 || readedSize == (int)fileInfo.uncompressed_size);

        *size = fileInfo.uncompressed_size;
        unzCloseCurrentFile(file);
    } while (false);

    if (file) {
        unzClose(file);
    }

    return buffer;
}

ccstd::string FileUtils::getPathForFilename(const ccstd::string &filename, const ccstd::string &searchPath) const {
    ccstd::string file{filename};
    ccstd::string filePath;
    size_t pos = filename.find_last_of('/');
    if (pos != ccstd::string::npos) {
        filePath = filename.substr(0, pos + 1);
        file = filename.substr(pos + 1);
    }

    // searchPath + file_path
    ccstd::string path = searchPath;
    path.append(filePath);

    path = getFullPathForDirectoryAndFilename(path, file);

    return path;
}

ccstd::string FileUtils::fullPathForFilename(const ccstd::string &filename) const {
    if (filename.empty()) {
        return "";
    }

    if (isAbsolutePath(filename)) {
        return normalizePath(filename);
    }

    // Already Cached ?
    auto cacheIter = _fullPathCache.find(filename);
    if (cacheIter != _fullPathCache.end()) {
        return cacheIter->second;
    }

    ccstd::string fullpath;

    for (const auto &searchIt : _searchPathArray) {
        fullpath = this->getPathForFilename(filename, searchIt);

        if (!fullpath.empty()) {
            // Using the filename passed in as key.
            _fullPathCache.emplace(filename, fullpath);
            return fullpath;
        }
    }

    // The file wasn't found, return empty string.
    return "";
}

ccstd::string FileUtils::fullPathFromRelativeFile(const ccstd::string &filename, const ccstd::string &relativeFile) {
    return relativeFile.substr(0, relativeFile.rfind('/') + 1) + filename;
}

const ccstd::vector<ccstd::string> &FileUtils::getSearchPaths() const {
    return _searchPathArray;
}

const ccstd::vector<ccstd::string> &FileUtils::getOriginalSearchPaths() const {
    return _originalSearchPaths;
}

void FileUtils::setWritablePath(const ccstd::string &writablePath) {
    _writablePath = writablePath;
}

const ccstd::string &FileUtils::getDefaultResourceRootPath() const {
    return _defaultResRootPath;
}

void FileUtils::setDefaultResourceRootPath(const ccstd::string &path) {
    if (_defaultResRootPath != path) {
        _fullPathCache.clear();
        _defaultResRootPath = path;
        if (!_defaultResRootPath.empty() && _defaultResRootPath[_defaultResRootPath.length() - 1] != '/') {
            _defaultResRootPath += '/';
        }

        // Updates search paths
        setSearchPaths(_originalSearchPaths);
    }
}

void FileUtils::setSearchPaths(const ccstd::vector<ccstd::string> &searchPaths) {
    bool existDefaultRootPath = false;
    _originalSearchPaths = searchPaths;

    _fullPathCache.clear();
    _searchPathArray.clear();

    for (const auto &path : _originalSearchPaths) {
        ccstd::string prefix;
        ccstd::string fullPath;

        if (!isAbsolutePath(path)) { // Not an absolute path
            prefix = _defaultResRootPath;
        }
        fullPath = prefix + path;
        if (!path.empty() && path[path.length() - 1] != '/') {
            fullPath += "/";
        }
        if (!existDefaultRootPath && path == _defaultResRootPath) {
            existDefaultRootPath = true;
        }
        _searchPathArray.push_back(fullPath);
    }

    if (!existDefaultRootPath) {
        // CC_LOG_DEBUG("Default root path doesn't exist, adding it.");
        _searchPathArray.push_back(_defaultResRootPath);
    }
}

void FileUtils::addSearchPath(const ccstd::string &searchpath, bool front) {
    ccstd::string prefix;
    if (!isAbsolutePath(searchpath)) {
        prefix = _defaultResRootPath;
    }

    ccstd::string path = prefix + searchpath;
    if (!path.empty() && path[path.length() - 1] != '/') {
        path += "/";
    }
    if (front) {
        _originalSearchPaths.insert(_originalSearchPaths.begin(), searchpath);
        _searchPathArray.insert(_searchPathArray.begin(), path);
    } else {
        _originalSearchPaths.push_back(searchpath);
        _searchPathArray.push_back(path);
    }
}

ccstd::string FileUtils::getFullPathForDirectoryAndFilename(const ccstd::string &directory, const ccstd::string &filename) const {
    // get directory+filename, safely adding '/' as necessary
    ccstd::string ret = directory;
    if (!directory.empty() && directory[directory.size() - 1] != '/') {
        ret += '/';
    }
    ret += filename;
    ret = normalizePath(ret);

    // if the file doesn't exist, return an empty string
    if (!isFileExistInternal(ret)) {
        ret = "";
    }
    return ret;
}

bool FileUtils::isFileExist(const ccstd::string &filename) const {
    if (isAbsolutePath(filename)) {
        return isFileExistInternal(normalizePath(filename));
    }
    ccstd::string fullpath = fullPathForFilename(filename);
    return !fullpath.empty();
}

bool FileUtils::isAbsolutePath(const ccstd::string &path) const {
    return (path[0] == '/');
}

bool FileUtils::isDirectoryExist(const ccstd::string &dirPath) const {
    CC_ASSERT(!dirPath.empty());

    if (isAbsolutePath(dirPath)) {
        return isDirectoryExistInternal(normalizePath(dirPath));
    }

    // Already Cached ?
    auto cacheIter = _fullPathCache.find(dirPath);
    if (cacheIter != _fullPathCache.end()) {
        return isDirectoryExistInternal(cacheIter->second);
    }

    ccstd::string fullpath;
    for (const auto &searchIt : _searchPathArray) {
        // searchPath + file_path
        fullpath = fullPathForFilename(searchIt + dirPath);
        if (isDirectoryExistInternal(fullpath)) {
            _fullPathCache.emplace(dirPath, fullpath);
            return true;
        }
    }
    return false;
}

ccstd::vector<ccstd::string> FileUtils::listFiles(const ccstd::string &dirPath) const {
    ccstd::string fullpath = fullPathForFilename(dirPath);
    ccstd::vector<ccstd::string> files;
    if (isDirectoryExist(fullpath)) {
        tinydir_dir dir;
#ifdef UNICODE
        unsigned int length = MultiByteToWideChar(CP_UTF8, 0, &fullpath[0], (int)fullpath.size(), NULL, 0);
        if (length != fullpath.size()) {
            return files;
        }
        std::wstring fullpathstr(length, 0);
        MultiByteToWideChar(CP_UTF8, 0, &fullpath[0], (int)fullpath.size(), &fullpathstr[0], length);
#else
        ccstd::string fullpathstr = fullpath;
#endif
        if (tinydir_open(&dir, &fullpathstr[0]) != -1) {
            while (dir.has_next) {
                tinydir_file file;
                if (tinydir_readfile(&dir, &file) == -1) {
                    // Error getting file
                    break;
                }

#ifdef UNICODE
                std::wstring path = file.path;
                length = WideCharToMultiByte(CP_UTF8, 0, &path[0], (int)path.size(), NULL, 0, NULL, NULL);
                ccstd::string filepath;
                if (length > 0) {
                    filepath.resize(length);
                    WideCharToMultiByte(CP_UTF8, 0, &path[0], (int)path.size(), &filepath[0], length, NULL, NULL);
                }
#else
                ccstd::string filepath = file.path;
#endif
                if (file.is_dir) {
                    filepath.append("/");
                }
                files.push_back(filepath);

                if (tinydir_next(&dir) == -1) {
                    // Error getting next file
                    break;
                }
            }
        }
        tinydir_close(&dir);
    }
    return files;
}

void FileUtils::listFilesRecursively(const ccstd::string &dirPath, ccstd::vector<ccstd::string> *files) const { // NOLINT(misc-no-recursion)
    ccstd::string fullpath = fullPathForFilename(dirPath);
    if (!fullpath.empty() && isDirectoryExist(fullpath)) {
        tinydir_dir dir;
#ifdef UNICODE
        unsigned int length = MultiByteToWideChar(CP_UTF8, 0, &fullpath[0], (int)fullpath.size(), NULL, 0);
        if (length != fullpath.size()) {
            return;
        }
        std::wstring fullpathstr(length, 0);
        MultiByteToWideChar(CP_UTF8, 0, &fullpath[0], (int)fullpath.size(), &fullpathstr[0], length);
#else
        ccstd::string fullpathstr = fullpath;
#endif
        if (tinydir_open(&dir, &fullpathstr[0]) != -1) {
            while (dir.has_next) {
                tinydir_file file;
                if (tinydir_readfile(&dir, &file) == -1) {
                    // Error getting file
                    break;
                }

#ifdef UNICODE
                std::wstring path = file.path;
                length = WideCharToMultiByte(CP_UTF8, 0, &path[0], (int)path.size(), NULL, 0, NULL, NULL);
                ccstd::string filepath;
                if (length > 0) {
                    filepath.resize(length);
                    WideCharToMultiByte(CP_UTF8, 0, &path[0], (int)path.size(), &filepath[0], length, NULL, NULL);
                }
#else
                ccstd::string filepath = file.path;
#endif
                if (file.name[0] != '.') {
                    if (file.is_dir) {
                        filepath.append("/");
                        files->push_back(filepath);
                        listFilesRecursively(filepath, files);
                    } else {
                        files->push_back(filepath);
                    }
                }

                if (tinydir_next(&dir) == -1) {
                    // Error getting next file
                    break;
                }
            }
        }
        tinydir_close(&dir);
    }
}

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS) || (CC_PLATFORM == CC_PLATFORM_WINRT)
// windows os implement should override in platform specific FileUtiles class
bool FileUtils::isDirectoryExistInternal(const ccstd::string &dirPath) const {
    // FileUtils not support isDirectoryExistInternal.
    CC_ABORT();
    return false;
}

bool FileUtils::createDirectory(const ccstd::string &path) {
    // FileUtils not support createDirectory.
    CC_ABORT();
    return false;
}

bool FileUtils::removeDirectory(const ccstd::string &path) {
    // FileUtils not support removeDirectory.
    CC_ABORT();
    return false;
}

bool FileUtils::removeFile(const ccstd::string &path) {
    // FileUtils not support removeFile.
    CC_ABORT();
    return false;
}

bool FileUtils::renameFile(const ccstd::string &oldfullpath, const ccstd::string &newfullpath) {
    // FileUtils not support renameFile.
    CC_ABORT();
    return false;
}

bool FileUtils::renameFile(const ccstd::string &path, const ccstd::string &oldname, const ccstd::string &name) {
    // FileUtils not support renameFile.
    CC_ABORT();
    return false;
}

ccstd::string FileUtils::getSuitableFOpen(const ccstd::string &filenameUtf8) const {
    // getSuitableFOpen should be override by platform FileUtils
    CC_ABORT();
    return filenameUtf8;
}

long FileUtils::getFileSize(const ccstd::string &filepath) {
    // getFileSize should be override by platform FileUtils
    CC_ABORT();
    return 0;
}

#else
    // default implements for unix like os
    #include <dirent.h>
    #include <sys/types.h>
    #include <cerrno>

    // android doesn't have ftw.h
    #if (CC_PLATFORM != CC_PLATFORM_ANDROID)
        #include <ftw.h>
    #endif

bool FileUtils::isDirectoryExistInternal(const ccstd::string &dirPath) const {
    struct stat st;
    if (stat(dirPath.c_str(), &st) == 0) {
        return S_ISDIR(st.st_mode);
    }
    return false;
}

bool FileUtils::createDirectory(const ccstd::string &path) {
    CC_ASSERT(!path.empty());

    if (isDirectoryExist(path)) {
        return true;
    }

    // Split the path
    size_t start = 0;
    size_t found = path.find_first_of("/\\", start);
    ccstd::string subpath;
    ccstd::vector<ccstd::string> dirs;

    if (found != ccstd::string::npos) {
        while (true) {
            subpath = path.substr(start, found - start + 1);
            if (!subpath.empty()) {
                dirs.push_back(subpath);
            }
            start = found + 1;
            found = path.find_first_of("/\\", start);
            if (found == ccstd::string::npos) {
                if (start < path.length()) {
                    dirs.push_back(path.substr(start));
                }
                break;
            }
        }
    }

    DIR *dir = nullptr;

    // Create path recursively
    subpath = "";
    for (const auto &iter : dirs) {
        subpath += iter;
        dir = opendir(subpath.c_str());

        if (!dir) {
            // directory doesn't exist, should create a new one

            int ret = mkdir(subpath.c_str(), S_IRWXU | S_IRWXG | S_IRWXO);
            if (ret != 0 && (errno != EEXIST)) {
                // current directory can not be created, sub directories can not be created too
                // should return
                return false;
            }
        } else {
            // directory exists, should close opened dir
            closedir(dir);
        }
    }
    return true;
}

namespace {
    #if (CC_PLATFORM != CC_PLATFORM_ANDROID)
int unlinkCb(const char *fpath, const struct stat * /*sb*/, int /*typeflag*/, struct FTW * /*ftwbuf*/) {
    int rv = remove(fpath);

    if (rv) {
        perror(fpath);
    }

    return rv;
}
    #endif
} // namespace

bool FileUtils::removeDirectory(const ccstd::string &path) {
    #if (CC_PLATFORM != CC_PLATFORM_ANDROID)
    return nftw(path.c_str(), unlinkCb, 64, FTW_DEPTH | FTW_PHYS) != -1;
    #else
    ccstd::string command = "rm -r ";
    // Path may include space.
    command += "\"" + path + "\"";

    return (system(command.c_str()) >= 0);
    #endif // (CC_PLATFORM != CC_PLATFORM_ANDROID)
}

bool FileUtils::removeFile(const ccstd::string &path) {
    return remove(path.c_str()) == 0;
}

bool FileUtils::renameFile(const ccstd::string &oldfullpath, const ccstd::string &newfullpath) {
    CC_ASSERT(!oldfullpath.empty());
    CC_ASSERT(!newfullpath.empty());

    int errorCode = rename(oldfullpath.c_str(), newfullpath.c_str());

    if (0 != errorCode) {
        CC_LOG_ERROR("Fail to rename file %s to %s !Error code is %d", oldfullpath.c_str(), newfullpath.c_str(), errorCode);
        return false;
    }
    return true;
}

bool FileUtils::renameFile(const ccstd::string &path, const ccstd::string &oldname, const ccstd::string &name) {
    CC_ASSERT(!path.empty());
    ccstd::string oldPath = path + oldname;
    ccstd::string newPath = path + name;

    return this->renameFile(oldPath, newPath);
}

ccstd::string FileUtils::getSuitableFOpen(const ccstd::string &filenameUtf8) const {
    return filenameUtf8;
}

long FileUtils::getFileSize(const ccstd::string &filepath) { //NOLINT(google-runtime-int)
    CC_ASSERT(!filepath.empty());

    ccstd::string fullpath{filepath};
    if (!isAbsolutePath(filepath)) {
        fullpath = fullPathForFilename(filepath);
        if (fullpath.empty()) {
            return 0;
        }
    }

    struct stat info;
    // Get data associated with "crt_stat.c":
    int result = stat(fullpath.c_str(), &info);

    // Check if statistics are valid:
    if (result != 0) {
        // Failed
        return -1;
    }
    return static_cast<long>(info.st_size); // NOLINT(google-runtime-int)
}
#endif

ccstd::string FileUtils::getFileExtension(const ccstd::string &filePath) const {
    ccstd::string fileExtension;
    size_t pos = filePath.find_last_of('.');
    if (pos != ccstd::string::npos) {
        fileExtension = filePath.substr(pos, filePath.length());

        std::transform(fileExtension.begin(), fileExtension.end(), fileExtension.begin(), ::tolower);
    }

    return fileExtension;
}

void FileUtils::valueMapCompact(ValueMap &valueMap) {
}

void FileUtils::valueVectorCompact(ValueVector &valueVector) {
}

ccstd::string FileUtils::getFileDir(const ccstd::string &path) const {
    ccstd::string ret;
    size_t pos = path.rfind('/');
    if (pos != ccstd::string::npos) {
        ret = path.substr(0, pos);
    }

    normalizePath(ret);

    return ret;
}

ccstd::string FileUtils::normalizePath(const ccstd::string &path) const {
    ccstd::string ret;
    // Normalize: remove . and ..
    ret = std::regex_replace(path, std::regex("/\\./"), "/");
    ret = std::regex_replace(ret, std::regex("/\\.$"), "");

    size_t pos;
    while ((pos = ret.find("..")) != ccstd::string::npos && pos > 2) {
        size_t prevSlash = ret.rfind('/', pos - 2);
        if (prevSlash == ccstd::string::npos) {
            break;
        }

        ret = ret.replace(prevSlash, pos - prevSlash + 2, "");
    }
    return ret;
}

} // namespace cc
