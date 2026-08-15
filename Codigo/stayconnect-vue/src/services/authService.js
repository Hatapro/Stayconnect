import { pb } from './pb.js';

const login = async function(email, password) {
  return await pb.collection('users').authWithPassword(email, password);
}

const register = async function({ name, email, password, passwordConfirm }) {
  return await pb.collection('users').create({ name, email, emailVisibility: true, password, passwordConfirm });
}

const logout = function() {
  pb.authStore.clear();
}

const getCurrentUser = function() {
  return pb.authStore.model;
}

const updateUser = async (id, data) => {
  return await pb.collection('users').update(id, data);
}

const deleteUser = async (id) => {
  return await pb.collection('users').delete(id);
}

const saveAuthModel = function(token, model) {
  const t = typeof token === 'undefined' || token === null ? pb.authStore.token : token;
  pb.authStore.save(t, model);
}

export { login, register, logout, getCurrentUser, saveAuthModel, updateUser, deleteUser };
