const API_URL = "http://localhost:5000/api/tasks";
let page = 1, totalPages = 1, editTaskId = null;

async function fetchTasks() {
    const filter = document.getElementById('filter').value;
    const limit = document.getElementById('limit').value;
    const sort = document.getElementById('sort').value;
    const url = `${API_URL}?page=${page}&limit=${limit}${filter !== 'all' ? `&completed=${filter}` : ''}&sort=${sort}`;
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('taskList').innerHTML = data.data.map(task => `
        <li class="flex flex-col bg-blue-100 p-2 rounded">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <input type="checkbox" class="cursor-pointer" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task._id}', ${task.completed})">
                    <span class="${task.completed ? 'line-through text-green-500' : ''}">${task.title}</span>
                </div>
                <div>
                    <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="openModal('${task._id}', '${task.title}', '${task.description}')">Modifier</button>
                    <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteTask('${task._id}')">Supprimer</button>
                </div>
            </div>
            <p class="text-sm text-gray-700 mt-1">${task.description || "Pas de description"}</p>
        </li>
    `).join('');
    totalPages = data.totalPages;
    document.getElementById('pageInfo').textContent = `Page ${page} / ${totalPages}`;
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (page <= 1) {
        prevBtn.classList.add('disabled-btn');
    } else {
        prevBtn.classList.remove('disabled-btn');
    }
    
    if (page >= totalPages) {
        nextBtn.classList.add('disabled-btn');
    } else {
        nextBtn.classList.remove('disabled-btn');
    }
}

async function addTask() {
    const title = document.getElementById('taskInput').value;
    const description = document.getElementById('taskDescription').value;
    if (!title) return;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });
    document.getElementById('taskInput').value = '';
    document.getElementById('taskDescription').value = '';
    fetchTasks();
}

async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
}

function openModal(id, title, description) {
    editTaskId = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

async function saveTask() {
    const newTitle = document.getElementById('editTitle').value;
    const newDescription = document.getElementById('editDescription').value;
    if (editTaskId) {
        await fetch(`${API_URL}/${editTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDescription })
        });
        fetchTasks();
        closeModal();
    }
}

async function deleteTask(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTasks();
    }
}

function prevPage() {
    if (page > 1) {
        page--;
        fetchTasks();
    }
}

function nextPage() {
    if (page < totalPages) {
        page++;
        fetchTasks();
    }
}

fetchTasks();
