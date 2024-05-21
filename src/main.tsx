import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { AuthProvider, ThemeProvider } from "./context";
import "./i18n";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <ThemeProvider defaultTheme="light" storageKey="kanto-ui-theme">
        <AuthProvider>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                theme="light"
            />
        </AuthProvider>
    </ThemeProvider>
);
