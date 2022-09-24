/** @format */

import React, {useState} from 'react'
import {Drawer} from 'antd'
import {TagsOutlined} from '@ant-design/icons'
import DoubleLineChart from './Chart/DoubleLineChart'
import SpectralChart from './Chart/SpectralChart'
import GuitarPanel from './GuitarPanel'
import ResultPanel from './ResultPanel'
import UploadAudio from './UploadAudio'
import Container from './Provider'
import style from './index.less'

function GuitarChord(props: any) {
    const [visible, setVisible] = useState(false)
    return (
        <>
            <div className={style.affix}>
                <TagsOutlined
                    onClick={() => {
                        setVisible(true)
                    }}
                    style={{fontSize: '60px', cursor: 'pointer'}}
                />
            </div>
            <UploadAudio />
            <DoubleLineChart />
            <SpectralChart />
            <Drawer
                onClose={() => {
                    setVisible(false)
                }}
                maskClosable
                visible={visible}
                width={'100%'}
                placement="bottom">
                <GuitarPanel />
            </Drawer>
            <ResultPanel />
        </>
    )
}

export default function (props: any) {
    return (
        <>
            <Container.Provider initialState={{}}>
                <GuitarChord {...props} />
            </Container.Provider>
        </>
    )
}
