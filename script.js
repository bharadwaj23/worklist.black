let tasksContainer = document.getElementById('tasksContainer');
let userInput = document.getElementById('userInput');
let addButton = document.getElementById('addButton');
let saveButton = document.getElementById('save');

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Trigger the click event of the submit button
        addButton.click();
    }
});

function getTodoListFromLocalStorage() {
    let storedValue = localStorage.getItem("TodoList");
    let parsedValue = JSON.parse(storedValue);
    if (parsedValue === null) {
        return [];
    } else {
        return parsedValue;
    }
}

let todoList = getTodoListFromLocalStorage();

saveButton.onclick = function() {
    localStorage.setItem('TodoList', JSON.stringify(todoList));
}

let todoListLength = todoList.length;

function onDeleteTodo(taskItem) {
    let taskContainer = document.getElementById(taskItem);
    tasksContainer.removeChild(taskContainer);

    let indexOfTodo = todoList.findIndex(function(eachItem) {
        eachItem = "todo" + eachItem.uniqueNo;
        if (eachItem === taskItem) {
            return true;
        }
    });
    todoList.splice(indexOfTodo, 1); //remove no of elements from the given index 
}

function createTodoItem(todoItem) {
    let taskItem = 'todo' + todoItem.uniqueNo;
    let uniqueId = 'myTask' + todoItem.uniqueNo;

    let listContainer = document.createElement('li');
    listContainer.id = taskItem;
    listContainer.classList.add('mt-3', 'mb-3', 'list-container', 'd-flex', 'flex-row');
    tasksContainer.prepend(listContainer); //prepend is oppposite of append

    let checkbox = document.createElement('input');
    checkbox.id = uniqueId;
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('m-2', 'checkbox');
    checkbox.checked = todoItem.isChecked;
    listContainer.appendChild(checkbox);

    let labelContainer = document.createElement('div');
    labelContainer.classList.add('w-100', 'd-flex', 'flex-row', 'label-container');
    listContainer.appendChild(labelContainer);

    let task = document.createElement('label');
    task.setAttribute('for', uniqueId);
    task.classList.add('w-100', 'pt-1', 'task');
    task.textContent = todoItem.text;
    labelContainer.appendChild(task);

    let deleteContainer = document.createElement('div');
    deleteContainer.classList.add('d-flex', 'flex-column', 'justify-content-center');
    labelContainer.appendChild(deleteContainer);

    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('m-2', 'fa-solid', 'fa-trash-can');
    deleteIcon.onclick = function() {
        onDeleteTodo(taskItem);

    };
    deleteContainer.appendChild(deleteIcon);
    if (checkbox.checked) {
        task.classList.add('checked');
        deleteIcon.classList.add('fa-bounce');
    }
    checkbox.onclick = function() {
        if (checkbox.checked) {
            deleteIcon.classList.add('fa-bounce');
            task.classList.add('checked');
            todoItem.isChecked = true;

        } else {
            todoItem.isChecked = false;
            deleteIcon.classList.remove('fa-bounce');
            task.classList.remove('checked');
        }
    };
}

function addNewTodo(newTask, uniqueNumber) {
    todoListLength = todoListLength + 1;
    let newTodo = {
        text: newTask,
        uniqueNo: todoListLength,
        isChecked: false
    };
    todoList.push(newTodo); // opposite is unshift
    createTodoItem(newTodo);
}

addButton.onclick = function() {
    let newTask = userInput.value;
    let uniqueNumber = todoList.length;
    if (newTask !== "") {
        addNewTodo(newTask, uniqueNumber);
        userInput.value = "";
    } else {
        alert("Em aina type cheyyi mowa...!!!");
    }
}

if (todoList.length !== 0) {
    for (let todoitem of todoList) {
        createTodoItem(todoitem);
    }
}
