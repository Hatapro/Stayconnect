import { pb } from './pb.js';

const getCategories = async () => {
  const res = await pb.collection('CATEGORIES').getFullList({ sort: '-created' });
  return res;
}

export { getCategories };
