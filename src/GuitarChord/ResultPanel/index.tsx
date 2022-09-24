/** @format */

import React, {useRef, useState, useEffect, useMemo} from 'react'
import {Button, message} from 'antd'
import * as Tone from 'tone'
import {findNote} from '../config'
import ResultTable from './ResultTable'
import Container from '../Provider'
import {useCreation, useDeepCompareEffect, useMemoizedFn} from 'ahooks'
import useWebWorker from '@/components/Hooks/useWebWorker'

function ResultPanel(props: any) {
    const {predictedNote, confidence} = Container.useContainer()
    const [guitarNote, setGuitarNote] = useState<any>([])
    const [resultPanelNote, setResultPanelNote] = useState({})
    const allResults = useRef([])
    const [curIndex, setCurIndex] = useState(0)
    const ResultPanelRef = useRef<any>(null)
    const synth = useCreation(() => {
        return new Tone.Synth().toDestination()
    }, [])

    const onMessage = useMemoizedFn(e => {
        console.log('主线程接受到的消息', e.data)
        allResults.current = e.data
        setCurIndex(0)
        setResultPanelNote(e.data[0])
    })

    const [postMessage, processing] = useWebWorker(`http://${location.host}/webworker/processNote.worker.js`, onMessage)

    const playNote = () => {
        if (!guitarNote.length) return message.warn('没有数据:)')
        const now = Tone.now()
        let increaseTime = 0
        guitarNote.forEach((item: any) => {
            if (item.confidence > confidence) {
                synth.triggerAttackRelease(item.pitch, item.duration, now + increaseTime)
            }
            increaseTime += item.duration
        })
    }

    const changePosition = () => {
        if (!guitarNote.length) return message.warn('没有数据:)')
        if (curIndex == allResults.current.length - 1) {
            setCurIndex(0)
            setResultPanelNote(allResults.current[0])
        } else {
            setResultPanelNote(allResults.current[curIndex + 1])
            setCurIndex(t => t + 1)
        }
    }

    useDeepCompareEffect(() => {
        console.log('开始处理模型原始数据')
        if (Object.keys(predictedNote).length && confidence >= 0) {
            setGuitarNote(findNote(predictedNote.f0_hz, predictedNote.confidences, predictedNote.duration))
        }
    }, [predictedNote])

    useDeepCompareEffect(() => {
        if (!guitarNote.length) return
        console.log('计算位置并绘制', guitarNote)
        postMessage(guitarNote)
    }, [guitarNote])

    const text = useMemo(() => {
        if (!guitarNote.length) return '(0/0)'
        return `(${curIndex + 1}/${allResults.current.length})`
    }, [curIndex, allResults.current.length, guitarNote])

    const saveAsPic = () => {
        ResultPanelRef.current.toPic()
    }

    return (
        <>
            <Button type="primary" onClick={playNote}>
                播放结果
            </Button>
            <Button type="primary" onClick={changePosition}>
                切换结果{text}
            </Button>
            <Button type="primary" onClick={saveAsPic}>
                保存为图片
            </Button>
            <ResultTable ref={ResultPanelRef} processing={processing} resultPanelNote={resultPanelNote} />
        </>
    )
}

export default ResultPanel
