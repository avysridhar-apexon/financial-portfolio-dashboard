import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { PortfolioList } from "./PortfolioList";

export const PORTFOLIO_ASSET_TYPES = [
  "All",
  "Stock",
  "Mutual Fund",
  "Bond",
] as const;

export type PortfolioAssetType = (typeof PORTFOLIO_ASSET_TYPES)[number]; // set as union type.

export type Portfolio = {
  id: string;
  name: string;
  type: PortfolioAssetType;
  investedAmount: number;
  currentValue: number;
};

type PortfolioStatus = "idle" | "loading" | "completed" | "failed";
type Portfolios = Portfolio[];

type PortfolioSliceState = {
  status: PortfolioStatus;
  portfolios: Portfolios;
};

const initialState: PortfolioSliceState = {
  status: "idle",
  portfolios: [],
};

const fetchPortfoliosHelper = async (): Promise<Portfolios> =>
  (await fetch("/mock-portfolio.json")).json();

// createAppAsyncThunk is a wrapper for rtk.createAsyncThunk with appropriate types.
export const fetchPortfolios = createAppAsyncThunk(
  "portfolios/fetchPortfolios", // type (not url)
  fetchPortfoliosHelper, // payload
);

// // utility fns
// function getRandomInt(min: number, max: number) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// // mock refetch which would modify the the prices randomly
// export const reFetchPortfolios = createAppAsyncThunk(
//   "portfolios/reFetchPortfolios", // type (not url)
//   async () => {
//     const portfolios = await fetchPortfoliosHelper();
//     // setTimeout(() => {}, 500);
//     portfolios.map(p => ({
//       ...p,
//       currentValue: p.currentValue + getRandomInt(-5, 5),
//     }));
//   },
// );

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: create => ({
    setStatus: create.reducer(
      (state, action: PayloadAction<PortfolioStatus>) => {
        state.status = action.payload;
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
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, state => {
        state.status = "failed";
      });
  },

  selectors: {
    getPortfolios: state => state.portfolios,
    getStatus: state => state.status,
  },
});

export const { setStatus } = portfolioSlice.actions;
export const { getPortfolios, getStatus } = portfolioSlice.selectors;
export const portfoliosReducer = portfolioSlice.reducer;
