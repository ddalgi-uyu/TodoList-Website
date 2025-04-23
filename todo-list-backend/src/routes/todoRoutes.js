import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
    const getTotos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
    const todos = getTotos.all(req.userId)
    res.json(todos)
})

router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    
    const result = insertTodo.run(req.userId, task)

    res.json({ id: result.lastInsertRowid, task, completed: 0})
})

router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params   // req.query e.g. ?page=2

    const updataTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`) // For multiple values - SET task = ?, completed = ?
    updateTodo.run(completed, id)

    res.json({message: "Todo completed"})
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const { userId } = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)

    deleteTodo.run(id, userId)
    res.send({messge: "Todo deleted"})
})

export defaut router