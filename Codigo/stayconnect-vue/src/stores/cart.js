import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items') || '[]'),
  }),

  getters: {
    count: (state) => state.items.reduce((s, it) => s + (it.quantity || 1), 0),
    total: (state) => state.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
  },
  actions: {
    addItem(item) {
      const existing = this.items.find(i => i.id === item.id && i.variantId === item.variantId);
      if (existing) existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      else this.items.push({ ...item, quantity: item.quantity || 1 });
      this._save();
      try { window.dispatchEvent(new CustomEvent('cart:added', { detail: { item } })); } catch (e) { /* Ignore */ }
    },

    removeItem(indexOrId) {
      if (typeof indexOrId === 'number') this.items.splice(indexOrId, 1);
      else this.items = this.items.filter(i => i.id !== indexOrId);
      this._save();
    },

    clear() {
      this.items = [];
      this._save();
    },
    
    _save() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    }
  }
});
