
class Task {
    constructor(name, date,isChecked) {
        this.name = name;
        this.date = date;
        this.isChecked = isChecked;
    }
}



class ToDoList {
    constructor() {
        this.taskList = document.getElementById("task-list");
        this.newTaskInput = document.getElementById("pole-tekstowe");
        this.dueDateInput = document.getElementById("pole-datowe");
        this.addTaskButton = document.getElementById("add-task");
        this.searchInput = document.getElementById("search");
        this.currentSearchPhrase = "";

        this.addTaskButton.addEventListener("click", this.addTask.bind(this));
        this.searchInput.addEventListener("input", this.handleSearch.bind(this));

        this.updateTaskList(this.getTasksFromLocalStorage());
    }

    getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    updateTaskList(tasks, searchPhrase) {
        this.taskList.innerHTML = "";

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const listItem = document.createElement("li");
            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.checked = task.isChecked;
            const taskName = task.name;
            const editName = document.createElement("p");
            editName.className = "name-btn";
            editName.innerHTML = task.name;
            const editButton = document.createElement("p");
            editButton.className = "edit-btn";
            editButton.textContent = task.date;
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Usuń";
            let editedName = "";

            if (searchPhrase) {
                const parts = taskName.split(new RegExp(`(${searchPhrase})`, "gi"));
                parts.forEach((part, index) => {
                    if (part.toLowerCase() === searchPhrase.toLowerCase()) {
                        editedName += `<span class="highlight">${part}</span>`;
                    } else {
                        editedName += part;
                    }

                    if (index < parts.length - 1) {
                        editedName += " ";
                    }
                });

                editName.innerHTML = editedName;
            } else {
                editName.textContent = taskName;
            }

            listItem.appendChild(checkBox);
            listItem.appendChild(editName);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            this.taskList.appendChild(listItem);

            checkBox.addEventListener("change", () => {
                tasks[i].isChecked = checkBox.checked;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            });



            listItem.addEventListener("click", (event) => {
                event.stopPropagation(); // Zapobiega przenoszeniu kliknięcia do elementu nadrzędnego

                const editButton = listItem.querySelector(".edit-btn");
                const editName = listItem.querySelector(".name-btn");

                const inputElement = document.createElement("input");
                inputElement.type = "date";
                inputElement.value = tasks[i].date; // Ustaw początkową wartość daty

                const inputElement2 = document.createElement("input");
                inputElement2.type = "text";
                inputElement2.value = tasks[i].name; // Ustaw początkową wartość nazwy

                editButton.replaceWith(inputElement);
                editName.replaceWith(inputElement2);

                inputElement.focus();

                const handleBlur = () => {
                    const newDate = inputElement.value;
                    tasks[i].date = newDate;

                    const newName = inputElement2.value;
                    tasks[i].name = newName;

                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    this.updateTaskList(tasks);

                    inputElement.replaceWith(editButton);
                    inputElement2.replaceWith(editName);

                    // Usuń obsługę zdarzenia blur po zakończeniu edycji
                    document.removeEventListener("click", handleBlur);

                    // Dodaj obsługę zdarzenia click na elemencie listy, aby ponownie rozpocząć edycję
                    listItem.addEventListener("click", editListItem);
                };

                // Dodaj obsługę zdarzenia blur, która zostanie wywołana po utraceniu focusu
                document.addEventListener("click", handleBlur);

                // Usuń obsługę zdarzenia click na elemencie listy, aby uniknąć konfliktu z edycją
                listItem.removeEventListener("click", editListItem);
            });




            // editName.addEventListener("click", () => {
            //     const inputElement = document.createElement("input");
            //     const currentText = editName.textContent;
            //     inputElement.type = "text";
            //     inputElement.value = currentText;
            //
            //     const editNameRef = editName;
            //     editName.replaceWith(inputElement);
            //     inputElement.focus();
            //
            //     inputElement.addEventListener("blur", () => {
            //         const newText = inputElement.value;
            //         editNameRef.textContent = newText;
            //         inputElement.replaceWith(editName);
            //
            //         tasks[i].name = newText;
            //         localStorage.setItem("tasks", JSON.stringify(tasks));
            //         this.updateTaskList(tasks);
            //     });
            // });

            deleteButton.addEventListener("click", () => {
                this.deleteTask(i);
            });
        }
    }

    addTask() {
        const newTask = this.newTaskInput.value;
        const dueDate = this.dueDateInput.value;
        const user = new Task(newTask, dueDate, false);

        if (this.validateTask(newTask, dueDate)) {
            const tasks = this.getTasksFromLocalStorage();
            tasks.push(user);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            this.updateTaskList(tasks);
            this.newTaskInput.value = "";
            this.dueDateInput.value = "";
        }
    }

    validateTask(task, dueDate) {
        if (task.length < 3 || task.length > 255) {
            alert("Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.");
            return false;
        }
        if (dueDate && new Date(dueDate) <= new Date()) {
            alert("Data wykonania zadania musi być w przyszłości.");
            return false;
        }
        return true;
    }

    handleSearch() {
        const searchPhrase = this.searchInput.value.toLowerCase();
        if (searchPhrase.length >= 2) {
            this.currentSearchPhrase = searchPhrase;
            const tasks = this.getTasksFromLocalStorage();
            const filteredTasks = tasks.filter((task) =>
                task.name.toLowerCase().includes(searchPhrase)
            );
            this.updateTaskList(filteredTasks, searchPhrase);
        } else {
            this.currentSearchPhrase = "";
            this.updateTaskList(this.getTasksFromLocalStorage());
        }
    }

    deleteTask(index) {
        const tasks = this.getTasksFromLocalStorage();
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        this.updateTaskList(tasks);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    new ToDoList();
});
