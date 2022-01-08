// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/core/assets/AssetsModuleHeader.h"
#include "cocos/3d/assets/Mesh.h"
#include "cocos/3d/assets/Morph.h"
#include "cocos/3d/assets/MorphRendering.h"
#include "cocos/3d/assets/Skeleton.h"

bool register_all_assets(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::Error);
JSB_REGISTER_OBJECT_TYPE(cc::BoundingBox);
JSB_REGISTER_OBJECT_TYPE(cc::VertexIdChannel);
JSB_REGISTER_OBJECT_TYPE(cc::Asset);
JSB_REGISTER_OBJECT_TYPE(cc::BufferAsset);
JSB_REGISTER_OBJECT_TYPE(cc::TextureBase);
JSB_REGISTER_OBJECT_TYPE(cc::IPropertyInfo);
JSB_REGISTER_OBJECT_TYPE(cc::RasterizerStateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::DepthStencilStateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::BlendTargetInfo);
JSB_REGISTER_OBJECT_TYPE(cc::BlendStateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IPassStates);
JSB_REGISTER_OBJECT_TYPE(cc::IPassInfoFull);
JSB_REGISTER_OBJECT_TYPE(cc::ITechniqueInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IBlockInfo);
JSB_REGISTER_OBJECT_TYPE(cc::ISamplerTextureInfo);
JSB_REGISTER_OBJECT_TYPE(cc::ITextureInfo);
JSB_REGISTER_OBJECT_TYPE(cc::ISamplerInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IBufferInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IImageInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IInputAttachmentInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IAttributeInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IDefineInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IBuiltin);
JSB_REGISTER_OBJECT_TYPE(cc::IBuiltinInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IBuiltins);
JSB_REGISTER_OBJECT_TYPE(cc::IShaderSource);
JSB_REGISTER_OBJECT_TYPE(cc::IShaderInfo);
JSB_REGISTER_OBJECT_TYPE(cc::EffectAsset);
JSB_REGISTER_OBJECT_TYPE(cc::IMemoryImageSource);
JSB_REGISTER_OBJECT_TYPE(cc::ImageAsset);
JSB_REGISTER_OBJECT_TYPE(cc::IMaterialInfo);
JSB_REGISTER_OBJECT_TYPE(cc::Material);
JSB_REGISTER_OBJECT_TYPE(cc::IRenderTextureCreateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::RenderTexture);
JSB_REGISTER_OBJECT_TYPE(cc::IMeshBufferView);
JSB_REGISTER_OBJECT_TYPE(cc::MorphTarget);
JSB_REGISTER_OBJECT_TYPE(cc::SubMeshMorph);
JSB_REGISTER_OBJECT_TYPE(cc::Morph);
JSB_REGISTER_OBJECT_TYPE(cc::IGeometricInfo);
JSB_REGISTER_OBJECT_TYPE(cc::IFlatBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::RenderingSubMesh);
JSB_REGISTER_OBJECT_TYPE(cc::SceneAsset);
JSB_REGISTER_OBJECT_TYPE(cc::TextAsset);
JSB_REGISTER_OBJECT_TYPE(cc::SimpleTexture);
JSB_REGISTER_OBJECT_TYPE(cc::ITexture2DSerializeData);
JSB_REGISTER_OBJECT_TYPE(cc::ITexture2DCreateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::Texture2D);
JSB_REGISTER_OBJECT_TYPE(cc::ITextureCubeMipmap);
JSB_REGISTER_OBJECT_TYPE(cc::ITextureCubeSerializeMipmapData);
JSB_REGISTER_OBJECT_TYPE(cc::ITextureCubeSerializeData);
JSB_REGISTER_OBJECT_TYPE(cc::TextureCube);
JSB_REGISTER_OBJECT_TYPE(cc::MorphRendering);
JSB_REGISTER_OBJECT_TYPE(cc::MorphRenderingInstance);
JSB_REGISTER_OBJECT_TYPE(cc::StdMorphRendering);
JSB_REGISTER_OBJECT_TYPE(cc::Mesh::IVertexBundle);
JSB_REGISTER_OBJECT_TYPE(cc::Mesh::ISubMesh);
JSB_REGISTER_OBJECT_TYPE(cc::Mesh::IStruct);
JSB_REGISTER_OBJECT_TYPE(cc::Mesh::ICreateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::Mesh);
JSB_REGISTER_OBJECT_TYPE(cc::Skeleton);


