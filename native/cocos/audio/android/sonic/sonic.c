/* Sonic library
   Copyright 2010
   Bill Cox
   This file is part of the Sonic Library.

   This file is licensed under the Apache 2.0 license.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#ifdef SONIC_USE_SIN
#include <math.h>
#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif
#endif
#include "sonic.h"

struct sonicStreamStruct {
    short *inputBuffer;
    short *outputBuffer;
    short *pitchBuffer;
    short *downSampleBuffer;
    float speed;
    float volume;
    float pitch;
    float rate;
    int oldRatePosition;
    int newRatePosition;
    int useChordPitch;
    int quality;
    int numChannels;
    int inputBufferSize;
    int pitchBufferSize;
    int outputBufferSize;
    int numInputSamples;
    int numOutputSamples;
    int numPitchSamples;
    int minPeriod;
    int maxPeriod;
    int maxRequired;
    int remainingInputToCopy;
    int sampleRate;
    int prevPeriod;
    int prevMinDiff;
};

/* Just used for debugging */
/*
void sonicMSG(char *format, ...)
{
    char buffer[4096];
    va_list ap;
    FILE *file;

    va_start(ap, format);
    vsprintf((char *)buffer, (char *)format, ap);
    va_end(ap);
    file=fopen("/tmp/sonic.log", "a");
    fprintf(file, "%s", buffer);
    fclose(file);
}
*/

/* Scale the samples by the factor. */
static void scaleSamples(
    short *samples,
    int numSamples,
    float volume)
{
    int fixedPointVolume = volume*4096.0f;
    int value;

    while(numSamples--) {
	value = (*samples*fixedPointVolume) >> 12;
	if(value > 32767) {
	    value = 32767;
	} else if(value < -32767) {
	    value = -32767;
	}
	*samples++ = value;
    }
}

/* Get the speed of the stream. */
float sonicGetSpeed(
    sonicStream stream)
{
    return stream->speed;
}

/* Set the speed of the stream. */
void sonicSetSpeed(
    sonicStream stream,
    float speed)
{
    stream->speed = speed;
}

/* Get the pitch of the stream. */
float sonicGetPitch(
    sonicStream stream)
{
    return stream->pitch;
}

/* Set the pitch of the stream. */
void sonicSetPitch(
    sonicStream stream,
    float pitch)
{
    stream->pitch = pitch;
}

/* Get the rate of the stream. */
float sonicGetRate(
    sonicStream stream)
{
    return stream->rate;
}

/* Set the playback rate of the stream. This scales pitch and speed at the same time. */
void sonicSetRate(
    sonicStream stream,
    float rate)
{
    stream->rate = rate;

    stream->oldRatePosition = 0;
    stream->newRatePosition = 0;
}

/* Get the vocal chord pitch setting. */
int sonicGetChordPitch(
    sonicStream stream)
{
    return stream->useChordPitch;
}

/* Set the vocal chord mode for pitch computation.  Default is off. */
void sonicSetChordPitch(
    sonicStream stream,
    int useChordPitch)
{
    stream->useChordPitch = useChordPitch;
}

/* Get the quality setting. */
int sonicGetQuality(
    sonicStream stream)
{
    return stream->quality;
}

/* Set the "quality".  Default 0 is virtually as good as 1, but very much faster. */
void sonicSetQuality(
    sonicStream stream,
    int quality)
{
    stream->quality = quality;
}

/* Get the scaling factor of the stream. */
float sonicGetVolume(
    sonicStream stream)
{
    return stream->volume;
}

/* Set the scaling factor of the stream. */
void sonicSetVolume(
    sonicStream stream,
    float volume)
{
    stream->volume = volume;
}

/* Free stream buffers. */
static void freeStreamBuffers(
    sonicStream stream)
{
    if(stream->inputBuffer != NULL) {
	free(stream->inputBuffer);
    }
    if(stream->outputBuffer != NULL) {
	free(stream->outputBuffer);
    }
    if(stream->pitchBuffer != NULL) {
	free(stream->pitchBuffer);
    }
    if(stream->downSampleBuffer != NULL) {
	free(stream->downSampleBuffer);
    }
}

/* Destroy the sonic stream. */
void sonicDestroyStream(
    sonicStream stream)
{
    freeStreamBuffers(stream);
    free(stream);
}

