import { pb } from './pb';

const getReviewsByProduct = async (productId: string, options: any = {}) => {
  const opts = { filter: `product = "${productId}"`, sort: '-created', expand: 'user', perPage: 200, ...options };

  return await pb.collection('reviews').getFullList(opts);
};

const createReview = async ({ product, userId, score, comment }: any) => {
  return await pb.collection('reviews').create({ product, user: userId, score, comment });
};

const updateReview = async (id: string, data: any) => {
  return await pb.collection('reviews').update(id, data);
};

const deleteReview = async (id: string) => {
  return await pb.collection('reviews').delete(id);
};

export { getReviewsByProduct, createReview, updateReview, deleteReview };
