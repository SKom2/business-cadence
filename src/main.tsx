import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./services/redux/store.ts";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabaseClient from "./api/supabaseClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <App />
      </SessionContextProvider>
    </Provider>
  </StrictMode>,
);
