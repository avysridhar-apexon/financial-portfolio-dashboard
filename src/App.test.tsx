import { act, screen, waitFor } from "@testing-library/react";
import { App } from "./App";
import { renderWithProviders } from "./utils/test-utils";
import { Mock } from "vitest";

test("App should have correct initial render with header and loading..", () => {
  renderWithProviders(<App />);
  expect(
    screen.getByText(/Financial Portfolio Dashboard/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/loading../i)).toBeInTheDocument();
  expect(screen.queryByText(/summary../i)).not.toBeInTheDocument();
});

test("App should have correct error handling on fetch failure", async () => {
  // throw an error on fetch.
  global.fetch = vi.fn(() => Promise.reject(new Error("Server Error"))) as Mock;

  renderWithProviders(<App />);

  expect(screen.getByText(/loading../i)).toBeInTheDocument();
  // expecting Retry Button to show up (waits for sometine..)
  expect(await screen.findByText(/Retry/i)).toBeInTheDocument();
});

test("App should have correct data after filter by asset type", async () => {
  // throw an error on fetch.
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: "1",
            name: "HDFC Midcap",
            type: "Mutual Fund",
            investedAmount: 10000,
            currentValue: 13200,
          },
          {
            id: "2",
            name: "name2",
            type: "Bond",
            investedAmount: 1000,
            currentValue: 1320,
          },
        ]),
    }),
  ) as Mock;

  const { user } = renderWithProviders(<App />);

  expect(await screen.findByTestId("portfolio-row-1")).toBeInTheDocument();

  // select Bond as filter.
  user.selectOptions(await screen.findByTestId("asset-type"), "Mutual Fund");
  expect(await screen.findByTestId("portfolio-row-1")).not.toBeNull();
  user.selectOptions(await screen.findByTestId("asset-type"), "Bond");
  expect(await screen.findByTestId("portfolio-row-2")).not.toBeNull();
  //
});

test("App should have correct data for selected/tracking", async () => {
  // throw an error on fetch.
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: "1",
            name: "HDFC Midcap",
            type: "Mutual Fund",
            investedAmount: 10000,
            currentValue: 13200,
          },
          {
            id: "2",
            name: "name2",
            type: "Bond",
            investedAmount: 1000,
            currentValue: 1320,
          },
        ]),
    }),
  ) as Mock;

  const { user } = renderWithProviders(<App />);
  // check if checkbox is in rendered.
  expect(await screen.findByTestId("checkbox-1")).toBeInTheDocument();
  // initially no summary
  expect(screen.queryByText(/summary/i)).not.toBeInTheDocument();
  expect(screen.queryByText("Total: 13200")).not.toBeInTheDocument();
  expect(screen.queryByText("Count: 1")).not.toBeInTheDocument();

  // click row 1. (select)
  user.click(await screen.findByTestId("checkbox-1"));
  expect(await screen.findByText(/summary/i)).toBeInTheDocument();
  // check if correct summary is shown.
  expect(await screen.findByText("Total: 13200")).toBeInTheDocument();
  expect(await screen.findByText("Count: 1")).toBeInTheDocument();
});
