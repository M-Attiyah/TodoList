//////////////////////////////////
// 30 min to develop the app    //
//////////////////////////////////

function List() {
    this.listSize = 0;
    this.dataStore = [];
    this.append = append;
    this.find = find;
    this.removeIndex = removeIndex
    this.storeToLocal = storeToLocal;
    this.queryFromLocal = queryFromLocal;
    this.check = check;
    this.remove = remove;
    this.clearAll = clearAll;
}


function append(element) {
    this.dataStore.push(element)
    ++this.listSize
}


function find(element) {
    for (let i = 0; i < this.dataStore.length; i++) {
        if (this.dataStore[i] === element) {
            return i
        }
    }
    return -1
}


function removeIndex(element) {
    let found = this.find(element);
    if (found !== -1) {
        this.dataStore.splice(found, 1)
        --this.listSize;
        return true
    }
    return false
}





let tasks = new List();



window.addEventListener('load', e => {
    
    if (!localStorage.getItem('tasks')) {
        return false 
    } else {
        let values = JSON.parse(localStorage.getItem('tasks'));
        values.forEach(value => {
            makeElement(value)
            tasks.append(value)
            remove(value)
        })

        check();
        clearAll();
        countTasks();
    }   
})



// define the form, input
let form = document.querySelector('#form');
let input = document.querySelector('#input-form');

// when click submit
form.addEventListener('submit', e => {
    e.preventDefault();

    // check the empty input 
    // | true -> false
    // | false -> display input value

    if (input.value.length === 0) {
        return false
    } else {

        // display the input
        tasks.append(input.value)
        tasks.storeToLocal(input.value)
        makeElement(input.value)
        check();
        clearAll();
        countTasks();

        input.value = '';

        let values = JSON.parse(localStorage.getItem('tasks'));
        values.forEach(val => {
            remove(val)
        })

    }
})



/////////////////////////////
// create element function //
/////////////////////////////

function makeElement(inputValue) {
    let ul = document.querySelector('#list');
    let li = document.createElement('li');
    li.id = 'item';

    let checkboxButton = document.createElement('input');
    checkboxButton.id = 'check';
    checkboxButton.className = 'inputCheck'
    checkboxButton.type = 'checkbox';

    let todoText = document.createElement('span');
    todoText.id = 'task-text';
    todoText.className = 'taskTxt';
    todoText.textContent = inputValue;

    let removeBtn = document.createElement('span');
    removeBtn.id = 'remove-btn';
    removeBtn.className = 'removeBtn';
    removeBtn.innerHTML = '&times';

    li.appendChild(checkboxButton);
    li.appendChild(todoText);
    li.appendChild(removeBtn);

    ul.appendChild(li);
}



/////////////////////////////
// create store function   //
/////////////////////////////

function storeToLocal(element) {
    let localArr;

    if (!localStorage.getItem('tasks')) {
        localArr = []
    } else {
        localArr = JSON.parse(localStorage.getItem('tasks'))
    }

    localArr.push(element);
    localStorage.setItem('tasks', JSON.stringify(localArr))
}



/////////////////////////////
// create query function   //
/////////////////////////////

function queryFromLocal() {
    if (!localStorage.getItem('tasks')) {
        return false
    } 
    
    let values = JSON.parse(localStorage.getItem('tasks'));
    values.forEach(value => {
        makeElement(value)
    })
}




function remove(element) {
    let removeButtons = document.querySelectorAll('#remove-btn')

    removeButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            // remove from HTML page
            let parent = e.target.parentElement;
            parent.remove();

            // remove from localStorage
            let taskTxt = e.target.previousElementSibling;
            
            if (taskTxt.textContent === element) {
                tasks.removeIndex(element);
                countTasks()
            }
            localStorage.setItem('tasks', JSON.stringify(tasks.dataStore))

        })
    })
}





function check() {
    let checkInput = document.querySelectorAll('#check');

    checkInput.forEach(inp => {
        inp.addEventListener('click', e => {
            let taskText = e.target.nextSibling
            let parent = e.target.parentElement;

            if (e.target.checked) {
                taskText.classList.add('check');
                parent.style.opacity = '.5';
            } else {
                taskText.classList.remove('check');
                parent.style.opacity = '';
            }
        })
    })
}




function clearAll() {
    let clearButton = document.querySelector('#clearAll');
    clearButton.addEventListener('click', e => {
        let ul = document.querySelector('#list');
        let child = ul.firstElementChild;
        
        while (child) {
            ul.removeChild(child);
            child = ul.firstElementChild;
        }

        tasks.dataStore = [];
        tasks.listSize = 0;
        localStorage.clear('tasks');
    })
}



function countTasks() {
    let count = document.querySelector('#task-count');
    count.textContent = tasks.listSize;
}