/* Allocate stream buffers. */
static int allocateStreamBuffers(
    sonicStream stream,
    int sampleRate,
    int numChannels)
{
    int minPeriod = sampleRate/SONIC_MAX_PITCH;
    int maxPeriod = sampleRate/SONIC_MIN_PITCH;
    int maxRequired = 2*maxPeriod; 

    stream->inputBufferSize = maxRequired;
    stream->inputBuffer = (short *)calloc(maxRequired, sizeof(short)*numChannels);
    if(stream->inputBuffer == NULL) {
	sonicDestroyStream(stream);
	return 0;
    }
    stream->outputBufferSize = maxRequired;
    stream->outputBuffer = (short *)calloc(maxRequired, sizeof(short)*numChannels);
    if(stream->outputBuffer == NULL) {
	sonicDestroyStream(stream);
	return 0;
    }
    stream->pitchBufferSize = maxRequired;
    stream->pitchBuffer = (short *)calloc(maxRequired, sizeof(short)*numChannels);
    if(stream->pitchBuffer == NULL) {
	sonicDestroyStream(stream);
	return 0;
    }
    stream->downSampleBuffer = (short *)calloc(maxRequired, sizeof(short));
    if(stream->downSampleBuffer == NULL) {
	sonicDestroyStream(stream);
	return 0;
    }
    stream->sampleRate = sampleRate;
    stream->numChannels = numChannels;
    stream->oldRatePosition = 0;
    stream->newRatePosition = 0;
    stream->minPeriod = minPeriod;
    stream->maxPeriod = maxPeriod;
    stream->maxRequired = maxRequired;
    stream->prevPeriod = 0;
    return 1;
}

/* Create a sonic stream.  Return NULL only if we are out of memory and cannot
   allocate the stream. */
sonicStream sonicCreateStream(
    int sampleRate,
    int numChannels)
{
    sonicStream stream = (sonicStream)calloc(1, sizeof(struct sonicStreamStruct));

    if(stream == NULL) {
	return NULL;
    }
    if(!allocateStreamBuffers(stream, sampleRate, numChannels)) {
        return NULL;
    }
    stream->speed = 1.0f;
    stream->pitch = 1.0f;
    stream->volume = 1.0f;
    stream->rate = 1.0f;
    stream->oldRatePosition = 0;
    stream->newRatePosition = 0;
    stream->useChordPitch = 0;
    stream->quality = 0;
    return stream;
}

/* Get the sample rate of the stream. */
int sonicGetSampleRate(
    sonicStream stream)
{
    return stream->sampleRate;
}

/* Set the sample rate of the stream.  This will cause samples buffered in the stream to
   be lost. */
void sonicSetSampleRate(
    sonicStream stream,
    int sampleRate)
{
    freeStreamBuffers(stream);
    allocateStreamBuffers(stream, sampleRate, stream->numChannels);
}

/* Get the number of channels. */
int sonicGetNumChannels(
    sonicStream stream)
{
    return stream->numChannels;
}

/* Set the num channels of the stream.  This will cause samples buffered in the stream to
   be lost. */
void sonicSetNumChannels(
    sonicStream stream,
    int numChannels)
{
    freeStreamBuffers(stream);
    allocateStreamBuffers(stream, stream->sampleRate, numChannels);
}

/* Enlarge the output buffer if needed. */
static int enlargeOutputBufferIfNeeded(
    sonicStream stream,
    int numSamples)
{
    if(stream->numOutputSamples + numSamples > stream->outputBufferSize) {
	stream->outputBufferSize += (stream->outputBufferSize >> 1) + numSamples;
	stream->outputBuffer = (short *)realloc(stream->outputBuffer,
	    stream->outputBufferSize*sizeof(short)*stream->numChannels);
	if(stream->outputBuffer == NULL) {
	    return 0;
	}
    }
    return 1;
}

/* Enlarge the input buffer if needed. */
static int enlargeInputBufferIfNeeded(
    sonicStream stream,
    int numSamples)
{
    if(stream->numInputSamples + numSamples > stream->inputBufferSize) {
	stream->inputBufferSize += (stream->inputBufferSize >> 1) + numSamples;
	stream->inputBuffer = (short *)realloc(stream->inputBuffer,
	    stream->inputBufferSize*sizeof(short)*stream->numChannels);
	if(stream->inputBuffer == NULL) {
	    return 0;
	}
    }
    return 1;
}

