const todos = [];
const RENDER_EVENT = "render-todo";
const completedTODO = [];
const uncompletedTODO = [];
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

function generateid() {
  return +new Date();
}

function generatetodoObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id == todosId) {
      return index;
    }
  }

  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedTODOList.innerHTML = "";

  const completedTODOList = document.getElementById("completeBookshelfList");
  completedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);

    if (todoItem.isCompleted) {
      completedTODOList.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
});

function addTodo() {
  const generatedid = generateid();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const todoObject = generatetodoObject(
    generatedid,
    title,
    author,
    year,
    isComplete
  );

  if (isComplete) {
    completedTODO.push(todoObject);
  } else {
    uncompletedTODO.push(todoObject);
  }
  todos.push(todoObject);
  renderTodos();

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function renderTodos() {
  const completedTODOList = document.getElementById("completeBookshelfList");
  const uncompletedTODOList = document.getElementById(
    "incompleteBookshelfList"
  );

  completedTODOList.innerHTML = "";
  uncompletedTODOList.innerHTML = "";
  const checkbox = document.getElementById("inputBookIsComplete");
  const todosToDisplay = checkbox.checked ? completedTODO : uncompletedTODO;

  for (const todoItem of todosToDisplay) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      completedTODOList.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
}

function makeTodo(todoObject) {
  const generatedid = generateid();
  const textTitle = document.createElement("h3");
  textTitle.innerText = todoObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = todoObject.author;

  const numberYear = document.createElement("p");
  numberYear.innerText = todoObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(generatedid, textTitle, textAuthor, numberYear);

  const container = document.createElement("div");
  container.classList.add("todoItem");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");

    undoButton.setAttribute("id", "button-undo");
    undoButton.innerText = "Belum Selesai Dibaca";

    undoButton.addEventListener("click", function () {
      undoTaskToCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");

    trashButton.setAttribute("id", "trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeTaskToCompleted(todoObject.id);
    });
    container.append(undoButton, trashButton);
  } else {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");

    undoButton.setAttribute("id", "button-undo");
    undoButton.innerText = "Sudah Selesai";

    undoButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");

    trashButton.setAttribute("id", "trash-button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeTaskToCompleted(todoObject.id);
    });
    container.append(undoButton, trashButton);
  }

  return container;
}

//Fungsi check button
function addTaskToCompleted(bookId) {
  const todoTarget = findTodo(bookId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//Fungsi menghapus Todo berdasrkan index
function removeTaskToCompleted(bookId) {
  const todoTarget = findTodo(bookId);
  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//Fungsi yang bertujuan agar todo yang completed, dapat dipindah menjadi incomplete
function undoTaskToCompleted(bookId) {
  const todoTarget = findTodo(bookId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  const checkbox = document.getElementById("inputBookIsComplete");
  checkbox.addEventListener("change", function () {
    renderTodos();
  });
  renderTodos();

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log("Data berhasil di simpan.");
});

//Fungsi mencari todo dengan ID
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

let checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("change", function () {
  const completedTODOList = document.getElementById("completeBookshelfList");
  const uncompletedTODOList = document.getElementById(
    "incompleteBookshelfList"
  );
  const showCompleted = checkbox.checked;

  completedTODOList.innerHTML = "";
  uncompletedTODOList.innerHTML = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);

    if (todoItem.isCompleted) {
      completedTODOList.append(todoElement);
    } else if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    }
  }
});
