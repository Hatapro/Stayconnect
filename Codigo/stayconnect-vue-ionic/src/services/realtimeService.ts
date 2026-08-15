import { pb } from './pb';
import { toastController } from '@ionic/vue';

// Estados de pedidos con sus etiquetas en español
const STATE_LABELS: Record<string, string> = {
  'In preparation': 'En preparación',
  'Sent': 'Enviado',
  'Delivered': 'Entregado',
  'Cancelled': 'Cancelado'
};

let ordersUnsubscribe: (() => void) | null = null;

/**
 * Muestra una notificación toast
 */
async function showToast(message: string, color: string = 'primary') {
  const toast = await toastController.create({
    message,
    duration: 4000,
    position: 'top',
    color,
    buttons: [
      {
        text: 'Cerrar',
        role: 'cancel'
      }
    ]
  });
  await toast.present();
}

/**
 * Suscribirse a cambios en la colección de orders en tiempo real
 * @param userId - ID del usuario para filtrar sus pedidos
 * @param onUpdate - Callback opcional que se ejecuta cuando hay cambios
 */
export async function subscribeToOrders(userId?: string, onUpdate?: () => void) {
  try {
    // Desuscribirse si ya hay una suscripción activa
    if (ordersUnsubscribe) {
      ordersUnsubscribe();
    }

    // Suscribirse a todos los cambios en la colección orders
    ordersUnsubscribe = await pb.collection('orders').subscribe('*', async (e) => {
      const order = e.record;
      const action = e.action; // 'create', 'update', 'delete'
      
      // Si se proporciona userId, filtrar solo pedidos del usuario
      if (userId && order.user !== userId) {
        return;
      }

      // Determinar el mensaje según la acción
      let message = '';
      let color = 'primary';

      switch (action) {
        case 'create':
          message = `🛍️ Nuevo pedido creado (€${order.total?.toFixed(2)})`;
          color = 'success';
          break;

        case 'update':
          const stateLabel = STATE_LABELS[order.state] || order.state;
          message = `📦 Pedido actualizado: ${stateLabel}`;
          
          // Colores según el estado
          if (order.state === 'Delivered') {
            color = 'success';
          } else if (order.state === 'Cancelled') {
            color = 'danger';
          } else if (order.state === 'Sent') {
            color = 'warning';
          } else {
            color = 'primary';
          }
          break;

        case 'delete':
          message = '🗑️ Pedido eliminado';
          color = 'medium';
          break;
      }

      // Mostrar notificación
      if (message) {
        await showToast(message, color);
      }

      // Ejecutar callback si existe
      if (onUpdate) {
        onUpdate();
      }
    });

    console.log('✅ Suscrito a cambios en tiempo real de orders');
  } catch (error) {
    console.error('❌ Error al suscribirse a orders:', error);
  }
}

/**
 * Desuscribirse de los cambios en orders
 */
export function unsubscribeFromOrders() {
  if (ordersUnsubscribe) {
    ordersUnsubscribe();
    ordersUnsubscribe = null;
    console.log('✅ Desuscrito de cambios en tiempo real de orders');
  }
}

/**
 * Obtener todos los pedidos de un usuario
 */
export async function getUserOrders(userId: string) {
  try {
    const orders = await pb.collection('orders').getFullList({
      filter: `user = "${userId}"`,
      sort: '-created'
    });
    return orders;
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return [];
  }
}
