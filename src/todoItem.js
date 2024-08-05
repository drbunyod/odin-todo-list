class TodoItem {
    constructor(title, description=null, dueDate=null, priority=null, completed=false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
    
    getDueDate() {
        if (this.dueDate == "") {
            return "";
        }

        const date = new Date(this.dueDate);
        const options = {month: "short", day: "2-digit"};

        return date.toLocaleDateString("en-US", options);
    }

    getPriority() {
        const priorities = ["", "!!! ", "!! ", "! "];
        return priorities[Number(this.priority)];
    }

    isCompleted() {
        if (this.completed) {
            return "checked";
        }

        return "";
    }

}

export default TodoItem;