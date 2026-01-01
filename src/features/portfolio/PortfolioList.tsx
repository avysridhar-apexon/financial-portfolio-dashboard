import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchPortfolios,
  getPortfolios,
  getStatus,
  Portfolio,
  PortfolioAssetType,
  setStatus,
} from "./portfolioSlice";
import Loader from "../../components/Loader";
import FilterBar from "./FilterBar";
import classes from "./PortfolioList.module.css";
import SelectedSummary from "./SelectedSummary";

const DEBOUNCE_TIMEOUT = 350;

// utilit components
const CalculateInvestedText = ({ portfolio }: { portfolio: Portfolio }) => {
  const res = portfolio.investedAmount - portfolio.currentValue;
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
  const portfolios = useAppSelector(getPortfolios);
  const status = useAppSelector(getStatus);
  const [filter, setFilter] = useState<PortfolioAssetType | null>("All");
  const [debouncedFilter, setDebouncedFilter] =
    useState<PortfolioAssetType | null>("All");

  const filteredPortfolio = useMemo(() => {
    if (!debouncedFilter || debouncedFilter === "All") {
      return portfolios;
    } else {
      return portfolios.filter(({ type }) => type === debouncedFilter);
    }
  }, [debouncedFilter]);

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

  if (status === "failed") {
    // return <p className="error">{error}</p>;
    return (
      <RefreshButton
        text="Retry"
        onClick={() => {
          // setting status to idle would fetch the data.
          dispatch(setStatus("idle"));
        }}
      />
    );
  }

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <div className={classes.PortfolioHeader}>
        <FilterBar onSelect={setFilter} />
        <RefreshButton
          onClick={() => {
            // set to idle to refetch
            dispatch(setStatus("idle"));
          }}
        />
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
          {filteredPortfolio.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.investedAmount}</td>
              <td>{<CalculateInvestedText portfolio={p} />}</td>
              <td>
                <input type="checkbox" name={p.id}></input>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SelectedSummary count={0} total={0} />
    </>
  );
};
