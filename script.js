let tasksContainer = document.getElementById('tasksContainer');
let userInput = document.getElementById('userInput');
let addButton = document.getElementById('addButton');
let saveButton = document.getElementById('save');
let loadIcon = document.getElementById('loadIcon');
let swipeThreshold = 100;


loadIcon.classList.add('d-none');
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Trigger the click event of the submit button
        addButton.click();
    }
});


function findCurrentdateTime() {
    let now = new Date();
    let minutes = null;
    let month = null;
    let hour = null;

    if (now.getMinutes() <= 9) {
        minutes = "0" + now.getMinutes();
    } else {
        minutes = now.getMinutes();
    }

    if ((now.getMonth() + 1) <= 9) {
        month = "0" + (now.getMonth() + 1);
    } else {
        month = now.getMonth() + 1;
    }

    if (now.getHours() <= 9) {
        hour = "0" + now.getHours();
    } else {
        hour = now.getHours();
    }


    return `${now.getDate()}-${month}-${now.getFullYear()} ${hour}:${minutes}`;
}

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
    loadIcon.classList.remove('d-none');
    saveButton.classList.add('d-none');
    setTimeout(function() {
        loadIcon.classList.add('d-none');
        saveButton.classList.remove('d-none');
    }, 1000);
}

function onDeleteTodo(taskItem) {
    let listContainer = document.getElementById(taskItem);
    listContainer.style.transform = "translateX(150%)";
    setTimeout(function() {
        tasksContainer.removeChild(listContainer);
    }, 300);

    let indexOfTodo = todoList.findIndex(function(eachItem) {
        eachItem = "todo" + eachItem.uniqueNo;
        if (eachItem === taskItem) {
            return true;
        }
    });
    todoList.splice(indexOfTodo, 1); //remove no of elements from the given index 
}

function onTouchStart(event) {
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
}

function onTouchEnd(event) {
    let endX = event.changedTouches[0].clientX;
    let endY = event.changedTouches[0].clientY;
    let deltaX = endX - this.startX;
    let deltaY = endY - this.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
            // Right-to-left swipe
            let taskItem = this.getAttribute('id');
            onDeleteTodo(taskItem);
        } else {
            // Left-to-right swipe
            checkbox.click(); // Trigger the checkbox click event
        }
    }
}

function createTodoItem(todoItem) {
    let taskItem = 'todo' + todoItem.uniqueNo;
    let uniqueId = 'myTask' + todoItem.uniqueNo;
    let time = todoItem.time;

    let listContainer = document.createElement('li');
    listContainer.id = taskItem;
    listContainer.classList.add('task-container');
    listContainer.addEventListener('touchstart', onTouchStart);
    listContainer.addEventListener('touchend', onTouchEnd);
    tasksContainer.prepend(listContainer); //prepend is oppposite of append

    let checkbox = document.createElement('input');
    checkbox.id = uniqueId;
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('checkbox');
    checkbox.checked = todoItem.isChecked;
    listContainer.appendChild(checkbox);

    let labelContainer = document.createElement('div');
    labelContainer.classList.add('label-container');
    listContainer.appendChild(labelContainer);

    let workContainer = document.createElement('div');
    workContainer.classList.add('work-container');
    labelContainer.appendChild(workContainer);

    let task = document.createElement('label');
    task.setAttribute('for', uniqueId);
    task.classList.add('task');
    task.textContent = todoItem.text;
    workContainer.appendChild(task);

    let todoTime = document.createElement('p');
    todoTime.classList.add('time');
    todoTime.textContent = time;
    labelContainer.appendChild(todoTime);

    let deleteIcon = document.createElement('i');
    deleteIcon.classList.add('delete-icon', 'fa-solid', 'fa-trash-can');
    deleteIcon.onclick = function() {
        onDeleteTodo(taskItem);

    };
    listContainer.appendChild(deleteIcon);

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
    let newTodo = {
        text: newTask,
        uniqueNo: uniqueNumber,
        isChecked: false,
        time: findCurrentdateTime()
    };
    todoList.push(newTodo); // opposite is unshift
    createTodoItem(newTodo);
}

addButton.onclick = function() {
    let newTask = userInput.value;
    let uniqueNumber = todoList.length + 1;
    if (newTask !== "") {
        addNewTodo(newTask, uniqueNumber);
        userInput.value = "";
    } else {
        alert("Em aina type cheyyi mowa...!!!");
    }
}

if (todoList.length !== 0) {
    for (let todoItem of todoList) {
        createTodoItem(todoItem);
    }
}