/* Add the input samples to the input buffer. */
static int addFloatSamplesToInputBuffer(
    sonicStream stream,
    float *samples,
    int numSamples)
{
    short *buffer;
    int count = numSamples*stream->numChannels;

    if(numSamples == 0) {
	return 1;
    }
    if(!enlargeInputBufferIfNeeded(stream, numSamples)) {
	return 0;
    }
    buffer = stream->inputBuffer + stream->numInputSamples*stream->numChannels;
    while(count--) {
        *buffer++ = (*samples++)*32767.0f;
    }
    stream->numInputSamples += numSamples;
    return 1;
}

/* Add the input samples to the input buffer. */
static int addShortSamplesToInputBuffer(
    sonicStream stream,
    short *samples,
    int numSamples)
{
    if(numSamples == 0) {
	return 1;
    }
    if(!enlargeInputBufferIfNeeded(stream, numSamples)) {
	return 0;
    }
    memcpy(stream->inputBuffer + stream->numInputSamples*stream->numChannels, samples,
        numSamples*sizeof(short)*stream->numChannels);
    stream->numInputSamples += numSamples;
    return 1;
}

/* Add the input samples to the input buffer. */
static int addUnsignedCharSamplesToInputBuffer(
    sonicStream stream,
    unsigned char *samples,
    int numSamples)
{
    short *buffer;
    int count = numSamples*stream->numChannels;

    if(numSamples == 0) {
	return 1;
    }
    if(!enlargeInputBufferIfNeeded(stream, numSamples)) {
	return 0;
    }
    buffer = stream->inputBuffer + stream->numInputSamples*stream->numChannels;
    while(count--) {
        *buffer++ = (*samples++ - 128) << 8;
    }
    stream->numInputSamples += numSamples;
    return 1;
}

/* Remove input samples that we have already processed. */
static void removeInputSamples(
    sonicStream stream,
    int position)
{
    int remainingSamples = stream->numInputSamples - position;

    if(remainingSamples > 0) {
	memmove(stream->inputBuffer, stream->inputBuffer + position*stream->numChannels,
	    remainingSamples*sizeof(short)*stream->numChannels);
    }
    stream->numInputSamples = remainingSamples;
}

/* Just copy from the array to the output buffer */
static int copyToOutput(
    sonicStream stream,
    short *samples,
    int numSamples)
{
    if(!enlargeOutputBufferIfNeeded(stream, numSamples)) {
	return 0;
    }
    memcpy(stream->outputBuffer + stream->numOutputSamples*stream->numChannels,
	samples, numSamples*sizeof(short)*stream->numChannels);
    stream->numOutputSamples += numSamples;
    return 1;
}

/* Just copy from the input buffer to the output buffer.  Return 0 if we fail to
   resize the output buffer.  Otherwise, return numSamples */
static int copyInputToOutput(
    sonicStream stream,
    int position)
{
    int numSamples = stream->remainingInputToCopy;

    if(numSamples > stream->maxRequired) {
	numSamples = stream->maxRequired;
    }
    if(!copyToOutput(stream, stream->inputBuffer + position*stream->numChannels,
	    numSamples)) {
	return 0;
    }
    stream->remainingInputToCopy -= numSamples;
    return numSamples;
}

/* Read data out of the stream.  Sometimes no data will be available, and zero
   is returned, which is not an error condition. */
int sonicReadFloatFromStream(
    sonicStream stream,
    float *samples,
    int maxSamples)
{
    int numSamples = stream->numOutputSamples;
    int remainingSamples = 0;
    short *buffer;
    int count;

    if(numSamples == 0) {
	return 0;
    }
    if(numSamples > maxSamples) {
	remainingSamples = numSamples - maxSamples;
	numSamples = maxSamples;
    }
    buffer = stream->outputBuffer;
    count = numSamples*stream->numChannels;
    while(count--) {
	*samples++ = (*buffer++)/32767.0f;
    }
    if(remainingSamples > 0) {
	memmove(stream->outputBuffer, stream->outputBuffer + numSamples*stream->numChannels,
	    remainingSamples*sizeof(short)*stream->numChannels);
    }
    stream->numOutputSamples = remainingSamples;
    return numSamples;
}

/* Read short data out of the stream.  Sometimes no data will be available, and zero
   is returned, which is not an error condition. */
int sonicReadShortFromStream(
    sonicStream stream,
    short *samples,
    int maxSamples)
{
    int numSamples = stream->numOutputSamples;
    int remainingSamples = 0;

    if(numSamples == 0) {
	return 0;
    }
    if(numSamples > maxSamples) {
	remainingSamples = numSamples - maxSamples;
	numSamples = maxSamples;
    }
    memcpy(samples, stream->outputBuffer, numSamples*sizeof(short)*stream->numChannels);
    if(remainingSamples > 0) {
	memmove(stream->outputBuffer, stream->outputBuffer + numSamples*stream->numChannels,
	    remainingSamples*sizeof(short)*stream->numChannels);
    }
    stream->numOutputSamples = remainingSamples;
    return numSamples;
}

