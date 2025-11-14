import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { SearchForm } from "../components/SearchForm.js";
import { ProductList } from "../components/ProductList.js";

export const HomePage = ({
  products = [],
  filters = {},
  categories = {},
  loading = false,
  error = false,
  cartCount = 0,
  totalCount = 0,
  isLoadingMore = false,
}) => {
  if (error) {
    return /*HTML*/ `
      <div class="min-h-screen bg-gray-50">
        ${Header({ cartCount })}
        <main class="max-w-md mx-auto px-4 py-4">
          <div class="text-center py-20">
            <p class="text-gray-600 mb-4">상품을 불러오는데 실패했습니다.</p>
            <button id="retry-button" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              다시 시도
            </button>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  return /*HTML*/ `
    <div class="min-h-screen bg-gray-50">
      ${Header({ cartCount })}
      <main class="max-w-md mx-auto px-4 py-4">
        ${SearchForm({ filters, categories })}
        ${ProductList({ products, totalCount, loading, isLoadingMore })}
      </main>
      ${Footer()}
    </div>
  `;
};
