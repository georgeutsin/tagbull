import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BackendLocation } from "./utils";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("has backend set to prod", () => {
  expect(BackendLocation).toBe("prod");
});
