import { pb } from './pb.js';

const createOrder = async (orderData) => {
  return await pb.collection('orders').create(orderData);
}

const getOrdersByUser = async (userId, page = 1, perPage = 50, options = {}) => {
  const opts = { filter: `user = "${userId}"`, sort: '-created', expand: 'items', ...options };
  return await pb.collection('orders').getList(page, perPage, opts);
}

export { createOrder, getOrdersByUser };