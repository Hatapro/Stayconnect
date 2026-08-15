import { defineStore } from 'pinia';
import * as authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser() || null,
  }),

  actions: {
    async login(email: string, password: string) {
      const r = await authService.login(email, password);
      authService.saveAuthModel(r.token, r.record);
      this.user = authService.getCurrentUser();
      return r;
    },

    async register(payload: any) {
      const r = await authService.register(payload);
      authService.saveAuthModel(r.token, r.record);
      this.user = authService.getCurrentUser();
      return r;
    },

    async logout() {
      authService.logout();
      this.user = null;
    },

    async updateUser(id: string, data: any) {
      const r = await authService.updateUser(id, data);
      this.user = authService.getCurrentUser();
      return r;
    },

    async deleteUser(id: string) {
      return await authService.deleteUser(id);
    },
  },
});
