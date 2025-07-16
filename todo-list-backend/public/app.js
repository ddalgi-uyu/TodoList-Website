// ==========================================
// GLOBAL STATE MANAGEMENT
// ==========================================
let token = localStorage.getItem('token')
let isLoading = false
let isAuthenticating = false
let isRegistration = false
let selectedTab = 'All'
let todos = []

const apiBase = '/'

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================
const elements = {
    nav: document.querySelector('nav'),
    header: document.querySelector('header'),
    main: document.querySelector('main'),
    navButtons: document.querySelectorAll('.tab-button'),
    authContent: document.getElementById('auth'),
    errorText: document.getElementById('error'),
    emailInput: document.getElementById('emailInput'),
    passwordInput: document.getElementById('passwordInput'),
    registerBtn: document.getElementById('registerBtn'),
    authBtn: document.getElementById('authBtn')
}

// ==========================================
// UI RENDERING FUNCTIONS
// ==========================================
async function showDashboard() {
    // Show main app interface
    elements.nav.style.display = 'block'
    elements.header.style.display = 'flex'
    elements.main.style.display = 'flex'
    elements.authContent.style.display = 'none'

    await fetchTodos()
}

function showAuthForm() {
    // Show authentication form
    elements.nav.style.display = 'none'
    elements.header.style.display = 'none'
    elements.main.style.display = 'none'
    elements.authContent.style.display = 'flex'
}

function updateHeaderText() {
    const openTodos = todos.filter(todo => !todo.completed).length
    const text = openTodos === 1 
        ? `You have 1 open task.` 
        : `You have ${openTodos} open tasks.`
    elements.header.querySelector('h1').innerText = text
}

function updateNavCount() {
    elements.navButtons.forEach(button => {
        const tabName = button.dataset.tab
        
        // Filter todos based on tab type
        const count = todos.filter(todo => {
            if (tabName === 'All') return true
            return tabName === 'Complete' ? todo.completed : !todo.completed
        }).length

        // Update the count display
        button.querySelector('span').innerText = `(${count})`
    })
}

function changeTab(tabName) {
    selectedTab = tabName
    
    // Update active tab styling
    elements.navButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('selected-tab')
        } else {
            button.classList.remove('selected-tab')
        }
    })
    
    renderTodos()
}

function renderTodos() {
    updateNavCount()
    updateHeaderText()

    // Filter todos based on selected tab
    const filteredTodos = todos.filter(todo => {
        if (selectedTab === 'All') return true
        return selectedTab === 'Complete' ? todo.completed : !todo.completed
    })

    // Generate HTML for todo items
    const todoItems = filteredTodos.map(todo => {
        const completedClass = todo.completed ? 'todo-complete' : ''
        
        return `
            <div class="card todo-item ${completedClass}">
                <p>${escapeHtml(todo.task)}</p>
                <div class="todo-buttons">
                    <button data-action="complete" data-id="${todo.id}" ${todo.completed ? 'disabled' : ''}>
                        <h6>Done</h6>
                    </button>
                    <button data-action="delete" data-id="${todo.id}">
                        <h6>Delete</h6>
                    </button>
                </div>
            </div>
        `
    }).join('')

    // Add input for new todos
    const addTodoForm = `
        <div class="input-container">
            <input id="todoInput" placeholder="Add task" />
            <button id="addTodoBtn">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `

    elements.main.innerHTML = todoItems + addTodoForm

    // Add event listeners for dynamically created elements
    attachTodoEventListeners()
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function attachEventListeners() {
    // Authentication events
    elements.authBtn.addEventListener('click', authenticate)
    elements.registerBtn.addEventListener('click', toggleRegistrationMode)
    
    // Tab navigation events
    elements.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            changeTab(button.dataset.tab)
        })
    })

    // Enter key support for auth form
    elements.emailInput.addEventListener('keypress', handleAuthKeyPress)
    elements.passwordInput.addEventListener('keypress', handleAuthKeyPress)
}

function attachTodoEventListeners() {
    // Add todo button
    const addTodoBtn = document.getElementById('addTodoBtn')
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodo)
    }

    // Todo input enter key
    const todoInput = document.getElementById('todoInput')
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo()
            }
        })
    }

    // Todo action buttons (complete/delete)
    const todoButtons = document.querySelectorAll('[data-action]')
    todoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.closest('button').dataset.action
            const todoId = parseInt(e.target.closest('button').dataset.id)
            
            if (action === 'complete') {
                updateTodo(todoId)
            } else if (action === 'delete') {
                deleteTodo(todoId)
            }
        })
    })
}

