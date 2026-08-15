import { pb } from './pb';

const getProducts = async (page = 1, perPage = 12) => {
  return await pb.collection('products').getList(page, perPage, { sort: '-created' });
};

const getProductById = async (id: string) => {
  return await pb.collection('products').getOne(id);
};

const searchProducts = async (search: string, page = 1, perPage = 12) => {
  return await pb.collection('products').getList(page, perPage, {
    filter: `name ~ "${search}" || description ~ "${search}"`,
    sort: '-created',
  });
};

const getFeaturedProducts = async (limit = 8) => {
  const result = await pb.collection('products').getList(1, limit, {
    sort: '-created',
  });

  return result.items;
};

const getProductsWithOptions = async (page: number, perPage: number, options: any = {}) => {
  return await pb.collection('products').getList(page, perPage, options);
};

const setAutoCancellation = (flag: boolean) => {
  if (typeof pb.autoCancellation === 'function') pb.autoCancellation(flag);
};

export { getProducts, getProductById, searchProducts, getFeaturedProducts, getProductsWithOptions, setAutoCancellation };
