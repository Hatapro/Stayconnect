import { useEffect, useState } from 'react'
import { pb } from './pocketbase'

export default function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const list = await pb.collection('simpleList').getFullList({ sort: '-created', requestKey: null})
      setItems(list)

    } catch (err) {
      console.error(err)
      setError(err.message || String(err))

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    try {
      await pb.collection('simpleList').delete(id)
      setItems((s) => s.filter(i => i.id !== id))

    } catch (err) {
      console.error(err)
      alert('Error al eliminar: ' + (err?.message || err))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Listado simple</h1>
        <div className="header-count" aria-live="polite">{items.length} {items.length === 1 ? 'producto' : 'productos'}</div>
      </header>

      <main>
        {loading && <p>Cargando...</p>}
        
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <ul className="list">
            {items.length === 0 && <li className="empty">No hay elementos.</li>}
            {items.map(item => (
              <li key={item.id} className="list-item">
                <div className="content">
                  <strong>{item.name || ('ID: ' + item.id)}</strong>
                  <p className="meta">{item.attribute || ''}</p>
                  <p className="meta">{item.price || ''} €</p>
                </div>
                <div className="actions">
                  <button className="btn btn-delete" onClick={() => remove(item.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}