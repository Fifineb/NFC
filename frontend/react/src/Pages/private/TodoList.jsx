import React, { useState } from 'react'
import { BiCheck, BiPlus, BiChevronDown, BiChevronRight, BiTrash } from 'react-icons/bi'
import '../styles/menu.css'

const TodoList = () => {
  const [todos,    setTodos]    = useState([])
  const [input,    setInput]    = useState('')
  const [showAdd,  setShowAdd]  = useState(false)
  const [showDone, setShowDone] = useState(true)

  const pending   = todos.filter(t => !t.done)
  const completed = todos.filter(t =>  t.done)

  const toggle = (id) =>
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const addTask = () => {
    if (!input.trim()) return
    setTodos([{ id: Date.now(), text: input.trim(), done: false }, ...todos])
    setInput('')
    setShowAdd(false)
  }

  const remove = (id) =>
    setTodos(todos.filter(t => t.id !== id))

  return (
    <div className="todo-wrap">

      {/* ── Pending ── */}
      {pending.length > 0 && (
        <div className="todo-group">
          {pending.map(t => (
            <div key={t.id} className="todo-row">
              <button className="todo-circle" onClick={() => toggle(t.id)} />
              <span className="todo-label">{t.text}</span>
              <button className="todo-delete-btn" onClick={() => remove(t.id)} title="Supprimer">
                <BiTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Completed ── */}
      {completed.length > 0 && (
        <div className="todo-group">
          <button className="completed-toggle" onClick={() => setShowDone(!showDone)}>
            {showDone
              ? <BiChevronDown  className="toggle-icon" />
              : <BiChevronRight className="toggle-icon" />
            }
            Completed <span className="completed-count">{completed.length}</span>
          </button>

          {showDone && completed.map(t => (
            <div key={t.id} className="todo-row todo-row-done">
              <button className="todo-circle todo-circle-done" onClick={() => toggle(t.id)}>
                <BiCheck className="check-icon" />
              </button>
              <span className="todo-label todo-label-done">{t.text}</span>
              <button className="todo-delete-btn" onClick={() => remove(t.id)} title="Supprimer">
                <BiTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Add task ── */}
      <div className="todo-group todo-add-group">
        {showAdd ? (
          <div className="todo-row">
            <BiPlus className="add-plus-icon" />
            <input
              className="todo-add-input"
              placeholder="Add a task"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter')  addTask()
                if (e.key === 'Escape') setShowAdd(false)
              }}
              autoFocus
              onBlur={() => { if (!input.trim()) setShowAdd(false) }}
            />
          </div>
        ) : (
          <button className="todo-add-btn" onClick={() => setShowAdd(true)}>
            <BiPlus className="add-plus-icon" />
            <span>Add a task</span>
          </button>
        )}
      </div>

    </div>
  )
}

export default TodoList