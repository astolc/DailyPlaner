'use strict';

const main = ((document) => {
  const arrDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение'];

  let date = new Date();

  const timeNow = date.toLocaleString("ru", {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  function createApp(app) {
    const header = createHeader();
    const timeBlock = createTimeBlock();
    const main = createMain();
    const form = creatForm();
    const notes = createSectionNotes();
    const tasks = createSectionTasks().tasks;

    app.append(header);
    app.append(main);
    header.append(timeBlock);
    main.append(tasks, notes.notes, form.form);
  }

  createApp(document.querySelector('.app'));

  function getDayIndex(date) {
    let day = date.getDay();
    if (day == 0) {
      day = 7;
    }
    return day - 1;
  };

  function createElement(teg, attr, ...subEl) {
    const el = document.createElement(teg);
    Object.keys(attr).forEach((key) => {
      el[key] = attr[key];
    })
    subEl.forEach((item) => {
      el.append(item);
    })

    return el;
  }

  function createHeader() {
    const title = createElement('h1', { className: 'title', textContent: 'daily planer' });
    const header = createElement('header', { className: 'header' }, title);
    return header;
  }

  function getShortDay() {
    const shortDay = arrDays.map((item) => {
      return item.replace(/[оеяу]/gi, '').slice(0, 2);
    })
    return shortDay;
  }

  function createTimeBlock() {
    const currentDate = createElement('time', { className: 'time__current-date', textContent: `${timeNow}` })
    const currentTime = createElement('time', { className: 'time__current-time', textContent: `${date.getHours()}:${date.getMinutes()}` })
    const timeInner = createElement('div', { className: 'time__inner' }, currentTime, currentDate)
    const days = createElement('ul', { className: 'days' })
    const timeWrapper = createElement('div', { className: 'time' }, days, timeInner);

    const shortDays = getShortDay();

    for (let i = 0; i < 7; i++) {
      const day = createElement('li', { className: 'days__item', textContent: `${shortDays[i]}` });
      if (i === getDayIndex(date)) day.classList.add('active');
      days.append(day);
    }

    setInterval(() => {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();

      if (h < 10) {
        h = '0' + h;
      }
      if (m < 10) {
        m = '0' + m;
      }
      currentTime.textContent = `${h}:${m}`;
    }, 60000);

    return timeWrapper;
  }

  function createMain() {
    const main = createElement('main', { className: 'main' });

    return main;
  }

  function createSectionTasks() {
    const tabsContent = createElement('div', { className: 'tabs__content' });
    const tabsList = createElement('ul', { className: 'tabs__list' });
    const tabs = createElement('div', { className: 'tabs' }, tabsList, tabsContent);
    const sectionTitle = createElement('h2', { className: 'section-title', textContent: 'Расписание' });
    const tasks = createElement('section', { className: 'tasks' }, sectionTitle, tabs);

    createTabsItem(tabsList, tabsContent);

    bindEvents(tabs);

    return { tasks, sectionTitle, tabs, tabsList, tabsContent };
  }

  function createTabsItem(list, content) {

    const shortDay = getShortDay();
    const screenWidth = window.screen.width;

    for (let i = 0; i < 7; i++) {
      const tabsItem = createElement('li', { className: 'tabs__item', textContent: `${screenWidth <= 600 ? shortDay[i] : arrDays[i]}` });
      if (i === getDayIndex(date)) tabsItem.classList.add('active');

      const block = createElement('ul', { className: 'block' });
      if (i === getDayIndex(date)) block.classList.add('active');

      list.append(tabsItem);
      content.append(block);
    }

    createShortItem(screenWidth, shortDay);
  }

  function createShortItem(screenWidth, shortDay) {
    const shortItems = document.querySelectorAll('.tabs__item');

    if (screenWidth <= 600) {
      shortItems.forEach((item, i) => {
        item.textContent = shortDay[i];
      });
    } else{
      shortItems.forEach((item, i) => {
        item.textContent = arrDays[i];
      });
    }
  }

  function createSectionNotes() {
    const notesList = createElement('ul', { className: 'notes__list' })
    const sectionTitle = createElement('h2', { className: 'section-title', textContent: 'Заметки' });
    const notes = createElement('section', { className: 'notes' }, sectionTitle, notesList);

    return { notes, notesList, sectionTitle };
  }

  function creatForm() {
    const inputTime = createElement('input', { className: 'form__input' });
    const labelInputTime = createElement('label', { className: 'form__label' }, inputTime);
    const textArea = createElement('textarea', { className: 'form__textarea' });
    const labelTaxtarea = createElement('label', { className: 'form__label' }, textArea);
    const btnTask = createElement('button', { className: 'form__btn-task', textContent: 'Задача' });
    const btnNote = createElement('button', { className: 'form__btn-note', textContent: 'Заметка' });
    const formInner = createElement('div', { className: 'form__inner' }, btnTask, btnNote);
    const form = createElement('form', { className: 'form' }, labelInputTime, labelTaxtarea, formInner);

    return {
      form,
      labelInputTime,
      inputTime,
      labelTaxtarea,
      textArea,
      formInner,
      btnTask,
      btnNote
    };
  }

  function bindEvents(listener) {
    const tabsItem = listener.querySelectorAll('.tabs__item');
    const block = listener.querySelectorAll('.block');

    tabsItem.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tabs__item')) return;
        tabsItem.forEach((el) => {
          el.classList.remove('active');
        })
        block.forEach((el) => {
          el.classList.remove('active');
        })
        tabsItem[index].classList.add('active');
        block[index].classList.add('active');
      })
    })
  }

  let arrTask = [];
  let arrNotes = [];

  const taskBlocks = document.querySelectorAll('.block');
  const notesList = document.querySelector('.notes__list');
  const timeValue = document.querySelector('.form__input');
  const textValue = document.querySelector('.form__textarea');
  const form = document.querySelector('.form');
  const btnNote = document.querySelector('.form__btn-note');

  loadTask();
  loadNotes();

  function createTask(id, time, text, i, checked) {
    taskBlocks.forEach((item, index) => {
      if (i !== index) return;
      const taskHTML = `
        <li class="block__item" id="${id}">
          <span class="block__item-time">${time}</span>
          <p class="block__item-text">${text}</p>
          <label class="block__item-label">
            <input class="block__item-checkbox" type="checkbox" ${checked ? 'checked' : ''}></input>
            <span class="block__item-decor"></span>
          </label>
          <div class="block__item-busket"></div>
        </li>
      `
      item.insertAdjacentHTML('beforeend', taskHTML);
    });
    delTask();
  }

  function renderTask() {
    if (timeValue.value == '' || textValue.value == '') return;

    const strTime = timeValue.value.match(/\w{2}/gi);

    if (timeValue.value.length > 4 || !/\d{4}/gi.test(timeValue.value) || (+strTime[0] >= 24 || +strTime[1] > 59)) {
      alert('Введите время в формате до: 2359');
      timeValue.value = '';
      timeValue.focus();
      return;
    }

    let taskObj = {
      id: new Date().getMilliseconds(),
      index: '',
      time: strTime.join(':'),
      text: textValue.value,
      checked: false,
    }

    taskBlocks.forEach((item, i) => {
      if (!item.classList.contains('active')) return;
      taskObj.index = i;
    });

    arrTask.push(taskObj);

    createTask(taskObj.id, taskObj.time, taskObj.text, taskObj.index, taskObj.checked);
    saveToLocalStorege(arrTask);

    timeValue.value = '';
    textValue.value = '';
    timeValue.focus();
  }

  function loadTask() {
    if (!localStorage.getItem('task')) return;
    arrTask = JSON.parse(localStorage.getItem('task'));
    arrTask.forEach((el) => createTask(el.id, el.time, el.text, el.index, el.checked));
  }

  function checkTask() {
    taskBlocks.forEach((item) => {
      item.addEventListener('change', (e) => {
        const checkbox = e.target.closest('li').id;
        arrTask.forEach((el) => {
          if (checkbox == el.id) {
            el.checked = !el.checked;
            saveToLocalStorege(arrTask);
          }
        })
      })
    })
  }

  function delTask() {
    taskBlocks.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('block__item-busket')) return;
        const parentNode = e.target.closest('li');
        parentNode.remove();
        arrTask = arrTask.filter((el) => {
          return +parentNode.id !== el.id;
        });
        saveToLocalStorege(arrTask);
        clearLocalStorege('task');
      });
    });
  }

  function saveToLocalStorege(data) {
    const str = JSON.stringify(data);
    return localStorage.setItem('task', str);
  }

  function createNote() {

    if (textValue.value == '') return;

    let noteObj = {
      id: new Date().getMilliseconds(),
      time: timeNow,
      text: textValue.value,
    }

    const notesItem = `
    <li class="notes__item" id="${noteObj.id}">
      <time class="note__item-time">${noteObj.time}</time>
      <p class="notes__text">${noteObj.text}</p>
      <div class="block__item-busket note-busket"></div>  
    </li>
  `
    notesList.insertAdjacentHTML('beforeend', notesItem);

    arrNotes.push(noteObj);
    saveNotesLocalStorege(arrNotes);

    textValue.value = '';
    textValue.focus();

    delNote();
  }

  function delNote() {
    notesList.addEventListener('click', (e) => {
      e.preventDefault();
      if (!e.target.classList.contains('note-busket')) return;
      const notePatent = e.target.closest('li');
      notePatent.remove();
      arrNotes = arrNotes.filter((el) => {
        return +notePatent.id !== el.id;
      });
      saveNotesLocalStorege(arrNotes);
      clearLocalStorege('note');
    })
  }

  function loadNotes() {
    if (localStorage.getItem('note')) {
      arrNotes = JSON.parse(localStorage.getItem('note'));
      arrNotes.forEach((el) => {
        const notesItem = `
          <li class="notes__item" id="${el.id}">
            <time class="note__item-time">${el.time}</time>
            <p class="notes__text">${el.text}</p>
            <div class="block__item-busket note-busket"></div>  
          </li>
        `
        notesList.insertAdjacentHTML('beforeend', notesItem);
        delNote();
      });
    }
  }

  function saveNotesLocalStorege(data) {
    let str = JSON.stringify(data);
    return localStorage.setItem('note', str);
  }

  function clearLocalStorege(key) {
    if (localStorage.getItem(key) === '[]') localStorage.removeItem(key);
  }

  function main() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      return renderTask();
    });

    btnNote.addEventListener('click', createNote);
    checkTask();

    window.addEventListener('resize', createSectionTasks);
  }

  return main;
})(document);

main();