extern se::Object *__jsb_cc_Error_proto; // NOLINT
extern se::Class * __jsb_cc_Error_class; // NOLINT

bool js_register_cc_Error(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Error *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_BoundingBox_proto; // NOLINT
extern se::Class * __jsb_cc_BoundingBox_class; // NOLINT

bool js_register_cc_BoundingBox(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::BoundingBox *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_VertexIdChannel_proto; // NOLINT
extern se::Class * __jsb_cc_VertexIdChannel_class; // NOLINT

bool js_register_cc_VertexIdChannel(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::VertexIdChannel *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Asset_proto; // NOLINT
extern se::Class * __jsb_cc_Asset_class; // NOLINT

bool js_register_cc_Asset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_Asset_addAssetRef);
SE_DECLARE_FUNC(js_assets_Asset_createNode);
SE_DECLARE_FUNC(js_assets_Asset_decAssetRef);
SE_DECLARE_FUNC(js_assets_Asset_deserialize);
SE_DECLARE_FUNC(js_assets_Asset_getAssetRefCount);
SE_DECLARE_FUNC(js_assets_Asset_getNativeAsset);
SE_DECLARE_FUNC(js_assets_Asset_initDefault);
SE_DECLARE_FUNC(js_assets_Asset_onLoaded);
SE_DECLARE_FUNC(js_assets_Asset_serialize);
SE_DECLARE_FUNC(js_assets_Asset_setNativeAsset);
SE_DECLARE_FUNC(js_assets_Asset_validate);
SE_DECLARE_FUNC(js_assets_Asset_Asset);

extern se::Object *__jsb_cc_BufferAsset_proto; // NOLINT
extern se::Class * __jsb_cc_BufferAsset_class; // NOLINT

bool js_register_cc_BufferAsset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_BufferAsset_BufferAsset);

extern se::Object *__jsb_cc_TextureBase_proto; // NOLINT
extern se::Class * __jsb_cc_TextureBase_class; // NOLINT

bool js_register_cc_TextureBase(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_TextureBase_getAnisotropy);
SE_DECLARE_FUNC(js_assets_TextureBase_getGFXSampler);
SE_DECLARE_FUNC(js_assets_TextureBase_getGFXTexture);
SE_DECLARE_FUNC(js_assets_TextureBase_getHashForJS);
SE_DECLARE_FUNC(js_assets_TextureBase_getId);
SE_DECLARE_FUNC(js_assets_TextureBase_getPixelFormat);
SE_DECLARE_FUNC(js_assets_TextureBase_getSamplerInfo);
SE_DECLARE_FUNC(js_assets_TextureBase_setAnisotropy);
SE_DECLARE_FUNC(js_assets_TextureBase_setFilters);
SE_DECLARE_FUNC(js_assets_TextureBase_setMipFilter);
SE_DECLARE_FUNC(js_assets_TextureBase_setWrapMode);

extern se::Object *__jsb_cc_IPropertyInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IPropertyInfo_class; // NOLINT

bool js_register_cc_IPropertyInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IPropertyInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_RasterizerStateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_RasterizerStateInfo_class; // NOLINT

bool js_register_cc_RasterizerStateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::RasterizerStateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_DepthStencilStateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_DepthStencilStateInfo_class; // NOLINT

bool js_register_cc_DepthStencilStateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::DepthStencilStateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_BlendTargetInfo_proto; // NOLINT
extern se::Class * __jsb_cc_BlendTargetInfo_class; // NOLINT

bool js_register_cc_BlendTargetInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::BlendTargetInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_BlendStateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_BlendStateInfo_class; // NOLINT

bool js_register_cc_BlendStateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::BlendStateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IPassStates_proto; // NOLINT
extern se::Class * __jsb_cc_IPassStates_class; // NOLINT

bool js_register_cc_IPassStates(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IPassStates *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_assets_IPassStates_overrides);

extern se::Object *__jsb_cc_IPassInfoFull_proto; // NOLINT
extern se::Class * __jsb_cc_IPassInfoFull_class; // NOLINT

bool js_register_cc_IPassInfoFull(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IPassInfoFull *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ITechniqueInfo_proto; // NOLINT
extern se::Class * __jsb_cc_ITechniqueInfo_class; // NOLINT

bool js_register_cc_ITechniqueInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITechniqueInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IBlockInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IBlockInfo_class; // NOLINT

bool js_register_cc_IBlockInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IBlockInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ISamplerTextureInfo_proto; // NOLINT
extern se::Class * __jsb_cc_ISamplerTextureInfo_class; // NOLINT

bool js_register_cc_ISamplerTextureInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ISamplerTextureInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ITextureInfo_proto; // NOLINT
extern se::Class * __jsb_cc_ITextureInfo_class; // NOLINT

bool js_register_cc_ITextureInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITextureInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ISamplerInfo_proto; // NOLINT
extern se::Class * __jsb_cc_ISamplerInfo_class; // NOLINT

bool js_register_cc_ISamplerInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ISamplerInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IBufferInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IBufferInfo_class; // NOLINT

bool js_register_cc_IBufferInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IBufferInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IImageInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IImageInfo_class; // NOLINT

bool js_register_cc_IImageInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IImageInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IInputAttachmentInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IInputAttachmentInfo_class; // NOLINT

bool js_register_cc_IInputAttachmentInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IInputAttachmentInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IAttributeInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IAttributeInfo_class; // NOLINT

bool js_register_cc_IAttributeInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IAttributeInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IDefineInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IDefineInfo_class; // NOLINT

bool js_register_cc_IDefineInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IDefineInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IBuiltin_proto; // NOLINT
extern se::Class * __jsb_cc_IBuiltin_class; // NOLINT

bool js_register_cc_IBuiltin(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IBuiltin *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IBuiltinInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IBuiltinInfo_class; // NOLINT

bool js_register_cc_IBuiltinInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IBuiltinInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IBuiltins_proto; // NOLINT
extern se::Class * __jsb_cc_IBuiltins_class; // NOLINT

bool js_register_cc_IBuiltins(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IBuiltins *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IShaderSource_proto; // NOLINT
extern se::Class * __jsb_cc_IShaderSource_class; // NOLINT

bool js_register_cc_IShaderSource(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IShaderSource *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IShaderInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IShaderInfo_class; // NOLINT

bool js_register_cc_IShaderInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IShaderInfo *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_assets_IShaderInfo_getSource);

extern se::Object *__jsb_cc_EffectAsset_proto; // NOLINT
extern se::Class * __jsb_cc_EffectAsset_class; // NOLINT

bool js_register_cc_EffectAsset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_EffectAsset_get);
SE_DECLARE_FUNC(js_assets_EffectAsset_getAll);
SE_DECLARE_FUNC(js_assets_EffectAsset_registerAsset);
SE_DECLARE_FUNC(js_assets_EffectAsset_remove);
SE_DECLARE_FUNC(js_assets_EffectAsset_EffectAsset);

extern se::Object *__jsb_cc_IMemoryImageSource_proto; // NOLINT
extern se::Class * __jsb_cc_IMemoryImageSource_class; // NOLINT

bool js_register_cc_IMemoryImageSource(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IMemoryImageSource *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ImageAsset_proto; // NOLINT
extern se::Class * __jsb_cc_ImageAsset_class; // NOLINT

bool js_register_cc_ImageAsset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_ImageAsset_getData);
SE_DECLARE_FUNC(js_assets_ImageAsset_getHeight);
SE_DECLARE_FUNC(js_assets_ImageAsset_getWidth);
SE_DECLARE_FUNC(js_assets_ImageAsset_isCompressed);
SE_DECLARE_FUNC(js_assets_ImageAsset_setHeight);
SE_DECLARE_FUNC(js_assets_ImageAsset_setWidth);
SE_DECLARE_FUNC(js_assets_ImageAsset_ImageAsset);

extern se::Object *__jsb_cc_IMaterialInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IMaterialInfo_class; // NOLINT

bool js_register_cc_IMaterialInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IMaterialInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Material_proto; // NOLINT
extern se::Class * __jsb_cc_Material_class; // NOLINT

bool js_register_cc_Material(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_Material_copy);
SE_DECLARE_FUNC(js_assets_Material_getPasses);
SE_DECLARE_FUNC(js_assets_Material_getProperty);
SE_DECLARE_FUNC(js_assets_Material_initialize);
SE_DECLARE_FUNC(js_assets_Material_overridePipelineStates);
SE_DECLARE_FUNC(js_assets_Material_recompileShaders);
SE_DECLARE_FUNC(js_assets_Material_reset);
SE_DECLARE_FUNC(js_assets_Material_resetUniforms);
SE_DECLARE_FUNC(js_assets_Material_setPropertyColor);
SE_DECLARE_FUNC(js_assets_Material_setPropertyColorArray);
SE_DECLARE_FUNC(js_assets_Material_setPropertyFloat32);
SE_DECLARE_FUNC(js_assets_Material_setPropertyFloat32Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyGFXTexture);
SE_DECLARE_FUNC(js_assets_Material_setPropertyGFXTextureArray);
SE_DECLARE_FUNC(js_assets_Material_setPropertyInt32);
SE_DECLARE_FUNC(js_assets_Material_setPropertyInt32Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyMat3);
SE_DECLARE_FUNC(js_assets_Material_setPropertyMat3Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyMat4);
SE_DECLARE_FUNC(js_assets_Material_setPropertyMat4Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyQuaternion);
SE_DECLARE_FUNC(js_assets_Material_setPropertyQuaternionArray);
SE_DECLARE_FUNC(js_assets_Material_setPropertyTextureBase);
SE_DECLARE_FUNC(js_assets_Material_setPropertyTextureBaseArray);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec2);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec2Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec3);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec3Array);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec4);
SE_DECLARE_FUNC(js_assets_Material_setPropertyVec4Array);
SE_DECLARE_FUNC(js_assets_Material_update);
SE_DECLARE_FUNC(js_assets_Material_getHashForMaterialForJS);
SE_DECLARE_FUNC(js_assets_Material_Material);

