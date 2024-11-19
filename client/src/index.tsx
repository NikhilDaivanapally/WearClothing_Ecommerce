import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/Store.js";
import "./index.css";
import { Suspense } from "react";
createRoot(document.getElementById("root")!).render(
  <Suspense>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);
