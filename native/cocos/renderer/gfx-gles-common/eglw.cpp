/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#if (CC_PLATFORM != CC_PLATFORM_MAC_IOS)
#define EGL_EGL_PROTOTYPES 0
#include <EGL/egl.h>
#include <EGL/eglext.h>
#include <EGL/eglplatform.h>
#endif

#include "eglw.h"

#if (CC_PLATFORM != CC_PLATFORM_MAC_IOS)
/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated from EGL spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */

/* EGLW_GENERATE_EGL_DEFINITION */
PFNEGLGETPROCADDRESSPROC eglGetProcAddress;

/* EGL_VERSION_1_0 */
PFNEGLCHOOSECONFIGPROC eglChooseConfig;
PFNEGLCOPYBUFFERSPROC eglCopyBuffers;
PFNEGLCREATECONTEXTPROC eglCreateContext;
PFNEGLCREATEPBUFFERSURFACEPROC eglCreatePbufferSurface;
PFNEGLCREATEPIXMAPSURFACEPROC eglCreatePixmapSurface;
PFNEGLCREATEWINDOWSURFACEPROC eglCreateWindowSurface;
PFNEGLDESTROYCONTEXTPROC eglDestroyContext;
PFNEGLDESTROYSURFACEPROC eglDestroySurface;
PFNEGLGETCONFIGATTRIBPROC eglGetConfigAttrib;
PFNEGLGETCONFIGSPROC eglGetConfigs;
PFNEGLGETCURRENTDISPLAYPROC eglGetCurrentDisplay;
PFNEGLGETCURRENTSURFACEPROC eglGetCurrentSurface;
PFNEGLGETDISPLAYPROC eglGetDisplay;
PFNEGLGETERRORPROC eglGetError;
PFNEGLINITIALIZEPROC eglInitialize;
PFNEGLMAKECURRENTPROC eglMakeCurrent;
PFNEGLQUERYCONTEXTPROC eglQueryContext;
PFNEGLQUERYSTRINGPROC eglQueryString;
PFNEGLQUERYSURFACEPROC eglQuerySurface;
PFNEGLSWAPBUFFERSPROC eglSwapBuffers;
PFNEGLTERMINATEPROC eglTerminate;
PFNEGLWAITGLPROC eglWaitGL;
PFNEGLWAITNATIVEPROC eglWaitNative;


/* EGL_VERSION_1_1 */
PFNEGLBINDTEXIMAGEPROC eglBindTexImage;
PFNEGLRELEASETEXIMAGEPROC eglReleaseTexImage;
PFNEGLSURFACEATTRIBPROC eglSurfaceAttrib;
PFNEGLSWAPINTERVALPROC eglSwapInterval;


/* EGL_VERSION_1_2 */
PFNEGLBINDAPIPROC eglBindAPI;
PFNEGLQUERYAPIPROC eglQueryAPI;
PFNEGLCREATEPBUFFERFROMCLIENTBUFFERPROC eglCreatePbufferFromClientBuffer;
PFNEGLRELEASETHREADPROC eglReleaseThread;
PFNEGLWAITCLIENTPROC eglWaitClient;


/* EGL_VERSION_1_3 */

/* EGL_VERSION_1_4 */
PFNEGLGETCURRENTCONTEXTPROC eglGetCurrentContext;


/* EGL_VERSION_1_5 */
PFNEGLCREATESYNCPROC eglCreateSync;
PFNEGLDESTROYSYNCPROC eglDestroySync;
PFNEGLCLIENTWAITSYNCPROC eglClientWaitSync;
PFNEGLGETSYNCATTRIBPROC eglGetSyncAttrib;

PFNEGLCREATEIMAGEPROC eglCreateImage;
PFNEGLDESTROYIMAGEPROC eglDestroyImage;

PFNEGLGETPLATFORMDISPLAYPROC eglGetPlatformDisplay;
PFNEGLCREATEPLATFORMWINDOWSURFACEPROC eglCreatePlatformWindowSurface;
PFNEGLCREATEPLATFORMPIXMAPSURFACEPROC eglCreatePlatformPixmapSurface;

PFNEGLWAITSYNCPROC eglWaitSync;


#if defined(EGL_ANDROID_blob_cache)
PFNEGLSETBLOBCACHEFUNCSANDROIDPROC eglSetBlobCacheFuncsANDROID;
#endif /* defined(EGL_ANDROID_blob_cache) */

#if defined(EGL_ANDROID_create_native_client_buffer)
PFNEGLCREATENATIVECLIENTBUFFERANDROIDPROC eglCreateNativeClientBufferANDROID;
#endif /* defined(EGL_ANDROID_create_native_client_buffer) */

#if defined(EGL_ANDROID_get_native_client_buffer)
PFNEGLGETNATIVECLIENTBUFFERANDROIDPROC eglGetNativeClientBufferANDROID;
#endif /* defined(EGL_ANDROID_get_native_client_buffer) */

#if defined(EGL_ANDROID_native_fence_sync)
PFNEGLDUPNATIVEFENCEFDANDROIDPROC eglDupNativeFenceFDANDROID;
#endif /* defined(EGL_ANDROID_native_fence_sync) */

#if defined(EGL_ANDROID_presentation_time)
PFNEGLPRESENTATIONTIMEANDROIDPROC eglPresentationTimeANDROID;
#endif /* defined(EGL_ANDROID_presentation_time) */

#if defined(EGL_ANDROID_get_frame_timestamps)
PFNEGLGETCOMPOSITORTIMINGSUPPORTEDANDROIDPROC eglGetCompositorTimingSupportedANDROID;
PFNEGLGETCOMPOSITORTIMINGANDROIDPROC eglGetCompositorTimingANDROID;
PFNEGLGETNEXTFRAMEIDANDROIDPROC eglGetNextFrameIdANDROID;
PFNEGLGETFRAMETIMESTAMPSUPPORTEDANDROIDPROC eglGetFrameTimestampSupportedANDROID;
PFNEGLGETFRAMETIMESTAMPSANDROIDPROC eglGetFrameTimestampsANDROID;
#endif /* defined(EGL_ANDROID_get_frame_timestamps) */

#if defined(EGL_ANGLE_query_surface_pointer)
PFNEGLQUERYSURFACEPOINTERANGLEPROC eglQuerySurfacePointerANGLE;
#endif /* defined(EGL_ANGLE_query_surface_pointer) */

#if defined(EGL_EXT_client_sync)
PFNEGLCLIENTSIGNALSYNCEXTPROC eglClientSignalSyncEXT;
#endif /* defined(EGL_EXT_client_sync) */

