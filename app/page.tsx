'use client'

type Todo = {
  id: number
  text: string
}

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(data)
  }

  const handleAdd = async () => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    })
    setInput('')
    fetchTodos()
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    // 編集中のtodoが削除された場合、編集状態をリセット
    if (editId === id) {
      setEditId(null)
      setEditText('')
    } else if (editId !== null && editId > id) {
      // 削除されたtodoより後ろのtodoを編集中の場合、IDを調整
      setEditId(editId - 1)
    }
    fetchTodos()
  }

  const handleEdit = async (todo: Todo) => {
    setEditId(todo.id)
    setEditText(todo.text)
  }

  const handleUpdate = async () => {
    await fetch('/api/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, text: editText })
    })
    setEditId(null)
    setEditText('')
    fetchTodos()
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">My Todo App</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            placeholder="Add New Todo"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-300 p-2 rounded"
            >
              <div className="flex-1">
                {editId === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border-b border-blue-400 px-1 focus:outline-none"
                  />
                ) : (
                  <span>{todo.text}</span>
                )
                }

              </div>
              <div className="flex gap-2 ml-2">
                {editId === todo.id ? (
                  <button
                    onClick={() => handleUpdate()}
                    className="text-green-600 hover:underline text-sm"
                  >
                    更新
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    編集
                  </button>
                )}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
