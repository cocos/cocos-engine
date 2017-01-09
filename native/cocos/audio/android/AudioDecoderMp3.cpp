#define LOG_TAG "AudioDecoderMp3"

#include "audio/android/AudioDecoderMp3.h"
#include "audio/android/mp3reader.h"
#include "platform/CCFileUtils.h"

namespace cocos2d { namespace experimental {

AudioDecoderMp3::AudioDecoderMp3()
{
    ALOGV("Create AudioDecoderMp3");
}

AudioDecoderMp3::~AudioDecoderMp3()
{

}

bool AudioDecoderMp3::decodeToPcm()
{
    _fileData = FileUtils::getInstance()->getDataFromFile(_url);
    if (_fileData.isNull())
    {
        return false;
    }

    mp3_callbacks callbacks;
    callbacks.read = AudioDecoder::fileRead;
    callbacks.seek = AudioDecoder::fileSeek;
    callbacks.close = AudioDecoder::fileClose;
    callbacks.tell = AudioDecoder::fileTell;

    int numChannels = 0;
    int sampleRate = 0;
    int numFrames = 0;
    decodeMP3(&callbacks, this, *_result.pcmBuffer, &numChannels, &sampleRate, &numFrames);

    _result.numChannels = numChannels;
    _result.sampleRate = sampleRate;
    _result.bitsPerSample = SL_PCMSAMPLEFORMAT_FIXED_16;
    _result.containerSize = SL_PCMSAMPLEFORMAT_FIXED_16;
    _result.channelMask = numChannels == 1 ? SL_SPEAKER_FRONT_CENTER : (SL_SPEAKER_FRONT_LEFT | SL_SPEAKER_FRONT_RIGHT);
    _result.endianness = SL_BYTEORDER_LITTLEENDIAN;
    _result.numFrames = numFrames;
    _result.duration = 1.0f * numFrames / sampleRate;

    std::string info = _result.toString();
    ALOGI("Original audio info: %s, total size: %d", info.c_str(), (int)_result.pcmBuffer->size());
    return true;
}

}} // namespace cocos2d { namespace experimental {