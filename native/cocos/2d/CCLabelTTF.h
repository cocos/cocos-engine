#ifndef _COCOS2D_CCLABELTTF_H_
#define _COCOS2D_CCLABELTTF_H_

#include "2d/CCNode.h"
#include "2d/CCLabel.h"

NS_CC_BEGIN

class Label;

class CC_DLL LabelTTF : public Node
{
public:
    LabelTTF();

    Label* getRenderLabel() const;

protected:
    Label* _renderLabel;
};

NS_CC_END

#endif /*_COCOS2D_CCLABELTTF_H_ */