/* Read unsigned char data out of the stream.  Sometimes no data will be available, and zero
   is returned, which is not an error condition. */
int sonicReadUnsignedCharFromStream(
    sonicStream stream,
    unsigned char *samples,
    int maxSamples)
{
    int numSamples = stream->numOutputSamples;
    int remainingSamples = 0;
    short *buffer;
    int count;

    if(numSamples == 0) {
	return 0;
    }
    if(numSamples > maxSamples) {
	remainingSamples = numSamples - maxSamples;
	numSamples = maxSamples;
    }
    buffer = stream->outputBuffer;
    count = numSamples*stream->numChannels;
    while(count--) {
	*samples++ = (char)((*buffer++) >> 8) + 128;
    }
    if(remainingSamples > 0) {
	memmove(stream->outputBuffer, stream->outputBuffer + numSamples*stream->numChannels,
	    remainingSamples*sizeof(short)*stream->numChannels);
    }
    stream->numOutputSamples = remainingSamples;
    return numSamples;
}

/* Force the sonic stream to generate output using whatever data it currently
   has.  No extra delay will be added to the output, but flushing in the middle of
   words could introduce distortion. */
int sonicFlushStream(
    sonicStream stream)
{
    int maxRequired = stream->maxRequired;
    int remainingSamples = stream->numInputSamples;
    float speed = stream->speed/stream->pitch;
    float rate = stream->rate*stream->pitch;
    int expectedOutputSamples = stream->numOutputSamples +
	(int)((remainingSamples/speed + stream->numPitchSamples)/rate + 0.5f);

    /* Add enough silence to flush both input and pitch buffers. */
    if(!enlargeInputBufferIfNeeded(stream, remainingSamples + 2*maxRequired)) {
        return 0;
    }
    memset(stream->inputBuffer + remainingSamples*stream->numChannels, 0,
	2*maxRequired*sizeof(short)*stream->numChannels);
    stream->numInputSamples += 2*maxRequired;
    if(!sonicWriteShortToStream(stream, NULL, 0)) {
	return 0;
    }
    /* Throw away any extra samples we generated due to the silence we added */
    if(stream->numOutputSamples > expectedOutputSamples) {
	stream->numOutputSamples = expectedOutputSamples;
    }
    /* Empty input and pitch buffers */
    stream->numInputSamples = 0;
    stream->remainingInputToCopy = 0;
    stream->numPitchSamples = 0;
    return 1;
}

/* Return the number of samples in the output buffer */
int sonicSamplesAvailable(
   sonicStream stream)
{
    return stream->numOutputSamples;
}

/* If skip is greater than one, average skip samples together and write them to
   the down-sample buffer.  If numChannels is greater than one, mix the channels
   together as we down sample. */
static void downSampleInput(
    sonicStream stream,
    short *samples,
    int skip)
{
    int numSamples = stream->maxRequired/skip;
    int samplesPerValue = stream->numChannels*skip;
    int i, j;
    int value;
    short *downSamples = stream->downSampleBuffer;

    for(i = 0; i < numSamples; i++) {
	value = 0;
        for(j = 0; j < samplesPerValue; j++) {
	    value += *samples++;
	}
	value /= samplesPerValue;
        *downSamples++ = value;
    }
}

/* Find the best frequency match in the range, and given a sample skip multiple.
   For now, just find the pitch of the first channel. */
static int findPitchPeriodInRange(
    short *samples,
    int minPeriod,
    int maxPeriod,
    int *retMinDiff,
    int *retMaxDiff)
{
    int period, bestPeriod = 0, worstPeriod = 255;
    short *s, *p, sVal, pVal;
    unsigned long diff, minDiff = 1, maxDiff = 0;
    int i;

    for(period = minPeriod; period <= maxPeriod; period++) {
	diff = 0;
	s = samples;
	p = samples + period;
	for(i = 0; i < period; i++) {
	    sVal = *s++;
	    pVal = *p++;
	    diff += sVal >= pVal? (unsigned short)(sVal - pVal) :
	        (unsigned short)(pVal - sVal);
	}
	/* Note that the highest number of samples we add into diff will be less
	   than 256, since we skip samples.  Thus, diff is a 24 bit number, and
	   we can safely multiply by numSamples without overflow */
	if(diff*bestPeriod < minDiff*period) {
	    minDiff = diff;
	    bestPeriod = period;
	}
	if(diff*worstPeriod > maxDiff*period) {
	    maxDiff = diff;
	    worstPeriod = period;
	}
    }
    *retMinDiff = minDiff/bestPeriod;
    *retMaxDiff = maxDiff/worstPeriod;
    return bestPeriod;
}

