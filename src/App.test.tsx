import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "jotai";

test("renders title", () => {
  render(
    <Provider>
      <App></App>
    </Provider>
  );
  const linkElement = screen.getByText(/Hnefatafl/i);
  expect(linkElement).toBeInTheDocument();
});
