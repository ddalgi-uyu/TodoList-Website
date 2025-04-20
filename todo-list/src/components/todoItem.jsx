const TodoItem = (props) => {
    const { id, text, done, onToggleItem } = props;

    const atClick = () => {
        onToggleItem(id);
    };

    let className = 'todo-item';
    if (done) {
        className += ' done';
    }
    
    return (
        <section>
            <li className={className} onClick={atClick}>
                {text}
            </li>
        </section>
    );
}

export default TodoItem