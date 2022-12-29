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

#pragma once

#if (CC_PLATFORM != CC_PLATFORM_IOS)
    #if (CC_PLATFORM == CC_PLATFORM_QNX)
        #define EGL_NO_X11 1
    #endif

    #define EGL_EGL_PROTOTYPES 0
    #include <EGL/egl.h>
    #include <EGL/eglext.h>
    #include <EGL/eglplatform.h>

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated from EGL spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */

/* EGLW_GENERATE_EGL_DECLARATION */
extern PFNEGLGETPROCADDRESSPROC eglGetProcAddress;

/* EGL_VERSION_1_0 */
extern PFNEGLCHOOSECONFIGPROC eglChooseConfig;
extern PFNEGLCOPYBUFFERSPROC eglCopyBuffers;
extern PFNEGLCREATECONTEXTPROC eglCreateContext;
extern PFNEGLCREATEPBUFFERSURFACEPROC eglCreatePbufferSurface;
extern PFNEGLCREATEPIXMAPSURFACEPROC eglCreatePixmapSurface;
extern PFNEGLCREATEWINDOWSURFACEPROC eglCreateWindowSurface;
extern PFNEGLDESTROYCONTEXTPROC eglDestroyContext;
extern PFNEGLDESTROYSURFACEPROC eglDestroySurface;
extern PFNEGLGETCONFIGATTRIBPROC eglGetConfigAttrib;
extern PFNEGLGETCONFIGSPROC eglGetConfigs;
extern PFNEGLGETCURRENTDISPLAYPROC eglGetCurrentDisplay;
extern PFNEGLGETCURRENTSURFACEPROC eglGetCurrentSurface;
extern PFNEGLGETDISPLAYPROC eglGetDisplay;
extern PFNEGLGETERRORPROC eglGetError;
extern PFNEGLINITIALIZEPROC eglInitialize;
extern PFNEGLMAKECURRENTPROC eglMakeCurrent;
extern PFNEGLQUERYCONTEXTPROC eglQueryContext;
extern PFNEGLQUERYSTRINGPROC eglQueryString;
extern PFNEGLQUERYSURFACEPROC eglQuerySurface;
extern PFNEGLSWAPBUFFERSPROC eglSwapBuffers;
extern PFNEGLTERMINATEPROC eglTerminate;
extern PFNEGLWAITGLPROC eglWaitGL;
extern PFNEGLWAITNATIVEPROC eglWaitNative;

/* EGL_VERSION_1_1 */
extern PFNEGLBINDTEXIMAGEPROC eglBindTexImage;
extern PFNEGLRELEASETEXIMAGEPROC eglReleaseTexImage;
extern PFNEGLSURFACEATTRIBPROC eglSurfaceAttrib;
extern PFNEGLSWAPINTERVALPROC eglSwapInterval;

/* EGL_VERSION_1_2 */
extern PFNEGLBINDAPIPROC eglBindAPI;
extern PFNEGLQUERYAPIPROC eglQueryAPI;
extern PFNEGLCREATEPBUFFERFROMCLIENTBUFFERPROC eglCreatePbufferFromClientBuffer;
extern PFNEGLRELEASETHREADPROC eglReleaseThread;
extern PFNEGLWAITCLIENTPROC eglWaitClient;

/* EGL_VERSION_1_3 */

/* EGL_VERSION_1_4 */
extern PFNEGLGETCURRENTCONTEXTPROC eglGetCurrentContext;

/* EGL_VERSION_1_5 */
extern PFNEGLCREATESYNCPROC eglCreateSync;
extern PFNEGLDESTROYSYNCPROC eglDestroySync;
extern PFNEGLCLIENTWAITSYNCPROC eglClientWaitSync;
extern PFNEGLGETSYNCATTRIBPROC eglGetSyncAttrib;

extern PFNEGLCREATEIMAGEPROC eglCreateImage;
extern PFNEGLDESTROYIMAGEPROC eglDestroyImage;

