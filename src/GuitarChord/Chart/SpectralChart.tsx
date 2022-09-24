/** @format */

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {DFT} from 'dsp.js'
import Container from '../Provider'
import {Button, Slider, Spin, message} from 'antd'
import {getOfflineAudioContext} from '../utils'
import {useCreation, useSize, useDebounceFn} from 'ahooks'

function SpectralChart(props: {}) {
    const {decodedMusicData} = Container.useContainer()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const frequencyData = useRef<any>([])
    const canvasRef = useRef<any>(null)
    const containerRef = useRef<any>(null)
    const size = useSize(containerRef)
    const [sliderValue, setSliderValue] = useState([0, 100])
    const audioCtx = useCreation(() => new (window.AudioContext || (window as any).webkitAudioContext)(), [])
    const offlineCtx = useCreation(() => {
        return getOfflineAudioContext()
    }, [])

    const getFrequencyData = () => {
        if (!decodedMusicData) return message.warn('没有数据:)')
        setLoading(true)
        frequencyData.current = []
        let flag = true
        const analyser = audioCtx.createAnalyser()
        const sourceNode = audioCtx.createBufferSource()
        const gainNode = audioCtx.createGain()
        const audioRawArrayBuffer = decodedMusicData.slice(0)
        analyser.fftSize = 2048
        gainNode.gain.value = 0
        sourceNode.connect(analyser)
        analyser.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        var bufferLength = analyser.frequencyBinCount
        offlineCtx.decodeAudioData(audioRawArrayBuffer).then((audiobuffer: AudioBuffer) => {
            console.log('解析成功', audiobuffer)
            sourceNode.buffer = audiobuffer
            loop()
            sourceNode.start()
        })
        sourceNode.onended = e => {
            flag = false
            console.log('打印频率数据', frequencyData)
            setData(() => {
                return frequencyData.current
                    .filter((t: any) => t[0] != -Infinity)
                    .reduce((total: any[], cur: any[], index: number) => {
                        const col: any[] = []
                        cur.forEach((v, y) => {
                            col.push({
                                x: index,
                                y: y,
                                v: v,
                            })
                        })
                        total.push(col)
                        return total
                    }, [])
            })
            setLoading(false)
        }

        function loop() {
            let dataArray: any = new Uint8Array(bufferLength)
            const id = requestAnimationFrame(loop)
            analyser.getByteFrequencyData(dataArray)
            frequencyData.current.push(dataArray)
            dataArray = null
            if (!flag) {
                cancelAnimationFrame(id)
            }
        }
    }

    const {run: draw} = useDebounceFn(
        () => {
            if (!size || !data.length) return
            console.log(size, sliderValue)
            const renderData = data.reduce((total: any[], cur: []) => {
                const tmp = cur
                    .slice(Math.ceil((1024 * sliderValue[0]) / 100), Math.ceil((1024 * sliderValue[1]) / 100))
                    .map((item: object, index) => {
                        return {...item, y: index}
                    })
                total.push(tmp)
                return total
            }, [])
            const ctx = canvasRef.current.getContext('2d')
            const w: number = Number((size.width / data.length).toFixed(2))
            const h: number = Number((size.height / ((1024 * (sliderValue[1] - sliderValue[0])) / 100)).toFixed(2))
            console.log('宽高', w, h)
            ctx.clearRect(0, 0, size.width, size.height)
            renderData.forEach((item: any) => {
                item.forEach((t: any) => {
                    ctx.fillStyle = `rgb(${Math.ceil(t.v)},50,50)`
                    //x-横坐标 y-纵坐标 w-宽 h-高
                    ctx.fillRect(
                        t.x * w,
                        (Math.ceil((1024 * (sliderValue[1] - sliderValue[0])) / 100) - t.y - 1) * h,
                        w,
                        h,
                    )
                })
            })
        },
        {wait: 500},
    )

    const {run: sliderChange} = useDebounceFn(
        value => {
            setSliderValue(value)
        },
        {wait: 500},
    )

    useLayoutEffect(() => {
        draw()
    }, [data, size, sliderValue])

    return (
        <>
            <Button loading={loading} type="primary" onClick={getFrequencyData}>
                获取频谱图
            </Button>
            <div ref={containerRef} style={{position: 'relative', display: 'block', width: '100%', height: '500px'}}>
                <Spin spinning={loading}>
                    <canvas
                        ref={canvasRef}
                        width={`${size?.width}`}
                        height={`${size?.height}`}
                        style={{display: 'block'}}></canvas>
                    <Slider
                        style={{position: 'absolute', right: '0', top: '100px', height: '300px'}}
                        min={0}
                        max={100}
                        defaultValue={[0, 100]}
                        onChange={sliderChange}
                        range={{draggableTrack: true}}
                        vertical></Slider>
                </Spin>
            </div>
        </>
    )
}

export default SpectralChart
