/** @format */

import React, {useEffect, useRef, useState} from 'react'
import {Chart} from '@antv/g2'
import SPICE from '../spice'
import {spicePredictDataType} from '../config'
import {getOfflineAudioContext} from '../utils'
import {InputNumber, Button, message, Spin} from 'antd'
import {useDeepCompareEffect, useUnmount, useDebounceFn, useCreation} from 'ahooks'
import Container from '../Provider'

const SpiceModelUrl = `http://${location.host}/tfjs-model-spice/model.json`

function DoubleLineChart(props: any) {
    const {predictedNote, setPredictedNote, decodedMusicData, confidence, setConfidence} = Container.useContainer()
    const offlineCtx = useCreation(() => {
        return getOfflineAudioContext()
    }, [])
    const chartInstance = useRef<any>(null)
    const SpiceInstance = useCreation(() => new SPICE(SpiceModelUrl), [])

    const [data, setData] = useState<any>([])
    const doubleLineChartRef = useRef<any>(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        chartInstance.current = new Chart({
            container: doubleLineChartRef.current,
            autoFit: true,
            height: 500,
        })
        chartInstance.current.scale({
            index: {
                alias: '时间',
                //type: 'time',
            },
            f0_hz: {
                alias: '音高/hz',
                min: 0,
                sync: true, // 将 pv 字段数值同 time 字段数值进行同步
                nice: true,
            },
            confidences: {
                alias: '置信度',
                // formatter: (value) => {
                //   return humanizeDuration(value, 0);
                // },
                sync: true, // 将 pv 字段数值同 time 字段数值进行同步
                nice: true,
            },
            count: {
                alias: '次数',
            },
        })
        chartInstance.current.option('slider', {})
        chartInstance.current.axis('f0_hz', {
            grid: null,
            title: {},
        })
        chartInstance.current.axis('confidences', {
            title: {},
        })

        chartInstance.current.tooltip({
            showCrosshairs: true,
            shared: true,
        })

        chartInstance.current.line().position('index*f0_hz').color('#4FAAEB')
        chartInstance.current.line().position('index*confidences').color('#9AD681').shape('dash')
    }, [doubleLineChartRef])

    useUnmount(() => {
        chartInstance?.current?.destroy()
    })

    useDeepCompareEffect(() => {
        if (!chartInstance.current || !data.length) {
            return
        }
        chartInstance.current.data(data)
        chartInstance.current.render()
    }, [data])

    useDeepCompareEffect(() => {
        if (!Object.keys(predictedNote).length) return
        setData(() => {
            return predictedNote.confidences.map((item: number, index: number) => {
                return {index, f0_hz: predictedNote.f0_hz[index], confidences: item}
            })
        })
    }, [predictedNote])

    const {run: handleFilterChange} = useDebounceFn(
        value => {
            setConfidence(value)
        },
        {wait: 500},
    )

    const startAnalize = () => {
        if (!decodedMusicData) {
            return message.warn('No File Uploaded!')
        }
        const audioRawArrayBuffer = decodedMusicData.slice(0)
        setLoading(true)
        offlineCtx.decodeAudioData(audioRawArrayBuffer).then((decodedData: AudioBuffer) => {
            SpiceInstance.getAudioFeatures(decodedData, confidence).then(res => {
                console.log('打印spice模型预测结果', res)
                setPredictedNote(res as spicePredictDataType)
                setLoading(false)
            })
        })
    }

    return (
        <>
            <InputNumber
                addonBefore="置信度"
                addonAfter={
                    <Button loading={loading} type="primary" onClick={startAnalize}>
                        生成结果
                    </Button>
                }
                size="large"
                min={0}
                max={1}
                defaultValue={0.7}
                step={0.1}
                onChange={handleFilterChange}
            />
            <Spin spinning={loading}>
                <div ref={doubleLineChartRef} style={{width: '100%', height: '500px'}} />
            </Spin>
        </>
    )
}

export default DoubleLineChart
