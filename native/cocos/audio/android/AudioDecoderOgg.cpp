#define LOG_TAG "AudioDecoderOgg"

#include "audio/android/AudioDecoderOgg.h"
#include "platform/CCFileUtils.h"

namespace cocos2d { namespace experimental {

AudioDecoderOgg::AudioDecoderOgg()
{
    ALOGV("Create AudioDecoderOgg");
}

AudioDecoderOgg::~AudioDecoderOgg()
{

}

int AudioDecoderOgg::fseek64Wrap(void* datasource, ogg_int64_t off, int whence)
{
    return AudioDecoder::fileSeek(datasource, (long)off, whence);
}

bool AudioDecoderOgg::decodeToPcm()
{
    _fileData = FileUtils::getInstance()->getDataFromFile(_url);
    if (_fileData.isNull())
    {
        return false;
    }

    ov_callbacks callbacks;
    callbacks.read_func = AudioDecoder::fileRead;
    callbacks.seek_func = AudioDecoderOgg::fseek64Wrap;
    callbacks.close_func = AudioDecoder::fileClose;
    callbacks.tell_func = AudioDecoder::fileTell;

    _fileCurrPos = 0;

    OggVorbis_File vf;
    int ret = ov_open_callbacks(this, &vf, NULL, 0, callbacks);
    if (ret != 0)
    {
        ALOGE("Open file error, file: %s, ov_open_callbacks return %d", _url.c_str(), ret);
        return false;
    }
    // header
    auto vi = ov_info(&vf, -1);

    uint32_t uiPCMSamples = (uint32_t) ov_pcm_total(&vf, -1);

    uint32_t bufferSize = uiPCMSamples * vi->channels * sizeof(short);
    char* pvPCMBuffer = (char*)malloc(bufferSize);
    memset(pvPCMBuffer, 0, bufferSize);

    int currentSection = 0;
    long curPos = 0;
    long readBytes = 0;
    // decode
    do {
        readBytes = ov_read(&vf, pvPCMBuffer + curPos, 4096, &currentSection);
        curPos += readBytes;
    } while (readBytes > 0);

    _result.pcmBuffer->insert(_result.pcmBuffer->end(), pvPCMBuffer, pvPCMBuffer + bufferSize);
    _result.numChannels = vi->channels;
    _result.sampleRate = vi->rate;
    _result.bitsPerSample = SL_PCMSAMPLEFORMAT_FIXED_16;
    _result.containerSize = SL_PCMSAMPLEFORMAT_FIXED_16;
    _result.channelMask = vi->channels == 1 ? SL_SPEAKER_FRONT_CENTER : (SL_SPEAKER_FRONT_LEFT | SL_SPEAKER_FRONT_RIGHT);
    _result.endianness = SL_BYTEORDER_LITTLEENDIAN;
    _result.numFrames = uiPCMSamples;
    _result.duration = 1.0f * uiPCMSamples / vi->rate;

    ov_clear(&vf);
    free(pvPCMBuffer);

    return true;
}

}} // namespace cocos2d { namespace experimental {