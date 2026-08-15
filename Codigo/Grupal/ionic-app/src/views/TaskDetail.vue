<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tasks" text="Volver"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de Tarea</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card v-if="task">
        <ion-card-header>
          <ion-card-title>{{ task.title }}</ion-card-title>
          <ion-card-subtitle>
            Creada: {{ task.createdAt }} · Estado: {{ task.completed ? 'Completada' : 'Pendiente' }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p>Descripción breve de la tarea (mock):</p>
          <p class="muted">Esta tarea forma parte de tu lista de demo. Puedes marcarla, eliminarla o regresar.</p>

          <div class="actions">
            <ion-button
              expand="block"
              :color="task.completed ? 'medium' : 'success'"
              @click="toggleCompleted"
            >
              {{ task.completed ? 'Marcar como pendiente' : 'Marcar como completada' }}
            </ion-button>

            <ion-button
              expand="block"
              color="danger"
              fill="outline"
              @click="confirmDelete"
            >
              Eliminar tarea
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card v-else>
        <ion-card-content>
          <p>No se encontró la tarea.</p>
          <ion-button expand="block" @click="goBack">Volver</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-list v-if="task">
        <ion-item>
          <ion-label>Estado</ion-label>
          <ion-badge :color="task.completed ? 'success' : 'warning'">
            {{ task.completed ? 'Completada' : 'Pendiente' }}
          </ion-badge>
        </ion-item>
        <ion-item>
          <ion-label>Fecha</ion-label>
          <ion-note slot="end">{{ task.createdAt }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge,
  IonButton,
  alertController,
  toastController
} from '@ionic/vue'

const route = useRoute()
const router = useRouter()

const tasks = ref([])
const taskId = computed(() => Number(route.params.id))

onMounted(() => {
  const saved = localStorage.getItem('tasks')
  tasks.value = saved ? JSON.parse(saved) : []
})

const task = computed(() => {
  return tasks.value.find(t => Number(t.id) === taskId.value) || null
})

const goBack = () => router.push('/tasks')

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const toggleCompleted = async () => {
  const found = tasks.value.find(t => Number(t.id) === taskId.value)
  if (!found) return
  found.completed = !found.completed
  saveTasks()

  const toast = await toastController.create({
    message: found.completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
    duration: 1500,
    color: found.completed ? 'success' : 'medium',
    position: 'bottom'
  })
  await toast.present()
}

const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'Eliminar tarea',
    message: '¿Seguro que quieres eliminar esta tarea?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: async () => {
            tasks.value = tasks.value.filter(t => Number(t.id) !== taskId.value)
            saveTasks()

          const toast = await toastController.create({
            message: 'Tarea eliminada',
            duration: 1500,
            color: 'danger',
            position: 'bottom'
          })
          await toast.present()
          goBack()
        }
      }
    ]
  })

  await alert.present()
}
</script>

<style scoped>
.muted {
  color: var(--ion-color-medium);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
</style>
