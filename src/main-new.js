import { HomePage } from "./pages/HomePage.js";
import { getProducts, getProduct, getCategories } from "./api/productApi.js";
import { DetailPage } from "./pages/DetailPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartCount,
  toggleCartItemSelection,
  toggleAllCartItems,
  // removeSelectedItems,
} from "./api/cartApi.js";
import { showToast } from "./utils/toast.js";
import { CartModal } from "./components/CartModal.js";

export const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
      onUnhandledRequest: "bypass",
    }),
  );

// URL 쿼리 파라미터 유틸리티 함수들
const updateURL = (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category1) params.set("category1", filters.category1);
  if (filters.category2) params.set("category2", filters.category2);
  if (filters.sort !== "price_asc") params.set("sort", filters.sort);
  params.set("limit", filters.limit.toString());

  const queryString = params.toString();
  const newURL = queryString ? `/?${queryString}` : "/";

  if (window.location.pathname + window.location.search !== newURL) {
    history.pushState(null, null, newURL);
  }
};

const parseURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    limit: parseInt(params.get("limit")) || 20,
    page: 1,
    search: params.get("search") || "",
    category1: params.get("category1") || "",
    category2: params.get("category2") || "",
    sort: params.get("sort") || "price_asc",
  };
};

// 필터 상태 관리
let currentFilters = parseURLParams();

// 무한 스크롤 상태
let allProducts = [];
let isLoading = false;
let hasMore = true;
let scrollHandler = null;
let categoriesData = {};
let isCartModalOpen = false;