#if defined(EGL_EXT_device_base)
PFNEGLQUERYDEVICEATTRIBEXTPROC eglQueryDeviceAttribEXT;
PFNEGLQUERYDEVICESTRINGEXTPROC eglQueryDeviceStringEXT;
PFNEGLQUERYDEVICESEXTPROC eglQueryDevicesEXT;
PFNEGLQUERYDISPLAYATTRIBEXTPROC eglQueryDisplayAttribEXT;
#endif /* defined(EGL_EXT_device_base) */

#if defined(EGL_EXT_image_dma_buf_import_modifiers)
PFNEGLQUERYDMABUFFORMATSEXTPROC eglQueryDmaBufFormatsEXT;
PFNEGLQUERYDMABUFMODIFIERSEXTPROC eglQueryDmaBufModifiersEXT;
#endif /* defined(EGL_EXT_image_dma_buf_import_modifiers) */

#if defined(EGL_EXT_output_base)
PFNEGLGETOUTPUTLAYERSEXTPROC eglGetOutputLayersEXT;
PFNEGLGETOUTPUTPORTSEXTPROC eglGetOutputPortsEXT;
PFNEGLOUTPUTLAYERATTRIBEXTPROC eglOutputLayerAttribEXT;
PFNEGLQUERYOUTPUTLAYERATTRIBEXTPROC eglQueryOutputLayerAttribEXT;
PFNEGLQUERYOUTPUTLAYERSTRINGEXTPROC eglQueryOutputLayerStringEXT;
PFNEGLOUTPUTPORTATTRIBEXTPROC eglOutputPortAttribEXT;
PFNEGLQUERYOUTPUTPORTATTRIBEXTPROC eglQueryOutputPortAttribEXT;
PFNEGLQUERYOUTPUTPORTSTRINGEXTPROC eglQueryOutputPortStringEXT;
#endif /* defined(EGL_EXT_output_base) */

#if defined(EGL_EXT_platform_base)
PFNEGLGETPLATFORMDISPLAYEXTPROC eglGetPlatformDisplayEXT;
PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC eglCreatePlatformWindowSurfaceEXT;
PFNEGLCREATEPLATFORMPIXMAPSURFACEEXTPROC eglCreatePlatformPixmapSurfaceEXT;
#endif /* defined(EGL_EXT_platform_base) */

#if defined(EGL_EXT_stream_consumer_egloutput)
PFNEGLSTREAMCONSUMEROUTPUTEXTPROC eglStreamConsumerOutputEXT;
#endif /* defined(EGL_EXT_stream_consumer_egloutput) */

#if defined(EGL_EXT_swap_buffers_with_damage)
PFNEGLSWAPBUFFERSWITHDAMAGEEXTPROC eglSwapBuffersWithDamageEXT;
#endif /* defined(EGL_EXT_swap_buffers_with_damage) */

#if defined(EGL_EXT_sync_reuse)
PFNEGLUNSIGNALSYNCEXTPROC eglUnsignalSyncEXT;
#endif /* defined(EGL_EXT_sync_reuse) */

#if defined(EGL_HI_clientpixmap)
PFNEGLCREATEPIXMAPSURFACEHIPROC eglCreatePixmapSurfaceHI;
#endif /* defined(EGL_HI_clientpixmap) */

#if defined(EGL_KHR_cl_event2)
PFNEGLCREATESYNC64KHRPROC eglCreateSync64KHR;
#endif /* defined(EGL_KHR_cl_event2) */

#if defined(EGL_KHR_debug)
PFNEGLDEBUGMESSAGECONTROLKHRPROC eglDebugMessageControlKHR;
PFNEGLQUERYDEBUGKHRPROC eglQueryDebugKHR;
PFNEGLLABELOBJECTKHRPROC eglLabelObjectKHR;
#endif /* defined(EGL_KHR_debug) */

#if defined(EGL_KHR_display_reference)
PFNEGLQUERYDISPLAYATTRIBKHRPROC eglQueryDisplayAttribKHR;
#endif /* defined(EGL_KHR_display_reference) */

#if defined(EGL_KHR_fence_sync)
PFNEGLCREATESYNCKHRPROC eglCreateSyncKHR;
PFNEGLDESTROYSYNCKHRPROC eglDestroySyncKHR;
PFNEGLCLIENTWAITSYNCKHRPROC eglClientWaitSyncKHR;
PFNEGLGETSYNCATTRIBKHRPROC eglGetSyncAttribKHR;
#endif /* defined(EGL_KHR_fence_sync) */

#if defined(EGL_KHR_image)
PFNEGLCREATEIMAGEKHRPROC eglCreateImageKHR;
PFNEGLDESTROYIMAGEKHRPROC eglDestroyImageKHR;
#endif /* defined(EGL_KHR_image) */

#if defined(EGL_KHR_lock_surface)
PFNEGLLOCKSURFACEKHRPROC eglLockSurfaceKHR;
PFNEGLUNLOCKSURFACEKHRPROC eglUnlockSurfaceKHR;
#endif /* defined(EGL_KHR_lock_surface) */

#if defined(EGL_KHR_lock_surface3)
PFNEGLQUERYSURFACE64KHRPROC eglQuerySurface64KHR;
#endif /* defined(EGL_KHR_lock_surface3) */

#if defined(EGL_KHR_partial_update)
PFNEGLSETDAMAGEREGIONKHRPROC eglSetDamageRegionKHR;
#endif /* defined(EGL_KHR_partial_update) */

#if defined(EGL_KHR_reusable_sync)
PFNEGLSIGNALSYNCKHRPROC eglSignalSyncKHR;
#endif /* defined(EGL_KHR_reusable_sync) */

#if defined(EGL_KHR_stream)
PFNEGLCREATESTREAMKHRPROC eglCreateStreamKHR;
PFNEGLDESTROYSTREAMKHRPROC eglDestroyStreamKHR;
PFNEGLSTREAMATTRIBKHRPROC eglStreamAttribKHR;
PFNEGLQUERYSTREAMKHRPROC eglQueryStreamKHR;
PFNEGLQUERYSTREAMU64KHRPROC eglQueryStreamu64KHR;
#endif /* defined(EGL_KHR_stream) */

#if defined(EGL_KHR_stream_attrib)
PFNEGLCREATESTREAMATTRIBKHRPROC eglCreateStreamAttribKHR;
PFNEGLSETSTREAMATTRIBKHRPROC eglSetStreamAttribKHR;
PFNEGLQUERYSTREAMATTRIBKHRPROC eglQueryStreamAttribKHR;
PFNEGLSTREAMCONSUMERACQUIREATTRIBKHRPROC eglStreamConsumerAcquireAttribKHR;
PFNEGLSTREAMCONSUMERRELEASEATTRIBKHRPROC eglStreamConsumerReleaseAttribKHR;
#endif /* defined(EGL_KHR_stream_attrib) */

