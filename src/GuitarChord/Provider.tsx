/** @format */

import React, {useRef, useState} from 'react'
import {spicePredictDataType} from './config'
import {createContainer} from 'unstated-next'

function useProvider(initialState = {}) {
    const [decodedMusicData, setDecodedMusicData] = useState<ArrayBuffer>(null as any)
    const [predictedNote, setPredictedNote] = useState<spicePredictDataType>({} as any)
    const [confidence, setConfidence] = useState(0.7)
    const [musicName, setMusicName] = useState('')

    return {
        decodedMusicData,
        predictedNote,
        confidence,
        musicName,
        setMusicName,
        setConfidence,
        setPredictedNote,
        setDecodedMusicData,
    }
}

var Container = createContainer(useProvider)

export default Container
