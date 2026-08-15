import { pb } from './pb';

const createOrder = async (orderData) => {
  return await pb.collection('orders').create(orderData);
}

const getOrdersByUser = async (userId, page = 1, perPage = 50, options = {}) => {
  const opts = { filter: `user = "${userId}"`, sort: '-created', expand: 'items', ...options };
  
  return await pb.collection('orders').getList(page, perPage, opts);
}

const updateOrder = async (id, data) => {
  return await pb.collection('orders').update(id, data);
}

export { createOrder, getOrdersByUser, updateOrder };
