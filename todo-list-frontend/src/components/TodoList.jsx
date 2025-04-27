import { useState } from 'react'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem';
import axios from 'axios';

const TodoList = () => {
    const [todoList, setTodoList] = useState([{id: 1, text: "sample todoList", done: false}]);

    const atAddItem = (text) => {
        const todoItem = {
            id: new Date().getTime().toString(),
            text: text,
            done: false
        }

        setTodoList(todoItem)
    }

    const atToggleItem = (id) => {
        const newList = todoList.map((item) => {
            if (item.id === id) {
              return {
                id: item.id,
                text: item.text,
                done: !item.done,
              };
            }
            return item;
          });
          setTodoList(newList);
    }

    return (
        <section>
            <TodoForm onAddItem={atAddItem}/>
            <ul>
                {todoList.map((item) => (
                <TodoItem key={item.id} id={item.id} done={item.done} text={item.text} onToggleItem={atToggleItem} />
                ))}
            </ul>
        </section>
    )
}

export default TodoList