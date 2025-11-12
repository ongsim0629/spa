import { SearchForm, ProductList } from "../components/index.js";
import { PageLayout } from "./PageLayout.js";

export const HomePage = ({ filters, pagination, products, loading }) => {
  return PageLayout({
    children: /*HTML*/ `
    ${SearchForm({ filters, pagination })}
    ${ProductList({ loading, products })}
    `,
  });
};
