<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mis Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="light" @click="handleLogout">
            <ion-icon :icon="logOut" slot="start"></ion-icon>
            Salir
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Usuario actual -->
      <ion-card>
        <ion-card-content>
          <ion-text color="primary">
            <h2>Hola, {{ currentUser }}! 👋</h2>
          </ion-text>
          <p>Tienes {{ tasks.filter(t => !t.completed).length }} tareas pendientes</p>
        </ion-card-content>
      </ion-card>

      <!-- Formulario para añadir tarea -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Nueva Tarea</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="addTask">
            <ion-item>
              <ion-input
                label="Título de la tarea"
                label-placement="floating"
                :legacy="false"
                v-model="newTaskTitle"
                type="text"
                placeholder="Ej: Comprar leche"
                aria-label="Título de la tarea"
                required
              ></ion-input>
            </ion-item>
            <ion-button expand="block" type="submit" class="ion-margin-top">
              <ion-icon :icon="add" slot="start"></ion-icon>
              Añadir Tarea
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <!-- Lista de tareas -->
      <ion-list>
        <ion-list-header>
          <ion-label>Lista de Tareas</ion-label>
        </ion-list-header>

        <ion-item v-for="task in tasks" :key="task.id">
          <ion-checkbox
            slot="start"
            :legacy="false"
            :aria-label="`Marcar tarea: ${task.title}`"
            :checked="task.completed"
            @ionChange="toggleTask(task.id)"
          ></ion-checkbox>
          <ion-label :class="{ 'task-completed': task.completed }">
            <h3>{{ task.title }}</h3>
            <p>{{ task.createdAt }}</p>
          </ion-label>
          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            @click="deleteTask(task.id)"
          >
            <ion-icon :icon="trash"></ion-icon>
          </ion-button>
          <ion-button
            slot="end"
            fill="clear"
            color="medium"
            @click="goToDetail(task.id)"
          >
            Detalles
          </ion-button>
        </ion-item>

        <ion-item v-if="tasks.length === 0">
          <ion-label class="ion-text-center">
            <p>No hay tareas. ¡Añade una nueva!</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon,
  IonCheckbox,
  IonText,
  alertController,
  toastController
} from '@ionic/vue'
import { add, trash, logOut } from 'ionicons/icons'
import { onIonViewWillEnter } from '@ionic/vue'

const router = useRouter()
const currentUser = ref('')
const newTaskTitle = ref('')
const tasks = ref([])

onMounted(() => {
  currentUser.value = localStorage.getItem('username') || 'Usuario'
  loadTasks()
})

// Importante: recargar las tareas cada vez que la vista vuelve a ser activa
onIonViewWillEnter(() => {
  currentUser.value = localStorage.getItem('username') || 'Usuario'
  loadTasks()
})

const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  } else {
    // Tareas de ejemplo iniciales
    tasks.value = [
      {
        id: 1,
        title: 'Completar el proyecto de ADI',
        completed: false,
        createdAt: new Date().toLocaleDateString()
      },
      {
        id: 2,
        title: 'Estudiar Vue + Ionic',
        completed: true,
        createdAt: new Date().toLocaleDateString()
      },
      {
        id: 3,
        title: 'Grabar el video de presentación',
        completed: false,
        createdAt: new Date().toLocaleDateString()
      }
    ]
    saveTasks()
  }
}

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const addTask = async () => {
  if (newTaskTitle.value.trim()) {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.value.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString()
    }
    tasks.value.push(newTask)
    saveTasks()
    newTaskTitle.value = ''

    const toast = await toastController.create({
      message: 'Tarea añadida correctamente',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    })
    await toast.present()
  }
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    saveTasks()
  }
}

const deleteTask = async (taskId) => {
  const alert = await alertController.create({
    header: '¿Eliminar tarea?',
    message: '¿Estás seguro de que quieres eliminar esta tarea?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          tasks.value = tasks.value.filter(t => t.id !== taskId)
          saveTasks()
        }
      }
    ]
  })

  await alert.present()
}

const goToDetail = (taskId) => {
  router.push(`/tasks/${taskId}`)
}

const handleLogout = async () => {
  const alert = await alertController.create({
    header: 'Cerrar sesión',
    message: '¿Estás seguro de que quieres cerrar sesión?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Sí, cerrar',
        handler: () => {
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('username')
          router.push('/login')
        }
      }
    ]
  })

  await alert.present()
}
</script>

<style scoped>
.task-completed {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