#if defined(EGL_KHR_stream_consumer_gltexture)
PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALKHRPROC eglStreamConsumerGLTextureExternalKHR;
PFNEGLSTREAMCONSUMERACQUIREKHRPROC eglStreamConsumerAcquireKHR;
PFNEGLSTREAMCONSUMERRELEASEKHRPROC eglStreamConsumerReleaseKHR;
#endif /* defined(EGL_KHR_stream_consumer_gltexture) */

#if defined(EGL_KHR_stream_cross_process_fd)
PFNEGLGETSTREAMFILEDESCRIPTORKHRPROC eglGetStreamFileDescriptorKHR;
PFNEGLCREATESTREAMFROMFILEDESCRIPTORKHRPROC eglCreateStreamFromFileDescriptorKHR;
#endif /* defined(EGL_KHR_stream_cross_process_fd) */

#if defined(EGL_KHR_stream_fifo)
PFNEGLQUERYSTREAMTIMEKHRPROC eglQueryStreamTimeKHR;
#endif /* defined(EGL_KHR_stream_fifo) */

#if defined(EGL_KHR_stream_producer_eglsurface)
PFNEGLCREATESTREAMPRODUCERSURFACEKHRPROC eglCreateStreamProducerSurfaceKHR;
#endif /* defined(EGL_KHR_stream_producer_eglsurface) */

#if defined(EGL_KHR_swap_buffers_with_damage)
PFNEGLSWAPBUFFERSWITHDAMAGEKHRPROC eglSwapBuffersWithDamageKHR;
#endif /* defined(EGL_KHR_swap_buffers_with_damage) */

#if defined(EGL_KHR_wait_sync)
PFNEGLWAITSYNCKHRPROC eglWaitSyncKHR;
#endif /* defined(EGL_KHR_wait_sync) */

#if defined(EGL_MESA_drm_image)
PFNEGLCREATEDRMIMAGEMESAPROC eglCreateDRMImageMESA;
PFNEGLEXPORTDRMIMAGEMESAPROC eglExportDRMImageMESA;
#endif /* defined(EGL_MESA_drm_image) */

#if defined(EGL_MESA_image_dma_buf_export)
PFNEGLEXPORTDMABUFIMAGEQUERYMESAPROC eglExportDMABUFImageQueryMESA;
PFNEGLEXPORTDMABUFIMAGEMESAPROC eglExportDMABUFImageMESA;
#endif /* defined(EGL_MESA_image_dma_buf_export) */

#if defined(EGL_MESA_query_driver)
PFNEGLGETDISPLAYDRIVERCONFIGPROC eglGetDisplayDriverConfig;
PFNEGLGETDISPLAYDRIVERNAMEPROC eglGetDisplayDriverName;
#endif /* defined(EGL_MESA_query_driver) */

#if defined(EGL_NOK_swap_region)
PFNEGLSWAPBUFFERSREGIONNOKPROC eglSwapBuffersRegionNOK;
#endif /* defined(EGL_NOK_swap_region) */

#if defined(EGL_NOK_swap_region2)
PFNEGLSWAPBUFFERSREGION2NOKPROC eglSwapBuffersRegion2NOK;
#endif /* defined(EGL_NOK_swap_region2) */

#if defined(EGL_NV_native_query)
PFNEGLQUERYNATIVEDISPLAYNVPROC eglQueryNativeDisplayNV;
PFNEGLQUERYNATIVEWINDOWNVPROC eglQueryNativeWindowNV;
PFNEGLQUERYNATIVEPIXMAPNVPROC eglQueryNativePixmapNV;
#endif /* defined(EGL_NV_native_query) */

#if defined(EGL_NV_post_sub_buffer)
PFNEGLPOSTSUBBUFFERNVPROC eglPostSubBufferNV;
#endif /* defined(EGL_NV_post_sub_buffer) */

#if defined(EGL_NV_stream_consumer_gltexture_yuv)
PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALATTRIBSNVPROC eglStreamConsumerGLTextureExternalAttribsNV;
#endif /* defined(EGL_NV_stream_consumer_gltexture_yuv) */

#if defined(EGL_NV_stream_consumer_eglimage)
PFNEGLSTREAMIMAGECONSUMERCONNECTNVPROC eglStreamImageConsumerConnectNV;
PFNEGLQUERYSTREAMCONSUMEREVENTNVPROC eglQueryStreamConsumerEventNV;
PFNEGLSTREAMACQUIREIMAGENVPROC eglStreamAcquireImageNV;
PFNEGLSTREAMRELEASEIMAGENVPROC eglStreamReleaseImageNV;
#endif /* defined(EGL_NV_stream_consumer_eglimage) */

#if defined(EGL_NV_stream_flush)
PFNEGLSTREAMFLUSHNVPROC eglStreamFlushNV;
#endif /* defined(EGL_NV_stream_flush) */

#if defined(EGL_NV_stream_metadata)
PFNEGLQUERYDISPLAYATTRIBNVPROC eglQueryDisplayAttribNV;
PFNEGLSETSTREAMMETADATANVPROC eglSetStreamMetadataNV;
PFNEGLQUERYSTREAMMETADATANVPROC eglQueryStreamMetadataNV;
#endif /* defined(EGL_NV_stream_metadata) */

#if defined(EGL_NV_stream_reset)
PFNEGLRESETSTREAMNVPROC eglResetStreamNV;
#endif /* defined(EGL_NV_stream_reset) */

#if defined(EGL_NV_stream_sync)
PFNEGLCREATESTREAMSYNCNVPROC eglCreateStreamSyncNV;
#endif /* defined(EGL_NV_stream_sync) */

#if defined(EGL_NV_sync)
PFNEGLCREATEFENCESYNCNVPROC eglCreateFenceSyncNV;
PFNEGLDESTROYSYNCNVPROC eglDestroySyncNV;
PFNEGLFENCENVPROC eglFenceNV;
PFNEGLCLIENTWAITSYNCNVPROC eglClientWaitSyncNV;
PFNEGLSIGNALSYNCNVPROC eglSignalSyncNV;
PFNEGLGETSYNCATTRIBNVPROC eglGetSyncAttribNV;
#endif /* defined(EGL_NV_sync) */

