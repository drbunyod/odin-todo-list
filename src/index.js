import TodoListManager from './todoListManager';
import TodoList from './todoList';
import TodoItem from './todoItem';
import { updateDatabase, checkDatabase, loadDatabase } from './database';
import './index.css';

class DOMController {
    constructor() {
        this.todoListManager = new TodoListManager();

        if (!checkDatabase()) {
            this.todoListManager.addList(new TodoList("Main", "#000000"));
        } else {
            const data = loadDatabase();
            for (const todoList of data.todoLists) {
                const newTodoList = new TodoList(todoList.title, todoList.color);
    
                for (const todoItem of todoList.todoItems) {
                    newTodoList.addItem(new TodoItem(todoItem.title, todoItem.description, todoItem.dueDate, todoItem.priority, todoItem.completed));
                }
    
                this.todoListManager.addList(newTodoList);
            }
        }

        const newTaskForm = document.querySelector("#task-form");
        const newTaskTitle = document.querySelector("#title");
        const newTaskDescription = document.querySelector("#description");
        const newTaskList = document.querySelector("#list");
        const newTaskDate = document.querySelector("#due-date");
        const newTaskPriority = document.querySelector("#priority");

        newTaskForm.addEventListener("submit", e => {
            e.preventDefault();

            if (newTaskTitle.value == "") {
                alert("Title must be entered.");
            } else {
                const taskList = this.todoListManager.getLists()[newTaskList.value];
                taskList.addItem(new TodoItem(newTaskTitle.value, newTaskDescription.value, newTaskDate.value, newTaskPriority.value));
                e.target.reset();
                this.updateDisplay();
            }
        });

        const newListForm = document.querySelector("#list-form");
        const newListTitle = document.querySelector("#list-title");
        const newListColor = document.querySelector("#list-color");

        newListForm.addEventListener("submit", e => {
            e.preventDefault();

            if (newListTitle.value == "") {
                alert("List title must be entered.");
            } else if (newListColor.value == "#ffffff") {
                alert("List color must be selected.");
            } else {
                this.todoListManager.addList(new TodoList(newListTitle.value, newListColor.value));
                e.target.reset();
                this.updateDisplay();
            }
        });

        const editTaskModal = document.querySelector("#edit-modal");
        const closeModalBtn = document.querySelector(".close-modal");

        closeModalBtn.addEventListener("click", () => {
            editTaskModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target == editTaskModal) {
                editTaskModal.style.display = "none";
            }
        });

        const editTaskForm = document.querySelector("#edit-form");
        const editTaskListId = document.querySelector("#edit-task-list");
        const editTaskId = document.querySelector("#edit-task-id");
        const editTaskTitle = document.querySelector("#edit-title");
        const editTaskDescription = document.querySelector("#edit-description");
        const editTaskList = document.querySelector("#edit-list");
        const editTaskDate = document.querySelector("#edit-due-date");
        const editTaskPriority = document.querySelector("#edit-priority");

        editTaskForm.addEventListener("submit", e => {
            e.preventDefault();

            if (editTaskTitle.value == "") {
                alert("Title must be entered.");
            } else {
                const editTask = this.todoListManager.getLists()[editTaskListId.value].getItems()[editTaskId.value];
                editTask.title = editTaskTitle.value;
                editTask.description = editTaskDescription.value;
                editTask.dueDate = editTaskDate.value;
                editTask.priority = editTaskPriority.value;

                if (editTaskListId.value != editTaskList.value) {
                    this.todoListManager.getLists()[editTaskList.value].addItem(editTask);
                    this.todoListManager.getLists()[editTaskListId.value].removeItem(editTaskId.value);
                }

                editTaskModal.style.display = "none";
                e.target.reset();
                this.updateDisplay();
            }
        });

        this.mainDiv = document.querySelector(".main");

