const addTodo = async({apiBase, token}) => {
    // have to access this val later as it's rendered with js
    const todoInput = document.getElementById('todoInput')
    const task = todoInput.value

    if (!task) { return }

    await fetch(apiBase + 'todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ task })
    })
    todoInput.value = ''
}