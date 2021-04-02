// HACK: on MacOS WechatDevTools 1.05.2103190 
// calling wx.createInnerAudioContext() would exceed maximum call stack
GameGlobal.originalDocumentCreateElement = GameGlobal.document && document.createElement.bind(document);