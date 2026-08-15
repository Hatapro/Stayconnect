import { pb } from './pb';

const login = async (email: string, password: string) => {
  return await pb.collection('users').authWithPassword(email, password);
};

const register = async ({ name, email, password, passwordConfirm }: any) => {
  return await pb.collection('users').create({ name, email, emailVisibility: true, password, passwordConfirm });
};

const logout = () => {
  pb.authStore.clear();
};

const getCurrentUser = () => {
  return pb.authStore.model;
};

const updateUser = async (id: string, data: any) => {
  return await pb.collection('users').update(id, data);
};

const deleteUser = async (id: string) => {
  return await pb.collection('users').delete(id);
};

const saveAuthModel = (token: string, model: any) => {
  const t = typeof token === 'undefined' || token === null ? pb.authStore.token : token;
  pb.authStore.save(t, model);
};

export { login, register, logout, getCurrentUser, saveAuthModel, updateUser, deleteUser };
