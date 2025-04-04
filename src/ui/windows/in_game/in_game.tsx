import React from 'react'
import ReactDOM from 'react-dom/client'
import OverlayComponent from '../../../components/OverlayComponent'

const rootElement = document.getElementById('root')
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<OverlayComponent />
		</React.StrictMode>
	)
} else {
	console.error('Root element not found for in-game overlay!')
}
