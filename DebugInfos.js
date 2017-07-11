if (CC_DEBUG) {
    var logs = {
        //ActionManager: 1000
        "1000": "cc.ActionManager.addAction(): action must be non-null", //addAction
        "1001": "cocos2d: removeAction: Target not found", //removeAction
        "1002": "cc.ActionManager.removeActionByTag(): an invalid tag", //removeActionByTag
        "1003": "cc.ActionManager.removeActionByTag(): target must be non-null", //removeActionByTag_2
        "1004": "cc.ActionManager.getActionByTag(): an invalid tag", //getActionByTag
        "1005": "cocos2d : getActionByTag(tag = %s): Action not found", //getActionByTag_2
        "1006": "[Action step]. override me", //Action.step
        "1007": "[Action update]. override me", //Action.update
        "1008": "cocos2d: FiniteTimeAction#reverse: Implement me", //Action.reverse
        "1009": "cc.EaseElastic.reverse(): it should be overridden in subclass.", //ActionEase.reverse
        "1010": "cc.IntervalAction: reverse not implemented.", //ActionInterval.reverse
        "1011": "cc.ActionInterval.setAmplitudeRate(): it should be overridden in subclass.", //ActionInterval.setAmplitudeRate
        "1012": "cc.ActionInterval.getAmplitudeRate(): it should be overridden in subclass.", //ActionInterval.getAmplitudeRate
        "1013": "The speed parameter error", //ActionInterval.speed
        "1014": "The repeat parameter error", //ActionInterval.repeat
        "1015": "parameters should not be ending with null in Javascript", //ActionInterval.seqeunce
        "1016": "cc.RotateTo.reverse(): it should be overridden in subclass.", //RotateTo.reverse
        "1017": "cc.GridAction.getGrid(): it should be overridden in subclass.", //ActionGrid.getGrid
        "1018": "Grid size must be (1,1)", //ActionGrid3D.initWithSize
        "1019": "Failed to construct, Sequence construction needs two or more actions", //ActionInterval.sequence
        "1020": "Failed to construct, Spawn construction needs two or more actions", //ActionInterval.spawn
        //configuration: 1100
        "1100": "Expected 'data' dict, but not found. Config file: %s", //loadConfigFile
        "1101": "Please load the resource first : %s", //loadConfigFile_2
        //Director: 1200
        "1200": "cocos2d: Director: Error in gettimeofday", //resume
        "1201": "cocos2d: Director: unrecognized projection", //setProjection
        "1202": "cocos2d: Director: unrecognized projection", //popToSceneStackLevel
        "1203": "cocos2d: Director: Error in gettimeofday", //popToSceneStackLevel_2
        "1204": "running scene should not null", //popScene
        "1205": "the scene should not null", //pushScene
        "1206": "loadScene: The scene index to load (%s) is out of range.", //_getSceneUuid
        "1207": "loadScene: Unknown name type to load: '%s'", //_getSceneUuid_2
        "1208": "loadScene: Failed to load scene '%s' because '%s' is already loading", //loadScene
        "1209": "loadScene: Can not load the scene '%s' because it was not in the build settings before playing.", //loadScene_2
        "1210": "Failed to preload '%s', %s", //preloadScene
        "1211": "loadScene: The scene index to load (%s) is out of range.", //_getSceneUuid
        "1212": "loadScene: Unknown name type to load: '%s'", //_getSceneUuid
        "1213": "loadScene: Failed to load scene '%s' because '%s' is already loading", //loadScene
        "1214": "loadScene: Can not load the scene '%s' because it was not in the build settings before playing.", //loadScene
        "1215": "Failed to preload '%s', %s", //preloadScene
        //Array: 1300
        "1300": "element type is wrong!", //verifyType
        //deprecated: 1400
        "1400": "'%s' is deprecated, please use '%s' instead.", //deprecated
        "1401": "The first argument should be the destination object", //inject
        "1402": "The 'visible' property of %s is deprecated, use 'enabled' instead please.", //visible
        "1403": "Sorry, cc.audioEngine.willPlayMusic is removed.", //willPlayMusicError
        "1404": "cc.spriteFrameCache is removed, please use cc.loader to load and cache sprite frames of atlas format.",
        //Scheduler: 1500
        "1500": "cc.Scheduler#schedule: Callback already scheduled. Updating interval from:%s to %s", //scheduleCallbackForTarget
        "1501": "cc.Scheduler#scheduleCallbackForTarget(): callback_fn should be non-null.", //scheduleCallbackForTarget_2
        "1502": "cc.Scheduler#scheduleCallbackForTarget(): target should be non-null.", //scheduleCallbackForTarget_3
        "1503": "cc.Scheduler#pauseTarget():target should be non-null", //pauseTarget
        "1504": "cc.Scheduler#resumeTarget():target should be non-null", //resumeTarget
        "1505": "cc.Scheduler#isTargetPaused():target should be non-null", //isTargetPaused
        "1506": "warning: you CANNOT change update priority in scheduled function", //_schedulePerFrame
        "1507": "cc.Scheduler#scheduleSelector: Selector already scheduled. Updating interval from: %.4f to %.4f", //schedule
        "1508": "Argument callback must not be empty", //isScheduled
        "1509": "Argument target must be non-nullptr", //isScheduled
        "1510": "cc.Scheduler: Illegal target which doesn't have uuid or instanceId",
        //Node: 1600
        "1600": "getZOrder is deprecated. Please use getLocalZOrder instead.", //getZOrder
        "1601": "setZOrder is deprecated. Please use setLocalZOrder instead.", //setZOrder
        "1602": "RotationX != RotationY. Don't know which one to return", //getRotation
        "1603": "ScaleX != ScaleY. Don't know which one to return", //getScale
        "1604": "An Node can't be added as a child of itself.", //addChild
        "1605": "child already added. It can't be added again", //addChild_2
        "1606": "child must be non-null", //addChild_3
        "1607": "removeFromParentAndCleanup is deprecated. Use removeFromParent instead", //removeFromParentAndCleanup
        "1608": "boundingBox is deprecated. Use getBoundingBox instead", //boundingBox
        "1609": "argument tag is an invalid tag", //removeChildByTag
        "1610": "cocos2d: removeChildByTag(tag = %s): child not found!", //removeChildByTag_2
        "1611": "removeAllChildrenWithCleanup is deprecated. Use removeAllChildren instead", //removeAllChildrenWithCleanup
        "1612": "cc.Node.stopActionBy(): argument tag an invalid tag", //stopActionByTag
        "1613": "cc.Node.getActionByTag(): argument tag is an invalid tag", //getActionByTag
        "1614": "resumeSchedulerAndActions is deprecated, please use resume instead.", //reumeSchedulerAndActions
        "1615": "pauseSchedulerAndActions is deprecated, please use pause instead.", //pauseSchedulerAndActions
        "1616": "Unknown callback function", //_arrayMakeObjectsPerformSelector
        "1617": "child must be non-null", //reorderChild
        "1618": "cc.Node.runAction(): action must be non-null", //runAction
        "1619": "callback function must be non-null", //schedule
        "1620": "interval must be positive", //schedule_2
        "1621": "cocos2d: Could not initialize cc.AtlasNode. Invalid Texture.", //initWithTexture
        "1622": "_ccsg.Node._requestDirtyFlag: failed to satisfy the request, key (%s) for flag have already been taken", //_requestDirtyFlag
        "1623": "Set '%s' to normal node (not persist root node).", //_onHierarchyChanged
        "1624": "Replacing with the same sgNode", //_replaceSgNode
        "1625": "The replacement sgNode should not contain any child.", //_replaceSgNode_2
        "1626": "Should not set alpha via 'color', set 'opacity' please.", //color
        "1627": "Not support for asynchronous creating node in SG", //ctor
        "1628": "Renderer error: Size of the cc._RendererInSG._sgNode must be zero", //__preload
        "1629": "The node '%s' has a component inherited from 'cc._RendererInSG'", //onEnable
        "1630": "JSB environment is not support invoke node.runAction before the 'cc._RendererInSG' component enabled.", //onEnable_2
        "1631": "Please use runAction in the method 'start' instead.", //onEnable_3
        "1632": "Node name can not include \'/\'.", //name
        "1633": "Internal error, should not remove unknown node from parent.", //parent
        "1634": "addChild: The child to add must be instance of cc.Node, not %s.", //addChild
        "1635": "reorderChild: this child is not in children list", // reorderChild
        //AtlasNode: 1700
        "1700": "cc.AtlasNode.updateAtlasValues(): Shall be overridden in subclasses", //_updateAtlasValues
        "1701": "", //_initWithTileFile
        "1702": "cocos2d: Could not initialize cc.AtlasNode. Invalid Texture.", //_initWithTexture
        "1703": "The new text must be String", //TextAtlas.text
        //_checkEventListenerAvailable: 1800
        "1800": "cc._EventListenerKeyboard.checkAvailable(): Invalid EventListenerKeyboard!", //keyboard
        "1801": "cc._EventListenerTouchOneByOne.checkAvailable(): Invalid EventListenerTouchOneByOne!", //touchOneByOne
        "1802": "cc._EventListenerTouchAllAtOnce.checkAvailable(): Invalid EventListenerTouchAllAtOnce!", //touchAllAtOnce
        "1803": "cc._EventListenerAcceleration.checkAvailable(): _onAccelerationEvent must be non-nil", //acceleration
        //EventListener: 1900
        "1900": "Invalid parameter.", //create
        //__getListenerID: 2000
        "2000": "Don't call this method if the event is for touch.", //__getListenerID
        //LayerMultiplex: 2100
        "2100": "parameters should not be ending with null in Javascript", //initWithLayers
        "2101": "Invalid index in MultiplexLayer switchTo message", //switchTo
        "2102": "Invalid index in MultiplexLayer switchTo message", //switchToAndReleaseMe
        "2103": "cc.Layer.addLayer(): layer should be non-null", //addLayer
        //view: 2200
        "2200": "Resolution not valid", //setDesignResolutionSize
        "2201": "should set resolutionPolicy", //setDesignResolutionSize_2
        //inputManager: 2300
        "2300": "The touches is more than MAX_TOUCHES, nUnusedIndex = %s", //handleTouchesBegin
        //checkGLErrorDebug: 2400
        "2400": "WebGL error %s", //checkGLErrorDebug
        "2401": "Too many graphics vertices generated, only 65536 vertices support.", //_render
        //spriteFrameAnimationCache: 2500
        "2500": "cocos2d: cc.SpriteFrameAnimationCache: No animations were found in provided dictionary.", //_addAnimationsWithDictionary
        "2501": "cc.SpriteFrameAnimationCache. Invalid animation format", //_addAnimationsWithDictionary_2
        "2502": "cc.SpriteFrameAnimationCache.addAnimations(): File could not be found", //addAnimations
        "2503": "cocos2d: cc.SpriteFrameAnimationCache: Animation '%s' found in dictionary without any frames - cannot add to animation cache.", //_parseVersion1
        "2504": "cocos2d: cc.SpriteFrameAnimationCache: Animation '%s' refers to frame '%s' which is not currently in the cc.SpriteFrameCache. This frame will not be added to the animation.", //_parseVersion1_2
        "2505": "cocos2d: cc.SpriteFrameAnimationCache: None of the frames for animation '%s' were found in the cc.SpriteFrameCache. Animation is not being added to the Animation Cache.", //_parseVersion1_3
        "2506": "cocos2d: cc.SpriteFrameAnimationCache: An animation in your dictionary refers to a frame which is not in the cc.SpriteFrameCache. Some or all of the frames for the animation '%s' may be missing.", //_parseVersion1_4
        "2507": "cocos2d: CCAnimationCache: Animation '%s' found in dictionary without any frames - cannot add to animation cache.", //_parseVersion2
        "2508": "cocos2d: cc.SpriteFrameAnimationCache: Animation '%s' refers to frame '%s' which is not currently in the cc.SpriteFrameCache. This frame will not be added to the animation.", //_parseVersion2_2
        "2509": "cc.SpriteFrameAnimationCache.addAnimations(): Invalid texture file name", //addAnimations_2
        //Sprite: 2600
        "2600": "cc.Sprite.reorderChild(): this child is not in children list", //reorderChild
        "2601": "cc.Sprite.setIgnoreAnchorPointForPosition(): it is invalid in cc.Sprite when using SpriteBatchNode", //setIgnoreAnchorPointForPosition
        "2602": "cc.Sprite.setDisplayFrameWithAnimationName(): Frame not found", //setDisplayFrameWithAnimationName
        "2603": "cc.Sprite.setDisplayFrameWithAnimationName(): Invalid frame index", //setDisplayFrameWithAnimationName_2
        "2604": "setDisplayFrame is deprecated, please use setSpriteFrame instead.", //setDisplayFrame
        "2605": "cc.Sprite._updateBlendFunc(): _updateBlendFunc doesn't work when the sprite is rendered using a cc.CCSpriteBatchNode", //_updateBlendFunc
        "2606": "cc.Sprite.initWithSpriteFrame(): spriteFrame should be non-null", //initWithSpriteFrame
        "2608": "initWithSpriteFrameName is deprecated and can not provide correct functionality", //initWithSpriteFrameName1
        "2609": "cc.Sprite.initWithFile(): filename should be non-null", //initWithFile
        "2610": "cc.Sprite.setDisplayFrameWithAnimationName(): animationName must be non-null", //setDisplayFrameWithAnimationName_3
        "2611": "cc.Sprite.reorderChild(): child should be non-null", //reorderChild_2
        "2612": "cc.Sprite.addChild(): cc.Sprite only supports cc.Sprites as children when using cc.SpriteBatchNode", //addChild
        "2613": "cc.Sprite.addChild(): cc.Sprite only supports a sprite using same texture as children when using cc.SpriteBatchNode", //addChild_2
        "2614": "cc.Sprite.addChild(): child should be non-null", //addChild_3
        "2615": "cc.Sprite.texture setter: Batched sprites should use the same texture as the batchnode", //setTexture
        "2616": "cc.SpriteBatchNode.updateQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children", //updateQuadFromSprite
        "2617": "cc.SpriteBatchNode.insertQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children", //insertQuadFromSprite
        "2618": "cc.SpriteBatchNode.addChild(): cc.SpriteBatchNode only supports cc.Sprites as children", //addChild_4
        "2619": "cc.SpriteBatchNode.addChild(): cc.Sprite is not using the same texture", //addChild_5
        "2620": "Sprite.initWithTexture(): Argument must be non-nil ", //initWithTexture
        "2621": "Invalid spriteFrameName", //setSpriteFrame
        "2622": "Invalid argument: cc.Sprite.texture setter expects a CCTexture2D.", //setTexture_2
        "2623": "cc.SpriteBatchNode.updateQuadFromSprite(): sprite should be non-null", //updateQuadFromSprite_2
        "2624": "cc.SpriteBatchNode.insertQuadFromSprite(): sprite should be non-null", //insertQuadFromSprite_2
        "2625": "too many tiles, only 16384 tiles will be show", //_rebuildQuads_base
        "2626": "Unrecognized fill type in bar fill", //_rebuildQuads_base
        "2627": "Can not generate quad", //_rebuildQuads
        "2728": "%s does not exist", //_softInit
        //SpriteBatchNode: 2700
        "2700": "cc.SpriteBatchNode.addQuadFromSprite(): SpriteBatchNode only supports cc.Sprites as children", //addSpriteWithoutQuad
        "2701": "cocos2d: CCSpriteBatchNode: resizing TextureAtlas capacity from %s to %s.", //increaseAtlasCapacity
        "2702": "cocos2d: WARNING: Not enough memory to resize the atlas", //increaseAtlasCapacity_2
        "2703": "cc.SpriteBatchNode.addChild(): Child doesn't belong to Sprite", //reorderChild
        "2704": "cc.SpriteBatchNode.addChild(): sprite batch node should contain the child", //removeChild
        "2705": "cc.SpriteBatchNode.addQuadFromSprite(): child should be non-null", //addSpriteWithoutQuad_2
        "2706": "cc.SpriteBatchNode.addChild(): child should be non-null", //reorderChild_2
        "2707": "cc.SpriteBatchNode.updateQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children", //updateQuadFromSprite
        "2708": "cc.SpriteBatchNode.insertQuadFromSprite(): cc.SpriteBatchNode only supports cc.Sprites as children", //insertQuadFromSprite
        "2709": "cc.SpriteBatchNode.addChild(): cc.SpriteBatchNode only supports cc.Sprites as children", //addChild
        "2710": "Sprite.initWithTexture(): Argument must be non-nil ", //initWithTexture
        "2711": "cc.Sprite.addChild(): child should be non-null", //addChild_2
        "2712": "Invalid spriteFrameName", //setSpriteFrame
        "2713": "Invalid argument: cc.Sprite texture setter expects a CCTexture2D.", //setTexture
        "2714": "cc.SpriteBatchNode.updateQuadFromSprite(): sprite should be non-null", //updateQuadFromSprite_2
        "2715": "cc.SpriteBatchNode.insertQuadFromSprite(): sprite should be non-null", //insertQuadFromSprite_2
        "2716": "cc.SpriteBatchNode.addChild(): child should be non-null", //addChild_3
        //spriteFrameCache: 2800
        "2800": "cocos2d: WARNING: originalWidth/Height not found on the cc.SpriteFrame. AnchorPoint won't work as expected. Regenrate the .plist", //_getFrameConfig
        "2801": "cocos2d: WARNING: an alias with name %s already exists", //addSpriteFrames
        "2802": "cocos2d: WARNING: Sprite frame: %s has already been added by another source, please fix name conflit", //_checkConflict
        "2803": "cocos2d: cc.SpriteFrameCahce: Frame %s not found", //getSpriteFrame
        "2804": "Please load the resource first : %s", //_getFrameConfig_2
        "2805": "cc.SpriteFrameCache.addSpriteFrames(): plist should be non-null", //addSpriteFrames_2
        "2806": "Argument must be non-nil", //addSpriteFrames_3
        //TextureAtlas: 2900
        "2900": "cocos2d: Could not open file: %s", //initWithFile
        "2901": "cc.TextureAtlas.insertQuad(): invalid totalQuads", //insertQuad
        "2902": "cc.TextureAtlas.initWithTexture():texture should be non-null", //initWithTexture
        "2903": "cc.TextureAtlas.updateQuad(): quad should be non-null", //updateQuad
        "2904": "cc.TextureAtlas.updateQuad(): Invalid index", //updateQuad_2
        "2905": "cc.TextureAtlas.insertQuad(): Invalid index", //insertQuad_2
        "2906": "cc.TextureAtlas.insertQuad(): Invalid index + amount", //insertQuads
        "2907": "cc.TextureAtlas.insertQuadFromIndex(): Invalid newIndex", //insertQuadFromIndex
        "2908": "cc.TextureAtlas.insertQuadFromIndex(): Invalid fromIndex", //insertQuadFromIndex_2
        "2909": "cc.TextureAtlas.removeQuadAtIndex(): Invalid index", //removeQuadAtIndex
        "2910": "cc.TextureAtlas.removeQuadsAtIndex(): index + amount out of bounds", //removeQuadsAtIndex
        "2911": "cc.TextureAtlas.moveQuadsFromIndex(): move is out of bounds", //moveQuadsFromIndex
        "2912": "cc.TextureAtlas.moveQuadsFromIndex(): Invalid newIndex", //moveQuadsFromIndex_2
        "2913": "cc.TextureAtlas.moveQuadsFromIndex(): Invalid oldIndex", //moveQuadsFromIndex_3
        //textureCache: 3000
        "3000": "TextureCache:addPVRTCImage does not support on HTML5", //addPVRTCImage
        "3001": "TextureCache:addPVRTCImage does not support on HTML5", //addETCImage
        "3002": "textureForKey is deprecated. Please use getTextureForKey instead.", //textureForKey
        "3003": "addPVRImage does not support on HTML5", //addPVRImage
        "3004": "cocos2d: Couldn't add UIImage in TextureCache", //addUIImage
        "3005": "cocos2d: '%s' id=%s %s x %s", //dumpCachedTextureInfo
        "3006": "cocos2d: '%s' id= HTMLCanvasElement %s x %s", //dumpCachedTextureInfo_2
        "3007": "cocos2d: TextureCache dumpDebugInfo: %s textures, HTMLCanvasElement for %s KB (%s MB)", //dumpCachedTextureInfo_3
        "3008": "cc.Texture.addUIImage(): image should be non-null", //addUIImage_2
        "3009": "TextureCache: url should be non-null", //invalidKey
        //Texture2D: 3100
        "3100": "initWithETCFile does not support on HTML5", //initWithETCFile
        "3101": "initWithPVRFile does not support on HTML5", //initWithPVRFile
        "3102": "initWithPVRTCData does not support on HTML5", //initWithPVRTCData
        "3103": "cc.Texture.addImage(): path should be non-null", //addImage
        "3104": "cocos2d: cc.Texture2D. Can't create Texture. UIImage is nil", //initWithImage
        "3105": "cocos2d: WARNING: Image (%s x %s) is bigger than the supported %s x %s", //initWithImage_2
        "3106": "initWithString isn't supported on cocos2d-html5", //initWithString
        "3107": "initWithETCFile does not support on HTML5", //initWithETCFile_2
        "3108": "initWithPVRFile does not support on HTML5", //initWithPVRFile_2
        "3109": "initWithPVRTCData does not support on HTML5", //initWithPVRTCData_2
        "3110": "bitsPerPixelForFormat: %s, cannot give useful result, it's a illegal pixel format", //bitsPerPixelForFormat
        "3111": "cocos2d: cc.Texture2D: Using RGB565 texture since image has no alpha", //_initPremultipliedATextureWithImage
        "3112": "cc.Texture.addImage(): path should be non-null", //addImage_2
        "3113": "NSInternalInconsistencyException", //initWithData
        "3114": "SpriteFrame: Failed to load sprite texture '%s'", //SpriteFrame.initWithTexture
        "3115": "Frame Grabber: could not attach texture to framebuffer", //CCGrabber.grab
        "3116": "WebGLRenderingContext.CLAMP_TO_EDGE should be used in NPOT textures", //setTexParameters
        "3117": "Mimpap texture only works in POT textures", //generateMipmap
        //RectWidth: 3300
        "3300": "Rect width exceeds maximum margin: %s", //RectWidth
        //RectHeight: 3400
        "3400": "Rect height exceeds maximum margin: %s", //RectHeight
        //EventManager: 3500
        "3500": "0 priority is forbidden for fixed priority since it's used for scene graph based priority.", //addListener
        "3501": "Invalid listener type!", //removeListeners
        "3502": "Can't set fixed priority with scene graph based listener.", //setPriority
        "3503": "Invalid parameters.", //addListener_2
        "3504": "listener must be a cc.EventListener object when adding a fixed priority listener", //addListener_3
        "3505": "The listener has been registered, please don't register it again.", //addListener_4
        "3506": "Unsupported listener target.", //addListener_5
        "3507": "Invalid scene graph priority!", //_forceAddEventListener
        "3508": "If program goes here, there should be event in dispatch.", //_updateListeners
        "3509": "_inDispatch should be 1 here.", //_updateListeners_2
        "3510": "%s's scene graph node not contains in the parent's children", //SceneGraphHelper._getChildrenOffset
        //Class: 3600
        "3600": "cc.Class will automatically call super constructor of %s, you should not call it manually.", //Class.callSuperCtor
        "3601": "The editor property 'playOnFocus' should be used with 'executeInEditMode' in class '%s'", //playOnFocus
        "3602": "Unknown editor property '%s' in class '%s'.", //unknown_property
        "3603": "Use 'cc.Float' or 'cc.Integer' instead of 'cc.Number' please. \uD83D\uDE02", //number
        "3604": "Can only indicate one type attribute for %s.", //getTypeChecker
        "3605": "The default value of %s is not instance of %s.", //getTypeChecker_2
        "3606": "No needs to indicate the '%s' attribute for %s, which its default value is type of %s.", //getTypeChecker_3
        "3607": "The default value of %s must be an empty string.", //getTypeChecker_4
        "3608": "The type of %s must be cc.String, not String.", //getTypeChecker_5
        "3609": "The type of %s must be cc.Boolean, not Boolean.", //getTypeChecker_6
        "3610": "The type of %s must be cc.Float or cc.Integer, not Number.", //getTypeChecker_7
        "3611": "Can not indicate the '%s' attribute for %s, which its default value is type of %s.", //getTypeChecker_8
        "3612": "%s Just set the default value to 'new %s()' and it will be handled properly.", //getTypeChecker_9
        "3613": "'No need to specify the '%s' attribute for the getter of '%s.%s', every getter is actually non-serialized.", //defineGetSet
        "3615": "Each script can have at most one Component.", //define_2
        "3616": "Should not specify class name %s for Component which defines in project.", //define_3
        "3617": "ctor of CCClass '%s' should not accept any arguments.", //_createCtor
        "3618": "ctor of '%s' can not be another CCClass", //_createCtor_2
        "3619": "ctor of '%s' must be function type", //_createCtor_3
        "3620": "this._super declared in '%s.%s' but no super method defined", //boundSuperCalls
        "3621": "Unknown type of %s.%s, maybe you want is '%s'.", //CCClass
        "3622": "Unknown type of %s.%s, property should be defined in 'properties' or 'ctor'", //CCClass_2
        "3623": "Can not use 'editor' attribute, '%s' not inherits from Components.", //CCClass_3
        "3624": "'%s' overrided '%s' but '%s' is defined as 'false' so the super method will not be called. You can set '%s' to null to disable this warning.", //CCClass_4
        "3625": "[isChildClassOf] superclass should be function type, not", //isChildClassOf
        "3626": "Can't remove '%s' because '%s' depends on it.", //destroy
        "3627": "Should not add renderer component (%s) to a Canvas node.", //_registSizeProvider
        "3628": "Should not add %s to a node which size is already used by its other component.", //_registSizeProvider_2
        "3629": "attribute must be type object", //attr
        "3630": "RawType is only available for Assets", //_onAfterProp
        "3631": "RawType name cannot contain uppercase", //_onAfterProp_2
        "3632": "Each asset cannot have more than one RawType", //_onAfterProp_3
        "3633": "Properties function of '%s' should return an object!", //init
        "3634": "Disallow to use '.' in property name", //appendProp
        "3635": "Default array must be empty, set default value of %s.%s to [], and initialize in 'onLoad' or 'ctor' please. (just like 'this.%s = [...];')", //defineProp
        "3636": "Do not set default value to non-empty object, unless the object defines its own 'clone' function. Set default value of %s.%s to null or {}, and initialize in 'onLoad' or 'ctor' please. (just like 'this.%s = {foo: bar};')", //defineProp_2
        "3637": "Can not declare %s.%s, it is already defined in the prototype of %s", //defineProp_3
        "3638": "'%s': the getter of '%s' is already defined!", //defineGetSet_2
        "3640": "'%s': the setter of '%s' is already defined!", //defineGetSet_4
        "3641": "Can not construct %s because it contains object property.", //getNewValueTypeCode
        "3642": "Cannot define %s.%s because static member name can not be '%s'.", //CCClass_4
        "3643": "Can not define a member called 'constructor' in the class '%s', please use 'ctor' instead.", //CCClass_5
        "3644": "Please define 'type' parameter of %s.%s as the actual constructor.", //parseAttributes
        "3645": "Please define 'type' parameter of %s.%s as the constructor of %s.", //parseAttributes_2
        "3646": "Unknown 'type' parameter of %s.%s：%s", //parseAttributes_3
        "3647": "The length of range array must be equal or greater than 2", //parseAttributes_4
        "3648": "Can not declare %s.%s method, it is already defined in the properties of %s.",
        "3649": "CCClass %s have conflict between its ctor and __ctor__.",
        "3650": "No need to specifiy '%s' attribute for '%s' in class \"%s\".",
        "3651": "Can not call `_super` or `prototype.ctor` in ES6 Classes \"%s\", use `super` instead please.",
        //Prefab: 3700
        "3700": "internal error: _prefab is undefined", //_doInstantiate
        "3701": "Failed to load prefab asset for node '%s'", //syncWithPrefab
        //Game: 3800
        "3800": "The target can not be made persist because it\'s not a cc.Node or it doesn\'t have _id property.", //addPersistRootNode
        "3801": "The node can not be made persist because it\'s not under root node.", //addPersistRootNode_2
        "3802": "The node can not be made persist because it\'s not in current scene.", //addPersistRootNode_3
        "3803": "The target can not be made persist because it\'s not a cc.Node or it doesn\'t have _id property.", //addPersistRootNode_4
        "3804": "getComponent: Type must be non-nil", //getConstructor
        "3805": "Can\'t add component '%s' because %s already contains the same component.", //_checkMultipleComp
        "3806": "Can\'t add component '%s' to %s because it conflicts with the existing '%s' derived component.", //_checkMultipleComp_2
        "3807": "addComponent: Failed to get class '%s'", //addComponent
        "3808": "addComponent: Should not add component ('%s') when the scripts are still loading.", //addComponent_2
        "3809": "addComponent: The component to add must be a constructor", //addComponent_3
        "3810": "addComponent: The component to add must be child class of cc.Component", //addComponent_4
        "3811": "_addComponentAt: The component to add must be a constructor", //_addComponentAt
        "3812": "_addComponentAt: Index out of range", //_addComponentAt_2
        "3813": "removeComponent: Component must be non-nil", //removeComponent
        "3814": "Argument must be non-nil", //_removeComponent
        "3815": "Component not owned by this entity", //_removeComponent_2
        "3816": "Node '%s' is already activating or deactivating.",
        "3817": "Sorry, the component of '%s' which with an index of %s is corrupted! It has been removed.",
        "3818": "Failed to read or parse project.json", //_loadConfig
        "3819": "Warning: target element is not a DIV or CANVAS", //_initRenderer
        //Animation: 3900
        "3900": "Invalid clip to add", //addClip
        "3901": "Invalid clip to remove", //removeClip
        "3902": "clip is defaultClip, set force to true to force remove clip and animation state", //removeClip_2
        "3903": "animation state is playing, set force to true to force stop and remove clip and animation state", //removeClip_3
        "3904": "motion path of target [%s] in prop [%s] frame [%s] is not valid", //createPropCurve
        "3905": "sprite frames must be an Array.", //createWithSpriteFrames
        "3906": "Can\'t find easing type [%s]", //computeRatioByType
        "3907": "animator not added or already removed", //removeAnimator
        "3908": "animation not added or already removed", //removeAnimation
        "3909": "[animate] keyFrames must be non-nil", //animate
        "3910": "[animate] ratio should >= 0!", //_doAnimate
        "3911": "[animate] ratio should in the order of smallest to largest!", //_doAnimate_2
        //Label: 4000
        "4000": "Sorry, the cc.Font has been modified from Raw Asset to Asset. Please load the font asset before using.", //font
        "4001": "_ccsg.Label._initBMFontWithString(): Impossible to create font. Please check file", //_setBMFontFile
        "4002": "_ccsg.Label._initBMFontWithString(): re-init is no longer supported", //_initBMFontWithString
        "4003": "Label font size can't be shirnked less than 0!", //_calculateLabelFont
        "4004": "force notify all fonts loaded!", //TextUtils._loadWithCSS
        "4005": "cc.LabelAtlas.initWithString(): Unsupported version. Upgrade cocos2d version", //LabelAtlas.initWithString
        "4006": "cc.LabelAtlas._updateAtlasValues(): Invalid String length", //LabelAtlasWebGL.updateAtlasValues
        "4007": "cc.LabelBMFont.initWithString(): re-init is no longer supported", //BMFont.initWithString
        "4008": "cc.LabelBMFont.initWithString(): Impossible to create font. Please check file", //
        "4009": "cocos2d: LabelBMFont: character not found %s", //BMFont.createFontChars
        "4010": "cc.LabelBMFont.setFntFile() : Impossible to create font. Please check file", //BMFont.setFntFile
        "4011": "Property spriteFrame of Font '%s' is invalid. Using system font instead.", // BMFont spriteFrame is invalid.
        "4012": "The texture of Font '%s' must be already loaded on JSB. Using system font instead.",
        //Layout: 4100
        "4100": "Property padding is deprecated, please use paddingLeft, paddingRight, paddingTop and paddingBottom instead", //padding
        //Mask: 4200
        "4200": "MaskType: IMAGE_STENCIL only support WebGL mode.", //onEnable
        "4201": "The alphaThreshold invalid in Canvas Mode.", // alphaThreshold
        "4202": "The inverted invalid in Canvas Mode.", // inverted
        //PageView: 4300
        "4300": "can not found the %s page.", //removePage
        //RichText: 4400
        "4400": "Invalid RichText img tag! The sprite frame name can\'t be found in the ImageAtlas!", //_addRichTextImageElement
        //MissingScript: 4600
        "4600": "Script attached to '%s' is missing or invalid.", //onLoad
        //EditBox: 4700
        "4700": "The dom control is not created!", //getTabIndex
        //AutoReleaseUtils: 4800
        "4800": "unknown asset type %s", //getKey
        //Loader: 4900
        "4901": "loadRes: should not specify the extname in %s %s", //_getResUuid
        "4902": "No need to release non-cached asset.", //setAutoRelease
        "4903": "Can not get class '%s'", //uuid-loader.loadUuid
        "4904": "%s does not exist", //load_2
        "4905": "%s load error, must be json file", //load_3
        "4906": "Can't find the parser : %s", //load_4
        "4907": "%s is armature. please use:", //load_5
        "4908": "    ccs.armatureDataManager.addArmatureFileInfoAsync(%s);", //load_6
        "4909": "    var armature = new ccs.Armature('name');", //load_7
        "4910": "Can't find the parser : %s", //load_8
        "4911": "register parser error", //registerParser
        "4912": "Can't find the parser : %s", //parseNode
        "4913": "Group versions haven't been loaded, you can also set group data with 'cc.LoaderLayer.groups'", //loaderLayer
        "4914": "Resources url '%s' does not exist.", //releaseRes
        "4915": "Pack indices and data do not match in size", //JSONunpacker.read
        "4916": "Failed to download package for %s", //PackDownloader._loadNewPack
        "4917": "cc.LabelBMFont._parseCommonArguments(): page can\'t be larger than supported", //loadFnt
        "4918": "cc.LabelBMFont._parseCommonArguments(): only supports 1 page", //loadFnt
        "4919": "cc.LabelBMFont._parseImageFileName() : file could not be found", //loadFnt
        "4920": "Sorry, you shouldn\'t use id as item identity any more, please use url or uuid instead, the current id is being set as url: (%s)", // load
        "4921": "Invalid pipe or invalid index provided!", //pipeline.insertPipe
        "4922": "The pipe to be inserted is already in the pipeline!", //pipeline.insertPipe
        //CCObject: 5000
        "5000": "object already destroyed", //destroy
        "5001": "object not yet destroyed", //realDestroyInEditor
        //PlistParser: 5100
        "5100": "Not a plist file!", //parse
        //CCSys: 5200
        "5200": "Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option", //localStorage
        "5201": "browser don't support web audio", //audio
        //Deserialize: 5300
        "5300": "Type of target to deserialize not matched with data: target is %s, data is %s", //_deserializeObject
        "5301": "Can not find script '%s'", //reportMissingClass
        "5302": "Can not find class '%s'", //reportMissingClass_2
        //JS: 5400
        "5400": "'%s' is deprecated, use '%s' instead please.", //obsolete
        "5401": "'%s' is deprecated, use '%s' instead please.", //obsolete_2
        "5402": "cc.js.addon called on non-object: ", //addon
        "5403": "cc.js.mixin: arguments must be type object: ", //mixin
        "5404": "The base class to extend from must be non-nil", //extend
        "5405": "The class to extend must be non-nil", //extend
        "5406": "Class should be extended before assigning any prototype members.", //extend
        //PreprocessAttrs: 5500
        "5500": "'notify' can\'t work with 'get/set' !", //parseNotify
        "5501": "'notify' must work with 'default' !", //parseNotify_2
        "5502": "Invalid url of %s.%s", //checkUrl
        "5503": "The 'url' attribute of '%s.%s' is undefined when loading script.", //checkUrl_2
        "5504": "The 'url' type of '%s.%s' must be child class of cc.RawAsset.", //checkUrl_3
        "5505": "The 'url' type of '%s.%s' must not be child class of cc.Asset, otherwise you should use 'type: %s' instead.", //checkUrl_4
        "5506": "Can not specify 'type' attribute for '%s.%s', because its 'url' is already defined.", //checkUrl_5
        "5507": "The 'default' attribute of '%s.%s' must be an array", //parseType
        "5508": "Invalid type of %s.%s", //parseType_2
        "5509": "The 'type' attribute of '%s.%s' must be child class of cc.Asset, otherwise you should use 'url: %s' instead", //parseType_3
        "5510": "The 'type' attribute of '%s.%s' can not be 'Number', use 'Float' or 'Integer' instead please.", //parseType_4
        "5511": "The 'type' attribute of '%s.%s' is undefined when loading script", //parseType_5
        "5512": "Can not serialize '%s.%s' because the specified type is anonymous, please provide a class name or set the 'serializable' attribute of '%s.%s' to 'false'.", //postCheckType
        "5513": "The 'default' value of '%s.%s' should not be used with a 'get' function.", //default
        "5514": "The 'default' value of '%s.%s' should not be used with a 'set' function.", //default_2
        "5515": "The 'default' value of '%s.%s' can not be an constructor. Set default to null please.", //default_3
        "5516": "Property '%s.%s' must define at least one of 'default', 'get' or 'set'.", //default_4
        "5517": "'%s.%s' hides inherited property '%s.%s'. To make the current property override that implementation, add the `override: true` attribute please.", //default_5
        //Find: 5600
        "5600": "Argument must be non-nil", //find
        "5601": "Can not get current scene.", //find_2
        "5602": "Scene is destroyed", //find_3
        "5603": "reference node is destroyed", //find_4
        //Misc: 5700
        "5700": "no %s or %s on %s", //misc
        //ValueType: 5800
        "5800": "%s.lerp not yet implemented.", //lerp
        "5801": "%s.clone not yet implemented.", //clone
        "5802": "%s.equals not yet implemented.", //equals
        //MotionStreak: 5900
        "5900": "MotionStreak only support WebGL mode.", //__preload
        "5901": "cc.MotionStreak.getOpacity has not been supported.", //getOpacity
        "5902": "cc.MotionStreak.setOpacity has not been supported.", //setOpacity
        //ParticleSystem: 6000
        "6000": "Custom should not be false if file is not specified.", //custom
        "6001": "The new %s must not be NaN", //particle
        "6002": "_ccsg.ParticleSystem.addChild() : Can't add a ParticleSystem that uses a different blending function", //ParticleBatchNode.addChild
        "6003": "cc.ParticleBatchNode.removeChild(): doesn't contain the sprite. Can't remove it", //removeChild
        "6004": "cc.ParticleBatchNode.reorderChild(): Child doesn't belong to batch", //reorderChild
        "6005": "cc.ParticleBatchNode._increaseAtlasCapacityTo() : WARNING: Not enough memory to resize the atlas", //_increaseAtlasCapacityTo
        "6006": "cocos2d: cc.ParticleBatchNode: resizing TextureAtlas capacity from [%d] to [%d]", //_increaseAtlasCapacityTo
        "6007": "cc.ParticleBatchNode._addChildHelper(): child already added. It can't be added again", //_addChildHelper
        "6008": "_ccsg.ParticleSystem.initWithFile(): Particles: file not found", //CCSGParticleSystem.initWithFile
        "6009": "_ccsg.ParticleSystem.initWithDictionary(): Invalid emitterType in config file", //initWithDictionary
        "6010": "_ccsg.ParticleSystem: error decoding or ungzipping textureImageData", //initWithDictionary
        "6011": "_ccsg.ParticleSystem: unknown image format with Data", //initWithDictionary
        "6012": "_ccsg.ParticleSystem.initWithDictionary() : error loading the texture", //initWithDictionary
        "6013": "Particle system: not enough memory", //initWithTotalParticles
        "6014": "Can't change blending functions when the particle is being batched", //_updateBlendFunc
        "6015": "_ccsg.ParticleSystem.setDisplayFrame(): QuadParticle only supports SpriteFrames with no offsets", //setDisplayFrame
        "6016": "_ccsg.ParticleSystem._allocMemory(): Memory should not be allocated when not using batchNode", //WebGLRenderCmd._allocMemory
        //Compatible: 6100
        "6100": "Not supported file types, Please try use the ccs.load", //widgetFromJsonFile
        //CCFactory: 6200
        "6200": "Canvas doesn't support mesh slot!", //_generateSlot
        //ClippingNode: 6300
        "6300": "only cc.DrawNode is accepted as stencil", //setStencil
        "6301": "Stencil buffer is not enabled.", //initStencilBits
        "6302": "Nesting more than %d stencils is not supported. Everything will be drawn without stencil for this node and its children.", //visit
        //CCAsset: 6400
        "6400": "asset.url is not usable in core process", //rawUrl
        "6401": "asset.urls is not usable in core process", //rawUrls
        "6402": "AssetLibrary has already been initialized!", //AssetLibrary.init
        //Widget: 6500
        "6500": "Widget target must be one of the parent nodes of it", //visitNode
        //Collision: 6600
        "6600": "collider not added or already removed", //removeCollider
        "6601": "Can\'t find testFunc for (%s, $s).", //Contact
        //Canvas: 6700
        "6700": "Can't init canvas '%s' because it conflicts with the existing '%s', the scene should only have one active canvas at the same time", //__preload
        "6701": "Should not add Canvas to a node which already contains a renderer component (%s).", //__preload_2
        "6702": "Should not add Canvas to a node which size is already used by its other component.", //__preload_3
        //EventTarget: 6800
        "6800": "Callback of event must be non-nil", //on
        "6801": "The message must be provided", //emit
        //Instantiate: 6900
        "6900": "The thing you want to instantiate must be an object", //instantiate
        "6901": "The thing you want to instantiate is nil", //instantiate_2
        "6902": "The thing you want to instantiate is destroyed", //instantiate_3
        "6903": "The instantiate method for given asset do not implemented", //instantiate_4
        "6904": "Can not instantiate array", //doInstantiate
        "6905": "Can not instantiate DOM element", //doInstantiate_2
        //Url: 7000
        "7000": "Failed to init asset\'s raw path.", //raw
        "7001": "Should not load '%s' from script dynamically, unless it is placed in the 'resources' folder.", //raw
        "7002": "Sorry can not load '%s' because it is not placed in the 'resources' folder.", //raw
        "7003": "Failed to init builtin asset\'s raw path.", //builtinRaw
        //Enum: 7100
        "7100": "%s already defined in Enum.", //Enum
        "7101": "Sorry, 'cc.Enum' not available on this platform, please report this error here: https://github.com/cocos-creator/engine/issues/new", //Enum
        //TiledMap: 7200
        "7200": "Method 'initWithTMXFile' is no effect now, please set property 'tmxAsset' instead.", //initWithTMXFile
        "7201": "Method 'initWithXML' is no effect now, please set property 'tmxAsset' instead.", //initWithXML
        "7202": "Add component TiledLayer into node failed.", //_refreshLayerEntities
        "7203": "Property 'mapLoaded' is unused now. Please write the logic to the callback 'start'.", //mapLoaded
        "7204": "_ccsg.TMXLayer.getTileAt(): TMXLayer: the tiles map has been released", //getTileAt
        "7205": "_ccsg.TMXLayer.getTileGIDAt(): TMXLayer: the tiles map has been released", //getTileGIDAt
        "7206": "_ccsg.TMXLayer.setTileGID(): TMXLayer: the tiles map has been released", //setTileGID
        "7207": "_ccsg.TMXLayer.setTileGID(): invalid gid: %s", //setTileGID
        "7208": "_ccsg.TMXLayer.getTileFlagsAt(): TMXLayer: the tiles map has been released", //getTileFlagsAt
        "7209": "_ccsg.TMXLayer.removeTileAt(): TMXLayer: the tiles map has been released", //removeTileAt
        "7210": "TMX Hexa zOrder not supported", //_vertexZForPos
        "7211": "TMX invalid value", //_vertexZForPos
        "7212": "_ccsg.TMXTiledMap.initWithTMXFile(): Map not found. Please check the filename.", //initWithTMXFile
        "7213": "_ccsg.TMXTiledMap.initWithXML(): Map not found. Please check the filename.", //initWithXML
        "7214": "propertiesForGID is deprecated. Please use getPropertiesForGID instead.", //propertiesForGID
        "7215": "cocos2d: Warning: TMX Layer %s has no tiles", //_tilesetForLayer
        "7216": "cocos2d: TMXFormat: Unsupported TMX version: %s", //parseXMLFile
        "7217": "cocos2d: TMXFomat: Unsupported orientation: %s", //parseXMLFile
        "7218": "cc.TMXMapInfo.parseXMLFile(): unsupported compression method", //_parseLayer
        "7219": "cc.TMXMapInfo.parseXMLFile(): Only base64 and/or gzip/zlib maps are supported", //_parseLayer
        //Wrapper: 7300
        "7300": "The new selected must be number", //CheckBox.selected
        "7301": "The new bake must be boolean", //layer
        //ArmatureDisplay: 7400
        "7400": "Failed to set _defaultArmatureIndex for '%s' because its dragonAsset is invalid.", //_defaultArmatureIndex
        "7401": "Failed to set _defaultArmatureIndex for '%s' because the index is out of range.", //_defaultArmatureIndex
        "7402": "Failed to set _animationIndex for '%s' because the index is out of range.", //_animationIndex
        //Skeleton: 7500
        "7500": "Failed to set _defaultSkinIndex for '%s' because its skeletonData is invalid.", //_defaultSkinIndex
        "7501": "Failed to set _defaultSkinIndex for '%s' because the index is out of range.", //_defaultSkinIndex
        "7502": "Failed to set _animationIndex for '%s' because its skeletonData is invalid.", //_animationIndex
        "7503": "Failed to set _animationIndex for '%s' because the index is out of range.", //_animationIndex
        "7504": "Can not render dynamic created SkeletonData", //_createSgNode
        "7505": "Invalid type of atlasFile, atlas should be registered as raw asset.", //_createSgNode
        "7506": "Failed to load spine atlas '$s'", //TextureLoader.load
        "7507": "Please re-import '%s' because its textures is not initialized! (This workflow will be improved in the future.)", //getRuntimeData
        "7508": "The atlas asset of '%s' is not exists!", //_getAtlas
        "7509": "Spine: Animation not found: %s", //setAnimation
        "7510": "Spine: Animation not found: %s", //addAnimation
        //Render: 7600
        "7600": "The context of RenderTexture is invalid.", //_renderingToCacheCanvas
        //VideoPlayer: 7700
        "7700": "On the web is always keep the aspect ratio", //setKeepAspectRatioEnabled
        "7701": "Can't know status", //isFullScreenEnabled
        "7702": "Video player's duration is not ready to get now!", //duration
        //WebView: 7800
        "7800": "Web does not support loading", //stopLoading
        "7801": "Web does not support query history", //canGoBack
        "7802": "Web does not support query history", //canGoForward
        "7803": "The current browser does not support the GoBack", //goBack
        "7804": "The current browser does not support the GoForward", //goForward
        "7805": "Web does not support zoom", //setScalesPageToFit
        //Math: 7900
        "7900": "cc.math.Matrix3.assign(): current matrix equals matIn", //mat3.assignFrom
        "7901": "cc.math.mat4Assign(): pOut equals pIn", //mat4.mat4Assign
        "7902": "cc.mat.Matrix4.assignFrom(): mat4 equals current matrix", //mat4.assignFrom
        "7903": "cc.math.Matrix4 equal: pMat1 and pMat2 are same object.", //mat4.equals
        "7904": "cc.math.Matrix4.extractPlane: Invalid plane index", //mat4.extractPlane
        "7905": "cc.math.mat4Assign(): pOut equals pIn", //mat4AssignSIMD
        "7906": "cc.mat.Matrix4.assignFrom(): mat4 equals current matrix", //assignFromSIMD
        "7907": "cc.math.Matrix4 equals: pMat1 and pMat2 are same object.", //equalsSIMD
        //Reader: 8000
        "8000": "Can't handle this field type or size", //TIFF.getFieldValues
        "8001": "No bytes requested", //TIFF.getBytes
        "8002": "Too many bytes requested", //TIFF.getBytes
        "8003": "Missing StripByteCounts!", //TIFF.parseTIFF
        //Shaders: 8100
        "8100": "cocos2d: ERROR: Failed to compile shader:\n %s", //_compileShader
        "8101": "cocos2d: ERROR: Failed to compile vertex shader", //initWithVertexShaderByteArray
        "8102": "cocos2d: ERROR: Failed to compile fragment shader", //initWithVertexShaderByteArray
        "8103": "cc.GLProgram.link(): Cannot link invalid program", //link
        "8104": "cocos2d: ERROR: Failed to link program: %s", //link
        "8105": "cocos2d: cc.shaderCache._loadDefaultShader, error shader type", //_loadDefaultShader
        //Physics: 8200
        "8200": "Please set node\'s active instead of rigidbody\'s enabled.", //cc.RigidBody.enabled
        //Camera: 8300
        "8300": "Should only one camera exists, please check your project.", //cc.Camera.enabled
        "8301": "Camera does not support Canvas Mode.", //cc.Camera.enabled
    };
    cc._LogInfos = logs;
}

// module.exports = false;

// // Only Node.JS has a process variable that is of [[Class]] process
// try {
//     module.exports = Object.prototype.toString.call(global.process) === '[object process]';
//     module.exports = logs;
// } catch (e) {

//     cc._LogInfos = logs;
// }
