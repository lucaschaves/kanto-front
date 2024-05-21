import { RouterProvider } from "react-router-dom";
import { PageFallback } from "./pages";
import { appRoutes } from "./routes";

const App = () => {
    const routerApp = appRoutes();

    return (
        <RouterProvider router={routerApp} fallbackElement={<PageFallback />} />
    );
};

export default App;