extern PFNEGLGETPLATFORMDISPLAYPROC eglGetPlatformDisplay;
extern PFNEGLCREATEPLATFORMWINDOWSURFACEPROC eglCreatePlatformWindowSurface;
extern PFNEGLCREATEPLATFORMPIXMAPSURFACEPROC eglCreatePlatformPixmapSurface;

extern PFNEGLWAITSYNCPROC eglWaitSync;

    #if defined(EGL_ANDROID_blob_cache)
extern PFNEGLSETBLOBCACHEFUNCSANDROIDPROC eglSetBlobCacheFuncsANDROID;
    #endif /* defined(EGL_ANDROID_blob_cache) */

    #if defined(EGL_ANDROID_create_native_client_buffer)
extern PFNEGLCREATENATIVECLIENTBUFFERANDROIDPROC eglCreateNativeClientBufferANDROID;
    #endif /* defined(EGL_ANDROID_create_native_client_buffer) */

    #if defined(EGL_ANDROID_get_native_client_buffer)
extern PFNEGLGETNATIVECLIENTBUFFERANDROIDPROC eglGetNativeClientBufferANDROID;
    #endif /* defined(EGL_ANDROID_get_native_client_buffer) */

    #if defined(EGL_ANDROID_native_fence_sync)
extern PFNEGLDUPNATIVEFENCEFDANDROIDPROC eglDupNativeFenceFDANDROID;
    #endif /* defined(EGL_ANDROID_native_fence_sync) */

    #if defined(EGL_ANDROID_presentation_time)
extern PFNEGLPRESENTATIONTIMEANDROIDPROC eglPresentationTimeANDROID;
    #endif /* defined(EGL_ANDROID_presentation_time) */

    #if defined(EGL_ANDROID_get_frame_timestamps)
extern PFNEGLGETCOMPOSITORTIMINGSUPPORTEDANDROIDPROC eglGetCompositorTimingSupportedANDROID;
extern PFNEGLGETCOMPOSITORTIMINGANDROIDPROC eglGetCompositorTimingANDROID;
extern PFNEGLGETNEXTFRAMEIDANDROIDPROC eglGetNextFrameIdANDROID;
extern PFNEGLGETFRAMETIMESTAMPSUPPORTEDANDROIDPROC eglGetFrameTimestampSupportedANDROID;
extern PFNEGLGETFRAMETIMESTAMPSANDROIDPROC eglGetFrameTimestampsANDROID;
    #endif /* defined(EGL_ANDROID_get_frame_timestamps) */

    #if defined(EGL_ANGLE_query_surface_pointer)
extern PFNEGLQUERYSURFACEPOINTERANGLEPROC eglQuerySurfacePointerANGLE;
    #endif /* defined(EGL_ANGLE_query_surface_pointer) */

    #if defined(EGL_ANGLE_sync_control_rate)
extern PFNEGLGETMSCRATEANGLEPROC eglGetMscRateANGLE;
    #endif /* defined(EGL_ANGLE_sync_control_rate) */

    #if defined(EGL_EXT_client_sync)
extern PFNEGLCLIENTSIGNALSYNCEXTPROC eglClientSignalSyncEXT;
    #endif /* defined(EGL_EXT_client_sync) */

    #if defined(EGL_EXT_device_base)
extern PFNEGLQUERYDEVICEATTRIBEXTPROC eglQueryDeviceAttribEXT;
extern PFNEGLQUERYDEVICESTRINGEXTPROC eglQueryDeviceStringEXT;
extern PFNEGLQUERYDEVICESEXTPROC eglQueryDevicesEXT;
extern PFNEGLQUERYDISPLAYATTRIBEXTPROC eglQueryDisplayAttribEXT;
    #endif /* defined(EGL_EXT_device_base) */

    #if defined(EGL_EXT_image_dma_buf_import_modifiers)