/* At abrupt ends of voiced words, we can have pitch periods that are better
   approximated by the previous pitch period estimate.  Try to detect this case. */
static int prevPeriodBetter(
    sonicStream stream,
    int period,
    int minDiff,
    int maxDiff,
    int preferNewPeriod)
{
    if(minDiff == 0 || stream->prevPeriod == 0) {
	return 0;
    }
    if(preferNewPeriod) {
	if(maxDiff > minDiff*3) {
	    /* Got a reasonable match this period */
	    return 0;
	}
	if(minDiff*2 <= stream->prevMinDiff*3) {
	    /* Mismatch is not that much greater this period */
	    return 0;
	}
    } else {
	if(minDiff <= stream->prevMinDiff) {
	    return 0;
	}
    }
    return 1;
}

/* Find the pitch period.  This is a critical step, and we may have to try
   multiple ways to get a good answer.  This version uses AMDF.  To improve
   speed, we down sample by an integer factor get in the 11KHz range, and then
   do it again with a narrower frequency range without down sampling */
static int findPitchPeriod(
    sonicStream stream,
    short *samples,
    int preferNewPeriod)
{
    int minPeriod = stream->minPeriod;
    int maxPeriod = stream->maxPeriod;
    int sampleRate = stream->sampleRate;
    int minDiff, maxDiff, retPeriod;
    int skip = 1;
    int period;

    if(sampleRate > SONIC_AMDF_FREQ && stream->quality == 0) {
	skip = sampleRate/SONIC_AMDF_FREQ;
    }
    if(stream->numChannels == 1 && skip == 1) {
	period = findPitchPeriodInRange(samples, minPeriod, maxPeriod, &minDiff, &maxDiff);
    } else {
	downSampleInput(stream, samples, skip);
	period = findPitchPeriodInRange(stream->downSampleBuffer, minPeriod/skip,
	    maxPeriod/skip, &minDiff, &maxDiff);
	if(skip != 1) {
	    period *= skip;
	    minPeriod = period - (skip << 2);
	    maxPeriod = period + (skip << 2);
	    if(minPeriod < stream->minPeriod) {
		minPeriod = stream->minPeriod;
	    }
	    if(maxPeriod > stream->maxPeriod) {
		maxPeriod = stream->maxPeriod;
	    }
	    if(stream->numChannels == 1) {
		period = findPitchPeriodInRange(samples, minPeriod, maxPeriod,
		    &minDiff, &maxDiff);
	    } else {
		downSampleInput(stream, samples, 1);
		period = findPitchPeriodInRange(stream->downSampleBuffer, minPeriod,
		    maxPeriod, &minDiff, &maxDiff);
	    }
	}
    }
    if(prevPeriodBetter(stream, period, minDiff, maxDiff, preferNewPeriod)) {
        retPeriod = stream->prevPeriod;
    } else {
	retPeriod = period;
    }
    stream->prevMinDiff = minDiff;
    stream->prevPeriod = period;
    return retPeriod;
}

/* Overlap two sound segments, ramp the volume of one down, while ramping the
   other one from zero up, and add them, storing the result at the output. */
static void overlapAdd(
    int numSamples,
    int numChannels,
    short *out,
    short *rampDown,
    short *rampUp)
{
    short *o, *u, *d;
    int i, t;

    for(i = 0; i < numChannels; i++) {
	o = out + i;
	u = rampUp + i;
	d = rampDown + i;
	for(t = 0; t < numSamples; t++) {
#ifdef SONIC_USE_SIN
	    float ratio = sin(t*M_PI/(2*numSamples));
	    *o = *d*(1.0f - ratio) + *u*ratio;
#else
	    *o = (*d*(numSamples - t) + *u*t)/numSamples;
#endif
	    o += numChannels;
	    d += numChannels;
	    u += numChannels;
	}
    }
}

/* Overlap two sound segments, ramp the volume of one down, while ramping the
   other one from zero up, and add them, storing the result at the output. */
