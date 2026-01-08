const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const modal = document.querySelector(".modal");
const toggleModal = document.getElementById("toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskBtn = document.getElementById("add-new-task");

let dragItem = null;
let tasksData = JSON.parse(localStorage.getItem("tasks")) || {};

/* Create Task */
function createTask(title, desc, column){
    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;

    task.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    column.appendChild(task);

    task.addEventListener("dragstart", () => dragItem = task);

    task.querySelector("button").onclick = () => {
        task.remove();
        updateCounts();
    };
}

/* Drag events */
[ todo, progress, done ].forEach(col => {
    col.addEventListener("dragover", e => e.preventDefault());
    col.addEventListener("dragenter", () => col.classList.add("hover-over"));
    col.addEventListener("dragleave", () => col.classList.remove("hover-over"));
    col.addEventListener("drop", () => {
        col.appendChild(dragItem);
        col.classList.remove("hover-over");
        updateCounts();
    });
});

/* Update count + storage */
function updateCounts(){
    [ todo, progress, done ].forEach(col => {
        col.querySelector(".right").innerText =
            col.querySelectorAll(".task").length;

        tasksData[col.id] = [...col.querySelectorAll(".task")].map(t => ({
            title: t.querySelector("h3").innerText,
            desc: t.querySelector("p").innerText
        }));
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

/* Load saved tasks */
Object.keys(tasksData).forEach(colId => {
    tasksData[colId].forEach(t => {
        createTask(t.title, t.desc, document.getElementById(colId));
    });
});
updateCounts();

/* Modal logic */
toggleModal.onclick = () => modal.classList.add("active");
modalBg.onclick = () => modal.classList.remove("active");

addTaskBtn.onclick = () => {
    const title = document.getElementById("task-title-input").value.trim();
    const desc = document.getElementById("task-desc-input").value.trim();

    if(!title) return alert("Task title required!");

    createTask(title, desc, todo);
    updateCounts();
    modal.classList.remove("active");

    document.getElementById("task-title-input").value = "";
    document.getElementById("task-desc-input").value = "";
};
