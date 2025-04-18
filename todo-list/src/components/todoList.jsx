import { useState } from 'react'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem';

const TodoList = () => {
    const [todoList, setTodoList] = useState([{id: 1, text: "sample todoList", done: false}]);

    const atAddItem = () => {

    }

    const atToggleItem = () => {

    }

    return (
        <section>
            <TodoForm/>
            <ul>
                {todoList.map((item) => (
                <TodoItem key={item.id} id={item.id} done={item.done} text={item.text} onToggleItem={atToggleItem} />
                ))}
            </ul>
        </section>
    )
}

export default TodoList