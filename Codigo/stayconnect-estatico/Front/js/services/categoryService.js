import { pb } from './pb.js';


const getCategories = async () => {
  return await pb.collection('categories').getFullList();
}

export { getCategories };