        this.updateDisplay();
    }

    updateDisplay() {
        updateDatabase(this.todoListManager);

        const todoLists = this.todoListManager.getLists();

        const formLists = document.querySelector("#list");
        formLists.innerHTML = "";

        const editFormLists = document.querySelector("#edit-list");
        editFormLists.innerHTML = "";

        for (let i = 0; i < todoLists.length; i++) {
            formLists.innerHTML += `<option value="${i}">${todoLists[i].title}</option>`;
            editFormLists.innerHTML += `<option value="${i}">${todoLists[i].title}</option>`;
        }

        this.mainDiv.innerHTML = "";

        for (let i = 0; i < todoLists.length; i++) {
            let listTable = `
                <table>
                    <thead>
                        <tr style="color:${todoLists[i].color}; border-color:${todoLists[i].color}">
                            <th style="background-color:${todoLists[i].color}"></th>
                            <th colspan="3" class="table-title left-text">${todoLists[i].title}</th>
                            <th class="table-delete">`;

            if (i != 0) {
                listTable += `<span class="list-delete-btn" data-id="${i}">×</span>`;
            }
            
            listTable += `  </th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            const todoItems = todoLists[i].getItems();
            for (let j = 0; j < todoItems.length; j++) {
                listTable += `
                    <tr>
                        <td><input type="checkbox" data-list="${i}" data-id="${j}" ${todoItems[j].isCompleted()}></td>
                        <td class="left-text"><span class="todo-priority">${todoItems[j].getPriority()}</span>${todoItems[j].title}</td>
                        <td colspan="2" class="todo-date">${todoItems[j].getDueDate()}</td>
                        <td class="expand"><span class="expand-btn">▶</span></td>
                    </tr>
                    <tr class="hidden">
                        <td></td>
                        <td class="todo-description left-text">${todoItems[j].description}</td>
                        <td class="todo-actions todo-edit" data-list="${i}" data-id="${j}">Edit&nbsp;</td>
                        <td class="todo-actions todo-delete" data-list="${i}" data-id="${j}">&nbsp;Delete</td>
                        <td></td>
                    </tr>
                `;
            }
            
            listTable += `
                    </tbody>
                </table>`;

            this.mainDiv.innerHTML += listTable;
        }

        const listDeleteBtns = document.querySelectorAll(".list-delete-btn");
        for (const listDeleteBtn of listDeleteBtns) {
            listDeleteBtn.addEventListener("click", e => {
                this.todoListManager.removeList(e.target.dataset.id);
                this.updateDisplay();
            });
        }

        const completeBtns = document.querySelectorAll("input[type=checkbox]");
        for (const completeBtn of completeBtns) {
            completeBtn.addEventListener("change", e => {
                const isChecked = e.target.checked;
                const taskList = e.target.dataset.list;
                const taskId = e.target.dataset.id;
                
                this.todoListManager.getLists()[taskList].getItems()[taskId].completed = isChecked;
                this.updateDisplay();
            });
        }

        const expandBtns = document.querySelectorAll(".expand-btn");
        for (const expandBtn of expandBtns) {
            expandBtn.addEventListener("click", e => {
                const tr = e.target;
                if (tr.textContent == "▶") {
                    tr.textContent = "▼";
                    tr.parentElement.parentElement.nextElementSibling.style.display = "table-row";
                } else if (tr.textContent == "▼") {
                    tr.textContent = "▶";
                    tr.parentElement.parentElement.nextElementSibling.style.display = "none";
                }
            });
        }

        const editBtns = document.querySelectorAll(".todo-edit");
        for (const editBtn of editBtns) {
            editBtn.addEventListener("click", e => {
                const taskList = e.target.dataset.list;
                const taskId = e.target.dataset.id;
                const task = this.todoListManager.getLists()[taskList].getItems()[taskId];

                document.querySelector("#edit-task-list").value = taskList;
                document.querySelector("#edit-task-id").value = taskId;
                document.querySelector("#edit-title").value = task.title;
                document.querySelector("#edit-description").value = task.description;
                document.querySelector("#edit-list").value = taskList;
                document.querySelector("#edit-due-date").value = task.dueDate;
                document.querySelector("#edit-priority").value = task.priority;
                document.querySelector("#edit-modal").style.display = "block";
            });
        }

        const deleteBtns = document.querySelectorAll(".todo-delete");
        for (const deleteBtn of deleteBtns) {
            deleteBtn.addEventListener("click", e => {
                const taskList = e.target.dataset.list;
                const taskId = e.target.dataset.id;
                
                this.todoListManager.getLists()[taskList].removeItem(taskId);
                this.updateDisplay();
            });
        }
    }
}

const domController = new DOMController();