extern se::Object *__jsb_cc_IRenderTextureCreateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IRenderTextureCreateInfo_class; // NOLINT

bool js_register_cc_IRenderTextureCreateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IRenderTextureCreateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_RenderTexture_proto; // NOLINT
extern se::Class * __jsb_cc_RenderTexture_class; // NOLINT

bool js_register_cc_RenderTexture(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_RenderTexture_initWindow);
SE_DECLARE_FUNC(js_assets_RenderTexture_initialize);
SE_DECLARE_FUNC(js_assets_RenderTexture_readPixels);
SE_DECLARE_FUNC(js_assets_RenderTexture_reset);
SE_DECLARE_FUNC(js_assets_RenderTexture_resize);
SE_DECLARE_FUNC(js_assets_RenderTexture_RenderTexture);

extern se::Object *__jsb_cc_IMeshBufferView_proto; // NOLINT
extern se::Class * __jsb_cc_IMeshBufferView_class; // NOLINT

bool js_register_cc_IMeshBufferView(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IMeshBufferView *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_MorphTarget_proto; // NOLINT
extern se::Class * __jsb_cc_MorphTarget_class; // NOLINT

bool js_register_cc_MorphTarget(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::MorphTarget *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_SubMeshMorph_proto; // NOLINT
extern se::Class * __jsb_cc_SubMeshMorph_class; // NOLINT

bool js_register_cc_SubMeshMorph(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::SubMeshMorph *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Morph_proto; // NOLINT
extern se::Class * __jsb_cc_Morph_class; // NOLINT

bool js_register_cc_Morph(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Morph *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IGeometricInfo_proto; // NOLINT
extern se::Class * __jsb_cc_IGeometricInfo_class; // NOLINT

bool js_register_cc_IGeometricInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IGeometricInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_IFlatBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_IFlatBuffer_class; // NOLINT

bool js_register_cc_IFlatBuffer(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::IFlatBuffer *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_RenderingSubMesh_proto; // NOLINT
extern se::Class * __jsb_cc_RenderingSubMesh_class; // NOLINT

bool js_register_cc_RenderingSubMesh(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_RenderingSubMesh_enableVertexIdChannel);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_genFlatBuffers);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_getAttributes);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_getGeometricInfo);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_getIndexBuffer);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_getVertexBuffers);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_indirectBuffer);
SE_DECLARE_FUNC(js_assets_RenderingSubMesh_RenderingSubMesh);

