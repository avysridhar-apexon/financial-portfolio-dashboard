import { act, screen, waitFor } from "@testing-library/react";
import { Mock } from "vitest";
import { PortfolioList } from "./PortfolioList";
import { renderWithProviders } from "../../utils/test-utils";

test("App should have correct data displaying on successful fetch", async () => {
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
        ]),
    }),
  ) as Mock;

  renderWithProviders(<PortfolioList />);

  expect(screen.getByText(/loading../i)).toBeInTheDocument();
  expect(await screen.findByText(/HDFC Midcap/i)).toBeInTheDocument();
  expect(await screen.findByText(/10000/i)).toBeInTheDocument();
  // calculate amount
  expect(await screen.findByText(/3200/i)).toBeInTheDocument();
});
