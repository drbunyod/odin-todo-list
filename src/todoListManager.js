class TodoListManager {
    constructor() {
        this.todoLists = [];
    }

    getLists() {
        return this.todoLists;
    }

    addList(list) {
        this.todoLists.push(list);
    }

    removeList(id) {
        this.todoLists.splice(id, 1);
    }
}

export default TodoListManager;