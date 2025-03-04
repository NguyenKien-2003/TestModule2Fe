document.addEventListener("DOMContentLoaded", loadTasks);

let currentFilter = 'all';

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => addTaskToDOM(task.text, task.completed));
    updateClearButtonVisibility();
}

function addTask() {
    const input = document.getElementById("todo-input");
    const taskText = input.value.trim();
    if (taskText) {
        addTaskToDOM(taskText);
        saveTask(taskText, false);
        input.value = "";
    }
}

function addTaskToDOM(text, completed = false) {
    const todoList = document.getElementById("todo-list");
    const taskElement = document.createElement("li");
    taskElement.className = "task";
    if (completed) taskElement.classList.add("completed");

    taskElement.innerHTML = `
        <label>
            <input type="checkbox" ${completed ? "checked" : ""} onclick="toggleComplete(this)">
            <span>${text}</span>
        </label>
        <button onclick="deleteTask(this)" class="delete-btn" style="display: none;"><i class="fa-solid fa-trash"></i></button>
    `;

    todoList.appendChild(taskElement);
    filterTasks(currentFilter);
    updateClearButtonVisibility();
}

function toggleComplete(checkbox) {
    const taskElement = checkbox.closest("li");
    taskElement.classList.toggle("completed", checkbox.checked);
    updateLocalStorage();
    filterTasks(currentFilter);
    updateClearButtonVisibility();
}

function deleteTask(button) {
    const taskElement = button.closest("li");
    taskElement.remove();
    updateLocalStorage();
}

function clearCompleted() {
    document.querySelectorAll(".completed").forEach(task => task.remove());
    updateLocalStorage();
    updateClearButtonVisibility();
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(`tab-${filter}`).classList.add("active");

    document.querySelectorAll(".task").forEach(task => {
        const isCompleted = task.classList.contains("completed");
        
        if (filter === "all") {
            task.style.display = "flex";
        } else if (filter === "active") {
            task.style.display = isCompleted ? "none" : "flex";
        } else { // "completed"
            task.style.display = isCompleted ? "flex" : "none";
            task.querySelector(".delete-btn").style.display = "inline";
        }
    });

    updateClearButtonVisibility();
}

function saveTask(text, completed) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text, completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll("#todo-list .task").forEach(task => {
        tasks.push({
            text: task.querySelector("span").textContent,
            completed: task.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateClearButtonVisibility() {
    const hasCompleted = document.querySelectorAll(".task.completed").length > 0;
    const clearBtn = document.getElementById("clear-btn");
    clearBtn.style.display = currentFilter === "completed" && hasCompleted ? "block" : "none";
}
