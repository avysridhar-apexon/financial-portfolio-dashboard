import { PORTFOLIO_ASSET_TYPES, PortfolioAssetType } from "./portfolioSlice";
import classes from "./FilterBar.module.css";

export default function FilterBar({
  value,
  onSelect,
}: {
  value: PortfolioAssetType;
  onSelect: (value: PortfolioAssetType) => void;
}) {
  return (
    <div className={classes.FilterBar}>
      <span>Filter by Asset Type</span>
      <select
        name="asset-type"
        data-testid="asset-type"
        aria-label="Filter by Asset Type"
        onChange={e => onSelect(e.target.value as PortfolioAssetType)}
        value={value}
        required
      >
        {PORTFOLIO_ASSET_TYPES.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
