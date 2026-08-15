import { pb } from './pb';

const getSubcategories = async (options = {}) => {
  return await pb.collection('subcategories').getFullList(options);
}

export { getSubcategories };
