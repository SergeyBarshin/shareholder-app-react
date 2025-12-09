import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import HomePage from "./pages/HomePage";
import ShareholdersPage from "./pages/ShareholdersPage";
import ShareholderPage from "./pages/ShareholderPage";
import ModeratorPage from "./pages/ModeratorPage";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";

//const BASE_NAME = "/shareholder-app-react";

const IS_TAURI =
  typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__;
const BASE_NAME = IS_TAURI ? "/" : "/shareholder-app-react";

function App() {
  return (
    <BrowserRouter basename={BASE_NAME}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />{" "}
        <Route path={ROUTES.SHAREHOLDERS} element={<ShareholdersPage />} />
        <Route path={ROUTES.SHAREHOLDER} element={<ShareholderPage />} />
        <Route path={ROUTES.MODERATOR} element={<ModeratorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
