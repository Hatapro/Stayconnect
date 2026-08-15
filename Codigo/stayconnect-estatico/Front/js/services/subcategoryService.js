import { pb } from './pb.js';

const getSubcategories = async (options = {}) => {
  return await pb.collection('subcategories').getFullList(options);
}

export { getSubcategories };