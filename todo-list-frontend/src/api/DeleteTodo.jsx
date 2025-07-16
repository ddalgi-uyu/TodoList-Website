async function deleteTodo(index) {
    // set task complete status to true
    await fetch(apiBase + 'todos' + '/' + index, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        },
    })
    fetchTodos()
}