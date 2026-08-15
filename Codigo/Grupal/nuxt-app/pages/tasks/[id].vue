<template>
  <div class="task-detail-page">
    <div class="container">
      <div class="card header-card">
        <button class="btn btn-secondary" @click="goBack">← Volver</button>
        <div class="title-block">
          <h2>Detalle de tarea</h2>
          <p class="muted">ID: {{ taskId }}</p>
        </div>
      </div>

      <div v-if="task" class="card">
        <h3>{{ task.title }}</h3>
        <p class="muted">Creada: {{ task.createdAt }}</p>
        <p class="muted">Estado: {{ task.completed ? 'Completada' : 'Pendiente' }}</p>

        <div class="actions">
          <button
            class="btn btn-primary btn-block"
            @click="toggleCompleted"
          >
            {{ task.completed ? 'Marcar como pendiente' : 'Marcar como completada' }}
          </button>

          <button
            class="btn btn-danger btn-block"
            @click="confirmDelete"
          >
            Eliminar tarea
          </button>
        </div>
      </div>

      <div v-else class="card">
        <p>No se encontró la tarea.</p>
        <button class="btn btn-secondary" @click="goBack">Volver</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()

const tasks = ref([])
const toast = ref({ show: false, message: '', type: 'success' })
const taskId = computed(() => Number(route.params.id))

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('tasks')
    tasks.value = saved ? JSON.parse(saved) : []
  }
})

const task = computed(() => tasks.value.find(t => Number(t.id) === taskId.value) || null)

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const toggleCompleted = () => {
  const found = tasks.value.find(t => Number(t.id) === taskId.value)
  if (!found) return
  found.completed = !found.completed
  saveTasks()
  showToast(found.completed ? 'Tarea completada' : 'Tarea marcada como pendiente', found.completed ? 'success' : 'medium')
}

const confirmDelete = () => {
  const ok = window.confirm('¿Seguro que quieres eliminar esta tarea?')
  if (!ok) return
  tasks.value = tasks.value.filter(t => Number(t.id) !== taskId.value)
  saveTasks()
  showToast('Tarea eliminada', 'danger')
  goBack()
}

const goBack = () => router.push('/tasks')
</script>

<style scoped>
.task-detail-page {
  min-height: 100vh;
  background: var(--light-color);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-block h2 {
  margin: 0;
}

.muted {
  color: var(--medium-color);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}
</style>