extern PFNEGLQUERYDMABUFFORMATSEXTPROC eglQueryDmaBufFormatsEXT;
extern PFNEGLQUERYDMABUFMODIFIERSEXTPROC eglQueryDmaBufModifiersEXT;
    #endif /* defined(EGL_EXT_image_dma_buf_import_modifiers) */

    #if defined(EGL_EXT_output_base)
extern PFNEGLGETOUTPUTLAYERSEXTPROC eglGetOutputLayersEXT;
extern PFNEGLGETOUTPUTPORTSEXTPROC eglGetOutputPortsEXT;
extern PFNEGLOUTPUTLAYERATTRIBEXTPROC eglOutputLayerAttribEXT;
extern PFNEGLQUERYOUTPUTLAYERATTRIBEXTPROC eglQueryOutputLayerAttribEXT;
extern PFNEGLQUERYOUTPUTLAYERSTRINGEXTPROC eglQueryOutputLayerStringEXT;
extern PFNEGLOUTPUTPORTATTRIBEXTPROC eglOutputPortAttribEXT;
extern PFNEGLQUERYOUTPUTPORTATTRIBEXTPROC eglQueryOutputPortAttribEXT;
extern PFNEGLQUERYOUTPUTPORTSTRINGEXTPROC eglQueryOutputPortStringEXT;
    #endif /* defined(EGL_EXT_output_base) */

    #if defined(EGL_EXT_platform_base)
extern PFNEGLGETPLATFORMDISPLAYEXTPROC eglGetPlatformDisplayEXT;
extern PFNEGLCREATEPLATFORMWINDOWSURFACEEXTPROC eglCreatePlatformWindowSurfaceEXT;
extern PFNEGLCREATEPLATFORMPIXMAPSURFACEEXTPROC eglCreatePlatformPixmapSurfaceEXT;
    #endif /* defined(EGL_EXT_platform_base) */

    #if defined(EGL_EXT_stream_consumer_egloutput)
extern PFNEGLSTREAMCONSUMEROUTPUTEXTPROC eglStreamConsumerOutputEXT;
    #endif /* defined(EGL_EXT_stream_consumer_egloutput) */

    #if defined(EGL_EXT_swap_buffers_with_damage)
extern PFNEGLSWAPBUFFERSWITHDAMAGEEXTPROC eglSwapBuffersWithDamageEXT;
    #endif /* defined(EGL_EXT_swap_buffers_with_damage) */

    #if defined(EGL_EXT_sync_reuse)
extern PFNEGLUNSIGNALSYNCEXTPROC eglUnsignalSyncEXT;
    #endif /* defined(EGL_EXT_sync_reuse) */

    #if defined(EGL_HI_clientpixmap)
extern PFNEGLCREATEPIXMAPSURFACEHIPROC eglCreatePixmapSurfaceHI;
    #endif /* defined(EGL_HI_clientpixmap) */

    #if defined(EGL_KHR_cl_event2)
extern PFNEGLCREATESYNC64KHRPROC eglCreateSync64KHR;
    #endif /* defined(EGL_KHR_cl_event2) */

    #if defined(EGL_KHR_debug)
extern PFNEGLDEBUGMESSAGECONTROLKHRPROC eglDebugMessageControlKHR;
extern PFNEGLQUERYDEBUGKHRPROC eglQueryDebugKHR;
extern PFNEGLLABELOBJECTKHRPROC eglLabelObjectKHR;
    #endif /* defined(EGL_KHR_debug) */

    #if defined(EGL_KHR_display_reference)
extern PFNEGLQUERYDISPLAYATTRIBKHRPROC eglQueryDisplayAttribKHR;
    #endif /* defined(EGL_KHR_display_reference) */

    #if defined(EGL_KHR_fence_sync)
