import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import App from './CharacterSheet'
import registerServiceWorker from './registerServiceWorker'
import './i18n'

ReactDOM.render(
    <Suspense fallback={null}>
        <App />
    </Suspense>, 
    document.getElementById('root')
)
registerServiceWorker()