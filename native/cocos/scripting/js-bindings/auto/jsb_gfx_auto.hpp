#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_renderer_GraphicsHandle_proto;
extern se::Class* __jsb_cocos2d_renderer_GraphicsHandle_class;

bool js_register_cocos2d_renderer_GraphicsHandle(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GraphicsHandle_getHandle);
SE_DECLARE_FUNC(js_gfx_GraphicsHandle_GraphicsHandle);

extern se::Object* __jsb_cocos2d_renderer_IndexBuffer_proto;
extern se::Class* __jsb_cocos2d_renderer_IndexBuffer_class;

bool js_register_cocos2d_renderer_IndexBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_setBytes);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_getUsage);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_setFormat);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_setCount);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_setUsage);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_getCount);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_setBytesPerIndex);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_getBytes);
SE_DECLARE_FUNC(js_gfx_IndexBuffer_IndexBuffer);

extern se::Object* __jsb_cocos2d_renderer_VertexBuffer_proto;
extern se::Class* __jsb_cocos2d_renderer_VertexBuffer_class;

bool js_register_cocos2d_renderer_VertexBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_setBytes);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_getUsage);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_setCount);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_setUsage);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_getCount);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_getBytes);
SE_DECLARE_FUNC(js_gfx_VertexBuffer_VertexBuffer);

extern se::Object* __jsb_cocos2d_renderer_DeviceGraphics_proto;
extern se::Class* __jsb_cocos2d_renderer_DeviceGraphics_class;

bool js_register_cocos2d_renderer_DeviceGraphics(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setBlendFuncSeparate);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_enableBlend);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setPrimitiveType);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setBlendEquationSeparate);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setIndexBuffer);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setProgram);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setFrameBuffer);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilFunc);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setBlendColor);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setScissor);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setVertexBuffer);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_enableDepthWrite);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_getCapacity);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilOpBack);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setViewport);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_draw);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setDepthFunc);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_enableDepthTest);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_resetDrawCalls);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_getDrawCalls);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setBlendEquation);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilFuncFront);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilOpFront);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilFuncBack);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setBlendFunc);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setCullMode);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_ext);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_setStencilOp);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_enableStencilTest);
SE_DECLARE_FUNC(js_gfx_DeviceGraphics_getInstance);

extern se::Object* __jsb_cocos2d_renderer_FrameBuffer_proto;
extern se::Class* __jsb_cocos2d_renderer_FrameBuffer_class;

bool js_register_cocos2d_renderer_FrameBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_FrameBuffer_getHeight);
SE_DECLARE_FUNC(js_gfx_FrameBuffer_getWidth);
SE_DECLARE_FUNC(js_gfx_FrameBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_FrameBuffer_FrameBuffer);

extern se::Object* __jsb_cocos2d_renderer_RenderTarget_proto;
extern se::Class* __jsb_cocos2d_renderer_RenderTarget_class;

bool js_register_cocos2d_renderer_RenderTarget(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_renderer_RenderBuffer_proto;
extern se::Class* __jsb_cocos2d_renderer_RenderBuffer_class;

bool js_register_cocos2d_renderer_RenderBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_RenderBuffer_init);
SE_DECLARE_FUNC(js_gfx_RenderBuffer_create);
SE_DECLARE_FUNC(js_gfx_RenderBuffer_RenderBuffer);

extern se::Object* __jsb_cocos2d_renderer_Texture_proto;
extern se::Class* __jsb_cocos2d_renderer_Texture_class;

bool js_register_cocos2d_renderer_Texture(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_Texture_getWidth);
SE_DECLARE_FUNC(js_gfx_Texture_getHeight);
SE_DECLARE_FUNC(js_gfx_Texture_getTarget);

extern se::Object* __jsb_cocos2d_renderer_Texture2D_proto;
extern se::Class* __jsb_cocos2d_renderer_Texture2D_class;

bool js_register_cocos2d_renderer_Texture2D(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_Texture2D_updateImage);
SE_DECLARE_FUNC(js_gfx_Texture2D_init);
SE_DECLARE_FUNC(js_gfx_Texture2D_updateSubImage);
SE_DECLARE_FUNC(js_gfx_Texture2D_update);
SE_DECLARE_FUNC(js_gfx_Texture2D_Texture2D);

extern se::Object* __jsb_cocos2d_renderer_Program_proto;
extern se::Class* __jsb_cocos2d_renderer_Program_class;

bool js_register_cocos2d_renderer_Program(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_Program_getID);
SE_DECLARE_FUNC(js_gfx_Program_init);
SE_DECLARE_FUNC(js_gfx_Program_link);
SE_DECLARE_FUNC(js_gfx_Program_Program);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