extern PFNEGLCREATESYNCKHRPROC eglCreateSyncKHR;
extern PFNEGLDESTROYSYNCKHRPROC eglDestroySyncKHR;
extern PFNEGLCLIENTWAITSYNCKHRPROC eglClientWaitSyncKHR;
extern PFNEGLGETSYNCATTRIBKHRPROC eglGetSyncAttribKHR;
    #endif /* defined(EGL_KHR_fence_sync) */

    #if defined(EGL_KHR_image)
extern PFNEGLCREATEIMAGEKHRPROC eglCreateImageKHR;
extern PFNEGLDESTROYIMAGEKHRPROC eglDestroyImageKHR;
    #endif /* defined(EGL_KHR_image) */

    #if defined(EGL_KHR_lock_surface)
extern PFNEGLLOCKSURFACEKHRPROC eglLockSurfaceKHR;
extern PFNEGLUNLOCKSURFACEKHRPROC eglUnlockSurfaceKHR;
    #endif /* defined(EGL_KHR_lock_surface) */

    #if defined(EGL_KHR_lock_surface3)
extern PFNEGLQUERYSURFACE64KHRPROC eglQuerySurface64KHR;
    #endif /* defined(EGL_KHR_lock_surface3) */

    #if defined(EGL_KHR_partial_update)
extern PFNEGLSETDAMAGEREGIONKHRPROC eglSetDamageRegionKHR;
    #endif /* defined(EGL_KHR_partial_update) */

    #if defined(EGL_KHR_reusable_sync)
extern PFNEGLSIGNALSYNCKHRPROC eglSignalSyncKHR;
    #endif /* defined(EGL_KHR_reusable_sync) */

    #if defined(EGL_KHR_stream)
extern PFNEGLCREATESTREAMKHRPROC eglCreateStreamKHR;
extern PFNEGLDESTROYSTREAMKHRPROC eglDestroyStreamKHR;
extern PFNEGLSTREAMATTRIBKHRPROC eglStreamAttribKHR;
extern PFNEGLQUERYSTREAMKHRPROC eglQueryStreamKHR;
extern PFNEGLQUERYSTREAMU64KHRPROC eglQueryStreamu64KHR;
    #endif /* defined(EGL_KHR_stream) */

    #if defined(EGL_KHR_stream_attrib)
extern PFNEGLCREATESTREAMATTRIBKHRPROC eglCreateStreamAttribKHR;
extern PFNEGLSETSTREAMATTRIBKHRPROC eglSetStreamAttribKHR;
extern PFNEGLQUERYSTREAMATTRIBKHRPROC eglQueryStreamAttribKHR;
extern PFNEGLSTREAMCONSUMERACQUIREATTRIBKHRPROC eglStreamConsumerAcquireAttribKHR;
extern PFNEGLSTREAMCONSUMERRELEASEATTRIBKHRPROC eglStreamConsumerReleaseAttribKHR;
    #endif /* defined(EGL_KHR_stream_attrib) */

    #if defined(EGL_KHR_stream_consumer_gltexture)
extern PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALKHRPROC eglStreamConsumerGLTextureExternalKHR;
extern PFNEGLSTREAMCONSUMERACQUIREKHRPROC eglStreamConsumerAcquireKHR;
extern PFNEGLSTREAMCONSUMERRELEASEKHRPROC eglStreamConsumerReleaseKHR;
    #endif /* defined(EGL_KHR_stream_consumer_gltexture) */

    #if defined(EGL_KHR_stream_cross_process_fd)
extern PFNEGLGETSTREAMFILEDESCRIPTORKHRPROC eglGetStreamFileDescriptorKHR;
extern PFNEGLCREATESTREAMFROMFILEDESCRIPTORKHRPROC eglCreateStreamFromFileDescriptorKHR;
    #endif /* defined(EGL_KHR_stream_cross_process_fd) */

    #if defined(EGL_KHR_stream_fifo)
extern PFNEGLQUERYSTREAMTIMEKHRPROC eglQueryStreamTimeKHR;
    #endif /* defined(EGL_KHR_stream_fifo) */

    #if defined(EGL_KHR_stream_producer_eglsurface)