extern se::Object *__jsb_cc_SceneAsset_proto; // NOLINT
extern se::Class * __jsb_cc_SceneAsset_class; // NOLINT

bool js_register_cc_SceneAsset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_SceneAsset_getScene);
SE_DECLARE_FUNC(js_assets_SceneAsset_setScene);
SE_DECLARE_FUNC(js_assets_SceneAsset_SceneAsset);

extern se::Object *__jsb_cc_TextAsset_proto; // NOLINT
extern se::Class * __jsb_cc_TextAsset_class; // NOLINT

bool js_register_cc_TextAsset(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_TextAsset_TextAsset);

extern se::Object *__jsb_cc_SimpleTexture_proto; // NOLINT
extern se::Class * __jsb_cc_SimpleTexture_class; // NOLINT

bool js_register_cc_SimpleTexture(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_SimpleTexture_assignImage);
SE_DECLARE_FUNC(js_assets_SimpleTexture_checkTextureLoaded);
SE_DECLARE_FUNC(js_assets_SimpleTexture_updateImage);
SE_DECLARE_FUNC(js_assets_SimpleTexture_updateMipmaps);
SE_DECLARE_FUNC(js_assets_SimpleTexture_uploadData);

extern se::Object *__jsb_cc_ITexture2DSerializeData_proto; // NOLINT
extern se::Class * __jsb_cc_ITexture2DSerializeData_class; // NOLINT

