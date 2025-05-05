const updateTodo = async ({index, apiBase, token, todos}) => {
    // set task complete status to true
    await fetch(apiBase + 'todos' + '/' + index, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ task: todos.find(val => val.id === index).task, completed: 1 })
    })
}

export default updateTodo