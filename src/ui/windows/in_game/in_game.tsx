import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../../store";
import OverlayComponent from "../../../components/OverlayComponent";
import "../../../index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<Provider store={store}>
				<OverlayComponent />
			</Provider>
		</React.StrictMode>,
	);
} else {
	console.error("Root element not found for in-game overlay!");
}
