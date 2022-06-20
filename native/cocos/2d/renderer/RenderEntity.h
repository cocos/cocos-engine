#pragma once
#include <cocos/2d/renderer/RenderDrawInfo.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/scene-graph/Node.h>
#include <vector>

namespace cc {
class Batcher2d;
class RenderEntity : public Node::UserData {

public:
    RenderEntity(/* args */);
    explicit RenderEntity(Batcher2d* batcher);
    ~RenderEntity();

    void addRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setRenderDrawInfo(RenderDrawInfo* drawInfo, index_t index);

    inline Node* getNode() const { return _node; }
    void setNode(Node* node);

    RenderDrawInfo* getRenderDrawInfo();
    ccstd::vector<RenderDrawInfo*>& getRenderDrawInfos();

private:
    ccstd::vector<RenderDrawInfo*> _drawInfos{};

    Batcher2d* _batcher{nullptr};
    Node* _node{nullptr};
};
}
