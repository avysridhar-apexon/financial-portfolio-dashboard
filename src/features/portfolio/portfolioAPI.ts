type Portfolio = {
  id: string;
  name: string;
  type: string;
  investedAmount: number;
  currentValue: number;
};

// A mock function to mimic making an async request for local data.
export const fetchPortfolios = async (): Promise<Portfolio[]> => {
  const resp = await fetch("/mock-portfolio.json");
  return await resp.json();
};