extern PFNEGLCREATESTREAMPRODUCERSURFACEKHRPROC eglCreateStreamProducerSurfaceKHR;
    #endif /* defined(EGL_KHR_stream_producer_eglsurface) */

    #if defined(EGL_KHR_swap_buffers_with_damage)
extern PFNEGLSWAPBUFFERSWITHDAMAGEKHRPROC eglSwapBuffersWithDamageKHR;
    #endif /* defined(EGL_KHR_swap_buffers_with_damage) */

    #if defined(EGL_KHR_wait_sync)
extern PFNEGLWAITSYNCKHRPROC eglWaitSyncKHR;
    #endif /* defined(EGL_KHR_wait_sync) */

    #if defined(EGL_MESA_drm_image)
extern PFNEGLCREATEDRMIMAGEMESAPROC eglCreateDRMImageMESA;
extern PFNEGLEXPORTDRMIMAGEMESAPROC eglExportDRMImageMESA;
    #endif /* defined(EGL_MESA_drm_image) */

    #if defined(EGL_MESA_image_dma_buf_export)
extern PFNEGLEXPORTDMABUFIMAGEQUERYMESAPROC eglExportDMABUFImageQueryMESA;
extern PFNEGLEXPORTDMABUFIMAGEMESAPROC eglExportDMABUFImageMESA;
    #endif /* defined(EGL_MESA_image_dma_buf_export) */

    #if defined(EGL_MESA_query_driver)
extern PFNEGLGETDISPLAYDRIVERCONFIGPROC eglGetDisplayDriverConfig;
extern PFNEGLGETDISPLAYDRIVERNAMEPROC eglGetDisplayDriverName;
    #endif /* defined(EGL_MESA_query_driver) */

    #if defined(EGL_NOK_swap_region)
extern PFNEGLSWAPBUFFERSREGIONNOKPROC eglSwapBuffersRegionNOK;
    #endif /* defined(EGL_NOK_swap_region) */

    #if defined(EGL_NOK_swap_region2)
extern PFNEGLSWAPBUFFERSREGION2NOKPROC eglSwapBuffersRegion2NOK;
    #endif /* defined(EGL_NOK_swap_region2) */

    #if defined(EGL_NV_native_query)
extern PFNEGLQUERYNATIVEDISPLAYNVPROC eglQueryNativeDisplayNV;
extern PFNEGLQUERYNATIVEWINDOWNVPROC eglQueryNativeWindowNV;
extern PFNEGLQUERYNATIVEPIXMAPNVPROC eglQueryNativePixmapNV;
    #endif /* defined(EGL_NV_native_query) */

    #if defined(EGL_NV_post_sub_buffer)
extern PFNEGLPOSTSUBBUFFERNVPROC eglPostSubBufferNV;
    #endif /* defined(EGL_NV_post_sub_buffer) */

    #if defined(EGL_NV_stream_consumer_gltexture_yuv)
extern PFNEGLSTREAMCONSUMERGLTEXTUREEXTERNALATTRIBSNVPROC eglStreamConsumerGLTextureExternalAttribsNV;
    #endif /* defined(EGL_NV_stream_consumer_gltexture_yuv) */

    #if defined(EGL_NV_stream_consumer_eglimage)
extern PFNEGLSTREAMIMAGECONSUMERCONNECTNVPROC eglStreamImageConsumerConnectNV;
extern PFNEGLQUERYSTREAMCONSUMEREVENTNVPROC eglQueryStreamConsumerEventNV;
extern PFNEGLSTREAMACQUIREIMAGENVPROC eglStreamAcquireImageNV;
extern PFNEGLSTREAMRELEASEIMAGENVPROC eglStreamReleaseImageNV;
    #endif /* defined(EGL_NV_stream_consumer_eglimage) */

    #if defined(EGL_NV_stream_flush)
