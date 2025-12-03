import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found! Unable to mount React application.");
}

createRoot(rootElement).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
);

if (import.meta.env.DEV) {
	console.log("AbTracker initialized in development mode");
	console.log("Environment:", import.meta.env.MODE);
}
