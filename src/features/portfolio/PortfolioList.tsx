import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setSelected,
  fetchPortfolios,
  getSelected,
  getStatus,
  Portfolio,
  PortfolioAssetType,
  selectAllPortfolios,
  setStatus,
  toggleSelected,
} from "./portfolioSlice";

import Loader from "../../components/Loader";
import FilterBar from "./FilterBar";
import classes from "./PortfolioList.module.css";
import SelectedSummary from "./SelectedSummary";

const DEBOUNCE_TIMEOUT = 350;

// utilit components
const CalculateInvestedText = ({ portfolio }: { portfolio: Portfolio }) => {
  const res = portfolio.currentValue - portfolio.investedAmount;
  return res <= 0 ? (
    <span className="error">{res}</span>
  ) : (
    <span className="success">+{res}</span>
  );
};

const RefreshButton = ({
  text = "Refresh Prices",
  onClick,
}: {
  text?: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className="outline contrast">
      {/* <img width="30px" src="/refresh.svg" onClick={onClick}></img> */}
      {text}
    </button>
  );
};

export const PortfolioList = () => {
  const dispatch = useAppDispatch(); // pre configured with app store's dispatch types.
  const portfolios = useAppSelector(selectAllPortfolios);
  const status = useAppSelector(getStatus);
  const selected = useAppSelector(getSelected);
  const [filter, setFilter] = useState<PortfolioAssetType>("All");
  const [debouncedFilter, setDebouncedFilter] =
    useState<PortfolioAssetType>("All");

  const refreshHandler = () => {
    // set to idle to refetch
    dispatch(setStatus("idle"));
  };

  const filteredPortfolios = useMemo(() => {
    if (!debouncedFilter || debouncedFilter === "All") {
      return portfolios;
    } else {
      return portfolios.filter(({ type }) => type === debouncedFilter);
    }
  }, [debouncedFilter, portfolios]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilter(filter);
    }, DEBOUNCE_TIMEOUT);
    // clean up
    return () => window.clearTimeout(timeoutId);
  }, [filter]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPortfolios());
    }
    // only run on status === "idle";
  }, [status]);

  useEffect(() => {
    dispatch(
      setSelected(
        selected.filter(s => filteredPortfolios.some(({ id }) => id === s)),
      ),
    );
    // remove selected state from items that are filtered out of state.
  }, [filteredPortfolios]);

  if (status === "failed") {
    // return <p className="error">{error}</p>;
    return <RefreshButton text="Retry" onClick={refreshHandler} />;
  }

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <div className={classes.PortfolioHeader}>
        <FilterBar value={filter} onSelect={setFilter} />
        <RefreshButton onClick={refreshHandler} />
      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Invested Amount</th>
            <th scope="col">Profit/Loss</th>
            <th scope="col">Track</th>
          </tr>
        </thead>
        <tbody>
          {filteredPortfolios.map(p => (
            <tr key={p.id} data-testid={`portfolio-row-${p.id}`}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.investedAmount}</td>
              <td>{<CalculateInvestedText portfolio={p} />}</td>
              <td>
                <input
                  type="checkbox"
                  data-testid={`checkbox-${p.id}`}
                  name={p.id}
                  checked={selected.some(s => p.id === s)}
                  onChange={() => dispatch(toggleSelected(p.id))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <SelectedSummary portfolios={filteredPortfolios} selected={selected} />
      )}
    </>
  );
};