// 장바구니 모달 열기
const openCartModal = () => {
  isCartModalOpen = true;
  const cartItems = getCart();
  const modalHtml = CartModal({ items: cartItems, isOpen: true });

  const existingModal = document.querySelector(".cart-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  const rootElement = document.getElementById("root");
  if (rootElement) {
    Array.from(rootElement.children).forEach((child) => {
      if (!child.classList.contains("cart-modal-overlay")) {
        child.style.display = "none";
        child.setAttribute("aria-hidden", "true");
      }
    });

    rootElement.insertAdjacentHTML("beforeend", modalHtml);

    const newModal = rootElement.querySelector(".cart-modal-overlay");
    if (newModal) {
      newModal.style.position = "fixed";
      newModal.style.top = "0";
      newModal.style.left = "0";
      newModal.style.right = "0";
      newModal.style.bottom = "0";
      newModal.style.zIndex = "9999";
      newModal.style.display = "flex";
    }
  } else {
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  setupCartModalEvents();
  document.body.style.overflow = "hidden";
};

// 장바구니 모달 닫기
const closeCartModal = () => {
  isCartModalOpen = false;
  const modal = document.querySelector(".cart-modal-overlay");
  if (modal) {
    modal.remove();
  }

  const rootElement = document.getElementById("root");
  if (rootElement) {
    Array.from(rootElement.children).forEach((child) => {
      if (!child.classList.contains("cart-modal-overlay")) {
        child.style.display = "";
        child.removeAttribute("aria-hidden");
      }
    });
  }

  document.body.style.overflow = "";
};

// 장바구니 모달 새로고침
const refreshCartModal = (fullRefresh = false) => {
  if (!isCartModalOpen) {
    return;
  }

  const cart = getCart();

  if (fullRefresh) {
    const modal = document.querySelector(".cart-modal");
    if (modal) {
      const fullHTML = CartModal({ items: cart, isOpen: true });
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullHTML, "text/html");
      const newModalContent = doc.querySelector(".cart-modal");

      if (newModalContent) {
        modal.innerHTML = newModalContent.innerHTML;
        setupCartModalEvents();
      }
    }
    updateCartBadge();
    return;
  }

  const totalAmount = cart.reduce((sum, item) => {
    return sum + parseInt(item.lprice) * (item.quantity || 1);
  }, 0);

  const totalAmountElement = document.querySelector("#cart-modal-total-amount");
  if (totalAmountElement) {
    totalAmountElement.textContent = `${totalAmount.toLocaleString()}원`;
  }

  cart.forEach((item) => {
    const quantityInput = document.querySelector(`.quantity-input[data-product-id="${item.productId}"]`);
    if (quantityInput) {
      quantityInput.value = item.quantity || 1;
    }

    const itemElement = document.querySelector(`.cart-item[data-product-id="${item.productId}"]`);
    if (itemElement) {
      const priceSection = itemElement.querySelector(".text-right");
      if (priceSection) {
        const subtotalElement = priceSection.querySelector(".text-sm.font-medium.text-gray-900");
        if (subtotalElement) {
          const subtotal = parseInt(item.lprice) * (item.quantity || 1);
          subtotalElement.textContent = `${subtotal.toLocaleString()}원`;
        }
      }
    }
  });

  updateCartBadge();
};

// 장바구니 배지 업데이트
const updateCartBadge = () => {
  const count = getCartCount();
  const badge = document.getElementById("cart-badge");
  const cartBtn = document.getElementById("cart-icon-btn");

  if (count > 0) {
    if (badge) {
      badge.textContent = count > 99 ? "99+" : count;
    } else if (cartBtn) {
      const badgeHtml = `<span id="cart-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">${count > 99 ? "99+" : count}</span>`;
      cartBtn.insertAdjacentHTML("beforeend", badgeHtml);
    }
  } else {
    if (badge) {
      badge.remove();
    }
  }
};

// 장바구니 모달 버튼 영역 업데이트
const updateCartModalButtons = () => {
  const cart = getCart();
  const selectedItems = cart.filter((item) => item.selected);
  const hasSelectedItems = selectedItems.length > 0;

  const removeBtn = document.getElementById("cart-modal-remove-selected-btn");
  if (removeBtn) {
    if (hasSelectedItems) {
      removeBtn.style.display = "block";
      removeBtn.textContent = `선택한 상품 삭제 (${selectedItems.length}개)`;
    } else {
      removeBtn.style.display = "none";
    }
  }
};

// 장바구니 모달 이벤트 설정
const setupCartModalEvents = () => {
  document.getElementById("cart-modal-close-btn")?.addEventListener("click", closeCartModal);

  document.getElementById("cart-modal-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "cart-modal-overlay") {
      closeCartModal();
    }
  });

  const handleEsc = (e) => {
    if (e.key === "Escape" && isCartModalOpen) {
      closeCartModal();
      document.removeEventListener("keydown", handleEsc);
    }
  };
  document.addEventListener("keydown", handleEsc);

  document.querySelectorAll(".quantity-increase-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.productId;
      const cart = getCart();
      const item = cart.find((p) => p.productId === productId);
      if (item) {
        updateCartQuantity(productId, (item.quantity || 1) + 1);
        requestAnimationFrame(() => {
          refreshCartModal(false);
        });
      }
    });
  });

  document.querySelectorAll(".quantity-decrease-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.productId;
      const cart = getCart();
      const item = cart.find((p) => p.productId === productId);
      if (item && (item.quantity || 1) > 1) {
        updateCartQuantity(productId, (item.quantity || 1) - 1);
        requestAnimationFrame(() => {
          refreshCartModal(false);
        });
      }
    });
  });

  document.querySelectorAll(".cart-item-remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.productId;
      removeFromCart(productId);
      showToast("상품이 장바구니에서 삭제되었습니다.", "success");
      refreshCartModal(true);
    });
  });

  document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const productId = e.currentTarget.dataset.productId;
      toggleCartItemSelection(productId);

      const cart = getCart();
      const allChecked = cart.length > 0 && cart.every((item) => item.selected);
      const selectAllCheckbox = document.getElementById("cart-modal-select-all-checkbox");
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
      }
      updateCartModalButtons();
    });
  });

  document.getElementById("cart-modal-select-all-checkbox")?.addEventListener("change", (e) => {
    const selectAll = e.target.checked;
    toggleAllCartItems(selectAll);

    document.querySelectorAll(".cart-item-checkbox").forEach((checkbox) => {
      checkbox.checked = selectAll;
    });

    updateCartModalButtons();
  });

  setupCartModalButtonEvents();

  document.querySelectorAll(".cart-item-image, .cart-item-title").forEach((element) => {
    element.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.productId;
      closeCartModal();
      window.history.pushState(null, null, `/product/${productId}`);
      render();
    });
  });
};

// 장바구니 모달 버튼 이벤트
const setupCartModalButtonEvents = () => {
  document.getElementById("cart-modal-remove-selected-btn")?.addEventListener("click", (e) => {
    e.preventDefault();

    const checkedBoxes = document.querySelectorAll(".cart-item-checkbox:checked");
    if (checkedBoxes.length === 0) {
      showToast("삭제할 상품을 선택해주세요.", "error");
      return;
    }

    const count = checkedBoxes.length;
    const productIds = Array.from(checkedBoxes).map((cb) => cb.dataset.productId);

    productIds.forEach((productId) => {
      removeFromCart(productId);
    });

    showToast(`${count}개 상품이 삭제되었습니다.`, "success");

    requestAnimationFrame(() => {
      refreshCartModal(true);
    });
  });

  document.getElementById("cart-modal-clear-cart-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("장바구니를 비우시겠습니까?")) {
      clearCart();
      showToast("장바구니가 비워졌습니다.", "success");
      closeCartModal();
      openCartModal();
    }
  });

  document.getElementById("cart-modal-checkout-btn")?.addEventListener("click", () => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      showToast("장바구니에 상품이 없습니다.", "error");
      return;
    }
    showToast("구매 기능은 준비 중입니다.", "info");
  });
};

