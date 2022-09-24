/** @format */

import React from 'react'
import GuitarChord from './GuitarChord'
import ErrorBoundary from './components/ErrorBoundary'

function App(props: any) {
    return (
        <>
            <ErrorBoundary>
                <GuitarChord></GuitarChord>
            </ErrorBoundary>
        </>
    )
}

export default App
