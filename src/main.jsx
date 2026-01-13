import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Thanks from "./Thanks.jsx";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/thanks" element={<Thanks />} />
        </Routes>
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </StrictMode>
);
