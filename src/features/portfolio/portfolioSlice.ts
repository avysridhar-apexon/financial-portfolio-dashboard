import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { RootState } from "../../app/store";

export const PORTFOLIO_ASSET_TYPES = [
  "All",
  "Stock",
  "Mutual Fund",
  "Bond",
] as const;

export type PortfolioAssetType = (typeof PORTFOLIO_ASSET_TYPES)[number]; // set as union type.
export type PortfolioId = string;

export type Portfolio = {
  id: PortfolioId;
  name: string;
  type: PortfolioAssetType;
  investedAmount: number;
  currentValue: number;
};

type PortfolioStatus = "idle" | "loading" | "completed" | "failed";
type Portfolios = Portfolio[];

interface PortfolioSliceState extends EntityState<Portfolio, string> {
  status: PortfolioStatus;
  // list of select portfolioIds
  selected: PortfolioId[];
}

const portfoliosAdapter = createEntityAdapter<Portfolio>({});

const initialState: PortfolioSliceState = portfoliosAdapter.getInitialState({
  status: "idle",
  selected: [],
});

const fetchPortfoliosHelper = async (): Promise<Portfolios> =>
  (await fetch("/mock-portfolio.json")).json();

// createAppAsyncThunk is a wrapper for rtk.createAsyncThunk with appropriate types.
export const fetchPortfolios = createAppAsyncThunk(
  "portfolios/fetchPortfolios", // type (not url)
  fetchPortfoliosHelper, // payload
);

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: create => ({
    setStatus: create.reducer(
      (state, action: PayloadAction<PortfolioStatus>) => {
        state.status = action.payload;
      },
    ),
    setSelected: create.reducer(
      (state, action: PayloadAction<PortfolioId[]>) => {
        state.selected = action.payload;
      },
    ),
    toggleSelected: create.reducer(
      (state, action: PayloadAction<PortfolioId>) => {
        const idx = state.selected.findIndex(s => s === action.payload);
        if (idx === -1) {
          state.selected.push(action.payload);
        } else {
          state.selected.splice(idx, 1);
        }
      },
    ),
  }),
  extraReducers: builder => {
    // note: AsyncThunk has these promise `status` properties.
    builder
      .addCase(fetchPortfolios.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.status = "completed";
        // state.portfolios = action.payload.;
        portfoliosAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPortfolios.rejected, state => {
        state.status = "failed";
      });
  },

  selectors: {
    getStatus: state => state.status,
    getSelected: state => state.selected,
  },
});

export const { setStatus, setSelected, toggleSelected } =
  portfolioSlice.actions;
export const { getStatus, getSelected } = portfolioSlice.selectors;
export const portfoliosReducer = portfolioSlice.reducer;
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPortfolios,
  selectById: selectPortfolioById,
  //   selectIds: selectPortfolioIds,
  // Pass in a selector that returns the posts slice of state
} = portfoliosAdapter.getSelectors((state: RootState) => state.portfolio);
