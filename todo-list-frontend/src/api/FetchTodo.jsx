const FetchTodo = async ({apiBase, token}) => {
    const response = await fetch(apiBase + 'todos', {
        headers: { 'Authorization': token }
    })
    const todosData = await response.json()
    return todosData
}

export default FetchTodo