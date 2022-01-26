/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

package com.cocos.lib;


import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import okhttp3.*;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class CocosDownloader {

    private static final HiLogLabel LABEL = new HiLogLabel(HiLog.LOG_APP, 0, "CocosDownloader");

    private int _id;
    private OkHttpClient _httpClient = null;

    private String _tempFileNameSuffix;
    private int _countOfMaxProcessingTasks;
    private final ConcurrentHashMap<Integer, Call> _taskMap = new ConcurrentHashMap<>();
    private final Queue<Runnable> _taskQueue = new LinkedList<>();
    private int _runningTaskCount = 0;
    private static final ConcurrentHashMap<String, Boolean> _resumingSupport = new ConcurrentHashMap<>();

    private void onProgress(final int id, final long downloadBytes, final long downloadNow, final long downloadTotal) {
        CocosHelper.runOnGameThread(() ->
                nativeOnProgress(_id, id, downloadBytes, downloadNow, downloadTotal)
        );
    }

    private void onFinish(final int id, final int errCode, final String errStr, final byte[] data) {
        Call task =_taskMap.get(id);
        if (null == task) return;
        _taskMap.remove(id);
        _runningTaskCount -= 1;
        CocosHelper.runOnGameThread(() ->
                nativeOnFinish(_id, id, errCode, errStr, data)
        );
        runNextTaskIfExists();
    }

    @SuppressWarnings("unused")
    public static CocosDownloader createDownloader(int id, int timeoutInSeconds, String tempFileSuffix, int maxProcessingTasks) {
        CocosDownloader downloader = new CocosDownloader();
        downloader._id = id;

        if (timeoutInSeconds > 0) {
            downloader._httpClient = new OkHttpClient().newBuilder()
                    .followRedirects(true)
                    .followSslRedirects(true)
                    .callTimeout(timeoutInSeconds, TimeUnit.SECONDS)
                    .build();
        } else {
            downloader._httpClient = new OkHttpClient().newBuilder()
                    .followRedirects(true)
                    .followSslRedirects(true)
                    .build();
        }


        downloader._tempFileNameSuffix = tempFileSuffix;
        downloader._countOfMaxProcessingTasks = maxProcessingTasks;
        return downloader;
    }

    @SuppressWarnings("unused")
    public static void createTask(final CocosDownloader downloader, int id_, String url_, String path_, String []header_) {
        final int id = id_;
        final String url = url_;
        final String path = path_;
        final String[] header = header_;

        Runnable taskRunnable = new Runnable() {
            String domain = null;
            String host = null;
            File tempFile = null;
            File finalFile = null;
            long downloadStart = 0;

            @Override
            public void run() {
                Call task = null;

                do {
                    if (path.length() > 0) {
                        try {
                            URI uri = new URI(url);
                            domain = uri.getHost();
                        } catch (URISyntaxException | NullPointerException e) {
                            e.printStackTrace();
                            break;
                        }

                        // file task
                        tempFile = new File(path + downloader._tempFileNameSuffix);
                        if (tempFile.isDirectory()) break;

                        File parent = tempFile.getParentFile();
                        if (!parent.isDirectory() && !parent.mkdirs()) break;

                        finalFile = new File(path);
                        if (finalFile.isDirectory()) break;
                        long fileLen = tempFile.length();

                        host = domain.startsWith("www.") ? domain.substring(4) : domain;
                        if (fileLen > 0) {
                            if (_resumingSupport.containsKey(host) && _resumingSupport.get(host)) {
                                downloadStart = fileLen;
                            } else {
                                // Remove previous downloaded context
                                try {
                                    PrintWriter writer = new PrintWriter(tempFile);
                                    writer.print("");
                                    writer.close();
                                }
                                // Not found then nothing to do
                                catch (FileNotFoundException e) {
                                }
                            }
                        }
                    }

                    final Request.Builder builder = new Request.Builder().url(url);
                    for (int i = 0; i < header.length / 2; i++) {
                        builder.addHeader(header[i * 2], header[(i * 2) + 1]);
                    }
                    if (downloadStart > 0) {
                        builder.addHeader("RANGE", "bytes=" + downloadStart + "-");
                    }

                    final Request request = builder.build();
                    task = downloader._httpClient.newCall(request);
                    task.enqueue(new Callback() {
                        @Override
                        public void onFailure(Call call, IOException e) {
                            downloader.onFinish(id, 0, e.toString(), null);
                        }

                        @Override
                        public void onResponse(Call call, Response response) throws IOException {
                            InputStream is = null;
                            byte[] buf = new byte[4096];
                            FileOutputStream fos = null;

                            try {

                                if(!(response.code() >= 200 && response.code() <= 206)) {
                                    // it is encourage to delete the tmp file when requested range not satisfiable.
                                    if (response.code() == 416) {
                                        File file = new File(path + downloader._tempFileNameSuffix);
                                        if (file.exists() && file.isFile()) {
                                            file.delete();
                                        }
                                    } 
                                    downloader.onFinish(id, -2, response.message(), null);
                                    return;
                                }

                                long total = response.body().contentLength();
                                if (path.length() > 0 && !_resumingSupport.containsKey(host)) {
                                    if (total > 0) {
                                        _resumingSupport.put(host, true);
                                    } else {
                                        _resumingSupport.put(host, false);
                                    }
                                }

                                long current = downloadStart;
                                is = response.body().byteStream();

                                if (path.length() > 0) {
                                    if (downloadStart > 0) {
                                        fos = new FileOutputStream(tempFile, true);
                                    } else {
                                        fos = new FileOutputStream(tempFile, false);
                                    }

                                    int len;
                                    while ((len = is.read(buf)) != -1) {
                                        current += len;
                                        fos.write(buf, 0, len);
                                        downloader.onProgress(id, len, current, total);
                                    }
                                    fos.flush();

                                    String errStr = null;
                                    do {
                                        // rename temp file to final file, if final file exist, remove it
                                        if (finalFile.exists()) {
                                            if (finalFile.isDirectory()) {
                                                break;
                                            }
                                            if (!finalFile.delete()) {
                                                errStr = "Can't remove old file:" + finalFile.getAbsolutePath();
                                                break;
                                            }
                                        }
                                        tempFile.renameTo(finalFile);
                                    } while (false);

                                    if (errStr == null) {
                                        downloader.onFinish(id, 0, null, null);
                                        downloader.runNextTaskIfExists();
                                    }
                                    else
                                        downloader.onFinish(id, 0, errStr, null);
                                } else {
                                    // 非文件
                                    ByteArrayOutputStream buffer;
                                    if(total > 0) {
                                        buffer = new ByteArrayOutputStream((int) total);
                                    } else {
                                        buffer = new ByteArrayOutputStream(4096);
                                    }

                                    int len;
                                    while ((len = is.read(buf)) != -1) {
                                        current += len;
                                        buffer.write(buf, 0, len);
                                        downloader.onProgress(id, len, current, total);
                                    }
                                    downloader.onFinish(id, 0, null, buffer.toByteArray());
                                    downloader.runNextTaskIfExists();
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                                downloader.onFinish(id, 0, e.toString(), null);
                            } finally {
                                try {
                                    if (is != null) {
                                        is.close();
                                    }
                                    if (fos != null) {
                                        fos.close();
                                    }
                                } catch (IOException e) {
                                    HiLog.error(LABEL, e.toString());
                                }
                            }
                        }
                    });
                } while (false);

                if (null == task) {
                    final String errStr = "Can't create DownloadTask for " + url;
                    CocosHelper.runOnGameThread(() ->
                            downloader.nativeOnFinish(downloader._id, id, 0, errStr, null)
                    );
                } else {
                    downloader._taskMap.put(id, task);
                }
            }
        };
        downloader.enqueueTask(taskRunnable);
    }

    public static void abort(final CocosDownloader downloader, final int id) {
        CocosHelper.runOnUIThread(() -> {
            for (Map.Entry<?, Call> entry : downloader._taskMap.entrySet()) {
                Object key = entry.getKey();
                Call task =  entry.getValue();
                if (null != task && Integer.parseInt(key.toString()) == id) {
                    task.cancel();
                    downloader._taskMap.remove(id);
                    downloader.runNextTaskIfExists();
                    break;
                }
            }
        });
    }

    @SuppressWarnings("unused")
    public static void cancelAllRequests(final CocosDownloader downloader) {
        CocosHelper.runOnUIThread(() -> {
            for (Map.Entry<?, Call>  entry : downloader._taskMap.entrySet()) {
                Call task = entry.getValue();
                if (null != task) {
                    task.cancel();
                }
            }
        });
    }


    private void enqueueTask(Runnable taskRunnable) {
        synchronized (_taskQueue) {
            if (_runningTaskCount < _countOfMaxProcessingTasks) {
                CocosHelper.runOnUIThread(taskRunnable);
                _runningTaskCount++;
            } else {
                _taskQueue.add(taskRunnable);
            }
        }
    }

    private void runNextTaskIfExists() {
        synchronized (_taskQueue) {
            while (_runningTaskCount < _countOfMaxProcessingTasks && 
                CocosDownloader.this._taskQueue.size() > 0) {
                
                Runnable taskRunnable = CocosDownloader.this._taskQueue.poll();
                CocosHelper.runOnUIThread(taskRunnable);
                _runningTaskCount += 1;
            }
        }
    }

    native void nativeOnProgress(int id, int taskId, long dl, long dlnow, long dltotal);
    native void nativeOnFinish(int id, int taskId, int errCode, String errStr, final byte[] data);
}