const push = (path) => {
  history.pushState(null, null, path);
  allProducts = [];
  currentFilters.page = 1;
  hasMore = true;
  render();
};

const render = async (isInfiniteScroll = false) => {
  const $root = document.querySelector("#root");

  if (location.pathname === "/") {
    if (!isInfiniteScroll) {
      $root.innerHTML = HomePage({ loading: true, categories: {} });
      allProducts = [];
      currentFilters.page = 1;
      hasMore = true;
    }

    if (Object.keys(categoriesData).length === 0) {
      try {
        categoriesData = await getCategories();
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
      }
    }

    try {
      if (isLoading || !hasMore) return;

      isLoading = true;

      const data = await getProducts(currentFilters);

      if (isInfiniteScroll) {
        allProducts = [...allProducts, ...data.products];
      } else {
        allProducts = data.products;
      }

      hasMore = data.pagination.hasNext;

      const cartCount = getCartCount();

      $root.innerHTML = HomePage({
        ...data,
        products: allProducts,
        filters: currentFilters,
        categories: categoriesData,
        cartCount,
        loading: false,
        error: false,
        isLoadingMore: false,
        totalCount: data.pagination?.total || data.products?.length || 0,
      });

      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 200 && hasMore && !isLoading) {
          currentFilters.page += 1;

          const productsGrid = document.getElementById("products-grid");
          if (productsGrid) {
            const loadingIndicator = document.createElement("div");
            loadingIndicator.className = "col-span-2 text-center py-4";
            loadingIndicator.id = "loading-more";
            loadingIndicator.innerHTML = `
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            `;
            productsGrid.appendChild(loadingIndicator);
          }

          render(true);
        }
      };

      const handleClick = (e) => {
        if (e.target.closest("#cart-icon-btn")) {
          e.preventDefault();
          openCartModal();
          return;
        }

        if (e.target.closest(".add-to-cart-btn")) {
          e.stopPropagation();
          const button = e.target.closest(".add-to-cart-btn");
          const productId = button.dataset.productId;

          const product = allProducts.find((p) => p.productId === productId);

          if (product) {
            const result = addToCart(product);
            if (result.success) {
              showToast("장바구니에 추가되었습니다", "success");
              updateCartBadge();
            } else {
              showToast("장바구니 추가에 실패했습니다.", "error");
            }
          }
          return;
        }

        if (e.target.closest(".product-card")) {
          const productId = e.target.closest(".product-card").dataset.productId;
          push(`/product/${productId}`);
        }

        if (e.target.id === "retry-button") {
          render();
        }

        if (e.target.id === "search-button") {
          const searchInput = document.getElementById("search-input");
          if (searchInput) {
            currentFilters.search = searchInput.value.trim();
            currentFilters.page = 1;
            allProducts = [];
            updateURL(currentFilters);
            render();
          }
        }

        if (e.target.dataset.breadcrumb === "reset") {
          currentFilters.category1 = "";
          currentFilters.category2 = "";
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }

        if (e.target.dataset.breadcrumb === "category1") {
          currentFilters.category2 = "";
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }

        if (e.target.dataset.category1) {
          currentFilters.category1 = e.target.dataset.category1;
          currentFilters.category2 = "";
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }

        if (e.target.dataset.category2) {
          currentFilters.category2 = e.target.dataset.category2;
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }
      };

      const handleKeyPress = (e) => {
        if (e.target.id === "search-input" && e.key === "Enter") {
          currentFilters.search = e.target.value.trim();
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }
      };

      const handleChange = (e) => {
        if (e.target.id === "limit-select") {
          currentFilters.limit = Number(e.target.value);
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }

        if (e.target.id === "sort-select") {
          currentFilters.sort = e.target.value;
          currentFilters.page = 1;
          allProducts = [];
          updateURL(currentFilters);
          render();
        }
      };

      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
      document.body.removeEventListener("click", handleClick);
      document.body.removeEventListener("change", handleChange);
      document.body.removeEventListener("keypress", handleKeyPress);

      scrollHandler = handleScroll;
      window.addEventListener("scroll", scrollHandler);
      document.body.addEventListener("click", handleClick);
      document.body.addEventListener("change", handleChange);
      document.body.addEventListener("keypress", handleKeyPress);

      isLoading = false;
    } catch (error) {
      console.error("상품 로드 실패:", error);
      isLoading = false;

      if (!isInfiniteScroll) {
        const cartCount = getCartCount();
        $root.innerHTML = HomePage({
          loading: false,
          error: true,
          products: [],
          categories: categoriesData,
          cartCount,
        });

        document.getElementById("retry-button")?.addEventListener("click", () => {
          render();
        });
      }
    }
  } else if (location.pathname.startsWith("/product/")) {
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler);
      scrollHandler = null;
    }

    try {
      $root.innerHTML = DetailPage({ loading: true });
      const productId = location.pathname.split("/").pop();
      const data = await getProduct(productId);

      const relatedData = await getProducts({
        category2: data.category2,
        limit: 10,
      });
      const relatedProducts = relatedData.products.filter((p) => p.productId !== productId).slice(0, 4);

      const cartCount = getCartCount();

      $root.innerHTML = DetailPage({
        loading: false,
        product: data,
        relatedProducts,
        cartCount,
      });

      setupDetailPageEvents(data);
    } catch (error) {
      console.error("상품 로드 실패:", error);
      $root.innerHTML = NotFoundPage();

      document.getElementById("go-home-btn")?.addEventListener("click", () => {
        currentFilters = {
          limit: 20,
          page: 1,
          search: "",
          category1: "",
          category2: "",
          sort: "price_asc",
        };
        allProducts = [];
        push("/");
      });
    }
  } else {
    $root.innerHTML = NotFoundPage();

    document.getElementById("go-home-btn")?.addEventListener("click", () => {
      currentFilters = {
        limit: 20,
        page: 1,
        search: "",
        category1: "",
        category2: "",
        sort: "price_asc",
      };
      allProducts = [];
      push("/");
    });
  }
};