static void overlapAddWithSeparation(
    int numSamples,
    int numChannels,
    int separation,
    short *out,
    short *rampDown,
    short *rampUp)
{
    short *o, *u, *d;
    int i, t;

    for(i = 0; i < numChannels; i++) {
	o = out + i;
	u = rampUp + i;
	d = rampDown + i;
	for(t = 0; t < numSamples + separation; t++) {
	    if(t < separation) {
		*o = *d*(numSamples - t)/numSamples;
		d += numChannels;
	    } else if(t < numSamples) {
		*o = (*d*(numSamples - t) + *u*(t - separation))/numSamples;
		d += numChannels;
		u += numChannels;
	    } else {
		*o = *u*(t - separation)/numSamples;
		u += numChannels;
	    }
	    o += numChannels;
	}
    }
}

/* Just move the new samples in the output buffer to the pitch buffer */
static int moveNewSamplesToPitchBuffer(
    sonicStream stream,
    int originalNumOutputSamples)
{
    int numSamples = stream->numOutputSamples - originalNumOutputSamples;
    int numChannels = stream->numChannels;

    if(stream->numPitchSamples + numSamples > stream->pitchBufferSize) {
	stream->pitchBufferSize += (stream->pitchBufferSize >> 1) + numSamples;
	stream->pitchBuffer = (short *)realloc(stream->pitchBuffer,
	    stream->pitchBufferSize*sizeof(short)*numChannels);
	if(stream->pitchBuffer == NULL) {
	    return 0;
	}
    }
    memcpy(stream->pitchBuffer + stream->numPitchSamples*numChannels,
        stream->outputBuffer + originalNumOutputSamples*numChannels,
	numSamples*sizeof(short)*numChannels);
    stream->numOutputSamples = originalNumOutputSamples;
    stream->numPitchSamples += numSamples;
    return 1;
}

/* Remove processed samples from the pitch buffer. */
static void removePitchSamples(
    sonicStream stream,
    int numSamples)
{
    int numChannels = stream->numChannels;
    short *source = stream->pitchBuffer + numSamples*numChannels;

    if(numSamples == 0) {
	return;
    }
    if(numSamples != stream->numPitchSamples) {
	memmove(stream->pitchBuffer, source, (stream->numPitchSamples -
	    numSamples)*sizeof(short)*numChannels);
    }
    stream->numPitchSamples -= numSamples;
}

/* Change the pitch.  The latency this introduces could be reduced by looking at
   past samples to determine pitch, rather than future. */
static int adjustPitch(
    sonicStream stream,
    int originalNumOutputSamples)
{
    float pitch = stream->pitch;
    int numChannels = stream->numChannels;
    int period, newPeriod, separation;
    int position = 0;
    short *out, *rampDown, *rampUp;

    if(stream->numOutputSamples == originalNumOutputSamples) {
	return 1;
    }
    if(!moveNewSamplesToPitchBuffer(stream, originalNumOutputSamples)) {
	return 0;
    }
    while(stream->numPitchSamples - position >= stream->maxRequired) {
	period = findPitchPeriod(stream, stream->pitchBuffer + position*numChannels, 0);
	newPeriod = period/pitch;
	if(!enlargeOutputBufferIfNeeded(stream, newPeriod)) {
	    return 0;
	}
	out = stream->outputBuffer + stream->numOutputSamples*numChannels;
	if(pitch >= 1.0f) {
	    rampDown = stream->pitchBuffer + position*numChannels;
	    rampUp = stream->pitchBuffer + (position + period - newPeriod)*numChannels;
	    overlapAdd(newPeriod, numChannels, out, rampDown, rampUp);
	} else {
	    rampDown = stream->pitchBuffer + position*numChannels;
	    rampUp = stream->pitchBuffer + position*numChannels;
	    separation = newPeriod - period;
	    overlapAddWithSeparation(period, numChannels, separation, out, rampDown, rampUp);
	}
	stream->numOutputSamples += newPeriod;
	position += period;
    }
    removePitchSamples(stream, position);
    return 1;
}

/* Interpolate the new output sample. */
static short interpolate(
    sonicStream stream,
    short *in,
    int oldSampleRate,
    int newSampleRate)
{
    short left = *in;
    short right = in[stream->numChannels];
    int position = stream->newRatePosition*oldSampleRate;
    int leftPosition = stream->oldRatePosition*newSampleRate;
    int rightPosition = (stream->oldRatePosition + 1)*newSampleRate;
    int ratio = rightPosition - position;
    int width = rightPosition - leftPosition;

    return (ratio*left + (width - ratio)*right)/width;
}

