import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import HomePage from "./pages/HomePage";
import ShareholdersPage from "./pages/ShareholdersPage";
import ShareholderPage from "./pages/ShareholderPage";
import "bootstrap/dist/css/bootstrap.min.css";
const BASE_NAME = "/SergeyBarshin/";

function App() {
  return (
    <BrowserRouter basename={BASE_NAME}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SHAREHOLDERS} element={<ShareholdersPage />} />
        <Route path={ROUTES.SHAREHOLDER} element={<ShareholderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
