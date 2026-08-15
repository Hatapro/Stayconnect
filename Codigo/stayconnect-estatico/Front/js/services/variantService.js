import { pb } from './pb.js';

const getVariantsOfProduct = async (productId) => {
  return await pb.collection('variants').getFullList(200, {
    filter: `product = "${productId}"`,
    sort: '-stock',
  });
}

const updateVariant = async (variantId, data) => {
  return await pb.collection('variants').update(variantId, data);
}

export { getVariantsOfProduct, updateVariant };