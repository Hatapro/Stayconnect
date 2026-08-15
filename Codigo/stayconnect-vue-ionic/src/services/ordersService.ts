import { pb } from './pb';

const createOrder = async (orderData: any) => {
  return await pb.collection('orders').create(orderData);
};

const getOrdersByUser = async (userId: string, page = 1, perPage = 50, options: any = {}) => {
  const opts = { filter: `user = "${userId}"`, sort: '-created', expand: 'items', ...options };

  return await pb.collection('orders').getList(page, perPage, opts);
};

const updateOrder = async (id: string, data: any) => {
  return await pb.collection('orders').update(id, data);
};

export { createOrder, getOrdersByUser, updateOrder };
