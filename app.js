const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoApp = document.getElementById('todo-app');

function saveState(state) {
  localStorage.setItem('pageState', JSON.stringify(state));
}

function loadState() {
  return JSON.parse(localStorage.getItem('pageState'));
}

let todos = [];

if (loadState() !== null) {
  todos = loadState();
}

class Todo {
  constructor(description) {
    if (todos.length === 0) {
      this.id = 1;
    } else {
      this.id = todos[todos.length - 1].id + 1;
    }

    this.description = description;
    this.done = false;
    todos.push(this);
  }
}

if (todos !== null) {
  todos.forEach((todo) => {
    renderTodo(todo);
  });
}

function renderTodo(todo) {
  const parent = document.createElement('div');
  parent.id = `todo${todo.id}`;
  parent.classList.add('todo-card');
  let maxLength = 23;
  let description = todo.description;
  
  if (todo.description.length > maxLength) {
    description = todo.description.substring(0, maxLength) + "..."; 
  }

  const todoElements = [
    {
      tag: 'p',
      className: 'todo-description',
      text: description,
    },
    {
      tag: 'button',
      className: 'check-button',
      text: todo.done ? '' : '',
    },
    {
      tag: 'button',
      className: 'delete-button',
      text: '',
    },
  ];

  let child;

  todoElements.forEach((elementInfo) => {
    child = document.createElement(elementInfo.tag);
    child.classList.add(elementInfo.className);
    child.innerText = elementInfo.text;

    if (elementInfo.className === 'check-button') {
      child.addEventListener('click', checkTodo);
    } else if (elementInfo.className === 'delete-button') {
      child.addEventListener('click', deleteTodo);
    } else if (elementInfo.className === 'todo-description' && todo.done) {
      child.style.color = '#079452';
    }

    parent.appendChild(child);
  });

  todoApp.appendChild(parent);
}

function createNewTodo() {
  if (todoInput.value === '') {
    return;
  }

  let newTodo = new Todo(todoInput.value);
  renderTodo(newTodo);

  todoInput.value = '';
  saveState(todos);
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createNewTodo();
});

function checkTodo(event) {
  const parent = event.target.parentNode;
  const todoDescription = parent.querySelector('p');
  const checkButton = parent.querySelector('button');
  const todoId = parseInt(parent.id.replace('todo', ''));
  let todo = null;

  for (let i = 0; i < todos.length; i++) {
    if (todoId === todos[i].id) {
      todo = todos[i];
    }
  }

  if (todo !== null) {
    if (todo.done) {
      todoDescription.style.color = '#ffffff';
      checkButton.innerText = '';
      todo.done = false;
    } else {
      todoDescription.style.color = '#079452';
      checkButton.innerText = '';
      todo.done = true;
    }
  }

  saveState(todos);
}

function deleteTodo(event) {
  const parent = event.target.parentNode;
  const todoId = parseInt(parent.id.replace('todo', ''));

  for (let i = 0; i < todos.length; i++) {
    if (todoId === todos[i].id) {
      todos.splice(i, 1);
    }
  }

  todoApp.removeChild(parent);
  saveState(todos);
}
