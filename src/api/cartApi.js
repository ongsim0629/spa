const CART_STORAGE_KEY = "shopping_cart";

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("��ٱ��� �ε� ����:", error);
    return [];
  }
};

export const addToCart = (product, quantity = 1) => {
  try {
    const cart = getCart();
    const existingIndex = cart.findIndex((item) => item.productId === product.productId);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
        selected: true,
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("��ٱ��� �߰� ����:", error);
    throw error;
  }
};

export const removeFromCart = (productId) => {
  try {
    const cart = getCart();
    const filtered = cart.filter((item) => item.productId !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("��ٱ��� ���� ����:", error);
    throw error;
  }
};

export const updateCartQuantity = (productId, quantity) => {
  try {
    const cart = getCart();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
      item.quantity = Math.max(1, quantity);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("��ٱ��� ���� ������Ʈ ����:", error);
    throw error;
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  } catch (error) {
    console.error("��ٱ��� �ʱ�ȭ ����:", error);
    throw error;
  }
};

export const getCartCount = () => {
  try {
    const cart = getCart();
    return cart.length;
  } catch (error) {
    console.error("��ٱ��� ���� ��ȸ ����:", error);
    return 0;
  }
};

export const toggleCartItemSelection = (productId) => {
  try {
    const cart = getCart();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
      item.selected = !item.selected;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("��ٱ��� ���� ��� ����:", error);
    throw error;
  }
};

export const toggleAllCartItems = (selected) => {
  try {
    const cart = getCart();
    cart.forEach((item) => {
      item.selected = selected;
    });

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error("��ٱ��� ��ü ���� ����:", error);
    throw error;
  }
};

export const removeSelectedItems = () => {
  try {
    const cart = getCart();
    const filtered = cart.filter((item) => !item.selected);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("���� �׸� ���� ����:", error);
    throw error;
  }
};