function handleAuthKeyPress(e) {
    if (e.key === 'Enter') {
        authenticate()
    }
}

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================
async function toggleRegistrationMode() {
    isRegistration = !isRegistration
    
    // Update UI text based on mode
    const headerText = isRegistration ? 'Sign Up' : 'Login'
    const questionText = isRegistration ? 'Already have an account?' : "Don't have an account?"
    const buttonText = isRegistration ? 'Sign in' : 'Sign up'
    
    document.querySelector('#auth > div h2').innerText = headerText
    document.querySelector('.register-content p').innerText = questionText
    elements.registerBtn.innerText = buttonText
}

async function authenticate() {
    const emailVal = elements.emailInput.value.trim()
    const passVal = elements.passwordInput.value

    // Validation checks
    if (!validateAuthInput(emailVal, passVal)) {
        return
    }

    // Reset error state and show loading
    elements.errorText.style.display = 'none'
    isAuthenticating = true
    elements.authBtn.innerText = 'Authenticating...'
    elements.authBtn.disabled = true

    try {
        const endpoint = isRegistration ? 'auth/register' : 'auth/login'
        const response = await fetch(apiBase + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: emailVal, password: passVal })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.token) {
            token = data.token
            localStorage.setItem('token', token)
            elements.authBtn.innerText = 'Loading...'
            
            // Clear form
            elements.emailInput.value = ''
            elements.passwordInput.value = ''
            
            await showDashboard()
        } else {
            throw new Error('❌ Authentication failed. Please check your credentials.')
        }

    } catch (error) {
        console.error('Authentication error:', error)
        showError(error.message)
    } finally {
        elements.authBtn.innerText = 'Submit'
        elements.authBtn.disabled = false
        isAuthenticating = false
    }
}

function validateAuthInput(email, password) {
    if (isLoading || isAuthenticating) {
        return false
    }

    if (!email || !password) {
        showError('Please fill in all fields.')
        return false
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long.')
        return false
    }

    if (!email.includes('@')) {
        showError('Please enter a valid email address.')
        return false
    }

    return true
}

function logout() {
    localStorage.removeItem('token')
    token = null
    todos = []
    selectedTab = 'All'
    isRegistration = false
    showAuthForm()
}

// ==========================================
// TODO CRUD OPERATIONS
// ==========================================
async function fetchTodos() {
    if (!token) return

    isLoading = true
    
    try {
        const response = await fetch(apiBase + 'todos', {
            headers: { 'Authorization': token }
        })

        if (!response.ok) {
            if (response.status === 401) {
                // Token is invalid, logout user
                logout()
                return
            }
            throw new Error(`Failed to fetch todos: ${response.status}`)
        }

        const todosData = await response.json()
        todos = todosData
        renderTodos()
    } catch (error) {
        console.error('Failed to fetch todos:', error)
        showError('Failed to load todos. Please try again.')
    } finally {
        isLoading = false
    }
}

async function updateTodo(todoId) {
    try {
        const todo = todos.find(t => t.id === todoId)
        if (!todo) return

        const response = await fetch(`${apiBase}todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ 
                task: todo.task, 
                completed: 1 
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to update todo: ${response.status}`)
        }

        await fetchTodos()
    } catch (error) {
        console.error('Failed to update todo:', error)
        showError('Failed to update todo. Please try again.')
    }
}

async function deleteTodo(todoId) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return
    }

    try {
        const response = await fetch(`${apiBase}todos/${todoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        })

        if (!response.ok) {
            throw new Error(`Failed to delete todo: ${response.status}`)
        }

        await fetchTodos()
    } catch (error) {
        console.error('Failed to delete todo:', error)
        showError('Failed to delete todo. Please try again.')
    }
}

async function addTodo() {
    const todoInput = document.getElementById('todoInput')
    if (!todoInput) return

    const task = todoInput.value.trim()

    if (!task) {
        showError('Please enter a task.')
        return
    }

    try {
        const response = await fetch(apiBase + 'todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ task })
        })

        if (!response.ok) {
            throw new Error(`Failed to add todo: ${response.status}`)
        }

        todoInput.value = ''
        await fetchTodos()
    } catch (error) {
        console.error('Failed to add todo:', error)
        showError('Failed to add todo. Please try again.')
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showError(message) {
    elements.errorText.innerText = message
    elements.errorText.style.display = 'block'
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        elements.errorText.style.display = 'none'
    }, 5000)
}

function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================
async function initializeApp() {
    // Attach event listeners
    attachEventListeners()

    // Auto-login if token exists
    if (token) {
        try {
            await fetchTodos()
            await showDashboard()
        } catch (error) {
            // Token might be invalid, clear it and show auth form
            console.error('Auto-login failed:', error)
            logout()
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp)
} else {
    initializeApp()
}