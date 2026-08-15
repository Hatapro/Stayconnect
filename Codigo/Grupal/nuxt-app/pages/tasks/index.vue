<template>
  <div class="tasks-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1>Mis Tareas</h1>
        <button @click="handleLogout" class="btn-logout" title="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>

    <div class="container">
      <!-- Tarjeta de bienvenida -->
      <div class="card welcome-card">
        <h2>Hola, {{ currentUser }}! 👋</h2>
        <p class="tasks-count">
          Tienes <strong>{{ pendingTasksCount }}</strong> 
          {{ pendingTasksCount === 1 ? 'tarea pendiente' : 'tareas pendientes' }}
        </p>
      </div>

      <!-- Formulario nueva tarea -->
      <div class="card">
        <h3>Nueva Tarea</h3>
        <form @submit.prevent="addTask" class="task-form">
          <div class="input-group">
            <label for="task-title">Título de la tarea</label>
            <input
              id="task-title"
              v-model="newTaskTitle"
              type="text"
              placeholder="Ej: Comprar leche"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            <span>➕</span> Añadir Tarea
          </button>
        </form>
      </div>

      <!-- Lista de tareas -->
      <div class="card">
        <div class="tasks-header">
          <h3>Lista de Tareas</h3>
          <span class="tasks-badge">{{ tasks.length }}</span>
        </div>

        <div v-if="tasks.length === 0" class="empty-state">
          <p>📋 No hay tareas. ¡Añade una nueva!</p>
        </div>

        <div v-else class="tasks-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            :class="['task-item', { 'task-completed': task.completed }]"
          >
            <input
              :id="`task-${task.id}`"
              type="checkbox"
              :checked="task.completed"
              @change="toggleTask(task.id)"
              class="task-checkbox"
            />
            <label :for="`task-${task.id}`" class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-date">{{ task.createdAt }}</div>
            </label>
            <NuxtLink
              :to="`/tasks/${task.id}`"
              class="btn-secondary"
              title="Ver detalles"
            >
              Detalles
            </NuxtLink>
            <button
              @click="deleteTask(task.id)"
              class="btn-delete"
              title="Eliminar tarea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Modal de confirmación -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <h3>¿Eliminar tarea?</h3>
          <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="confirmDelete" class="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de logout -->
    <Transition name="modal">
      <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
        <div class="modal-content" @click.stop>
          <h3>Cerrar sesión</h3>
          <p>¿Estás seguro de que quieres cerrar sesión?</p>
          <div class="modal-actions">
            <button @click="showLogoutModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="confirmLogout" class="btn btn-primary">
              Sí, cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const currentUser = ref('')
const newTaskTitle = ref('')
const tasks = ref([])
const toast = ref({ show: false, message: '', type: 'success' })
const showDeleteModal = ref(false)
const showLogoutModal = ref(false)
const taskToDelete = ref(null)

const pendingTasksCount = computed(() => {
  return tasks.value.filter(t => !t.completed).length
})

onMounted(() => {
  if (process.client) {
    currentUser.value = localStorage.getItem('username') || 'Usuario'
    loadTasks()
  }
})

const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  } else {
    // Tareas de ejemplo
    tasks.value = [
      {
        id: 1,
        title: 'Completar el proyecto de ADI',
        completed: false,
        createdAt: new Date().toLocaleDateString('es-ES')
      },
      {
        id: 2,
        title: 'Estudiar Vue + Nuxt',
        completed: true,
        createdAt: new Date().toLocaleDateString('es-ES')
      },
      {
        id: 3,
        title: 'Grabar el video de presentación',
        completed: false,
        createdAt: new Date().toLocaleDateString('es-ES')
      }
    ]
    saveTasks()
  }
}

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const addTask = () => {
  if (newTaskTitle.value.trim()) {
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.value.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString('es-ES')
    }
    tasks.value.push(newTask)
    saveTasks()
    newTaskTitle.value = ''
    showToast('Tarea añadida correctamente', 'success')
  }
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    saveTasks()
  }
}

const deleteTask = (taskId) => {
  taskToDelete.value = taskId
  showDeleteModal.value = true
}


const confirmDelete = () => {
  tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value)
  saveTasks()
  showDeleteModal.value = false
  taskToDelete.value = null
  showToast('Tarea eliminada', 'success')
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('username')
  showLogoutModal.value = false
  router.push('/')
}
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  background-color: var(--light-color);
}

.header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  color: white;
  font-size: 24px;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: background 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-card h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.tasks-count {
  font-size: 16px;
  opacity: 0.9;
}

.tasks-count strong {
  font-size: 20px;
}

.task-form h3 {
  margin-bottom: 20px;
  color: var(--dark-color);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tasks-badge {
  background-color: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--medium-color);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: var(--light-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background-color: #e8e9ec;
  transform: translateX(4px);
}

.task-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.task-content {
  flex: 1;
  cursor: pointer;
}

.task-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--dark-color);
  margin-bottom: 4px;
}

.task-date {
  font-size: 12px;
  color: var(--medium-color);
}

.task-completed .task-title {
  text-decoration: line-through;
  opacity: 0.6;
}

.btn-delete {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.btn-delete:hover {
  background-color: rgba(235, 68, 90, 0.1);
}

.btn-secondary {
  background-color: var(--medium-color);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-bottom: 12px;
  color: var(--dark-color);
}

.modal-content p {
  margin-bottom: 24px;
  color: var(--medium-color);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 20px;
  }

  .welcome-card h2 {
    font-size: 24px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
