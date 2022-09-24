/** @format */

import React, {useEffect, useRef, useState, useImperativeHandle, useCallback} from 'react'
import {Button, Input, message, Space, Table, Tooltip} from 'antd'
import html2canvas from 'html2canvas'
import {useDeepCompareEffect, useLatest, useMemoizedFn} from 'ahooks'
import {PlusOutlined, MinusOutlined} from '@ant-design/icons'
import style from './index.less'
import Container from '@/GuitarChord/Provider'
import {ulid} from 'ulid'

function GuitarCell(props: any) {
    //console.log('guitarcell的props',props)
    const {text} = props
    const inputRef = useRef<any>()
    const [value, setValue] = useState(text)
    const [editabale, setEditable] = useState(false)

    const handleDoubleClick = useMemoizedFn(() => {
        setEditable(!editabale)
    })

    const handlePressEnter = (e: any) => {
        setValue(e.target.value)
        setEditable(false)
    }

    useEffect(() => {
        if (inputRef.current && editabale) {
            inputRef.current?.focus()
        }
    }, [inputRef, editabale])

    useEffect(() => {
        //console.log('text变化重新设置')
        setValue(text)
    }, [text])

    return (
        <>
            <div className={style['cell']} onDoubleClick={handleDoubleClick}>
                {editabale ? (
                    <Input
                        style={{width: '50px', height: '30px'}}
                        ref={inputRef}
                        onBlur={handlePressEnter}
                        defaultValue={value}
                        onPressEnter={handlePressEnter}
                    />
                ) : (
                    <span className={style['cell-note']}>{value}</span>
                )}
            </div>
        </>
    )
}

function ResultTable(props: any, ref: any) {
    const {musicName} = Container.useContainer()
    const {resultPanelNote = {}, processing} = props
    const [column, setColumn] = useState([])
    const [data, setData] = useState([])
    const tableRef = useRef<any>(null)
    const latestColumn = useLatest<any>(column)

    const RenderColumnTitle = (dataIndex: string) => {
        return (
            <>
                <Space style={{justifyContent: 'space-around', width: '100%'}}>
                    <Tooltip title="删除此列">
                        <MinusOutlined onClick={() => deleteCol(dataIndex)}></MinusOutlined>
                    </Tooltip>
                    <Tooltip title="添加一列">
                        <PlusOutlined onClick={() => addCol(dataIndex)}></PlusOutlined>
                    </Tooltip>
                </Space>
            </>
        )
    }

    const addCol = (dataIndex: string) => {
        const index = latestColumn.current.findIndex((t: any) => t.dataIndex == dataIndex)
        const newDataIndex = ulid()
        setColumn(t => {
            t.splice(index + 1, 0, {
                dataIndex: newDataIndex,
                title: RenderColumnTitle(newDataIndex),
                render: (text: string) => {
                    return <GuitarCell text={text} />
                },
            } as never)
            return [...t]
        })
    }

    const deleteCol = (dataIndex: string) => {
        const index = latestColumn.current.findIndex((t: any) => t.dataIndex == dataIndex)
        setColumn(t => {
            t.splice(index, 1)
            return [...t]
        })
    }

    const getColumn = () => {
        let res = []
        if (resultPanelNote.result) {
            res = resultPanelNote.result.reduce((prev: any[], cur: any, index: number) => {
                return [
                    ...prev,
                    {
                        dataIndex: String(cur.startTime),
                        title: RenderColumnTitle(String(cur.startTime)),
                        render: (text: string) => {
                            return <GuitarCell text={text} />
                        },
                    },
                ]
            }, [])
        }
        setColumn(res)
    }

    const getData = () => {
        let res = []
        if (resultPanelNote.result) {
            res = resultPanelNote.result.reduce(
                (prev: any[], cur: any) => {
                    const location = cur.location
                    prev[location[0]][cur.startTime] = location[1]
                    return prev
                },
                [{key: ulid()}, {key: ulid()}, {key: ulid()}, {key: ulid()}, {key: ulid()}, {key: ulid()}],
            )
        }
        setData(res)
    }

    useDeepCompareEffect(() => {
        console.log('是否重新获取行列')
        getData()
        getColumn()
    }, [resultPanelNote])

    const toPic = async () => {
        if (!tableRef.current || !data.length) return message.warn('没有数据:)')
        const blob = await html2canvas(tableRef.current, {
            useCORS: true,
            width: tableRef.current.scrollWidth,
        }).then(canvas => {
            return canvas.toDataURL('image/jpeg')
        })
        const a = document.createElement('a')
        a.setAttribute('download', `${musicName.split('.')[0]}.jpg`)
        a.setAttribute('href', blob)
        a.click()
        a.remove()
    }

    useImperativeHandle(ref, () => ({
        toPic,
    }))

    return (
        <div style={{width: '100%', overflowX: 'scroll'}}>
            <Table
                loading={processing}
                ref={tableRef}
                pagination={false}
                columns={column}
                dataSource={data}
                className={style['custom-table']}
            />
        </div>
    )
}

export default React.forwardRef(ResultTable)
