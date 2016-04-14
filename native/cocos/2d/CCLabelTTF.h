#ifndef _COCOS2D_CCLABELTTF_H_
#define _COCOS2D_CCLABELTTF_H_

#include "2d/CCNode.h"
#include "2d/CCLabel.h"

NS_CC_BEGIN

class Label;

class CC_DLL LabelTTF : public Node
{
public:
    LabelTTF()
    : _renderLabel(nullptr)
    {
        setAnchorPoint(Vec2::ANCHOR_MIDDLE);
        setCascadeColorEnabled(true);
        setCascadeOpacityEnabled(true);
        _renderLabel = Label::create();
        _renderLabel->setAnchorPoint(Vec2::ANCHOR_BOTTOM_LEFT);
        addChild(_renderLabel);
    }

    Label* getRenderLabel() const {
        return _renderLabel;
    }

protected:
    Label* _renderLabel;
};

NS_CC_END

#endif /*_COCOS2D_CCLABELTTF_H_ */

