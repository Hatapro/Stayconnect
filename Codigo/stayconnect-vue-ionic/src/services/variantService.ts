import { pb } from './pb';

const getVariantsOfProduct = async (productId: string) => {
  return await pb.collection('variants').getFullList(200, {
    filter: `product = "${productId}"`,
    sort: '-stock',
  });
};

const updateVariant = async (variantId: string, data: any) => {
  return await pb.collection('variants').update(variantId, data);
};

export { getVariantsOfProduct, updateVariant };
