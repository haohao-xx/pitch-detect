/** @format */

import React, {useMemo, useState} from 'react'
import {Button, Select, Table} from 'antd'
import {useCreation, useMemoizedFn} from 'ahooks'
import {noteMap, GuitarNote} from '../config'
import style from './index.less'

console.log('cssmodule是否开启成功', style)

function GuitarCell(props: any) {
    console.log('guitarcell的props', props)
    const {colIndex, rowIndex, text, noteVisible = false, theme} = props
    const [showNote, setShowNote] = useState(noteVisible)

    const handleClick = useMemoizedFn(() => {
        setShowNote(!showNote)
    })

    const curTheme = useMemo(() => {
        if ([3, 5, 7, 9, 15, 17].includes(colIndex) && rowIndex == 2) {
            return true
        }
        if (colIndex == 12 && (rowIndex == 1 || rowIndex == 3)) {
            return true
        }
        return false
    }, [colIndex, rowIndex])
    return (
        <>
            <div className={[style['cell'], curTheme ? style[theme] : ''].join(' ')} onClick={handleClick}>
                <div className={colIndex == 0 ? '' : style['cell-string']} />
                {showNote ? (
                    <span className={colIndex == 0 ? '' : style['cell-note']}>
                        {noteMap[text as keyof typeof noteMap]}
                    </span>
                ) : null}
            </div>
        </>
    )
}

function GuitarPanel(props: any) {
    const [theme, setTheme] = useState('multiply')
    const columns = useCreation(() => {
        return new Array(20).fill(0).map((item, colIndex) => {
            return {
                //title: 'Name',
                dataIndex: `capo${colIndex}`,
                render: (text: string, record: object, rowIndex: number) => {
                    return <GuitarCell theme={theme} rowIndex={rowIndex} text={text} colIndex={colIndex} {...record} />
                },
            }
        })
    }, [theme])

    const data = useCreation(() => {
        return GuitarNote.map((item, dataIndex) => {
            return item.reduce(
                (prev, cur, index, arr) => {
                    return {...prev, [`capo${index}`]: cur}
                },
                {key: dataIndex},
            )
        })
    }, [])

    return (
        <>
            主题
            <Select
                defaultValue={theme}
                onChange={e => {
                    setTheme(e)
                }}
                options={[
                    {label: 'x', value: 'multiply'},
                    {label: '+', value: 'plus'},
                    {label: '=', value: 'equal'},
                    {label: '➗', value: 'divide'},
                ]}></Select>
            <Table className={style['custom-table']} columns={columns} dataSource={data} pagination={false} />
        </>
    )
}

export default GuitarPanel
