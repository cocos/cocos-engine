/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#import "MTLDevice.h"
#import "MTLGPUObjects.h"
#import "MTLShader.h"
#import <Metal/MTLDevice.h>
#import "gfx-base/SPIRVUtils.h"
#include "base/Log.h"

namespace cc {
namespace gfx {

SPIRVUtils* CCMTLShader::spirv = nullptr;

CCMTLShader::CCMTLShader() : Shader() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLShader::~CCMTLShader() {
    destroy();
}

void CCMTLShader::doInit(const ShaderInfo& info) {
    _gpuShader = ccnew CCMTLGPUShader;
    _specializedFragFuncs = [[NSMutableDictionary alloc] init];

    for (const auto& stage : _stages) {
        if (!createMTLFunction(stage)) {
            destroy();
            return;
        }
    }

    setAvailableBufferBindingIndex();

    CC_LOG_INFO("%s compile succeed.", _name.c_str());

    // Clear shader source after they're uploaded to GPU
    for (auto &stage : _stages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }
}

void CCMTLShader::doDestroy() {
    id<MTLLibrary> vertLib = _vertLibrary;
    _vertLibrary = nil;
    id<MTLLibrary> fragLib = _fragLibrary;
    _fragLibrary = nil;
    id<MTLLibrary> cmptLib = _cmptLibrary;
    _cmptLibrary = nil;

    id<MTLFunction> vertFunc = _vertFunction;
    _vertFunction = nil;
    id<MTLFunction> fragFunc = _fragFunction;
    _fragFunction = nil;
    id<MTLFunction> cmptFunc = _cmptFunction;
    _cmptFunction = nil;

    if (_gpuShader) {
        [_gpuShader->shaderSrc release];
        CC_SAFE_DELETE(_gpuShader);
    }

    // [_specializedFragFuncs release];
    NSMutableDictionary<NSString*, id<MTLFunction>>* specFragFuncs = nil;
    if (_specializedFragFuncs) {
        specFragFuncs = _specializedFragFuncs;
        _specializedFragFuncs = nil;
    }

    std::function<void(void)> destroyFunc = [=]() {
        if ([specFragFuncs count] > 0) {
            for (NSString* key in [specFragFuncs allKeys]) {
                [[specFragFuncs valueForKey:key] release];
            }
        }
        [specFragFuncs release];

        if (vertFunc) {
            [vertFunc release];
        }
        if (fragFunc) {
            [fragFunc release];
        }
        if (cmptFunc) {
            [cmptFunc release];
        }

        if (vertLib) {
            [vertLib release];
        }
        if (fragLib) {
            [fragLib release];
        }
        if (cmptLib) {
            [cmptLib release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

bool CCMTLShader::createMTLFunction(const ShaderStage& stage) {
    bool isVertexShader = false;
    bool isFragmentShader = false;
    bool isComputeShader = false;

    if (stage.stage == ShaderStageFlagBit::VERTEX) {
        isVertexShader = true;
    } else if (stage.stage == ShaderStageFlagBit::FRAGMENT) {
        isFragmentShader = true;
    } else if (stage.stage == ShaderStageFlagBit::COMPUTE) {
        isComputeShader = true;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    if (!spirv) {
        spirv = SPIRVUtils::getInstance();
        spirv->initialize(2); // vulkan >= 1.2  spirv >= 1.5
    }

    spirv->compileGLSL(stage.stage, "#version 450\n" + stage.source);
    if (stage.stage == ShaderStageFlagBit::VERTEX) spirv->compressInputLocations(_attributes);

    auto* spvData = spirv->getOutputData();
    size_t unitSize = sizeof(std::remove_pointer<decltype(spvData)>::type);
    ccstd::string mtlShaderSrc = mu::spirv2MSL(spirv->getOutputData(), spirv->getOutputSize() / unitSize, stage.stage, _gpuShader);

    NSString* shader = [NSString stringWithUTF8String:mtlShaderSrc.c_str()];
    NSError* error = nil;
    MTLCompileOptions* opts = [[MTLCompileOptions alloc] init];
    //opts.languageVersion = MTLLanguageVersion2_3;
    id<MTLLibrary>& library = isVertexShader ? _vertLibrary : isFragmentShader ? _fragLibrary : _cmptLibrary;
    ccstd::string shaderStage = isVertexShader ? "vertex" : isFragmentShader ? "fragment" : "compute";

    if (isFragmentShader) {
        if(strcmp(_name.c_str(), "../resources/effects/deferred-lighting|lighting-vs|lighting-fs|USE_INSTANCING0|CC_RECEIVE_SHADOW1|CC_USE_IBL2|CC_USE_DIFFUSEMAP2|CC_USE_HDR1|CC_PIPELINE_TYPE1|CC_USE_FOG4|REFLECTION_PROBE_COUNT3|ENABLE_SHADOW0|ENABLE_CLUSTER_LIGHTING1|ENABLE_IBL1") == 0) {
            std::string str = R"(
#include <metal_stdlib>
#include <simd/simd.h>


constant int indexOffset0 [[function_constant(0)]];
using namespace metal;

struct CustomLightingUBO
{
    float4 light_cluster_BoundsMin;
    float4 light_cluster_BoundsDelta;
    float4 light_cluster_CellsDot;
    float4 light_cluster_CellsMax;
    float4 light_cluster_TextureSize;
    float4 light_cluster_InfoTextureInvSize;
    float4 light_cluster_CellsCountByBoundsSizeAndPixelsPerCell;
    float4 light_ibl_posRange0;
    float4 light_ibl_posRange1;
    float4 light_ibl_posRange2;
    float4 fog_Parameters;
    float4 fog_Parameters2;
    float4 fog_Parameters3;
    float4 fog_ColorParameters;
};

struct CCCamera
{
    float4x4 cc_matView;
    float4x4 cc_matViewInv;
    float4x4 cc_matProj;
    float4x4 cc_matProjInv;
    float4x4 cc_matViewProj;
    float4x4 cc_matViewProjInv;
    float4 cc_cameraPos;
    float4 cc_surfaceTransform;
    float4 cc_screenScale;
    float4 cc_exposure;
    float4 cc_mainLitDir;
    float4 cc_mainLitColor;
    float4 cc_ambientSky;
    float4 cc_ambientGround;
    float4 cc_fogColor;
    float4 cc_fogBase;
    float4 cc_fogAdd;
    float4 cc_nearFar;
    float4 cc_viewPort;
};

struct main0_out
{
    float4 fragColor0 [[color(indexOffset0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant CCCamera& _500 [[buffer(0)]], constant CustomLightingUBO& _379 [[buffer(1)]],  constant rasterization_rate_map_data &data [[buffer(2)]], texture2d<float> light_cluster_Texture [[texture(0)]], texture2d<float> light_cluster_InfoTexture [[texture(1)]], texturecube<float> light_ibl_Texture0 [[texture(2)]], texturecube<float> light_ibl_Texture1 [[texture(3)]], texturecube<float> light_ibl_Texture2 [[texture(4)]], texturecube<float> cc_environment [[texture(5)]], texture2d<float> gbuffer_albedoMap [[texture(6)]], texture2d<float> gbuffer_normalMap [[texture(7)]], texture2d<float> gbuffer_emissiveMap [[texture(8)]], texture2d<float> gbuffer_posMap [[texture(9)]], sampler light_cluster_TextureSmplr [[sampler(0)]], sampler light_cluster_InfoTextureSmplr [[sampler(1)]], sampler light_ibl_Texture0Smplr [[sampler(2)]], sampler light_ibl_Texture1Smplr [[sampler(3)]], sampler light_ibl_Texture2Smplr [[sampler(4)]], sampler cc_environmentSmplr [[sampler(5)]], sampler gbuffer_albedoMapSmplr [[sampler(6)]], sampler gbuffer_normalMapSmplr [[sampler(7)]], sampler gbuffer_emissiveMapSmplr [[sampler(8)]], sampler gbuffer_posMapSmplr [[sampler(9)]])
{
    main0_out out = {};
rasterization_rate_map_decoder map(data);
float2 screensize = {1239, 697};
float2 phySize = {747, 438};
float2 physCoords = map.map_screen_to_physical_coordinates(in.v_uv * screensize) * (1 / phySize);
    
    float4 _1350 = gbuffer_albedoMap.sample(gbuffer_albedoMapSmplr, physCoords);
    float4 _1355 = gbuffer_normalMap.sample(gbuffer_normalMapSmplr, physCoords);
    float4 _1360 = gbuffer_emissiveMap.sample(gbuffer_emissiveMapSmplr, physCoords);
    float4 _1365 = gbuffer_posMap.sample(gbuffer_posMapSmplr, physCoords);
    float3 _1366 = _1365.xyz;
    float _1373 = _1355.z;
    float _1491 = _1355.x;
    float _1495 = _1355.y;
    float _1497 = (1.0 - abs(_1491)) - abs(_1495);
    float3 _1500 = float3(_1491, _1495, _1497);
    float3 _3235;
    if (_1497 < 0.0)
    {
        float2 _1513 = (float2(1.0) - abs(_1500.yx)) * float2((_1491 >= 0.0) ? 1.0 : (-1.0), (_1495 >= 0.0) ? 1.0 : (-1.0));
        _3235 = float3(_1513.x, _1513.y, _1500.z);
    }
    else
    {
        _3235 = _1500;
    }
    float3 _1518 = normalize(_3235);
    float _1382 = _1355.w;
    float3 _1557 = _1350.xyz;
    float3 _1561 = _1557 * (1.0 - _1382);
    float3 _1572 = mix(float3(0.039999999105930328369140625), _1557, float3(_1382));
    float3 _1577 = normalize(_1518);
    float3 _1583 = normalize(_500.cc_cameraPos.xyz - _1366);
    float3 _1588 = normalize(-_500.cc_mainLitDir.xyz);
    float4 _1689 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _1373) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _1691 = _1689.x;
    float2 _1709 = (float2(-1.03999996185302734375, 1.03999996185302734375) * ((fast::min(_1691 * _1691, exp2((-9.27999973297119140625) * fast::max(abs(dot(_1577, _1583)), 0.0))) * _1691) + _1689.y)) + _1689.zw;
    float3 _1726 = fast::max(float3(0.0), (_1572 * _1709.x) + float3(_1709.y * fast::clamp(50.0 * _1572.y, 0.0, 1.0)));
    float3 _1606 = normalize(_1588 + _1583);
    float3 _1621 = _1561 * float3(0.3183098733425140380859375);
    float _1735 = (_1373 * 0.25) + 0.25;
    float3 _1751 = cross(_1577, _1606);
    float _1757 = _1373 * _1373;
    float _1760 = fast::max(dot(_1577, _1606), 0.0) * _1757;
    float _1768 = _1757 / fast::max(9.9999999747524270787835121154785e-07, dot(_1751, _1751) + (_1760 * _1760));
    float3 _1659 = (_1726 * _500.cc_ambientSky.w) * 1.0;
    float3 _1833 = floor((_1366 - _379.light_cluster_BoundsMin.xyz) * _379.light_cluster_CellsCountByBoundsSizeAndPixelsPerCell.xyz);
    float _1835 = _1833.x;
    bool _1836 = _1835 < 0.0;
    bool _1843;
    if (!_1836)
    {
        _1843 = _1833.y < 0.0;
    }
    else
    {
        _1843 = _1836;
    }
    bool _1850;
    if (!_1843)
    {
        _1850 = _1833.z < 0.0;
    }
    else
    {
        _1850 = _1843;
    }
    bool _1859;
    if (!_1850)
    {
        _1859 = _1835 > _379.light_cluster_CellsMax.x;
    }
    else
    {
        _1859 = _1850;
    }
    bool _1868;
    if (!_1859)
    {
        _1868 = _1833.y > _379.light_cluster_CellsMax.y;
    }
    else
    {
        _1868 = _1859;
    }
    bool _1877;
    if (!_1868)
    {
        _1877 = _1833.z > _379.light_cluster_CellsMax.z;
    }
    else
    {
        _1877 = _1868;
    }
    float3 _3251;
    if (_1877)
    {
        _3251 = float3(0.0);
    }
    else
    {
        float _1884 = dot(_379.light_cluster_CellsDot.xyz, _1833);
        float _1889 = floor(_1884 * _379.light_cluster_TextureSize.y);
        float _1895 = _1884 - (_1889 * _379.light_cluster_TextureSize.x);
        float _1900 = (_1889 + 0.5) * _379.light_cluster_TextureSize.z;
        float3 _3241;
        _3241 = float3(0.0);
        float _2089;
        float3 _3240;
        float3 _3252;
        float _3236 = 0.5;
        for (;;)
        {
            if (_3236 < 3.0)
            {
                float4 _1789 = light_cluster_Texture.sample(light_cluster_TextureSmplr, float2(_379.light_cluster_TextureSize.y * (_1895 + _3236), _1900)) * 255.0;
                _3240 = _3241;
                float3 _2083;
                for (int _3237 = 0; _3237 < 4; _3240 = _2083, _3237++)
                {
                    if (_1789[_3237] <= 0.0)
                    {
                        break;
                    }
                    float _1970 = (_1789[_3237] + 0.5) * _379.light_cluster_InfoTextureInvSize.y;
                    float4 _1977 = light_cluster_InfoTexture.sample(light_cluster_InfoTextureSmplr, float2(0.5 * _379.light_cluster_InfoTextureInvSize.x, _1970));
                    float4 _1984 = light_cluster_InfoTexture.sample(light_cluster_InfoTextureSmplr, float2(1.5 * _379.light_cluster_InfoTextureInvSize.x, _1970));
                    float4 _1991 = light_cluster_InfoTexture.sample(light_cluster_InfoTextureSmplr, float2(2.5 * _379.light_cluster_InfoTextureInvSize.x, _1970));
                    float4 _1998 = light_cluster_InfoTexture.sample(light_cluster_InfoTextureSmplr, float2(3.5 * _379.light_cluster_InfoTextureInvSize.x, _1970));
                    float3 _2002 = _1977.xyz - _1366;
                    float3 _2004 = normalize(_2002);
                    float3 _2008 = normalize(_2004 + _1583);
                    float _2019 = dot(_2002, _2002);
                    float3 _2174 = cross(_1577, _2008);
                    float _2183 = fast::max(dot(_1577, _2008), 0.0) * _1757;
                    float _2191 = _1757 / fast::max(9.9999999747524270787835121154785e-07, dot(_2174, _2174) + (_2183 * _2183));
                    float _2031 = 1.0 / _1991.x;
                    float _2209 = _2019 * (_2031 * _2031);
                    float _2227 = fast::min(fast::max(1.0 - (_2209 * _2209), 0.0), 1.0);
                    float _2216 = (1.0 / (_2019 + 1.0)) * (_2227 * _2227);
                    float _3238;
                    if (_1977.w > 0.0)
                    {
                        float _2264 = fast::min(fast::max((dot(_2002 / float3(sqrt(_2019)), -_1998.xyz) - _1991.y) * _1991.z, 0.0), 1.0);
                        _3238 = _2216 * (_2264 * _2264);
                    }
                    else
                    {
                        _3238 = _2216;
                    }
                    _2083 = _3240 + ((((_1984.xyz * fast::max(dot(_1577, _2004), 0.0)) * _1984.w) * _3238) * (_1621 + (_1726 * (_1735 * (_2191 * _2191)))));
                }
                _2089 = _3236 + 1.0;
                if (_2089 > _379.light_cluster_CellsCountByBoundsSizeAndPixelsPerCell.w)
                {
                    _3252 = _3240;
                    break;
                }
                _3241 = _3240;
                _3236 = _2089;
                continue;
            }
            else
            {
                _3252 = _3241;
                break;
            }
        }
        _3251 = _3252;
    }
    float4 _1431 = float4(((((_500.cc_mainLitColor.xyz * fast::max(dot(_1577, _1588), 0.0)) * _500.cc_mainLitColor.w) * ((_1621 + (_1726 * (_1735 * (_1768 * _1768)))) * 1.0)) + (((mix(_500.cc_ambientSky.xyz, _500.cc_ambientGround.xyz, float3(fast::max(0.5 - (_1577.y * 0.5), 0.001000000047497451305389404296875))) * _500.cc_ambientSky.w) * _1561) * 1.0)) + _1360.xyz, _1350.w) + (float4(_3251, 1.0) * 1.0);
    float _2314 = _1373 * (_500.cc_ambientGround.w - 1.0);
    float3 _2320 = normalize(reflect(-_1583, _1518));
    float _3266;
    do
    {
        float _2455 = _379.light_ibl_posRange0.w * _379.light_ibl_posRange0.w;
        float3 _2458 = _379.light_ibl_posRange0.xyz - _1366;
        float _2461 = dot(_2458, _2458);
        float _2464 = dot(_2458, _2320);
        float _2471 = _2455 - (_2461 - (_2464 * _2464));
        if (_2471 < 0.0)
        {
            _3266 = 0.0;
            break;
        }
        float _2477 = sqrt(_2471);
        float _3265;
        if (_2461 < _2455)
        {
            _3265 = _2464 + _2477;
        }
        else
        {
            _3265 = _2464 - _2477;
        }
        if (_3265 < 0.0)
        {
            _3266 = 0.0;
            break;
        }
        _3266 = _3265;
        break;
    } while(false);
    float3 _3269;
    float _3270;
    if (_3266 > 0.0)
    {
        _3270 = 1.0 - smoothstep(0.60000002384185791015625, 1.0, length(_1366 - _379.light_ibl_posRange0.xyz) / _379.light_ibl_posRange0.w);
        _3269 = normalize((_1366 + (_2320 * _3266)) - _379.light_ibl_posRange0.xyz);
    }
    else
    {
        _3270 = 0.0;
        _3269 = _2320;
    }
    float4 _2503 = light_ibl_Texture0.sample(light_ibl_Texture0Smplr, _3269, level(_2314));
    float _2438 = 1.0 - _3270;
    float _3278;
    do
    {
        float _2598 = _379.light_ibl_posRange1.w * _379.light_ibl_posRange1.w;
        float3 _2601 = _379.light_ibl_posRange1.xyz - _1366;
        float _2604 = dot(_2601, _2601);
        float _2607 = dot(_2601, _2320);
        float _2614 = _2598 - (_2604 - (_2607 * _2607));
        if (_2614 < 0.0)
        {
            _3278 = 0.0;
            break;
        }
        float _2620 = sqrt(_2614);
        float _3277;
        if (_2604 < _2598)
        {
            _3277 = _2607 + _2620;
        }
        else
        {
            _3277 = _2607 - _2620;
        }
        if (_3277 < 0.0)
        {
            _3278 = 0.0;
            break;
        }
        _3278 = _3277;
        break;
    } while(false);
    float3 _3281;
    float _3282;
    if (_3278 > 0.0)
    {
        _3282 = 1.0 - smoothstep(0.60000002384185791015625, 1.0, length(_1366 - _379.light_ibl_posRange1.xyz) / _379.light_ibl_posRange1.w);
        _3281 = normalize((_1366 + (_2320 * _3278)) - _379.light_ibl_posRange1.xyz);
    }
    else
    {
        _3282 = 0.0;
        _3281 = _2320;
    }
    float4 _2646 = light_ibl_Texture1.sample(light_ibl_Texture1Smplr, _3281, level(_2314));
    float _2582 = _2438 * (1.0 - _3282);
    float _3290;
    do
    {
        float _2741 = _379.light_ibl_posRange2.w * _379.light_ibl_posRange2.w;
        float3 _2744 = _379.light_ibl_posRange2.xyz - _1366;
        float _2747 = dot(_2744, _2744);
        float _2750 = dot(_2744, _2320);
        float _2757 = _2741 - (_2747 - (_2750 * _2750));
        if (_2757 < 0.0)
        {
            _3290 = 0.0;
            break;
        }
        float _2763 = sqrt(_2757);
        float _3289;
        if (_2747 < _2741)
        {
            _3289 = _2750 + _2763;
        }
        else
        {
            _3289 = _2750 - _2763;
        }
        if (_3289 < 0.0)
        {
            _3290 = 0.0;
            break;
        }
        _3290 = _3289;
        break;
    } while(false);
    float3 _3293;
    float _3294;
    if (_3290 > 0.0)
    {
        _3294 = 1.0 - smoothstep(0.60000002384185791015625, 1.0, length(_1366 - _379.light_ibl_posRange2.xyz) / _379.light_ibl_posRange2.w);
        _3293 = normalize((_1366 + (_2320 * _3290)) - _379.light_ibl_posRange2.xyz);
    }
    else
    {
        _3294 = 0.0;
        _3293 = _2320;
    }
    float4 _2789 = light_ibl_Texture2.sample(light_ibl_Texture2Smplr, _3293, level(_2314));
    float4 _2805 = cc_environment.sample(cc_environmentSmplr, _2320, level(_2314));
    float3 _1447 = _1366 - _500.cc_cameraPos.xyz;
    float _2864 = fast::min(_500.cc_cameraPos.y, _379.fog_Parameters.z);
    float _2876 = _1447.y + (_500.cc_cameraPos.y - _2864);
    float3 _3225 = _1447;
    _3225.y = _2876;
    float _2880 = dot(_3225, _3225);
    float _3003 = 1.0 / sqrt(_2880);
    float _2885 = _2880 * _3003;
    float _2899 = fast::max(0.0, _379.fog_Parameters.w);
    float _3310;
    float _3311;
    float _3312;
    float _3313;
    if (_2899 > 0.0)
    {
        float _2905 = _2899 * _3003;
        float _2909 = _2905 * _2876;
        float _2913 = _2864 + _2909;
        _3313 = (1.0 - _2905) * _2885;
        _3312 = _379.fog_Parameters2.z * exp2(-fast::max(-127.0, _379.fog_Parameters2.y * (_2913 - _379.fog_Parameters2.w)));
        _3311 = _379.fog_Parameters3.x * exp2(-fast::max(-127.0, _379.fog_Parameters.y * (_2913 - _379.fog_Parameters3.y)));
        _3310 = _2876 - _2909;
    }
    else
    {
        _3313 = _2885;
        _3312 = _379.fog_Parameters2.x;
        _3311 = _379.fog_Parameters.x;
        _3310 = _2876;
    }
    float _3012 = fast::max(-127.0, _379.fog_Parameters.y * _3310);
    float _3038 = fast::max(-127.0, _379.fog_Parameters2.y * _3310);
    bool _2977 = _379.fog_Parameters3.w > 0.0;
    bool _2984;
    if (_2977)
    {
        _2984 = _2885 > _379.fog_Parameters3.w;
    }
    else
    {
        _2984 = _2977;
    }
    float _3321 = _2984 ? 1.0 : fast::max(fast::min(fast::max(exp2(-(((_3311 * ((abs(_3012) > 0.00999999977648258209228515625) ? ((1.0 - exp2(-_3012)) / _3012) : (0.693147182464599609375 - (0.808403313159942626953125 * _3012)))) + (_3312 * ((abs(_3038) > 0.00999999977648258209228515625) ? ((1.0 - exp2(-_3038)) / _3038) : (0.693147182464599609375 - (0.808403313159942626953125 * _3038))))) * _3313)), 0.0), 1.0), _379.fog_ColorParameters.w);
    float3 _1457 = ((_1431.xyz + (((((((_2503.xyz * pow(1.10000002384185791015625, (_2503.w * 255.0) - 128.0)).xyz * _1659) * _3270) * 1.0) + ((((_2646.xyz * pow(1.10000002384185791015625, (_2646.w * 255.0) - 128.0)).xyz * _1659) * _3282) * _2438)) + ((((_2789.xyz * pow(1.10000002384185791015625, (_2789.w * 255.0) - 128.0)).xyz * _1659) * _3294) * _2582)) + ((((_2805.xyz * pow(1.10000002384185791015625, (_2805.w * 255.0) - 128.0)).xyz * (_2582 * (1.0 - _3294))) * _1659) * 0.20000000298023223876953125))).xyz * _3321) + float4(_379.fog_ColorParameters.xyz * (1.0 - _3321), _3321).xyz;
    out.fragColor0 = float4(_1457.x, _1457.y, _1457.z, _1431.w);
    return out;
}



)";
            shader = [NSString stringWithUTF8String:str.c_str()];
        }
        if (@available(iOS 11.0, *)) {
            library = [mtlDevice newLibraryWithSource:shader options:opts error:&error];
            if (!library) {
                CC_LOG_ERROR("Can not compile %s shader: %s", shaderStage.c_str(), [[error localizedDescription] UTF8String]);
                CC_LOG_ERROR("%s", stage.source.c_str());
                [opts release];
                return false;
            }
        } else {
            //delayed instance and pretend tobe specialized function.
            _gpuShader->specializeColor = false;
            _gpuShader->shaderSrc = [shader retain];
            [opts release];
            CC_ASSERT(_gpuShader->shaderSrc != nil);
            return true;
        }
    } else {
        library = [mtlDevice newLibraryWithSource:shader options:opts error:&error];
        if (!library) {
            CC_LOG_ERROR("Can not compile %s shader: %s", shaderStage.c_str(), [[error localizedDescription] UTF8String]);
            CC_LOG_ERROR("%s", stage.source.c_str());
            [opts release];
            return false;
        }
    }

    [opts release];

    if (isVertexShader) {
        _vertFunction = [library newFunctionWithName:@"main0"];
        if (!_vertFunction) {
            [library release];
            CC_LOG_ERROR("Can not create vertex function: main0");
            return false;
        }
    } else if (isFragmentShader) {
        _fragFunction = [library newFunctionWithName:@"main0"];
        if (!_fragFunction) {
            [library release];
            CC_LOG_ERROR("Can not create fragment function: main0");
            return false;
        }
    } else if (isComputeShader) {
        _cmptFunction = [library newFunctionWithName:@"main0"];
        if (!_cmptFunction) {
            [library release];
            CC_LOG_ERROR("Can not create compute function: main0");
            return false;
        }
    } else {
        [library release];
        CC_LOG_ERROR("Shader type not supported yet!");
        return false;
    }

#ifdef DEBUG_SHADER
    if (isVertexShader) {
        _vertGlslShader = stage.source;
        _vertMtlShader = mtlShader;
    } else if (isFragmenShader) {
        _fragGlslShader = stage.source;
        _fragMtlShader = mtlShader;
    } else if (isComputeShader) {
        _cmptGlslShader = stage.source;
        _cmptMtlShader = mtlShader;
    }
#endif
    return true;
}

id<MTLFunction> CCMTLShader::getSpecializedFragFunction(uint32_t* index, int* val, uint32_t count) {
    uint32_t notEvenHash = 0;
    for (size_t i = 0; i < count; i++) {
        notEvenHash += val[i] * std::pow(10, index[i]);
    }
    NSString* hashStr = [NSString stringWithFormat:@"%d", notEvenHash];
    id<MTLFunction> specFunc = [_specializedFragFuncs objectForKey:hashStr];

    if (!specFunc) {
        if (_gpuShader->specializeColor) {
            MTLFunctionConstantValues* constantValues = [MTLFunctionConstantValues new];
            for (size_t i = 0; i < count; i++) {
                [constantValues setConstantValue:&val[i] type:MTLDataTypeInt atIndex:index[i]];
            }

            NSError* error = nil;
            id<MTLFunction> specFragFunc = [_fragLibrary newFunctionWithName:@"main0" constantValues:constantValues error:&error];
            [constantValues release];
            if (!specFragFunc) {
                CC_LOG_ERROR("Can not specialize shader: %s", [[error localizedDescription] UTF8String]);
            }
            [_specializedFragFuncs setObject:specFragFunc forKey:hashStr];
        } else {
            NSString* res = nil;
            for (size_t i = 0; i < count; i++) {
                NSString* targetStr = [NSString stringWithFormat:@"(indexOffset%u)", static_cast<unsigned int>(i)];
                NSString* index = [NSString stringWithFormat:@"(%u)", static_cast<unsigned int>(i)];
                res = [_gpuShader->shaderSrc stringByReplacingOccurrencesOfString:targetStr withString:index];
            }
            id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
            NSError* error = nil;
            MTLCompileOptions* opts = [[MTLCompileOptions alloc] init];
            // always current
            if (_fragLibrary) {
                [_fragLibrary release];
            }
            _fragLibrary = [mtlDevice newLibraryWithSource:res options:opts error:&error];
            if (!_fragLibrary) {
                CC_LOG_ERROR("Can not compile frag shader: %s", [[error localizedDescription] UTF8String]);
            }
            [opts release];
            _fragFunction = [_fragLibrary newFunctionWithName:@"main0"];
            if (!_fragFunction) {
                [_fragLibrary release];
                CC_LOG_ERROR("Can not create fragment function: main0");
            }

            [_specializedFragFuncs setObject:_fragFunction forKey:hashStr];
        }
    }
    return [_specializedFragFuncs valueForKey:hashStr];
}

uint32_t CCMTLShader::getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint32_t stream) {
    if (hasFlag(stage, ShaderStageFlagBit::VERTEX)) {
        return _availableVertexBufferBindingIndex.at(stream);
    }

    if (hasFlag(stage, ShaderStageFlagBit::FRAGMENT)) {
        return _availableFragmentBufferBindingIndex.at(stream);
    }

    CC_LOG_ERROR("getAvailableBufferBindingIndex: invalid shader stage %d", stage);
    return 0;
}

void CCMTLShader::setAvailableBufferBindingIndex() {
    uint32_t usedVertexBufferBindingIndexes = 0;
    uint32_t usedFragmentBufferBindingIndexes = 0;
    uint32_t vertexBindingCount = 0;
    uint32_t fragmentBindingCount = 0;
    for (const auto& block : _gpuShader->blocks) {
        if (hasFlag(block.second.stages, ShaderStageFlagBit::VERTEX)) {
            vertexBindingCount++;
            usedVertexBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
        if (hasFlag(block.second.stages, ShaderStageFlagBit::FRAGMENT)) {
            fragmentBindingCount++;
            usedFragmentBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
    }

    auto maxBufferBindingIndex = CCMTLDevice::getInstance()->getMaximumBufferBindingIndex();
    _availableVertexBufferBindingIndex.resize(maxBufferBindingIndex - vertexBindingCount);
    _availableFragmentBufferBindingIndex.resize(maxBufferBindingIndex - fragmentBindingCount);
    uint32_t availableVertexBufferBit = ~usedVertexBufferBindingIndexes;
    uint32_t availableFragmentBufferBit = ~usedFragmentBufferBindingIndexes;
    int theBit = maxBufferBindingIndex - 1;
    uint32_t i = 0, j = 0;
    for (; theBit >= 0; theBit--) {
        if ((availableVertexBufferBit & (1 << theBit))) {
            _availableVertexBufferBindingIndex[i++] = theBit;
        }

        if ((availableFragmentBufferBit & (1 << theBit))) {
            _availableFragmentBufferBindingIndex[j++] = theBit;
        }
    }
}

} // namespace gfx
} // namespace cc