#if defined(EGL_NV_system_time)
PFNEGLGETSYSTEMTIMEFREQUENCYNVPROC eglGetSystemTimeFrequencyNV;
PFNEGLGETSYSTEMTIMENVPROC eglGetSystemTimeNV;
#endif /* defined(EGL_NV_system_time) */

#if defined(EGL_EXT_compositor)
PFNEGLCOMPOSITORSETCONTEXTLISTEXTPROC eglCompositorSetContextListEXT;
PFNEGLCOMPOSITORSETCONTEXTATTRIBUTESEXTPROC eglCompositorSetContextAttributesEXT;
PFNEGLCOMPOSITORSETWINDOWLISTEXTPROC eglCompositorSetWindowListEXT;
PFNEGLCOMPOSITORSETWINDOWATTRIBUTESEXTPROC eglCompositorSetWindowAttributesEXT;
PFNEGLCOMPOSITORBINDTEXWINDOWEXTPROC eglCompositorBindTexWindowEXT;
PFNEGLCOMPOSITORSETSIZEEXTPROC eglCompositorSetSizeEXT;
PFNEGLCOMPOSITORSWAPPOLICYEXTPROC eglCompositorSwapPolicyEXT;
#endif /* defined(EGL_EXT_compositor) */

#if defined(EGL_WL_bind_wayland_display)
PFNEGLBINDWAYLANDDISPLAYWLPROC eglBindWaylandDisplayWL;
PFNEGLUNBINDWAYLANDDISPLAYWLPROC eglUnbindWaylandDisplayWL;
PFNEGLQUERYWAYLANDBUFFERWLPROC eglQueryWaylandBufferWL;
#endif /* defined(EGL_WL_bind_wayland_display) */

#if defined(EGL_WL_create_wayland_buffer_from_image)
PFNEGLCREATEWAYLANDBUFFERFROMIMAGEWLPROC eglCreateWaylandBufferFromImageWL;
#endif /* defined(EGL_WL_create_wayland_buffer_from_image) */

/* EGLW_GENERATE_EGL_DEFINITION */

/**
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 * The above section is auto-generated from EGL spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 */
#endif

