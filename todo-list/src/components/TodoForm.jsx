import { useState } from 'react'

const TodoForm = (props) => {
    const { onAddItem } = props;
    const [input, setInput] = useState('');

    const atSubmit = (e) => {
        e.preventDefault();
        if (input === '') {
            return;
        }

        setInput('');
        onAddItem(input);
    };

    return (
        <section>
            <form className="todo-form" onSubmit={atSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
            </form>
        </section>
    );
}

export default TodoForm