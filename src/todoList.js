class TodoList {
    constructor(title, color) {
        this.title = title;
        this.color = color;
        this.todoItems = [];
    }

    getItems() {
        return this.todoItems;
    }

    addItem(item) {
        this.todoItems.push(item);
    }

    removeItem(id) {
        this.todoItems.splice(id, 1);
    }
}

export default TodoList;