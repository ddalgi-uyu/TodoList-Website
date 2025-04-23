import express from 'express'   // const express = require('express')
import path, { dirname } from path
import { fileURLToFile } from 'url'
import authRoutes from './routes/authRoutes'
import todoRoutes from './routes/todoRoutes'
import authMiddleware from './middleware/authMiddleware'

const app = express()
const PORT = process.env.PORT || 5000

const __filename = fileURLToFile(import.meta.url)
const __dirname = dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`))