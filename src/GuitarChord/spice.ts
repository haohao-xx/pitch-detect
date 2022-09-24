/** @format */

import * as tf from '@tensorflow/tfjs'
import {resampleAndMakeMono} from './utils'
const MODEL_SAMPLE_RATE = 16000
const MODEL_FRAME_RATE = 250
const PT_OFFSET = 25.58
const PT_SLOPE = 63.07
const PITCH_CONF_JITTER = 0.002
const CONF_THRESHOLD = 0.7

class SPICE {
    modelUrl: string
    initialized: boolean
    spiceModel: any
    constructor(modelUrl: string) {
        if (modelUrl) {
            this.modelUrl = modelUrl
        } else {
            this.modelUrl = ''
        }
        this.initialized = false
        this.spiceModel = {}
        this.initialize()
    }

    async initialize() {
        if (!this.initialized) {
            this.spiceModel = await tf.loadGraphModel(this.modelUrl)
            this.initialized = true
        }
    }
    async getAudioFeatures(inputAudioBuffer: any, confidenceThreshold = CONF_THRESHOLD) {
        if (tf.getBackend() !== 'webgl') {
            throw new Error('Device does not support webgl.')
        }
        if (!this.initialized) {
            console.log('模型还未加载完毕')
        }
        const audioData = await resampleAndMakeMono(inputAudioBuffer, MODEL_SAMPLE_RATE)
        const originalRecordedBufferLength = audioData.length
        const powerTmp = await this.computePower(audioData)
        const {pitches, confidences} = await this.getPitches(audioData, confidenceThreshold)
        return {
            f0_hz: pitches,
            loudness_db: powerTmp,
            confidences,
            originalRecordedBufferLength,
            duration: inputAudioBuffer.duration,
        }
    }
    async getPitches(inputData: Float32Array, confidenceThreshold: number) {
        const SPICE_SAMPLE_RATE = 16000
        const SPICE_MODEL_MULTIPLE = 512
        const spicePitchesOutput = []
        const allConfidences = []
        const audioChannelDataLength = inputData.length
        const inputTensor = tf.tensor(inputData)
        const inputSampleNum = Math.ceil(audioChannelDataLength / SPICE_MODEL_MULTIPLE) * SPICE_MODEL_MULTIPLE
        const fullInputWithPadding = inputTensor.pad([[0, inputSampleNum - audioChannelDataLength]])
        const expectedDuration = fullInputWithPadding.size / SPICE_SAMPLE_RATE
        const output = await this.spiceModel.execute({
            input_audio_samples: fullInputWithPadding,
        })
        let uncertainties = await output[0].data()
        const pitches = await output[1].data()
        if (((pitches.length - 1) * 32) / 1000 === expectedDuration) {
            let lastPitch = 20.0
            for (let i = 0; i < pitches.length; ++i) {
                const confidence = 1.0 - uncertainties[i]
                allConfidences.push(confidence)
                if (confidence >= confidenceThreshold) {
                    lastPitch = this.getPitchHz(pitches[i])
                    spicePitchesOutput.push(lastPitch)
                } else {
                    const noiseT = tf.truncatedNormal([1], 0.0, PITCH_CONF_JITTER)
                    const noise = await noiseT.array()
                    const jitter = 1.0 - (noise as number)
                    spicePitchesOutput.push(lastPitch * jitter)
                    noiseT.dispose()
                }
            }
        } else {
            const finalPitchesLength = inputSampleNum / SPICE_MODEL_MULTIPLE + 1
            const stitchedPitches = new Float32Array(finalPitchesLength)
            uncertainties = new Float32Array(finalPitchesLength)
            for (let i = 0; i < inputSampleNum; i += inputSampleNum / 4) {
                const partialInput = fullInputWithPadding.slice([i], [inputSampleNum / 4])
                const partialOutput = await this.spiceModel.execute({
                    input_audio_samples: partialInput,
                })
                const partialUncertainties = await partialOutput[0].data()
                const partialPitches = await partialOutput[1].data()
                const index = Math.floor(i / SPICE_MODEL_MULTIPLE)
                uncertainties.set(partialUncertainties, index)
                stitchedPitches.set(partialPitches, index)
                partialInput.dispose()
                partialOutput[0].dispose()
                partialOutput[1].dispose()
            }
            let lastPitch = 20.0
            for (let i = 0; i < stitchedPitches.length; ++i) {
                const confidence = 1.0 - uncertainties[i]
                allConfidences.push(confidence)
                if (confidence >= confidenceThreshold) {
                    lastPitch = this.getPitchHz(stitchedPitches[i])
                    spicePitchesOutput.push(lastPitch)
                } else {
                    const noiseT = tf.truncatedNormal([1], 0.0, PITCH_CONF_JITTER)
                    const noise = await noiseT.array()
                    const jitter = 1.0 - (noise as any)
                    spicePitchesOutput.push(lastPitch * jitter)
                    noiseT.dispose()
                }
            }
        }
        output[0].dispose()
        output[1].dispose()
        inputTensor.dispose()
        fullInputWithPadding.dispose()
        return {pitches: spicePitchesOutput, confidences: allConfidences}
    }
    getPitchHz(modelPitch: number) {
        const fmin = 10.0
        const binsPerOctave = 12.0
        const cqtBin = modelPitch * PT_SLOPE + PT_OFFSET
        return fmin * Math.pow(2.0, (1.0 * cqtBin) / binsPerOctave)
    }
    async computePower(audioChannelData: any) {
        const frameSize = 1024
        const refDb = 20.7
        const ldRange = 120.0
        const hopSize = Math.floor(MODEL_SAMPLE_RATE / MODEL_FRAME_RATE)
        const audioTensor = tf.tensor1d(audioChannelData, 'float32')
        const newSamplesCount = audioChannelData.length
        if (audioTensor === null) {
            return []
        }
        const sq = audioTensor.mul(audioTensor).reshape([newSamplesCount, 1])
        const rmsEnergy = tf
            .conv1d(sq as any, tf.ones([frameSize, 1, 1]).div(frameSize) as any, hopSize, 'same')
            .sqrt()
            .squeeze()
        const amin = 1e-20
        const powerDb = tf.mul(tf.log(tf.maximum(amin, rmsEnergy)).div(tf.log(10)), 20)
        const powerDbShifted = powerDb.sub(refDb)
        const powerDbClipped = tf.maximum(powerDbShifted, -ldRange)
        const output = await powerDbClipped.array()
        audioTensor.dispose()
        sq.dispose()
        rmsEnergy.dispose()
        powerDb.dispose()
        powerDbShifted.dispose()
        powerDbClipped.dispose()
        return output
    }
    dispose() {
        if (!this.initialized) {
            return
        }
        this.spiceModel.dispose()
        this.initialized = false
    }
}
export default SPICE
