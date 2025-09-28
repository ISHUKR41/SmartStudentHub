/**
 * Smart Student Hub application entry point.
 * 
 * Initializes React 18 application with global CSS and providers
 * managed through the App component.
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
