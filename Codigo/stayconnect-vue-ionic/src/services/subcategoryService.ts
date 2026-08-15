import { pb } from './pb';

const getSubcategories = async (options: any = {}) => {
  return await pb.collection('subcategories').getFullList(options);
};

export { getSubcategories };
