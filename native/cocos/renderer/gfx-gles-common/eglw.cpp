/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "eglw.h"

#if (CC_PLATFORM != CC_PLATFORM_IOS)
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

    #if defined(EGL_ANGLE_sync_control_rate)
PFNEGLGETMSCRATEANGLEPROC eglGetMscRateANGLE;
    #endif /* defined(EGL_ANGLE_sync_control_rate) */

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
#if (CC_PLATFORM != CC_PLATFORM_IOS)
    /**
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     * The following section is auto-generated from EGL spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     */

    /* EGLW_GENERATE_EGL_LOAD */
    eglGetProcAddress = reinterpret_cast<PFNEGLGETPROCADDRESSPROC>(eglwLoad("eglGetProcAddress"));

    /* EGL_VERSION_1_0 */
    eglChooseConfig = reinterpret_cast<PFNEGLCHOOSECONFIGPROC>(eglwLoad("eglChooseConfig"));
    eglCopyBuffers = reinterpret_cast<PFNEGLCOPYBUFFERSPROC>(eglwLoad("eglCopyBuffers"));
    eglCreateContext = reinterpret_cast<PFNEGLCREATECONTEXTPROC>(eglwLoad("eglCreateContext"));
    eglCreatePbufferSurface = reinterpret_cast<PFNEGLCREATEPBUFFERSURFACEPROC>(eglwLoad("eglCreatePbufferSurface"));
    eglCreatePixmapSurface = reinterpret_cast<PFNEGLCREATEPIXMAPSURFACEPROC>(eglwLoad("eglCreatePixmapSurface"));
    eglCreateWindowSurface = reinterpret_cast<PFNEGLCREATEWINDOWSURFACEPROC>(eglwLoad("eglCreateWindowSurface"));
    eglDestroyContext = reinterpret_cast<PFNEGLDESTROYCONTEXTPROC>(eglwLoad("eglDestroyContext"));
    eglDestroySurface = reinterpret_cast<PFNEGLDESTROYSURFACEPROC>(eglwLoad("eglDestroySurface"));
    eglGetConfigAttrib = reinterpret_cast<PFNEGLGETCONFIGATTRIBPROC>(eglwLoad("eglGetConfigAttrib"));
    eglGetConfigs = reinterpret_cast<PFNEGLGETCONFIGSPROC>(eglwLoad("eglGetConfigs"));
    eglGetCurrentDisplay = reinterpret_cast<PFNEGLGETCURRENTDISPLAYPROC>(eglwLoad("eglGetCurrentDisplay"));
    eglGetCurrentSurface = reinterpret_cast<PFNEGLGETCURRENTSURFACEPROC>(eglwLoad("eglGetCurrentSurface"));
    eglGetDisplay = reinterpret_cast<PFNEGLGETDISPLAYPROC>(eglwLoad("eglGetDisplay"));
    eglGetError = reinterpret_cast<PFNEGLGETERRORPROC>(eglwLoad("eglGetError"));
    eglInitialize = reinterpret_cast<PFNEGLINITIALIZEPROC>(eglwLoad("eglInitialize"));
    eglMakeCurrent = reinterpret_cast<PFNEGLMAKECURRENTPROC>(eglwLoad("eglMakeCurrent"));
    eglQueryContext = reinterpret_cast<PFNEGLQUERYCONTEXTPROC>(eglwLoad("eglQueryContext"));
    eglQueryString = reinterpret_cast<PFNEGLQUERYSTRINGPROC>(eglwLoad("eglQueryString"));
    eglQuerySurface = reinterpret_cast<PFNEGLQUERYSURFACEPROC>(eglwLoad("eglQuerySurface"));
    eglSwapBuffers = reinterpret_cast<PFNEGLSWAPBUFFERSPROC>(eglwLoad("eglSwapBuffers"));
    eglTerminate = reinterpret_cast<PFNEGLTERMINATEPROC>(eglwLoad("eglTerminate"));
    eglWaitGL = reinterpret_cast<PFNEGLWAITGLPROC>(eglwLoad("eglWaitGL"));
    eglWaitNative = reinterpret_cast<PFNEGLWAITNATIVEPROC>(eglwLoad("eglWaitNative"));

    /* EGL_VERSION_1_1 */
    eglBindTexImage = reinterpret_cast<PFNEGLBINDTEXIMAGEPROC>(eglwLoad("eglBindTexImage"));
    eglReleaseTexImage = reinterpret_cast<PFNEGLRELEASETEXIMAGEPROC>(eglwLoad("eglReleaseTexImage"));
    eglSurfaceAttrib = reinterpret_cast<PFNEGLSURFACEATTRIBPROC>(eglwLoad("eglSurfaceAttrib"));
    eglSwapInterval = reinterpret_cast<PFNEGLSWAPINTERVALPROC>(eglwLoad("eglSwapInterval"));

    /* EGL_VERSION_1_2 */
    eglBindAPI = reinterpret_cast<PFNEGLBINDAPIPROC>(eglwLoad("eglBindAPI"));
    eglQueryAPI = reinterpret_cast<PFNEGLQUERYAPIPROC>(eglwLoad("eglQueryAPI"));
    eglCreatePbufferFromClientBuffer = reinterpret_cast<PFNEGLCREATEPBUFFERFROMCLIENTBUFFERPROC>(eglwLoad("eglCreatePbufferFromClientBuffer"));
    eglReleaseThread = reinterpret_cast<PFNEGLRELEASETHREADPROC>(eglwLoad("eglReleaseThread"));
    eglWaitClient = reinterpret_cast<PFNEGLWAITCLIENTPROC>(eglwLoad("eglWaitClient"));

    /* EGL_VERSION_1_3 */

    /* EGL_VERSION_1_4 */
    eglGetCurrentContext = reinterpret_cast<PFNEGLGETCURRENTCONTEXTPROC>(eglwLoad("eglGetCurrentContext"));

    /* EGL_VERSION_1_5 */
    eglCreateSync = reinterpret_cast<PFNEGLCREATESYNCPROC>(eglwLoad("eglCreateSync"));
    eglDestroySync = reinterpret_cast<PFNEGLDESTROYSYNCPROC>(eglwLoad("eglDestroySync"));
    eglClientWaitSync = reinterpret_cast<PFNEGLCLIENTWAITSYNCPROC>(eglwLoad("eglClientWaitSync"));
    eglGetSyncAttrib = reinterpret_cast<PFNEGLGETSYNCATTRIBPROC>(eglwLoad("eglGetSyncAttrib"));

    eglCreateImage = reinterpret_cast<PFNEGLCREATEIMAGEPROC>(eglwLoad("eglCreateImage"));
    eglDestroyImage = reinterpret_cast<PFNEGLDESTROYIMAGEPROC>(eglwLoad("eglDestroyImage"));

    eglGetPlatformDisplay = reinterpret_cast<PFNEGLGETPLATFORMDISPLAYPROC>(eglwLoad("eglGetPlatformDisplay"));
    eglCreatePlatformWindowSurface = reinterpret_cast<PFNEGLCREATEPLATFORMWINDOWSURFACEPROC>(eglwLoad("eglCreatePlatformWindowSurface"));
    eglCreatePlatformPixmapSurface = reinterpret_cast<PFNEGLCREATEPLATFORMPIXMAPSURFACEPROC>(eglwLoad("eglCreatePlatformPixmapSurface"));

    eglWaitSync = reinterpret_cast<PFNEGLWAITSYNCPROC>(eglwLoad("eglWaitSync"));

    #if defined(EGL_ANDROID_blob_cache)
    eglSetBlobCacheFuncsANDROID = reinterpret_cast<PFNEGLSETBLOBCACHEFUNCSANDROIDPROC>(eglwLoad("eglSetBlobCacheFuncsANDROID"));
    #endif /* defined(EGL_ANDROID_blob_cache) */

    #if defined(EGL_ANDROID_create_native_client_buffer)
    eglCreateNativeClientBufferANDROID = reinterpret_cast<PFNEGLCREATENATIVECLIENTBUFFERANDROIDPROC>(eglwLoad("eglCreateNativeClientBufferANDROID"));
    #endif /* defined(EGL_ANDROID_create_native_client_buffer) */

    #if defined(EGL_ANDROID_get_native_client_buffer)
    eglGetNativeClientBufferANDROID = reinterpret_cast<PFNEGLGETNATIVECLIENTBUFFERANDROIDPROC>(eglwLoad("eglGetNativeClientBufferANDROID"));
    #endif /* defined(EGL_ANDROID_get_native_client_buffer) */

    #if defined(EGL_ANDROID_native_fence_sync)
    eglDupNativeFenceFDANDROID = reinterpret_cast<PFNEGLDUPNATIVEFENCEFDANDROIDPROC>(eglwLoad("eglDupNativeFenceFDANDROID"));
    #endif /* defined(EGL_ANDROID_native_fence_sync) */

    #if defined(EGL_ANDROID_presentation_time)
    eglPresentationTimeANDROID = reinterpret_cast<PFNEGLPRESENTATIONTIMEANDROIDPROC>(eglwLoad("eglPresentationTimeANDROID"));
    #endif /* defined(EGL_ANDROID_presentation_time) */

    #if defined(EGL_ANDROID_get_frame_timestamps)
    eglGetCompositorTimingSupportedANDROID = reinterpret_cast<PFNEGLGETCOMPOSITORTIMINGSUPPORTEDANDROIDPROC>(eglwLoad("eglGetCompositorTimingSupportedANDROID"));
    eglGetCompositorTimingANDROID = reinterpret_cast<PFNEGLGETCOMPOSITORTIMINGANDROIDPROC>(eglwLoad("eglGetCompositorTimingANDROID"));
    eglGetNextFrameIdANDROID = reinterpret_cast<PFNEGLGETNEXTFRAMEIDANDROIDPROC>(eglwLoad("eglGetNextFrameIdANDROID"));
    eglGetFrameTimestampSupportedANDROID = reinterpret_cast<PFNEGLGETFRAMETIMESTAMPSUPPORTEDANDROIDPROC>(eglwLoad("eglGetFrameTimestampSupportedANDROID"));
    eglGetFrameTimestampsANDROID = reinterpret_cast<PFNEGLGETFRAMETIMESTAMPSANDROIDPROC>(eglwLoad("eglGetFrameTimestampsANDROID"));
    #endif /* defined(EGL_ANDROID_get_frame_timestamps) */

    #if defined(EGL_ANGLE_query_surface_pointer)
    eglQuerySurfacePointerANGLE = reinterpret_cast<PFNEGLQUERYSURFACEPOINTERANGLEPROC>(eglwLoad("eglQuerySurfacePointerANGLE"));
    #endif /* defined(EGL_ANGLE_query_surface_pointer) */

    #if defined(EGL_ANGLE_sync_control_rate)
    eglGetMscRateANGLE = reinterpret_cast<PFNEGLGETMSCRATEANGLEPROC>(eglwLoad("eglGetMscRateANGLE"));
    #endif /* defined(EGL_ANGLE_sync_control_rate) */

    #if defined(EGL_EXT_client_sync)
    eglClientSignalSyncEXT = reinterpret_cast<PFNEGLCLIENTSIGNALSYNCEXTPROC>(eglwLoad("eglClientSignalSyncEXT"));
    #endif /* defined(EGL_EXT_client_sync) */

    #if defined(EGL_EXT_device_base)
    eglQueryDeviceAttribEXT = reinterpret_cast<PFNEGLQUERYDEVICEATTRIBEXTPROC>(eglwLoad("eglQueryDeviceAttribEXT"));
    eglQueryDeviceStringEXT = reinterpret_cast<PFNEGLQUERYDEVICESTRINGEXTPROC>(eglwLoad("eglQueryDeviceStringEXT"));
    eglQueryDevicesEXT = reinterpret_cast<PFNEGLQUERYDEVICESEXTPROC>(eglwLoad("eglQueryDevicesEXT"));
    eglQueryDisplayAttribEXT = reinterpret_cast<PFNEGLQUERYDISPLAYATTRIBEXTPROC>(eglwLoad("eglQueryDisplayAttribEXT"));
    #endif /* defined(EGL_EXT_device_base) */

    #if defined(EGL_EXT_image_dma_buf_import_modifiers)
    eglQueryDmaBufFormatsEXT = reinterpret_cast<PFNEGLQUERYDMABUFFORMATSEXTPROC>(eglwLoad("eglQueryDmaBufFormatsEXT"));
    eglQueryDmaBufModifiersEXT = reinterpret_cast<PFNEGLQUERYDMABUFMODIFIERSEXTPROC>(eglwLoad("eglQueryDmaBufModifiersEXT"));
    #endif /* defined(EGL_EXT_image_dma_buf_import_modifiers) */

    #if defined(EGL_EXT_output_base)
    eglGetOutputLayersEXT = reinterpret_cast<PFNEGLGETOUTPUTLAYERSEXTPROC>(eglwLoad("eglGetOutputLayersEXT"));
    eglGetOutputPortsEXT = reinterpret_cast<PFNEGLGETOUTPUTPORTSEXTPROC>(eglwLoad("eglGetOutputPortsEXT"));
    eglOutputLayerAttribEXT = reinterpret_cast<PFNEGLOUTPUTLAYERATTRIBEXTPROC>(eglwLoad("eglOutputLayerAttribEXT"));
    eglQueryOutputLayerAttribEXT = reinterpret_cast<PFNEGLQUERYOUTPUTLAYERATTRIBEXTPROC>(eglwLoad("eglQueryOutputLayerAttribEXT"));
    eglQueryOutputLayerStringEXT = reinterpret_cast<PFNEGLQUERYOUTPUTLAYERSTRINGEXTPROC>(eglwLoad("eglQueryOutputLayerStringEXT"));
    eglOutputPortAttribEXT = reinterpret_cast<PFNEGLOUTPUTPORTATTRIBEXTPROC>(eglwLoad("eglOutputPortAttribEXT"));
    eglQueryOutputPortAttribEXT = reinterpret_cast<PFNEGLQUERYOUTPUTPORTATTRIBEXTPROC>(eglwLoad("eglQueryOutputPortAttribEXT"));
    eglQueryOutputPortStringEXT = reinterpret_cast<PFNEGLQUERYOUTPUTPORTSTRINGEXTPROC>(eglwLoad("eglQueryOutputPortStringEXT"));
    #endif /* defined(EGL_EXT_output_base) */

    #if defined(EGL_EXT_platform_base)
    eglGetPlatformDisplayEXT = reinterpret_cast<PFNEGLGETPLATFORMDISPLAYEXTPROC>(eglwLoad("eglGetPlatformDisplayEXT"));
    eglCreatePlatformWindowSurfaceEXT = reinterpret_cast<PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC>(eglwLoad("eglCreatePlatformWindowSurfaceEXT"));
    eglCreatePlatformPixmapSurfaceEXT = reinterpret_cast<PFNEGLCREATEPLATFORMPIXMAPSURFACEEXTPROC>(eglwLoad("eglCreatePlatformPixmapSurfaceEXT"));
    #endif /* defined(EGL_EXT_platform_base) */

    #if defined(EGL_EXT_stream_consumer_egloutput)
    eglStreamConsumerOutputEXT = reinterpret_cast<PFNEGLSTREAMCONSUMEROUTPUTEXTPROC>(eglwLoad("eglStreamConsumerOutputEXT"));
    #endif /* defined(EGL_EXT_stream_consumer_egloutput) */

    #if defined(EGL_EXT_swap_buffers_with_damage)
    eglSwapBuffersWithDamageEXT = reinterpret_cast<PFNEGLSWAPBUFFERSWITHDAMAGEEXTPROC>(eglwLoad("eglSwapBuffersWithDamageEXT"));
    #endif /* defined(EGL_EXT_swap_buffers_with_damage) */

    #if defined(EGL_EXT_sync_reuse)
    eglUnsignalSyncEXT = reinterpret_cast<PFNEGLUNSIGNALSYNCEXTPROC>(eglwLoad("eglUnsignalSyncEXT"));
    #endif /* defined(EGL_EXT_sync_reuse) */

    #if defined(EGL_HI_clientpixmap)
    eglCreatePixmapSurfaceHI = reinterpret_cast<PFNEGLCREATEPIXMAPSURFACEHIPROC>(eglwLoad("eglCreatePixmapSurfaceHI"));
    #endif /* defined(EGL_HI_clientpixmap) */

    #if defined(EGL_KHR_cl_event2)
    eglCreateSync64KHR = reinterpret_cast<PFNEGLCREATESYNC64KHRPROC>(eglwLoad("eglCreateSync64KHR"));
    #endif /* defined(EGL_KHR_cl_event2) */

    #if defined(EGL_KHR_debug)
    eglDebugMessageControlKHR = reinterpret_cast<PFNEGLDEBUGMESSAGECONTROLKHRPROC>(eglwLoad("eglDebugMessageControlKHR"));
    eglQueryDebugKHR = reinterpret_cast<PFNEGLQUERYDEBUGKHRPROC>(eglwLoad("eglQueryDebugKHR"));
    eglLabelObjectKHR = reinterpret_cast<PFNEGLLABELOBJECTKHRPROC>(eglwLoad("eglLabelObjectKHR"));
    #endif /* defined(EGL_KHR_debug) */

    #if defined(EGL_KHR_display_reference)
    eglQueryDisplayAttribKHR = reinterpret_cast<PFNEGLQUERYDISPLAYATTRIBKHRPROC>(eglwLoad("eglQueryDisplayAttribKHR"));
    #endif /* defined(EGL_KHR_display_reference) */

    #if defined(EGL_KHR_fence_sync)
    eglCreateSyncKHR = reinterpret_cast<PFNEGLCREATESYNCKHRPROC>(eglwLoad("eglCreateSyncKHR"));
    eglDestroySyncKHR = reinterpret_cast<PFNEGLDESTROYSYNCKHRPROC>(eglwLoad("eglDestroySyncKHR"));
    eglClientWaitSyncKHR = reinterpret_cast<PFNEGLCLIENTWAITSYNCKHRPROC>(eglwLoad("eglClientWaitSyncKHR"));
    eglGetSyncAttribKHR = reinterpret_cast<PFNEGLGETSYNCATTRIBKHRPROC>(eglwLoad("eglGetSyncAttribKHR"));
    #endif /* defined(EGL_KHR_fence_sync) */

    #if defined(EGL_KHR_image)
    eglCreateImageKHR = reinterpret_cast<PFNEGLCREATEIMAGEKHRPROC>(eglwLoad("eglCreateImageKHR"));
    eglDestroyImageKHR = reinterpret_cast<PFNEGLDESTROYIMAGEKHRPROC>(eglwLoad("eglDestroyImageKHR"));
    #endif /* defined(EGL_KHR_image) */

    #if defined(EGL_KHR_lock_surface)
    eglLockSurfaceKHR = reinterpret_cast<PFNEGLLOCKSURFACEKHRPROC>(eglwLoad("eglLockSurfaceKHR"));
    eglUnlockSurfaceKHR = reinterpret_cast<PFNEGLUNLOCKSURFACEKHRPROC>(eglwLoad("eglUnlockSurfaceKHR"));
    #endif /* defined(EGL_KHR_lock_surface) */

    #if defined(EGL_KHR_lock_surface3)
    eglQuerySurface64KHR = reinterpret_cast<PFNEGLQUERYSURFACE64KHRPROC>(eglwLoad("eglQuerySurface64KHR"));
    #endif /* defined(EGL_KHR_lock_surface3) */

    #if defined(EGL_KHR_partial_update)
    eglSetDamageRegionKHR = reinterpret_cast<PFNEGLSETDAMAGEREGIONKHRPROC>(eglwLoad("eglSetDamageRegionKHR"));
    #endif /* defined(EGL_KHR_partial_update) */

    #if defined(EGL_KHR_reusable_sync)
    eglSignalSyncKHR = reinterpret_cast<PFNEGLSIGNALSYNCKHRPROC>(eglwLoad("eglSignalSyncKHR"));
    #endif /* defined(EGL_KHR_reusable_sync) */

    #if defined(EGL_KHR_stream)
    eglCreateStreamKHR = reinterpret_cast<PFNEGLCREATESTREAMKHRPROC>(eglwLoad("eglCreateStreamKHR"));
    eglDestroyStreamKHR = reinterpret_cast<PFNEGLDESTROYSTREAMKHRPROC>(eglwLoad("eglDestroyStreamKHR"));
    eglStreamAttribKHR = reinterpret_cast<PFNEGLSTREAMATTRIBKHRPROC>(eglwLoad("eglStreamAttribKHR"));
    eglQueryStreamKHR = reinterpret_cast<PFNEGLQUERYSTREAMKHRPROC>(eglwLoad("eglQueryStreamKHR"));
    eglQueryStreamu64KHR = reinterpret_cast<PFNEGLQUERYSTREAMU64KHRPROC>(eglwLoad("eglQueryStreamu64KHR"));
    #endif /* defined(EGL_KHR_stream) */

    #if defined(EGL_KHR_stream_attrib)
    eglCreateStreamAttribKHR = reinterpret_cast<PFNEGLCREATESTREAMATTRIBKHRPROC>(eglwLoad("eglCreateStreamAttribKHR"));
    eglSetStreamAttribKHR = reinterpret_cast<PFNEGLSETSTREAMATTRIBKHRPROC>(eglwLoad("eglSetStreamAttribKHR"));
    eglQueryStreamAttribKHR = reinterpret_cast<PFNEGLQUERYSTREAMATTRIBKHRPROC>(eglwLoad("eglQueryStreamAttribKHR"));
    eglStreamConsumerAcquireAttribKHR = reinterpret_cast<PFNEGLSTREAMCONSUMERACQUIREATTRIBKHRPROC>(eglwLoad("eglStreamConsumerAcquireAttribKHR"));
    eglStreamConsumerReleaseAttribKHR = reinterpret_cast<PFNEGLSTREAMCONSUMERRELEASEATTRIBKHRPROC>(eglwLoad("eglStreamConsumerReleaseAttribKHR"));
    #endif /* defined(EGL_KHR_stream_attrib) */

    #if defined(EGL_KHR_stream_consumer_gltexture)
    eglStreamConsumerGLTextureExternalKHR = reinterpret_cast<PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALKHRPROC>(eglwLoad("eglStreamConsumerGLTextureExternalKHR"));
    eglStreamConsumerAcquireKHR = reinterpret_cast<PFNEGLSTREAMCONSUMERACQUIREKHRPROC>(eglwLoad("eglStreamConsumerAcquireKHR"));
    eglStreamConsumerReleaseKHR = reinterpret_cast<PFNEGLSTREAMCONSUMERRELEASEKHRPROC>(eglwLoad("eglStreamConsumerReleaseKHR"));
    #endif /* defined(EGL_KHR_stream_consumer_gltexture) */

    #if defined(EGL_KHR_stream_cross_process_fd)
    eglGetStreamFileDescriptorKHR = reinterpret_cast<PFNEGLGETSTREAMFILEDESCRIPTORKHRPROC>(eglwLoad("eglGetStreamFileDescriptorKHR"));
    eglCreateStreamFromFileDescriptorKHR = reinterpret_cast<PFNEGLCREATESTREAMFROMFILEDESCRIPTORKHRPROC>(eglwLoad("eglCreateStreamFromFileDescriptorKHR"));
    #endif /* defined(EGL_KHR_stream_cross_process_fd) */

    #if defined(EGL_KHR_stream_fifo)
    eglQueryStreamTimeKHR = reinterpret_cast<PFNEGLQUERYSTREAMTIMEKHRPROC>(eglwLoad("eglQueryStreamTimeKHR"));
    #endif /* defined(EGL_KHR_stream_fifo) */

    #if defined(EGL_KHR_stream_producer_eglsurface)
    eglCreateStreamProducerSurfaceKHR = reinterpret_cast<PFNEGLCREATESTREAMPRODUCERSURFACEKHRPROC>(eglwLoad("eglCreateStreamProducerSurfaceKHR"));
    #endif /* defined(EGL_KHR_stream_producer_eglsurface) */

    #if defined(EGL_KHR_swap_buffers_with_damage)
    eglSwapBuffersWithDamageKHR = reinterpret_cast<PFNEGLSWAPBUFFERSWITHDAMAGEKHRPROC>(eglwLoad("eglSwapBuffersWithDamageKHR"));
    #endif /* defined(EGL_KHR_swap_buffers_with_damage) */

    #if defined(EGL_KHR_wait_sync)
    eglWaitSyncKHR = reinterpret_cast<PFNEGLWAITSYNCKHRPROC>(eglwLoad("eglWaitSyncKHR"));
    #endif /* defined(EGL_KHR_wait_sync) */

    #if defined(EGL_MESA_drm_image)
    eglCreateDRMImageMESA = reinterpret_cast<PFNEGLCREATEDRMIMAGEMESAPROC>(eglwLoad("eglCreateDRMImageMESA"));
    eglExportDRMImageMESA = reinterpret_cast<PFNEGLEXPORTDRMIMAGEMESAPROC>(eglwLoad("eglExportDRMImageMESA"));
    #endif /* defined(EGL_MESA_drm_image) */

    #if defined(EGL_MESA_image_dma_buf_export)
    eglExportDMABUFImageQueryMESA = reinterpret_cast<PFNEGLEXPORTDMABUFIMAGEQUERYMESAPROC>(eglwLoad("eglExportDMABUFImageQueryMESA"));
    eglExportDMABUFImageMESA = reinterpret_cast<PFNEGLEXPORTDMABUFIMAGEMESAPROC>(eglwLoad("eglExportDMABUFImageMESA"));
    #endif /* defined(EGL_MESA_image_dma_buf_export) */

    #if defined(EGL_MESA_query_driver)
    eglGetDisplayDriverConfig = reinterpret_cast<PFNEGLGETDISPLAYDRIVERCONFIGPROC>(eglwLoad("eglGetDisplayDriverConfig"));
    eglGetDisplayDriverName = reinterpret_cast<PFNEGLGETDISPLAYDRIVERNAMEPROC>(eglwLoad("eglGetDisplayDriverName"));
    #endif /* defined(EGL_MESA_query_driver) */

    #if defined(EGL_NOK_swap_region)
    eglSwapBuffersRegionNOK = reinterpret_cast<PFNEGLSWAPBUFFERSREGIONNOKPROC>(eglwLoad("eglSwapBuffersRegionNOK"));
    #endif /* defined(EGL_NOK_swap_region) */

    #if defined(EGL_NOK_swap_region2)
    eglSwapBuffersRegion2NOK = reinterpret_cast<PFNEGLSWAPBUFFERSREGION2NOKPROC>(eglwLoad("eglSwapBuffersRegion2NOK"));
    #endif /* defined(EGL_NOK_swap_region2) */

    #if defined(EGL_NV_native_query)
    eglQueryNativeDisplayNV = reinterpret_cast<PFNEGLQUERYNATIVEDISPLAYNVPROC>(eglwLoad("eglQueryNativeDisplayNV"));
    eglQueryNativeWindowNV = reinterpret_cast<PFNEGLQUERYNATIVEWINDOWNVPROC>(eglwLoad("eglQueryNativeWindowNV"));
    eglQueryNativePixmapNV = reinterpret_cast<PFNEGLQUERYNATIVEPIXMAPNVPROC>(eglwLoad("eglQueryNativePixmapNV"));
    #endif /* defined(EGL_NV_native_query) */

    #if defined(EGL_NV_post_sub_buffer)
    eglPostSubBufferNV = reinterpret_cast<PFNEGLPOSTSUBBUFFERNVPROC>(eglwLoad("eglPostSubBufferNV"));
    #endif /* defined(EGL_NV_post_sub_buffer) */

    #if defined(EGL_NV_stream_consumer_gltexture_yuv)
    eglStreamConsumerGLTextureExternalAttribsNV = reinterpret_cast<PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALATTRIBSNVPROC>(eglwLoad("eglStreamConsumerGLTextureExternalAttribsNV"));
    #endif /* defined(EGL_NV_stream_consumer_gltexture_yuv) */

    #if defined(EGL_NV_stream_consumer_eglimage)
    eglStreamImageConsumerConnectNV = reinterpret_cast<PFNEGLSTREAMIMAGECONSUMERCONNECTNVPROC>(eglwLoad("eglStreamImageConsumerConnectNV"));
    eglQueryStreamConsumerEventNV = reinterpret_cast<PFNEGLQUERYSTREAMCONSUMEREVENTNVPROC>(eglwLoad("eglQueryStreamConsumerEventNV"));
    eglStreamAcquireImageNV = reinterpret_cast<PFNEGLSTREAMACQUIREIMAGENVPROC>(eglwLoad("eglStreamAcquireImageNV"));
    eglStreamReleaseImageNV = reinterpret_cast<PFNEGLSTREAMRELEASEIMAGENVPROC>(eglwLoad("eglStreamReleaseImageNV"));
    #endif /* defined(EGL_NV_stream_consumer_eglimage) */

    #if defined(EGL_NV_stream_flush)
    eglStreamFlushNV = reinterpret_cast<PFNEGLSTREAMFLUSHNVPROC>(eglwLoad("eglStreamFlushNV"));
    #endif /* defined(EGL_NV_stream_flush) */

    #if defined(EGL_NV_stream_metadata)
    eglQueryDisplayAttribNV = reinterpret_cast<PFNEGLQUERYDISPLAYATTRIBNVPROC>(eglwLoad("eglQueryDisplayAttribNV"));
    eglSetStreamMetadataNV = reinterpret_cast<PFNEGLSETSTREAMMETADATANVPROC>(eglwLoad("eglSetStreamMetadataNV"));
    eglQueryStreamMetadataNV = reinterpret_cast<PFNEGLQUERYSTREAMMETADATANVPROC>(eglwLoad("eglQueryStreamMetadataNV"));
    #endif /* defined(EGL_NV_stream_metadata) */

    #if defined(EGL_NV_stream_reset)
    eglResetStreamNV = reinterpret_cast<PFNEGLRESETSTREAMNVPROC>(eglwLoad("eglResetStreamNV"));
    #endif /* defined(EGL_NV_stream_reset) */

    #if defined(EGL_NV_stream_sync)
    eglCreateStreamSyncNV = reinterpret_cast<PFNEGLCREATESTREAMSYNCNVPROC>(eglwLoad("eglCreateStreamSyncNV"));
    #endif /* defined(EGL_NV_stream_sync) */

    #if defined(EGL_NV_sync)
    eglCreateFenceSyncNV = reinterpret_cast<PFNEGLCREATEFENCESYNCNVPROC>(eglwLoad("eglCreateFenceSyncNV"));
    eglDestroySyncNV = reinterpret_cast<PFNEGLDESTROYSYNCNVPROC>(eglwLoad("eglDestroySyncNV"));
    eglFenceNV = reinterpret_cast<PFNEGLFENCENVPROC>(eglwLoad("eglFenceNV"));
    eglClientWaitSyncNV = reinterpret_cast<PFNEGLCLIENTWAITSYNCNVPROC>(eglwLoad("eglClientWaitSyncNV"));
    eglSignalSyncNV = reinterpret_cast<PFNEGLSIGNALSYNCNVPROC>(eglwLoad("eglSignalSyncNV"));
    eglGetSyncAttribNV = reinterpret_cast<PFNEGLGETSYNCATTRIBNVPROC>(eglwLoad("eglGetSyncAttribNV"));
    #endif /* defined(EGL_NV_sync) */

    #if defined(EGL_NV_system_time)
    eglGetSystemTimeFrequencyNV = reinterpret_cast<PFNEGLGETSYSTEMTIMEFREQUENCYNVPROC>(eglwLoad("eglGetSystemTimeFrequencyNV"));
    eglGetSystemTimeNV = reinterpret_cast<PFNEGLGETSYSTEMTIMENVPROC>(eglwLoad("eglGetSystemTimeNV"));
    #endif /* defined(EGL_NV_system_time) */

    #if defined(EGL_EXT_compositor)
    eglCompositorSetContextListEXT = reinterpret_cast<PFNEGLCOMPOSITORSETCONTEXTLISTEXTPROC>(eglwLoad("eglCompositorSetContextListEXT"));
    eglCompositorSetContextAttributesEXT = reinterpret_cast<PFNEGLCOMPOSITORSETCONTEXTATTRIBUTESEXTPROC>(eglwLoad("eglCompositorSetContextAttributesEXT"));
    eglCompositorSetWindowListEXT = reinterpret_cast<PFNEGLCOMPOSITORSETWINDOWLISTEXTPROC>(eglwLoad("eglCompositorSetWindowListEXT"));
    eglCompositorSetWindowAttributesEXT = reinterpret_cast<PFNEGLCOMPOSITORSETWINDOWATTRIBUTESEXTPROC>(eglwLoad("eglCompositorSetWindowAttributesEXT"));
    eglCompositorBindTexWindowEXT = reinterpret_cast<PFNEGLCOMPOSITORBINDTEXWINDOWEXTPROC>(eglwLoad("eglCompositorBindTexWindowEXT"));
    eglCompositorSetSizeEXT = reinterpret_cast<PFNEGLCOMPOSITORSETSIZEEXTPROC>(eglwLoad("eglCompositorSetSizeEXT"));
    eglCompositorSwapPolicyEXT = reinterpret_cast<PFNEGLCOMPOSITORSWAPPOLICYEXTPROC>(eglwLoad("eglCompositorSwapPolicyEXT"));
    #endif /* defined(EGL_EXT_compositor) */

    #if defined(EGL_WL_bind_wayland_display)
    eglBindWaylandDisplayWL = reinterpret_cast<PFNEGLBINDWAYLANDDISPLAYWLPROC>(eglwLoad("eglBindWaylandDisplayWL"));
    eglUnbindWaylandDisplayWL = reinterpret_cast<PFNEGLUNBINDWAYLANDDISPLAYWLPROC>(eglwLoad("eglUnbindWaylandDisplayWL"));
    eglQueryWaylandBufferWL = reinterpret_cast<PFNEGLQUERYWAYLANDBUFFERWLPROC>(eglwLoad("eglQueryWaylandBufferWL"));
    #endif /* defined(EGL_WL_bind_wayland_display) */

    #if defined(EGL_WL_create_wayland_buffer_from_image)
    eglCreateWaylandBufferFromImageWL = reinterpret_cast<PFNEGLCREATEWAYLANDBUFFERFROMIMAGEWLPROC>(eglwLoad("eglCreateWaylandBufferFromImageWL"));
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
