/** @format */

import {useCreation, useMemoizedFn, useUnmount} from 'ahooks'
import {message} from 'antd'
import {useState} from 'react'

function useWebWorker(url: string, onMessage = (data?: any) => {}) {
    const [processing, setProcessing] = useState(false)

    const worker = useCreation(() => {
        return new Worker(new URL(url, import.meta.url))
    }, [])

    const postMessage = useMemoizedFn(e => {
        if (processing) {
            message.warn('请等待上个任务执行完毕！')
            return
        }
        worker.postMessage(e)
        setProcessing(true)
    })

    worker.onmessage = useMemoizedFn(e => {
        setProcessing(false)
        onMessage(e)
    })

    worker.onerror = useMemoizedFn(e => {
        message.error('出错啦', e)
        setProcessing(false)
        worker.terminate()
    })

    useUnmount(() => {
        worker.terminate()
    })

    return [postMessage, processing] as const
}

export default useWebWorker
