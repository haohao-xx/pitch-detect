/** @format */

import React, {useState} from 'react'
import {Upload} from 'antd'
import type {UploadChangeParam} from 'antd/es/upload'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import {InboxOutlined, LoadingOutlined} from '@ant-design/icons'
import {loadAudioFromFile} from '../utils'
import Container from '../Provider'

const {Dragger} = Upload

function UploadAudio(props: any) {
    const {setDecodedMusicData, setMusicName} = Container.useContainer()
    const [loading, setLoading] = useState(false)
    const [rawMusicData, setRawMusicData] = useState<any>(null)

    const handleUploadChange = (e: UploadChangeParam<UploadFile>) => {
        console.log(e)
        if (e.file.status == 'uploading') {
            setLoading(true)
        } else {
            setLoading(false)
            setRawMusicData(e.file)
            setMusicName(e.file.name)
            loadAudioFromFile(e.file.originFileObj).then((res: any) => {
                setDecodedMusicData(res)
            })
        }
    }

    return (
        <div>
            <Dragger
                showUploadList={false}
                maxCount={1}
                multiple={false}
                accept="audio/*"
                onChange={handleUploadChange}>
                <p className="ant-upload-drag-icon">{loading ? <LoadingOutlined /> : <InboxOutlined />}</p>
                <p className="ant-upload-text">{rawMusicData ? rawMusicData.name : '点击或拖拽上传'}</p>
            </Dragger>
        </div>
    )
}

export default UploadAudio
