const LS_KEY = 'vk_todos_v1';

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input[type=text]'),
  list: document.querySelector('.list'),
  stats: document.querySelector('.meta'),
  allBtn: document.querySelector('.btn-all'),
  activeBtn: document.querySelector('.btn-active'),
  completedBtn: document.querySelector('.btn-completed'),
  clearBtn: document.querySelector('.btn-clear'),
};

let todos = load();
let filter = 'all';

elements.form.addEventListener('submit', e => {
  e.preventDefault();
  const text = elements.input.value.trim();
  if (text) {
    todos.push({ id: Date.now(), text, done: false });
    elements.input.value = '';
    save();
    render();
  }
});

elements.allBtn?.addEventListener('click', () => {
  filter = 'all';
  render();
});
elements.activeBtn?.addEventListener('click', () => {
  filter = 'active';
  render();
});
elements.completedBtn?.addEventListener('click', () => {
  filter = 'completed';
  render();
});
elements.clearBtn?.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

elements.input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) {
    elements.form.requestSubmit();
  }
});

function render() {
  elements.list.innerHTML = '';

  const visible = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  if (visible.length === 0) {
    const p = document.createElement('div');
    p.className = 'small';
    p.style.opacity = 0.8;
    p.textContent = 'No tasks yet — add something!';
    elements.list.appendChild(p);
  }

  visible.forEach(todo => {
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.id = todo.id;

    const left = document.createElement('div');
    left.className = 'left';

    const cb = document.createElement('button');
    cb.className = 'checkbox' + (todo.done ? ' checked' : '');
    cb.setAttribute('aria-label', todo.done ? 'Mark as not done' : 'Mark as done');
    cb.addEventListener('click', () => {
      toggleDone(todo.id);
    });

    const txt = document.createElement('div');
    txt.className = 'task' + (todo.done ? ' done' : '');
    txt.textContent = todo.text;
    txt.title = 'Double-click to edit';
    txt.addEventListener('dblclick', () => {
      startEdit(item, todo);
    });

    left.appendChild(cb);
    left.appendChild(txt);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', () => startEdit(item, todo));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete';
    delBtn.innerHTML = '🗑️';
    delBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(actions);
    elements.list.appendChild(item);
  });

  elements.stats.textContent = `${todos.length} task${todos.length !== 1 ? 's' : ''}`;
}

function toggleDone(id) {
  todos = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function startEdit(itemEl, todo) {
  const txtEl = itemEl.querySelector('.task');
  const input = document.createElement('input');
  input.value = todo.text;
  input.className = 'edit-input';

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') finishEdit();
    if (e.key === 'Escape') cancelEdit();
  });

  input.addEventListener('blur', finishEdit);

  function finishEdit() {
    const v = input.value.trim();
    if (v) {
      todos = todos.map(t => (t.id === todo.id ? { ...t, text: v } : t));
      save();
    }
    render();
  }

  function cancelEdit() {
    render();
  }

  itemEl.querySelector('.left').replaceChild(input, txtEl);
  input.focus();
  input.select();
}

function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(todos));
}

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

render();
