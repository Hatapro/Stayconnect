import { pb } from './pb.js';

const getProducts = async (page, perPage) => {
  return await pb.collection('products').getList(page, perPage, { sort: '-created' });
}

const getProductById = async (id) => {
  return await pb.collection('products').getOne(id);
}

const searchProducts = async (search, page, perPage) => {
  return await pb.collection('products').getList(page, perPage, {
    filter: `name ~ "${search}" || description ~ "${search}"`,
    sort: '-created',
  });
}

const getFeaturedProducts = async (limit) => {
  const result = await pb.collection('products').getList(1, limit, {
    sort: '-created'
  });
  return result.items;
}

const getProductsWithOptions = async (page, perPage, options = {}) => {
  return await pb.collection('products').getList(page, perPage, options);
}

const setAutoCancellation = (flag) => {
  if (typeof pb.autoCancellation === 'function') pb.autoCancellation(flag);
}

export { getProducts, getProductById, searchProducts, getFeaturedProducts, getProductsWithOptions, setAutoCancellation };