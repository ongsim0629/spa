import { HomePage } from "./pages/HomePage.js";
import { getProducts, getProduct } from "./api/productApi.js";
import { DetailPage } from "./pages/DetailPage.js";

export const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
      onUnhandledRequest: "bypass",
    }),
  );

const push = (path) => {
  history.pushState(null, null, path);
  render();
};

const render = async () => {
  const $root = document.querySelector("#root");

  if (location.pathname === "/") {
    $root.innerHTML = HomePage({ loading: true });

    const data = await getProducts();

    $root.innerHTML = HomePage({ ...data, loading: false });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".product-card")) {
        const productId = e.target.closest(".product-card").dataset.productId;
        push(`/products/${productId}`);
      }
    });
  } else {
    $root.innerHTML = DetailPage({ loading: true });
    const productId = location.pathname.split("/").pop();
    const data = await getProduct(productId);

    const relatedData = await getProducts({ category2: data.category2 });
    const relatedProducts = relatedData.products.filter((p) => p.productId !== productId).slice(0, 2);

    $root.innerHTML = DetailPage({
      loading: false,
      product: data,
      relatedProducts,
    });
  }
};

window.addEventListener("popstate", () => {
  render();
});

const main = () => {
  render();
};

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
