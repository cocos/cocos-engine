#ifndef _CCB_CCNODELOADERLIBRARY_H_
#define _CCB_CCNODELOADERLIBRARY_H_

#include "CCBReader.h"

namespace cocosbuilder {

class NodeLoader;

typedef std::map<std::string, NodeLoader *> NodeLoaderMap;
typedef std::pair<std::string, NodeLoader *> NodeLoaderMapEntry;

class CC_DLL NodeLoaderLibrary : public cocos2d::Ref
{
public:
    /**
     * @js NA
     * @lua NA
     */
    CCB_STATIC_NEW_AUTORELEASE_OBJECT_METHOD(NodeLoaderLibrary, library);
    /**
     * @js NA
     * @lua NA
     */
    NodeLoaderLibrary();
    /**
     * @js NA
     * @lua NA
     */
    virtual ~NodeLoaderLibrary();
    /**
     * @js NA
     * @lua NA
     */
    void registerDefaultNodeLoaders();
    /**
     * @js NA
     * @lua NA
     */
    void registerNodeLoader(const char * pClassName, NodeLoader * pNodeLoader);
    //void registerNodeLoader(String * pClassName, NodeLoader * pNodeLoader);
    /**
     * @js NA
     * @lua NA
     */
    void unregisterNodeLoader(const char * pClassName);
    //void unregisterNodeLoader(String * pClassName);
    /**
     * @js NA
     * @lua NA
     */
    NodeLoader * getNodeLoader(const char * pClassName);
    //CCNodeLoader * getNodeLoader(String * pClassName);
    /**
     * @js NA
     * @lua NA
     */
    void purge(bool pDelete);

public:
    /**
     * @js NA
     * @lua NA
     */
    static NodeLoaderLibrary * getInstance();
    /**
     * @js NA
     * @lua NA
     */
    static void destroyInstance();
    /**
     * @js NA
     * @lua NA
     */
    static NodeLoaderLibrary * newDefaultNodeLoaderLibrary();

private:
    NodeLoaderMap _nodeLoaders;
};

}

#endif

