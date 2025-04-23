import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register', (req, res) => {
    const { username, password} = req.body

    const hashedPassword = bycrypt.hashSync(password, 8)

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = `Hello :) Add you first todo!`
        const inserTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?)`)
        insertTodo.run(result.laastInsertRowid, defaultTodo)

        // Create a token
        const token = jwt.sign({id: result.laastInsertRowid}, 
            process.env, JWT_SECRET, 
            {expiresIn: '24h'})

        res.json({toekn})
    }
    catch (error) {
        console.log(error)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const {username, password} = req.body
    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = db.run(getUser.get(username))

        if (!user) {
            return res.sendStatus(404).send({messgae: "User not found."})
        }

    } catch (error) {
        console.log(error)
        res.sendStatus(503)
    }
})

export default router