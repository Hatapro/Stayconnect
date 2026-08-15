import { pb } from './pb.js';

const getReviewsByProduct = async (productId, options = {}) => {
	const opts = { filter: `product = "${productId}"`, sort: '-created', expand: 'user', perPage: 200, ...options };
	return await pb.collection('reviews').getFullList(opts);
}

const createReview = async ({ product, userId, score, comment }) => {
	return await pb.collection('reviews').create({ product, user: userId, score, comment });
}

const updateReview = async (id, data) => {
	return await pb.collection('reviews').update(id, data);
}

const deleteReview = async (id) => {
	return await pb.collection('reviews').delete(id);
}

export { getReviewsByProduct, createReview, updateReview, deleteReview };