/* Change the rate. */
static int adjustRate(
    sonicStream stream,
    float rate,
    int originalNumOutputSamples)
{
    int newSampleRate = stream->sampleRate/rate;
    int oldSampleRate = stream->sampleRate;
    int numChannels = stream->numChannels;
    int position = 0;
    short *in, *out;
    int i;

    /* Set these values to help with the integer math */
    while(newSampleRate > (1 << 14) || oldSampleRate > (1 << 14)) {
	newSampleRate >>= 1;
	oldSampleRate >>= 1;
    }
    if(stream->numOutputSamples == originalNumOutputSamples) {
	return 1;
    }
    if(!moveNewSamplesToPitchBuffer(stream, originalNumOutputSamples)) {
	return 0;
    }
    /* Leave at least one pitch sample in the buffer */
    for(position = 0; position < stream->numPitchSamples - 1; position++) {
	while((stream->oldRatePosition + 1)*newSampleRate >
	        stream->newRatePosition*oldSampleRate) {
	    if(!enlargeOutputBufferIfNeeded(stream, 1)) {
		return 0;
	    }
	    out = stream->outputBuffer + stream->numOutputSamples*numChannels;
	    in = stream->pitchBuffer + position;
	    for(i = 0; i < numChannels; i++) {
		*out++ = interpolate(stream, in, oldSampleRate, newSampleRate);
		in++;
	    }
	    stream->newRatePosition++;
	    stream->numOutputSamples++;
	}
	stream->oldRatePosition++;
	if(stream->oldRatePosition == oldSampleRate) {
	    stream->oldRatePosition = 0;
	    if(stream->newRatePosition != newSampleRate) {
		fprintf(stderr,
		    "Assertion failed: stream->newRatePosition != newSampleRate\n");
		exit(1);
	    }
	    stream->newRatePosition = 0;
	}
    }
    removePitchSamples(stream, position);
    return 1;
}


/* Skip over a pitch period, and copy period/speed samples to the output */
static int skipPitchPeriod(
    sonicStream stream,
    short *samples,
    float speed,
    int period)
{
    long newSamples;
    int numChannels = stream->numChannels;

    if(speed >= 2.0f) {
	newSamples = period/(speed - 1.0f);
    } else {
	newSamples = period;
	stream->remainingInputToCopy = period*(2.0f - speed)/(speed - 1.0f);
    }
    if(!enlargeOutputBufferIfNeeded(stream, newSamples)) {
	return 0;
    }
    overlapAdd(newSamples, numChannels, stream->outputBuffer +
        stream->numOutputSamples*numChannels, samples, samples + period*numChannels);
    stream->numOutputSamples += newSamples;
    return newSamples;
}

/* Insert a pitch period, and determine how much input to copy directly. */
static int insertPitchPeriod(
    sonicStream stream,
    short *samples,
    float speed,
    int period)
{
    long newSamples;
    short *out;
    int numChannels = stream->numChannels;

    if(speed < 0.5f) {
        newSamples = period*speed/(1.0f - speed);
    } else {
        newSamples = period;
	stream->remainingInputToCopy = period*(2.0f*speed - 1.0f)/(1.0f - speed);
    }
    if(!enlargeOutputBufferIfNeeded(stream, period + newSamples)) {
	return 0;
    }
    out = stream->outputBuffer + stream->numOutputSamples*numChannels;
    memcpy(out, samples, period*sizeof(short)*numChannels);
    out = stream->outputBuffer + (stream->numOutputSamples + period)*numChannels;
    overlapAdd(newSamples, numChannels, out, samples + period*numChannels, samples);
    stream->numOutputSamples += period + newSamples;
    return newSamples;
}

/* Resample as many pitch periods as we have buffered on the input.  Return 0 if
   we fail to resize an input or output buffer.  Also scale the output by the volume. */
static int changeSpeed(
    sonicStream stream,
    float speed)
{
    short *samples;
    int numSamples = stream->numInputSamples;
    int position = 0, period, newSamples;
    int maxRequired = stream->maxRequired;

    if(stream->numInputSamples < maxRequired) {
	return 1;
    }
    do {
	if(stream->remainingInputToCopy > 0) {
            newSamples = copyInputToOutput(stream, position);
	    position += newSamples;
	} else {
	    samples = stream->inputBuffer + position*stream->numChannels;
	    period = findPitchPeriod(stream, samples, 1);
	    if(speed > 1.0) {
		newSamples = skipPitchPeriod(stream, samples, speed, period);
		position += period + newSamples;
	    } else {
		newSamples = insertPitchPeriod(stream, samples, speed, period);
		position += newSamples;
	    }
	}
	if(newSamples == 0) {
	    return 0; /* Failed to resize output buffer */
	}
    } while(position + maxRequired <= numSamples);
    removeInputSamples(stream, position);
    return 1;
}