bool js_register_cc_ITexture2DSerializeData(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITexture2DSerializeData *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ITexture2DCreateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_ITexture2DCreateInfo_class; // NOLINT

bool js_register_cc_ITexture2DCreateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITexture2DCreateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Texture2D_proto; // NOLINT
extern se::Class * __jsb_cc_Texture2D_class; // NOLINT

bool js_register_cc_Texture2D(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_Texture2D_create);
SE_DECLARE_FUNC(js_assets_Texture2D_description);
SE_DECLARE_FUNC(js_assets_Texture2D_getGfxTextureCreateInfo);
SE_DECLARE_FUNC(js_assets_Texture2D_getHtmlElementObj);
SE_DECLARE_FUNC(js_assets_Texture2D_getImage);
SE_DECLARE_FUNC(js_assets_Texture2D_getMipmaps);
SE_DECLARE_FUNC(js_assets_Texture2D_getMipmapsUuids);
SE_DECLARE_FUNC(js_assets_Texture2D_initialize);
SE_DECLARE_FUNC(js_assets_Texture2D_releaseTexture);
SE_DECLARE_FUNC(js_assets_Texture2D_reset);
SE_DECLARE_FUNC(js_assets_Texture2D_setImage);
SE_DECLARE_FUNC(js_assets_Texture2D_setMipmaps);
SE_DECLARE_FUNC(js_assets_Texture2D_syncMipmapsForJS);
SE_DECLARE_FUNC(js_assets_Texture2D_Texture2D);

extern se::Object *__jsb_cc_ITextureCubeMipmap_proto; // NOLINT
extern se::Class * __jsb_cc_ITextureCubeMipmap_class; // NOLINT

bool js_register_cc_ITextureCubeMipmap(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITextureCubeMipmap *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ITextureCubeSerializeMipmapData_proto; // NOLINT
extern se::Class * __jsb_cc_ITextureCubeSerializeMipmapData_class; // NOLINT

bool js_register_cc_ITextureCubeSerializeMipmapData(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITextureCubeSerializeMipmapData *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_ITextureCubeSerializeData_proto; // NOLINT
extern se::Class * __jsb_cc_ITextureCubeSerializeData_class; // NOLINT

bool js_register_cc_ITextureCubeSerializeData(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::ITextureCubeSerializeData *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_TextureCube_proto; // NOLINT
extern se::Class * __jsb_cc_TextureCube_class; // NOLINT

bool js_register_cc_TextureCube(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_TextureCube_getGfxTextureCreateInfo);
SE_DECLARE_FUNC(js_assets_TextureCube_getImage);
SE_DECLARE_FUNC(js_assets_TextureCube_getMipmaps);
SE_DECLARE_FUNC(js_assets_TextureCube_initialize);
SE_DECLARE_FUNC(js_assets_TextureCube_releaseTexture);
SE_DECLARE_FUNC(js_assets_TextureCube_reset);
SE_DECLARE_FUNC(js_assets_TextureCube_setImage);
SE_DECLARE_FUNC(js_assets_TextureCube_setMipmaps);
SE_DECLARE_FUNC(js_assets_TextureCube_fromTexture2DArray);
SE_DECLARE_FUNC(js_assets_TextureCube_TextureCube);

extern se::Object *__jsb_cc_MorphRendering_proto; // NOLINT
extern se::Class * __jsb_cc_MorphRendering_class; // NOLINT

bool js_register_cc_MorphRendering(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_MorphRendering_createInstance);

extern se::Object *__jsb_cc_MorphRenderingInstance_proto; // NOLINT
extern se::Class * __jsb_cc_MorphRenderingInstance_class; // NOLINT

bool js_register_cc_MorphRenderingInstance(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_MorphRenderingInstance_adaptPipelineState);
SE_DECLARE_FUNC(js_assets_MorphRenderingInstance_destroy);
SE_DECLARE_FUNC(js_assets_MorphRenderingInstance_requiredPatches);
SE_DECLARE_FUNC(js_assets_MorphRenderingInstance_setWeights);

extern se::Object *__jsb_cc_StdMorphRendering_proto; // NOLINT
extern se::Class * __jsb_cc_StdMorphRendering_class; // NOLINT

bool js_register_cc_StdMorphRendering(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_StdMorphRendering_StdMorphRendering);

extern se::Object *__jsb_cc_Mesh_IVertexBundle_proto; // NOLINT
extern se::Class * __jsb_cc_Mesh_IVertexBundle_class; // NOLINT

bool js_register_cc_Mesh_IVertexBundle(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Mesh::IVertexBundle *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Mesh_ISubMesh_proto; // NOLINT
extern se::Class * __jsb_cc_Mesh_ISubMesh_class; // NOLINT

bool js_register_cc_Mesh_ISubMesh(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Mesh::ISubMesh *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Mesh_IStruct_proto; // NOLINT
extern se::Class * __jsb_cc_Mesh_IStruct_class; // NOLINT

bool js_register_cc_Mesh_IStruct(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Mesh::IStruct *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Mesh_ICreateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_Mesh_ICreateInfo_class; // NOLINT

bool js_register_cc_Mesh_ICreateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::Mesh::ICreateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_Mesh_proto; // NOLINT
extern se::Class * __jsb_cc_Mesh_class; // NOLINT

bool js_register_cc_Mesh(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_Mesh_assign);
SE_DECLARE_FUNC(js_assets_Mesh_copyAttribute);
SE_DECLARE_FUNC(js_assets_Mesh_copyIndices);
SE_DECLARE_FUNC(js_assets_Mesh_destroyRenderingMesh);
SE_DECLARE_FUNC(js_assets_Mesh_getBoneSpaceBounds);
SE_DECLARE_FUNC(js_assets_Mesh_getStruct);
SE_DECLARE_FUNC(js_assets_Mesh_initialize);
SE_DECLARE_FUNC(js_assets_Mesh_merge);
SE_DECLARE_FUNC(js_assets_Mesh_readAttribute);
SE_DECLARE_FUNC(js_assets_Mesh_readIndices);
SE_DECLARE_FUNC(js_assets_Mesh_reset);
SE_DECLARE_FUNC(js_assets_Mesh_setStruct);
SE_DECLARE_FUNC(js_assets_Mesh_validateMergingMesh);
SE_DECLARE_FUNC(js_assets_Mesh_Mesh);

extern se::Object *__jsb_cc_Skeleton_proto; // NOLINT
extern se::Class * __jsb_cc_Skeleton_class; // NOLINT

bool js_register_cc_Skeleton(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_assets_Skeleton_getBindposes);
SE_DECLARE_FUNC(js_assets_Skeleton_getInverseBindposes);
SE_DECLARE_FUNC(js_assets_Skeleton_setBindposes);
SE_DECLARE_FUNC(js_assets_Skeleton_Skeleton);
    // clang-format on