/** @format */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import style from './index.less'

interface state {
    hasError: boolean
}

/**
 * [错误catch组件]
 * @type {Object}
 */
class ErrorBoundary extends Component<any, state> {
    static propTypes = {
        children: PropTypes.instanceOf(Object).isRequired,
    }
    constructor(props: any) {
        super(props)
        this.state = {
            hasError: false,
        }
    }

    componentDidCatch() {
        console.log('错误了')
        this.setState({hasError: true})
    }

    render() {
        if (this.state.hasError) {
            return <div className={style.errorboundary} />
        }
        return this.props.children
    }
}

export default ErrorBoundary