// 상세 페이지 이벤트 설정
const setupDetailPageEvents = (product) => {
  document.getElementById("cart-icon-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    openCartModal();
  });

  document.querySelector("button[onclick*='history.back']")?.addEventListener("click", (e) => {
    e.preventDefault();
    push("/");
  });

  let quantity = 1;
  const quantityInput = document.getElementById("quantity-input");
  const decreaseBtn = document.getElementById("quantity-decrease");
  const increaseBtn = document.getElementById("quantity-increase");

  const updateQuantity = (newQuantity) => {
    const max = product.stock || 999;
    quantity = Math.max(1, Math.min(max, newQuantity));
    if (quantityInput) quantityInput.value = quantity;

    if (decreaseBtn) {
      decreaseBtn.disabled = quantity <= 1;
      decreaseBtn.classList.toggle("opacity-50", quantity <= 1);
      decreaseBtn.classList.toggle("cursor-not-allowed", quantity <= 1);
    }

    if (increaseBtn) {
      increaseBtn.disabled = quantity >= max;
      increaseBtn.classList.toggle("opacity-50", quantity >= max);
      increaseBtn.classList.toggle("cursor-not-allowed", quantity >= max);
    }
  };

  decreaseBtn?.addEventListener("click", () => {
    if (quantity > 1) {
      updateQuantity(quantity - 1);
    }
  });

  increaseBtn?.addEventListener("click", () => {
    if (quantity < (product.stock || 999)) {
      updateQuantity(quantity + 1);
    }
  });

  quantityInput?.addEventListener("change", (e) => {
    updateQuantity(parseInt(e.target.value) || 1);
  });

  updateQuantity(1);

  document.getElementById("add-to-cart-btn")?.addEventListener("click", () => {
    if ((product.stock || 0) === 0) {
      showToast("품절된 상품입니다.", "error");
      return;
    }

    let successCount = 0;
    for (let i = 0; i < quantity; i++) {
      const result = addToCart(product);
      if (result.success) {
        successCount++;
      }
    }

    if (successCount === quantity) {
      showToast(`${quantity}개의 상품이 장바구니에 추가되었습니다!`, "success");
    } else if (successCount > 0) {
      showToast(`${successCount}개의 상품이 장바구니에 추가되었습니다.`, "info");
    } else {
      showToast("장바구니 추가에 실패했습니다.", "error");
    }

    updateCartBadge();
  });

  document.querySelectorAll(".breadcrumb-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category1 = btn.dataset.category1;
      const category2 = btn.dataset.category2;

      if (!category1 && !category2) {
        currentFilters.category1 = "";
        currentFilters.category2 = "";
        currentFilters.search = "";
        currentFilters.page = 1;
        allProducts = [];
        updateURL(currentFilters);
        push("/");
      } else if (category1 && !category2) {
        currentFilters.category1 = category1;
        currentFilters.category2 = "";
        currentFilters.page = 1;
        allProducts = [];
        updateURL(currentFilters);
        push("/");
      } else if (category1 && category2) {
        currentFilters.category1 = category1;
        currentFilters.category2 = category2;
        currentFilters.page = 1;
        allProducts = [];
        updateURL(currentFilters);
        push("/");
      }
    });
  });

  document.querySelector(".go-to-product-list")?.addEventListener("click", () => {
    push("/");
  });

  document.querySelectorAll(".related-product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.dataset.productId;
      push(`/product/${productId}`);
    });
  });
};

window.addEventListener("popstate", () => {
  if (location.pathname === "/") {
    currentFilters = parseURLParams();
    allProducts = [];
  }
  render();
});

const main = () => {
  render();
};

if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
