document.getElementById('addTaskBtn').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    const taskPriority = document.getElementById('taskPriority').value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    addTaskToDOM(taskText, taskPriority);
    saveTaskToLocalStorage(taskText, taskPriority);
    taskInput.value = '';
});

function addTaskToDOM(taskText, priority, completed = false) {
    const li = document.createElement('li');
    li.className = priority; // Set the class based on priority
    li.setAttribute('draggable', true); // Make the item draggable
    li.ondragstart = function() {
        li.classList.add('dragging');
    };
    li.ondragend = function() {
        li.classList.remove('dragging');
    };

    li.ondragover = function(e) {
        e.preventDefault(); // Allow dropping
        const draggingItem = document.querySelector('.dragging');
        const currentItem = li;
        const isMovingDown = draggingItem.compareDocumentPosition(currentItem) & Node.DOCUMENT_POSITION_FOLLOWING;

        currentItem.parentNode.insertBefore(draggingItem, isMovingDown ? currentItem.nextSibling : currentItem);
    };

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.onclick = function() {
        if (checkbox.checked) {
            taskTextSpan.classList.add('completed'); // Apply completed class to the span
        } else {
            taskTextSpan.classList.remove('completed'); // Remove completed class from the span
        }
        updateLocalStorage();
    };

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    if (completed) {
        taskTextSpan.classList.add('completed'); // Apply completed class if the task is completed
    }

    li.appendChild(checkbox);
    li.appendChild(taskTextSpan); // Append the task text to the li
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        li.remove();
        updateLocalStorage();
    };

    li.appendChild(deleteBtn);
    document.getElementById('taskList').appendChild(li);
}

function saveTaskToLocalStorage(taskText, priority) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, priority: priority, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    const taskListItems = document.querySelectorAll('#taskList li');
    taskListItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        tasks.push({ text: item.querySelector('span').textContent, priority: item.className, completed: checkbox.checked });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.priority, task.completed);
    });
}

// Load tasks when the page is loaded
window.onload = loadTasks;