/* Resample as many pitch periods as we have buffered on the input.  Return 0 if
   we fail to resize an input or output buffer.  Also scale the output by the volume. */
static int processStreamInput(
    sonicStream stream)
{
    int originalNumOutputSamples = stream->numOutputSamples;
    float speed = stream->speed/stream->pitch;
    float rate = stream->rate;

    if(!stream->useChordPitch) {
	rate *= stream->pitch;
    }
    if(speed > 1.00001 || speed < 0.99999) {
	changeSpeed(stream, speed);
    } else {
        if(!copyToOutput(stream, stream->inputBuffer, stream->numInputSamples)) {
	    return 0;
	}
	stream->numInputSamples = 0;
    }
    if(stream->useChordPitch) {
	if(stream->pitch != 1.0f) {
	    if(!adjustPitch(stream, originalNumOutputSamples)) {
		return 0;
	    }
	}
    } else if(rate != 1.0f) {
	if(!adjustRate(stream, rate, originalNumOutputSamples)) {
	    return 0;
	}
    }
    if(stream->volume != 1.0f) {
	/* Adjust output volume. */
        scaleSamples(stream->outputBuffer + originalNumOutputSamples*stream->numChannels,
	    (stream->numOutputSamples - originalNumOutputSamples)*stream->numChannels,
	    stream->volume);
    }
    return 1;
}

/* Write floating point data to the input buffer and process it. */
int sonicWriteFloatToStream(
    sonicStream stream,
    float *samples,
    int numSamples)
{
    if(!addFloatSamplesToInputBuffer(stream, samples, numSamples)) {
	return 0;
    }
    return processStreamInput(stream);
}

/* Simple wrapper around sonicWriteFloatToStream that does the short to float
   conversion for you. */
int sonicWriteShortToStream(
    sonicStream stream,
    short *samples,
    int numSamples)
{
    if(!addShortSamplesToInputBuffer(stream, samples, numSamples)) {
	return 0;
    }
    return processStreamInput(stream);
}

/* Simple wrapper around sonicWriteFloatToStream that does the unsigned char to float
   conversion for you. */
int sonicWriteUnsignedCharToStream(
    sonicStream stream,
    unsigned char *samples,
    int numSamples)
{
    if(!addUnsignedCharSamplesToInputBuffer(stream, samples, numSamples)) {
	return 0;
    }
    return processStreamInput(stream);
}

/* This is a non-stream oriented interface to just change the speed of a sound sample */
int sonicChangeFloatSpeed(
    float *samples,
    int numSamples,
    float speed,
    float pitch,
    float rate,
    float volume,
    int useChordPitch,
    int sampleRate,
    int numChannels)
{
    sonicStream stream = sonicCreateStream(sampleRate, numChannels);

    sonicSetSpeed(stream, speed);
    sonicSetPitch(stream, pitch);
    sonicSetRate(stream, rate);
    sonicSetVolume(stream, volume);
    sonicSetChordPitch(stream, useChordPitch);
    sonicWriteFloatToStream(stream, samples, numSamples);
    sonicFlushStream(stream);
    numSamples = sonicSamplesAvailable(stream);
    sonicReadFloatFromStream(stream, samples, numSamples);
    sonicDestroyStream(stream);
    return numSamples;
}

/* This is a non-stream oriented interface to just change the speed of a sound sample */
int sonicChangeShortSpeed(
    short *samples,
    int numSamples,
    float speed,
    float pitch,
    float rate,
    float volume,
    int useChordPitch,
    int sampleRate,
    int numChannels)
{
    sonicStream stream = sonicCreateStream(sampleRate, numChannels);

    sonicSetSpeed(stream, speed);
    sonicSetPitch(stream, pitch);
    sonicSetRate(stream, rate);
    sonicSetVolume(stream, volume);
    sonicSetChordPitch(stream, useChordPitch);
    sonicWriteShortToStream(stream, samples, numSamples);
    sonicFlushStream(stream);
    numSamples = sonicSamplesAvailable(stream);
    sonicReadShortFromStream(stream, samples, numSamples);
    sonicDestroyStream(stream);
    return numSamples;
}
