/** @format */

import App from './App'
import React from 'react'
import 'antd/dist/antd.css'
import {createRoot} from 'react-dom/client'

const rootEle = document.createElement('div')
rootEle.setAttribute('id', 'root')
document.body.appendChild(rootEle)

const root = createRoot(rootEle as HTMLElement)

root.render(<App></App>)