void eglwLoadProcs(PFNEGLWLOADPROC eglwLoad) {
#if (CC_PLATFORM != CC_PLATFORM_MAC_IOS)
    /**
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     * The following section is auto-generated from EGL spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     */

    /* EGLW_GENERATE_EGL_LOAD */
    eglGetProcAddress = (PFNEGLGETPROCADDRESSPROC)eglwLoad("eglGetProcAddress");

    /* EGL_VERSION_1_0 */
    eglChooseConfig = (PFNEGLCHOOSECONFIGPROC)eglwLoad("eglChooseConfig");
    eglCopyBuffers = (PFNEGLCOPYBUFFERSPROC)eglwLoad("eglCopyBuffers");
    eglCreateContext = (PFNEGLCREATECONTEXTPROC)eglwLoad("eglCreateContext");
    eglCreatePbufferSurface = (PFNEGLCREATEPBUFFERSURFACEPROC)eglwLoad("eglCreatePbufferSurface");
    eglCreatePixmapSurface = (PFNEGLCREATEPIXMAPSURFACEPROC)eglwLoad("eglCreatePixmapSurface");
    eglCreateWindowSurface = (PFNEGLCREATEWINDOWSURFACEPROC)eglwLoad("eglCreateWindowSurface");
    eglDestroyContext = (PFNEGLDESTROYCONTEXTPROC)eglwLoad("eglDestroyContext");
    eglDestroySurface = (PFNEGLDESTROYSURFACEPROC)eglwLoad("eglDestroySurface");
    eglGetConfigAttrib = (PFNEGLGETCONFIGATTRIBPROC)eglwLoad("eglGetConfigAttrib");
    eglGetConfigs = (PFNEGLGETCONFIGSPROC)eglwLoad("eglGetConfigs");
    eglGetCurrentDisplay = (PFNEGLGETCURRENTDISPLAYPROC)eglwLoad("eglGetCurrentDisplay");
    eglGetCurrentSurface = (PFNEGLGETCURRENTSURFACEPROC)eglwLoad("eglGetCurrentSurface");
    eglGetDisplay = (PFNEGLGETDISPLAYPROC)eglwLoad("eglGetDisplay");
    eglGetError = (PFNEGLGETERRORPROC)eglwLoad("eglGetError");
    eglInitialize = (PFNEGLINITIALIZEPROC)eglwLoad("eglInitialize");
    eglMakeCurrent = (PFNEGLMAKECURRENTPROC)eglwLoad("eglMakeCurrent");
    eglQueryContext = (PFNEGLQUERYCONTEXTPROC)eglwLoad("eglQueryContext");
    eglQueryString = (PFNEGLQUERYSTRINGPROC)eglwLoad("eglQueryString");
    eglQuerySurface = (PFNEGLQUERYSURFACEPROC)eglwLoad("eglQuerySurface");
    eglSwapBuffers = (PFNEGLSWAPBUFFERSPROC)eglwLoad("eglSwapBuffers");
    eglTerminate = (PFNEGLTERMINATEPROC)eglwLoad("eglTerminate");
    eglWaitGL = (PFNEGLWAITGLPROC)eglwLoad("eglWaitGL");
    eglWaitNative = (PFNEGLWAITNATIVEPROC)eglwLoad("eglWaitNative");


    /* EGL_VERSION_1_1 */
    eglBindTexImage = (PFNEGLBINDTEXIMAGEPROC)eglwLoad("eglBindTexImage");
    eglReleaseTexImage = (PFNEGLRELEASETEXIMAGEPROC)eglwLoad("eglReleaseTexImage");
    eglSurfaceAttrib = (PFNEGLSURFACEATTRIBPROC)eglwLoad("eglSurfaceAttrib");
    eglSwapInterval = (PFNEGLSWAPINTERVALPROC)eglwLoad("eglSwapInterval");


    /* EGL_VERSION_1_2 */
    eglBindAPI = (PFNEGLBINDAPIPROC)eglwLoad("eglBindAPI");
    eglQueryAPI = (PFNEGLQUERYAPIPROC)eglwLoad("eglQueryAPI");
    eglCreatePbufferFromClientBuffer = (PFNEGLCREATEPBUFFERFROMCLIENTBUFFERPROC)eglwLoad("eglCreatePbufferFromClientBuffer");
    eglReleaseThread = (PFNEGLRELEASETHREADPROC)eglwLoad("eglReleaseThread");
    eglWaitClient = (PFNEGLWAITCLIENTPROC)eglwLoad("eglWaitClient");


    /* EGL_VERSION_1_3 */

    /* EGL_VERSION_1_4 */
    eglGetCurrentContext = (PFNEGLGETCURRENTCONTEXTPROC)eglwLoad("eglGetCurrentContext");


    /* EGL_VERSION_1_5 */
    eglCreateSync = (PFNEGLCREATESYNCPROC)eglwLoad("eglCreateSync");
    eglDestroySync = (PFNEGLDESTROYSYNCPROC)eglwLoad("eglDestroySync");
    eglClientWaitSync = (PFNEGLCLIENTWAITSYNCPROC)eglwLoad("eglClientWaitSync");
    eglGetSyncAttrib = (PFNEGLGETSYNCATTRIBPROC)eglwLoad("eglGetSyncAttrib");

    eglCreateImage = (PFNEGLCREATEIMAGEPROC)eglwLoad("eglCreateImage");
    eglDestroyImage = (PFNEGLDESTROYIMAGEPROC)eglwLoad("eglDestroyImage");

    eglGetPlatformDisplay = (PFNEGLGETPLATFORMDISPLAYPROC)eglwLoad("eglGetPlatformDisplay");
    eglCreatePlatformWindowSurface = (PFNEGLCREATEPLATFORMWINDOWSURFACEPROC)eglwLoad("eglCreatePlatformWindowSurface");
    eglCreatePlatformPixmapSurface = (PFNEGLCREATEPLATFORMPIXMAPSURFACEPROC)eglwLoad("eglCreatePlatformPixmapSurface");

    eglWaitSync = (PFNEGLWAITSYNCPROC)eglwLoad("eglWaitSync");


#if defined(EGL_ANDROID_blob_cache)
    eglSetBlobCacheFuncsANDROID = (PFNEGLSETBLOBCACHEFUNCSANDROIDPROC)eglwLoad("eglSetBlobCacheFuncsANDROID");
#endif /* defined(EGL_ANDROID_blob_cache) */

#if defined(EGL_ANDROID_create_native_client_buffer)
    eglCreateNativeClientBufferANDROID = (PFNEGLCREATENATIVECLIENTBUFFERANDROIDPROC)eglwLoad("eglCreateNativeClientBufferANDROID");
#endif /* defined(EGL_ANDROID_create_native_client_buffer) */

#if defined(EGL_ANDROID_get_native_client_buffer)
    eglGetNativeClientBufferANDROID = (PFNEGLGETNATIVECLIENTBUFFERANDROIDPROC)eglwLoad("eglGetNativeClientBufferANDROID");
#endif /* defined(EGL_ANDROID_get_native_client_buffer) */

#if defined(EGL_ANDROID_native_fence_sync)
    eglDupNativeFenceFDANDROID = (PFNEGLDUPNATIVEFENCEFDANDROIDPROC)eglwLoad("eglDupNativeFenceFDANDROID");
#endif /* defined(EGL_ANDROID_native_fence_sync) */

#if defined(EGL_ANDROID_presentation_time)
    eglPresentationTimeANDROID = (PFNEGLPRESENTATIONTIMEANDROIDPROC)eglwLoad("eglPresentationTimeANDROID");
#endif /* defined(EGL_ANDROID_presentation_time) */

#if defined(EGL_ANDROID_get_frame_timestamps)
    eglGetCompositorTimingSupportedANDROID = (PFNEGLGETCOMPOSITORTIMINGSUPPORTEDANDROIDPROC)eglwLoad("eglGetCompositorTimingSupportedANDROID");
    eglGetCompositorTimingANDROID = (PFNEGLGETCOMPOSITORTIMINGANDROIDPROC)eglwLoad("eglGetCompositorTimingANDROID");
    eglGetNextFrameIdANDROID = (PFNEGLGETNEXTFRAMEIDANDROIDPROC)eglwLoad("eglGetNextFrameIdANDROID");
    eglGetFrameTimestampSupportedANDROID = (PFNEGLGETFRAMETIMESTAMPSUPPORTEDANDROIDPROC)eglwLoad("eglGetFrameTimestampSupportedANDROID");
    eglGetFrameTimestampsANDROID = (PFNEGLGETFRAMETIMESTAMPSANDROIDPROC)eglwLoad("eglGetFrameTimestampsANDROID");
#endif /* defined(EGL_ANDROID_get_frame_timestamps) */

#if defined(EGL_ANGLE_query_surface_pointer)
    eglQuerySurfacePointerANGLE = (PFNEGLQUERYSURFACEPOINTERANGLEPROC)eglwLoad("eglQuerySurfacePointerANGLE");
#endif /* defined(EGL_ANGLE_query_surface_pointer) */

#if defined(EGL_EXT_client_sync)
    eglClientSignalSyncEXT = (PFNEGLCLIENTSIGNALSYNCEXTPROC)eglwLoad("eglClientSignalSyncEXT");
#endif /* defined(EGL_EXT_client_sync) */

#if defined(EGL_EXT_device_base)
    eglQueryDeviceAttribEXT = (PFNEGLQUERYDEVICEATTRIBEXTPROC)eglwLoad("eglQueryDeviceAttribEXT");
    eglQueryDeviceStringEXT = (PFNEGLQUERYDEVICESTRINGEXTPROC)eglwLoad("eglQueryDeviceStringEXT");
    eglQueryDevicesEXT = (PFNEGLQUERYDEVICESEXTPROC)eglwLoad("eglQueryDevicesEXT");
    eglQueryDisplayAttribEXT = (PFNEGLQUERYDISPLAYATTRIBEXTPROC)eglwLoad("eglQueryDisplayAttribEXT");
#endif /* defined(EGL_EXT_device_base) */

#if defined(EGL_EXT_image_dma_buf_import_modifiers)
    eglQueryDmaBufFormatsEXT = (PFNEGLQUERYDMABUFFORMATSEXTPROC)eglwLoad("eglQueryDmaBufFormatsEXT");
    eglQueryDmaBufModifiersEXT = (PFNEGLQUERYDMABUFMODIFIERSEXTPROC)eglwLoad("eglQueryDmaBufModifiersEXT");
#endif /* defined(EGL_EXT_image_dma_buf_import_modifiers) */

#if defined(EGL_EXT_output_base)
    eglGetOutputLayersEXT = (PFNEGLGETOUTPUTLAYERSEXTPROC)eglwLoad("eglGetOutputLayersEXT");
    eglGetOutputPortsEXT = (PFNEGLGETOUTPUTPORTSEXTPROC)eglwLoad("eglGetOutputPortsEXT");
    eglOutputLayerAttribEXT = (PFNEGLOUTPUTLAYERATTRIBEXTPROC)eglwLoad("eglOutputLayerAttribEXT");
    eglQueryOutputLayerAttribEXT = (PFNEGLQUERYOUTPUTLAYERATTRIBEXTPROC)eglwLoad("eglQueryOutputLayerAttribEXT");
    eglQueryOutputLayerStringEXT = (PFNEGLQUERYOUTPUTLAYERSTRINGEXTPROC)eglwLoad("eglQueryOutputLayerStringEXT");
    eglOutputPortAttribEXT = (PFNEGLOUTPUTPORTATTRIBEXTPROC)eglwLoad("eglOutputPortAttribEXT");
    eglQueryOutputPortAttribEXT = (PFNEGLQUERYOUTPUTPORTATTRIBEXTPROC)eglwLoad("eglQueryOutputPortAttribEXT");
    eglQueryOutputPortStringEXT = (PFNEGLQUERYOUTPUTPORTSTRINGEXTPROC)eglwLoad("eglQueryOutputPortStringEXT");
#endif /* defined(EGL_EXT_output_base) */

#if defined(EGL_EXT_platform_base)
    eglGetPlatformDisplayEXT = (PFNEGLGETPLATFORMDISPLAYEXTPROC)eglwLoad("eglGetPlatformDisplayEXT");
    eglCreatePlatformWindowSurfaceEXT = (PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC)eglwLoad("eglCreatePlatformWindowSurfaceEXT");
    eglCreatePlatformPixmapSurfaceEXT = (PFNEGLCREATEPLATFORMPIXMAPSURFACEEXTPROC)eglwLoad("eglCreatePlatformPixmapSurfaceEXT");
#endif /* defined(EGL_EXT_platform_base) */

#if defined(EGL_EXT_stream_consumer_egloutput)
    eglStreamConsumerOutputEXT = (PFNEGLSTREAMCONSUMEROUTPUTEXTPROC)eglwLoad("eglStreamConsumerOutputEXT");
#endif /* defined(EGL_EXT_stream_consumer_egloutput) */

#if defined(EGL_EXT_swap_buffers_with_damage)
    eglSwapBuffersWithDamageEXT = (PFNEGLSWAPBUFFERSWITHDAMAGEEXTPROC)eglwLoad("eglSwapBuffersWithDamageEXT");
#endif /* defined(EGL_EXT_swap_buffers_with_damage) */

#if defined(EGL_EXT_sync_reuse)
    eglUnsignalSyncEXT = (PFNEGLUNSIGNALSYNCEXTPROC)eglwLoad("eglUnsignalSyncEXT");
#endif /* defined(EGL_EXT_sync_reuse) */

#if defined(EGL_HI_clientpixmap)
    eglCreatePixmapSurfaceHI = (PFNEGLCREATEPIXMAPSURFACEHIPROC)eglwLoad("eglCreatePixmapSurfaceHI");
#endif /* defined(EGL_HI_clientpixmap) */

#if defined(EGL_KHR_cl_event2)
    eglCreateSync64KHR = (PFNEGLCREATESYNC64KHRPROC)eglwLoad("eglCreateSync64KHR");
#endif /* defined(EGL_KHR_cl_event2) */

#if defined(EGL_KHR_debug)
    eglDebugMessageControlKHR = (PFNEGLDEBUGMESSAGECONTROLKHRPROC)eglwLoad("eglDebugMessageControlKHR");
    eglQueryDebugKHR = (PFNEGLQUERYDEBUGKHRPROC)eglwLoad("eglQueryDebugKHR");
    eglLabelObjectKHR = (PFNEGLLABELOBJECTKHRPROC)eglwLoad("eglLabelObjectKHR");
#endif /* defined(EGL_KHR_debug) */

#if defined(EGL_KHR_display_reference)
    eglQueryDisplayAttribKHR = (PFNEGLQUERYDISPLAYATTRIBKHRPROC)eglwLoad("eglQueryDisplayAttribKHR");
#endif /* defined(EGL_KHR_display_reference) */

#if defined(EGL_KHR_fence_sync)
    eglCreateSyncKHR = (PFNEGLCREATESYNCKHRPROC)eglwLoad("eglCreateSyncKHR");
    eglDestroySyncKHR = (PFNEGLDESTROYSYNCKHRPROC)eglwLoad("eglDestroySyncKHR");
    eglClientWaitSyncKHR = (PFNEGLCLIENTWAITSYNCKHRPROC)eglwLoad("eglClientWaitSyncKHR");
    eglGetSyncAttribKHR = (PFNEGLGETSYNCATTRIBKHRPROC)eglwLoad("eglGetSyncAttribKHR");
#endif /* defined(EGL_KHR_fence_sync) */

#if defined(EGL_KHR_image)
    eglCreateImageKHR = (PFNEGLCREATEIMAGEKHRPROC)eglwLoad("eglCreateImageKHR");
    eglDestroyImageKHR = (PFNEGLDESTROYIMAGEKHRPROC)eglwLoad("eglDestroyImageKHR");
#endif /* defined(EGL_KHR_image) */

#if defined(EGL_KHR_lock_surface)
    eglLockSurfaceKHR = (PFNEGLLOCKSURFACEKHRPROC)eglwLoad("eglLockSurfaceKHR");
    eglUnlockSurfaceKHR = (PFNEGLUNLOCKSURFACEKHRPROC)eglwLoad("eglUnlockSurfaceKHR");
#endif /* defined(EGL_KHR_lock_surface) */

#if defined(EGL_KHR_lock_surface3)
    eglQuerySurface64KHR = (PFNEGLQUERYSURFACE64KHRPROC)eglwLoad("eglQuerySurface64KHR");
#endif /* defined(EGL_KHR_lock_surface3) */

#if defined(EGL_KHR_partial_update)
    eglSetDamageRegionKHR = (PFNEGLSETDAMAGEREGIONKHRPROC)eglwLoad("eglSetDamageRegionKHR");
#endif /* defined(EGL_KHR_partial_update) */

#if defined(EGL_KHR_reusable_sync)
    eglSignalSyncKHR = (PFNEGLSIGNALSYNCKHRPROC)eglwLoad("eglSignalSyncKHR");
#endif /* defined(EGL_KHR_reusable_sync) */

#if defined(EGL_KHR_stream)
    eglCreateStreamKHR = (PFNEGLCREATESTREAMKHRPROC)eglwLoad("eglCreateStreamKHR");
    eglDestroyStreamKHR = (PFNEGLDESTROYSTREAMKHRPROC)eglwLoad("eglDestroyStreamKHR");
    eglStreamAttribKHR = (PFNEGLSTREAMATTRIBKHRPROC)eglwLoad("eglStreamAttribKHR");
    eglQueryStreamKHR = (PFNEGLQUERYSTREAMKHRPROC)eglwLoad("eglQueryStreamKHR");
    eglQueryStreamu64KHR = (PFNEGLQUERYSTREAMU64KHRPROC)eglwLoad("eglQueryStreamu64KHR");
#endif /* defined(EGL_KHR_stream) */

#if defined(EGL_KHR_stream_attrib)
    eglCreateStreamAttribKHR = (PFNEGLCREATESTREAMATTRIBKHRPROC)eglwLoad("eglCreateStreamAttribKHR");
    eglSetStreamAttribKHR = (PFNEGLSETSTREAMATTRIBKHRPROC)eglwLoad("eglSetStreamAttribKHR");
    eglQueryStreamAttribKHR = (PFNEGLQUERYSTREAMATTRIBKHRPROC)eglwLoad("eglQueryStreamAttribKHR");
    eglStreamConsumerAcquireAttribKHR = (PFNEGLSTREAMCONSUMERACQUIREATTRIBKHRPROC)eglwLoad("eglStreamConsumerAcquireAttribKHR");
    eglStreamConsumerReleaseAttribKHR = (PFNEGLSTREAMCONSUMERRELEASEATTRIBKHRPROC)eglwLoad("eglStreamConsumerReleaseAttribKHR");
#endif /* defined(EGL_KHR_stream_attrib) */

#if defined(EGL_KHR_stream_consumer_gltexture)
    eglStreamConsumerGLTextureExternalKHR = (PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALKHRPROC)eglwLoad("eglStreamConsumerGLTextureExternalKHR");
    eglStreamConsumerAcquireKHR = (PFNEGLSTREAMCONSUMERACQUIREKHRPROC)eglwLoad("eglStreamConsumerAcquireKHR");
    eglStreamConsumerReleaseKHR = (PFNEGLSTREAMCONSUMERRELEASEKHRPROC)eglwLoad("eglStreamConsumerReleaseKHR");
#endif /* defined(EGL_KHR_stream_consumer_gltexture) */

#if defined(EGL_KHR_stream_cross_process_fd)
    eglGetStreamFileDescriptorKHR = (PFNEGLGETSTREAMFILEDESCRIPTORKHRPROC)eglwLoad("eglGetStreamFileDescriptorKHR");
    eglCreateStreamFromFileDescriptorKHR = (PFNEGLCREATESTREAMFROMFILEDESCRIPTORKHRPROC)eglwLoad("eglCreateStreamFromFileDescriptorKHR");
#endif /* defined(EGL_KHR_stream_cross_process_fd) */

#if defined(EGL_KHR_stream_fifo)
    eglQueryStreamTimeKHR = (PFNEGLQUERYSTREAMTIMEKHRPROC)eglwLoad("eglQueryStreamTimeKHR");
#endif /* defined(EGL_KHR_stream_fifo) */

#if defined(EGL_KHR_stream_producer_eglsurface)
    eglCreateStreamProducerSurfaceKHR = (PFNEGLCREATESTREAMPRODUCERSURFACEKHRPROC)eglwLoad("eglCreateStreamProducerSurfaceKHR");
#endif /* defined(EGL_KHR_stream_producer_eglsurface) */

#if defined(EGL_KHR_swap_buffers_with_damage)
    eglSwapBuffersWithDamageKHR = (PFNEGLSWAPBUFFERSWITHDAMAGEKHRPROC)eglwLoad("eglSwapBuffersWithDamageKHR");
#endif /* defined(EGL_KHR_swap_buffers_with_damage) */

#if defined(EGL_KHR_wait_sync)
    eglWaitSyncKHR = (PFNEGLWAITSYNCKHRPROC)eglwLoad("eglWaitSyncKHR");
#endif /* defined(EGL_KHR_wait_sync) */

#if defined(EGL_MESA_drm_image)
    eglCreateDRMImageMESA = (PFNEGLCREATEDRMIMAGEMESAPROC)eglwLoad("eglCreateDRMImageMESA");
    eglExportDRMImageMESA = (PFNEGLEXPORTDRMIMAGEMESAPROC)eglwLoad("eglExportDRMImageMESA");
#endif /* defined(EGL_MESA_drm_image) */

#if defined(EGL_MESA_image_dma_buf_export)
    eglExportDMABUFImageQueryMESA = (PFNEGLEXPORTDMABUFIMAGEQUERYMESAPROC)eglwLoad("eglExportDMABUFImageQueryMESA");
    eglExportDMABUFImageMESA = (PFNEGLEXPORTDMABUFIMAGEMESAPROC)eglwLoad("eglExportDMABUFImageMESA");
#endif /* defined(EGL_MESA_image_dma_buf_export) */

#if defined(EGL_MESA_query_driver)
    eglGetDisplayDriverConfig = (PFNEGLGETDISPLAYDRIVERCONFIGPROC)eglwLoad("eglGetDisplayDriverConfig");
    eglGetDisplayDriverName = (PFNEGLGETDISPLAYDRIVERNAMEPROC)eglwLoad("eglGetDisplayDriverName");
#endif /* defined(EGL_MESA_query_driver) */

#if defined(EGL_NOK_swap_region)
    eglSwapBuffersRegionNOK = (PFNEGLSWAPBUFFERSREGIONNOKPROC)eglwLoad("eglSwapBuffersRegionNOK");
#endif /* defined(EGL_NOK_swap_region) */

#if defined(EGL_NOK_swap_region2)
    eglSwapBuffersRegion2NOK = (PFNEGLSWAPBUFFERSREGION2NOKPROC)eglwLoad("eglSwapBuffersRegion2NOK");
#endif /* defined(EGL_NOK_swap_region2) */

#if defined(EGL_NV_native_query)
    eglQueryNativeDisplayNV = (PFNEGLQUERYNATIVEDISPLAYNVPROC)eglwLoad("eglQueryNativeDisplayNV");
    eglQueryNativeWindowNV = (PFNEGLQUERYNATIVEWINDOWNVPROC)eglwLoad("eglQueryNativeWindowNV");
    eglQueryNativePixmapNV = (PFNEGLQUERYNATIVEPIXMAPNVPROC)eglwLoad("eglQueryNativePixmapNV");
#endif /* defined(EGL_NV_native_query) */

#if defined(EGL_NV_post_sub_buffer)
    eglPostSubBufferNV = (PFNEGLPOSTSUBBUFFERNVPROC)eglwLoad("eglPostSubBufferNV");
#endif /* defined(EGL_NV_post_sub_buffer) */

#if defined(EGL_NV_stream_consumer_gltexture_yuv)
    eglStreamConsumerGLTextureExternalAttribsNV = (PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALATTRIBSNVPROC)eglwLoad("eglStreamConsumerGLTextureExternalAttribsNV");
#endif /* defined(EGL_NV_stream_consumer_gltexture_yuv) */

#if defined(EGL_NV_stream_consumer_eglimage)
    eglStreamImageConsumerConnectNV = (PFNEGLSTREAMIMAGECONSUMERCONNECTNVPROC)eglwLoad("eglStreamImageConsumerConnectNV");
    eglQueryStreamConsumerEventNV = (PFNEGLQUERYSTREAMCONSUMEREVENTNVPROC)eglwLoad("eglQueryStreamConsumerEventNV");
    eglStreamAcquireImageNV = (PFNEGLSTREAMACQUIREIMAGENVPROC)eglwLoad("eglStreamAcquireImageNV");
    eglStreamReleaseImageNV = (PFNEGLSTREAMRELEASEIMAGENVPROC)eglwLoad("eglStreamReleaseImageNV");
#endif /* defined(EGL_NV_stream_consumer_eglimage) */

#if defined(EGL_NV_stream_flush)
    eglStreamFlushNV = (PFNEGLSTREAMFLUSHNVPROC)eglwLoad("eglStreamFlushNV");
#endif /* defined(EGL_NV_stream_flush) */

#if defined(EGL_NV_stream_metadata)
    eglQueryDisplayAttribNV = (PFNEGLQUERYDISPLAYATTRIBNVPROC)eglwLoad("eglQueryDisplayAttribNV");
    eglSetStreamMetadataNV = (PFNEGLSETSTREAMMETADATANVPROC)eglwLoad("eglSetStreamMetadataNV");
    eglQueryStreamMetadataNV = (PFNEGLQUERYSTREAMMETADATANVPROC)eglwLoad("eglQueryStreamMetadataNV");
#endif /* defined(EGL_NV_stream_metadata) */

#if defined(EGL_NV_stream_reset)
    eglResetStreamNV = (PFNEGLRESETSTREAMNVPROC)eglwLoad("eglResetStreamNV");
#endif /* defined(EGL_NV_stream_reset) */

#if defined(EGL_NV_stream_sync)
    eglCreateStreamSyncNV = (PFNEGLCREATESTREAMSYNCNVPROC)eglwLoad("eglCreateStreamSyncNV");
#endif /* defined(EGL_NV_stream_sync) */

#if defined(EGL_NV_sync)
    eglCreateFenceSyncNV = (PFNEGLCREATEFENCESYNCNVPROC)eglwLoad("eglCreateFenceSyncNV");
    eglDestroySyncNV = (PFNEGLDESTROYSYNCNVPROC)eglwLoad("eglDestroySyncNV");
    eglFenceNV = (PFNEGLFENCENVPROC)eglwLoad("eglFenceNV");
    eglClientWaitSyncNV = (PFNEGLCLIENTWAITSYNCNVPROC)eglwLoad("eglClientWaitSyncNV");
    eglSignalSyncNV = (PFNEGLSIGNALSYNCNVPROC)eglwLoad("eglSignalSyncNV");
    eglGetSyncAttribNV = (PFNEGLGETSYNCATTRIBNVPROC)eglwLoad("eglGetSyncAttribNV");
#endif /* defined(EGL_NV_sync) */

#if defined(EGL_NV_system_time)
    eglGetSystemTimeFrequencyNV = (PFNEGLGETSYSTEMTIMEFREQUENCYNVPROC)eglwLoad("eglGetSystemTimeFrequencyNV");
    eglGetSystemTimeNV = (PFNEGLGETSYSTEMTIMENVPROC)eglwLoad("eglGetSystemTimeNV");
#endif /* defined(EGL_NV_system_time) */

#if defined(EGL_EXT_compositor)
    eglCompositorSetContextListEXT = (PFNEGLCOMPOSITORSETCONTEXTLISTEXTPROC)eglwLoad("eglCompositorSetContextListEXT");
    eglCompositorSetContextAttributesEXT = (PFNEGLCOMPOSITORSETCONTEXTATTRIBUTESEXTPROC)eglwLoad("eglCompositorSetContextAttributesEXT");
    eglCompositorSetWindowListEXT = (PFNEGLCOMPOSITORSETWINDOWLISTEXTPROC)eglwLoad("eglCompositorSetWindowListEXT");
    eglCompositorSetWindowAttributesEXT = (PFNEGLCOMPOSITORSETWINDOWATTRIBUTESEXTPROC)eglwLoad("eglCompositorSetWindowAttributesEXT");
    eglCompositorBindTexWindowEXT = (PFNEGLCOMPOSITORBINDTEXWINDOWEXTPROC)eglwLoad("eglCompositorBindTexWindowEXT");
    eglCompositorSetSizeEXT = (PFNEGLCOMPOSITORSETSIZEEXTPROC)eglwLoad("eglCompositorSetSizeEXT");
    eglCompositorSwapPolicyEXT = (PFNEGLCOMPOSITORSWAPPOLICYEXTPROC)eglwLoad("eglCompositorSwapPolicyEXT");
#endif /* defined(EGL_EXT_compositor) */

#if defined(EGL_WL_bind_wayland_display)
    eglBindWaylandDisplayWL = (PFNEGLBINDWAYLANDDISPLAYWLPROC)eglwLoad("eglBindWaylandDisplayWL");
    eglUnbindWaylandDisplayWL = (PFNEGLUNBINDWAYLANDDISPLAYWLPROC)eglwLoad("eglUnbindWaylandDisplayWL");
    eglQueryWaylandBufferWL = (PFNEGLQUERYWAYLANDBUFFERWLPROC)eglwLoad("eglQueryWaylandBufferWL");
#endif /* defined(EGL_WL_bind_wayland_display) */

#if defined(EGL_WL_create_wayland_buffer_from_image)
    eglCreateWaylandBufferFromImageWL = (PFNEGLCREATEWAYLANDBUFFERFROMIMAGEWLPROC)eglwLoad("eglCreateWaylandBufferFromImageWL");
#endif /* defined(EGL_WL_create_wayland_buffer_from_image) */

    /* EGLW_GENERATE_EGL_LOAD */

    /**
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     * The above section is auto-generated from EGL spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     */
#endif
}
