import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]'),
  }),

  getters: {
    count: (state: any) => state.items.reduce((s: number, it: any) => s + (it.quantity || 1), 0),
    total: (state: any) => state.items.reduce((s: number, it: any) => s + (it.price || 0) * (it.quantity || 1), 0),
  },

  actions: {
    addItem(item: any) {
      const existing = this.items.find((i: any) => i.id === item.id && i.variantId === item.variantId);
      if (existing) existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      else this.items.push({ ...item, quantity: item.quantity || 1 });
      this._save();
      try {
        window.dispatchEvent(new CustomEvent('cart:added', { detail: { item } }));
      } catch (e) {
        /* Ignore */
      }
    },

    removeItem(indexOrId: number | string) {
      if (typeof indexOrId === 'number') this.items.splice(indexOrId, 1);
      else this.items = this.items.filter((i: any) => i.id !== indexOrId);
      this._save();
    },

    clear() {
      this.items = [];
      this._save();
    },

    _save() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    },
  },
});
