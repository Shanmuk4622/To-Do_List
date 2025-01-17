document.getElementById('addTaskBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form submission

    // Retrieve values from the inputs
    const taskInput = document.getElementById('taskInput').value.trim();
    const taskPriority = document.getElementById('taskPriority').value;
    const openingTime = document.getElementById('openingTime').value;
    const closingTime = document.getElementById('closingTime').value;

    // Set defaults for empty fields
    const taskText = taskInput || "Untitled Task"; // Default task name if empty
    const displayOpeningTime = openingTime || "Not Set"; // Default opening time
    const displayClosingTime = closingTime || "Not Set"; // Default closing time

    // Calculate task duration
    const taskDuration = calculateTaskDuration(openingTime, closingTime);

    // Add the task to the DOM
    addTaskToDOM(taskText, taskPriority, displayOpeningTime, displayClosingTime, taskDuration);

    // Save the task (if using local storage or other persistence)
    saveTaskToLocalStorage(taskText, taskPriority, displayOpeningTime, displayClosingTime, taskDuration);

    // Clear the input fields
    document.getElementById('taskInput').value = '';
    document.getElementById('openingTime').value = '';
    document.getElementById('closingTime').value = '';
});

function calculateTaskDuration(openingTime, closingTime) {
    if (!openingTime || !closingTime) return "Not Set";

    const [openHours, openMinutes] = openingTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closingTime.split(':').map(Number);

    const openingDate = new Date(0, 0, 0, openHours, openMinutes);
    const closingDate = new Date(0, 0, 0, closeHours, closeMinutes);

    const durationInMinutes = (closingDate - openingDate) / (1000 * 60); // Convert milliseconds to minutes

    if (durationInMinutes < 0) return "Invalid Time Range"; // Handle cases where closing time is earlier than opening time

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours}h ${minutes}m`; // Return duration in "xh ym" format
}

function addTaskToDOM(taskText, priority, openingTime, closingTime, taskDuration) {
    const li = document.createElement('li');
    li.className = priority; // Assign the class based on priority

    // Set the task's display text
    li.textContent = `${taskText} (Opening: ${openingTime}, Closing: ${closingTime}, Duration: ${taskDuration})`;

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function () {
        li.remove(); // Remove task from the list
        updateLocalStorage(); // Update stored tasks
    };

    li.appendChild(deleteBtn); // Append the delete button to the list item
    document.getElementById('taskList').appendChild(li); // Add the task to the list
}

function saveTaskToLocalStorage(taskText, priority, openingTime, closingTime, taskDuration) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, priority, openingTime, closingTime, duration: taskDuration });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    const taskListItems = document.querySelectorAll('#taskList li');
    taskListItems.forEach(item => {
        const text = item.textContent.replace('Delete', '').trim(); // Extract task text
        tasks.push({ text }); // Save the text
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
        addTaskToDOM(task.text, task.priority, task.openingTime, task.closingTime, task.duration);
    });
}

// Load tasks on page load
window.onload = loadTasks;

