import { Portfolio, PortfolioId } from "./portfolioSlice";

// not working :c
// i guess should be registered once per component..
// const getCurrentValue = (pid: PortfolioId) =>
//   useAppSelector(state => selectPortfolioById(state, pid)).currentValue || 0;

// const calculateTotal = (selected: PortfolioId[]) =>
//   selected.reduce((total, s) => total + getCurrentValue(s), 0);

const getCurrentValue = (portfolios: Portfolio[], pid: PortfolioId) =>
  portfolios.find(({ id }) => id === pid)?.currentValue || 0;

const calculateTotal = (portfolios: Portfolio[], selected: PortfolioId[]) =>
  selected.reduce((total, s) => total + getCurrentValue(portfolios, s), 0);

export default function SelectedSummary({
  portfolios,
  selected,
}: {
  portfolios: Portfolio[];
  selected: PortfolioId[];
}) {
  return (
    <details style={{ marginTop: "30px" }} name="example" open>
      <summary>Selected Summary</summary>
      <article>
        <p>Count: {selected.length}</p>
        <p>Total: {calculateTotal(portfolios, selected)}</p>
      </article>
    </details>
  );
}