extern PFNEGLSTREAMFLUSHNVPROC eglStreamFlushNV;
    #endif /* defined(EGL_NV_stream_flush) */

    #if defined(EGL_NV_stream_metadata)
extern PFNEGLQUERYDISPLAYATTRIBNVPROC eglQueryDisplayAttribNV;
extern PFNEGLSETSTREAMMETADATANVPROC eglSetStreamMetadataNV;
extern PFNEGLQUERYSTREAMMETADATANVPROC eglQueryStreamMetadataNV;
    #endif /* defined(EGL_NV_stream_metadata) */

    #if defined(EGL_NV_stream_reset)
extern PFNEGLRESETSTREAMNVPROC eglResetStreamNV;
    #endif /* defined(EGL_NV_stream_reset) */

    #if defined(EGL_NV_stream_sync)
extern PFNEGLCREATESTREAMSYNCNVPROC eglCreateStreamSyncNV;
    #endif /* defined(EGL_NV_stream_sync) */

    #if defined(EGL_NV_sync)
extern PFNEGLCREATEFENCESYNCNVPROC eglCreateFenceSyncNV;
extern PFNEGLDESTROYSYNCNVPROC eglDestroySyncNV;
extern PFNEGLFENCENVPROC eglFenceNV;
extern PFNEGLCLIENTWAITSYNCNVPROC eglClientWaitSyncNV;
extern PFNEGLSIGNALSYNCNVPROC eglSignalSyncNV;
extern PFNEGLGETSYNCATTRIBNVPROC eglGetSyncAttribNV;
    #endif /* defined(EGL_NV_sync) */

    #if defined(EGL_NV_system_time)
extern PFNEGLGETSYSTEMTIMEFREQUENCYNVPROC eglGetSystemTimeFrequencyNV;
extern PFNEGLGETSYSTEMTIMENVPROC eglGetSystemTimeNV;
    #endif /* defined(EGL_NV_system_time) */

    #if defined(EGL_EXT_compositor)
extern PFNEGLCOMPOSITORSETCONTEXTLISTEXTPROC eglCompositorSetContextListEXT;
extern PFNEGLCOMPOSITORSETCONTEXTATTRIBUTESEXTPROC eglCompositorSetContextAttributesEXT;
extern PFNEGLCOMPOSITORSETWINDOWLISTEXTPROC eglCompositorSetWindowListEXT;
extern PFNEGLCOMPOSITORSETWINDOWATTRIBUTESEXTPROC eglCompositorSetWindowAttributesEXT;
extern PFNEGLCOMPOSITORBINDTEXWINDOWEXTPROC eglCompositorBindTexWindowEXT;
extern PFNEGLCOMPOSITORSETSIZEEXTPROC eglCompositorSetSizeEXT;
extern PFNEGLCOMPOSITORSWAPPOLICYEXTPROC eglCompositorSwapPolicyEXT;
    #endif /* defined(EGL_EXT_compositor) */

    #if defined(EGL_WL_bind_wayland_display)
extern PFNEGLBINDWAYLANDDISPLAYWLPROC eglBindWaylandDisplayWL;
extern PFNEGLUNBINDWAYLANDDISPLAYWLPROC eglUnbindWaylandDisplayWL;
extern PFNEGLQUERYWAYLANDBUFFERWLPROC eglQueryWaylandBufferWL;
    #endif /* defined(EGL_WL_bind_wayland_display) */

    #if defined(EGL_WL_create_wayland_buffer_from_image)
extern PFNEGLCREATEWAYLANDBUFFERFROMIMAGEWLPROC eglCreateWaylandBufferFromImageWL;
    #endif /* defined(EGL_WL_create_wayland_buffer_from_image) */

/* EGLW_GENERATE_EGL_DECLARATION */

/**
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 * The above section is auto-generated from EGL spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 */

#endif

using PFNEGLWLOADPROC = void *(*)(const char *);
void eglwLoadProcs(PFNEGLWLOADPROC eglwLoad);
