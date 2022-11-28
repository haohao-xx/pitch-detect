/** @format */

import ndarray from 'ndarray'
import resample from 'ndarray-resample'

function isSafari() {
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
}

function getOfflineAudioContext(sampleRate = 16000) {
    const WEBKIT_SAMPLE_RATE = 44100
    const _sampleRate = isSafari() ? WEBKIT_SAMPLE_RATE : sampleRate
    const SafariOfflineCtx = (window as any).webkitOfflineAudioContext
    return isSafari()
        ? new SafariOfflineCtx(1, _sampleRate * 100, _sampleRate)
        : new window.OfflineAudioContext(1, _sampleRate * 100, _sampleRate)
}

async function loadAudioFromFile(file: any) {
    const fileReader = new FileReader()
    const loadFile = new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort()
            reject(new DOMException('Something went wrong reading that file.'))
        }
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.readAsArrayBuffer(file)
    })
    return loadFile
}

function getMonoAudio(audioBuffer: any) {
    if (audioBuffer.numberOfChannels === 1) {
        return audioBuffer.getChannelData(0)
    }
    if (audioBuffer.numberOfChannels !== 2) {
        throw Error(`${audioBuffer.numberOfChannels} channel audio is not supported.`)
    }
    const ch0 = audioBuffer.getChannelData(0)
    const ch1 = audioBuffer.getChannelData(1)
    const mono = new Float32Array(audioBuffer.length)
    for (let i = 0; i < audioBuffer.length; ++i) {
        mono[i] = (ch0[i] + ch1[i]) / 2
    }
    return mono
}

async function resampleAndMakeMono(audioBuffer: any, targetSr: number) {
    if (audioBuffer.sampleRate === targetSr) {
        return getMonoAudio(audioBuffer)
    }
    const sourceSr = audioBuffer.sampleRate
    const lengthRes = (audioBuffer.length * targetSr) / sourceSr
    if (!isSafari()) {
        const _offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.duration * targetSr,
            targetSr,
        )
        const bufferSource = _offlineCtx.createBufferSource()
        bufferSource.buffer = audioBuffer
        bufferSource.connect(_offlineCtx.destination)
        bufferSource.start()
        return _offlineCtx.startRendering().then(buffer => buffer.getChannelData(0))
    } else {
        console.warn('Safari does not support WebAudio resampling, so this may be slow.', 'O&F', 5)
        const originalAudio = getMonoAudio(audioBuffer)
        const resampledAudio = new Float32Array(lengthRes)
        resample(ndarray(resampledAudio, [lengthRes]), ndarray(originalAudio, [originalAudio.length]))
        return resampledAudio
    }
}

export {loadAudioFromFile, resampleAndMakeMono, getOfflineAudioContext, getMonoAudio}
