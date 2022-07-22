'use strict'

const listItem = document.querySelector('.list');
const inputText = document.querySelector('.inputText');
const addButton = document.querySelector('.addbtn');
const searchButton = document.querySelector('.searchbtn');
const actionDDL = document.getElementById('actionDDL');
const sortDDL = document.getElementById('sortDDL');
const actionDDLMobile = document.getElementById('actionDDLMobile');
const sortDDLMobile = document.getElementById('sortDDLMobile');
const displayAllButton = document.querySelector('#selectAll');
const displayActiveButton = document.querySelector('#selectActive');
const displayCompletedButton = document.querySelector('#selectCompleted');
const displayAllButtonMobile = document.querySelector('#selectAllMobile');
const displayActiveButtonMobile = document.querySelector('#selectActiveMobile');
const displayCompletedButtonMobile = document.querySelector('#selectCompletedMobile');
displayAllButton.classList.add('active');
displayAllButtonMobile.classList.add('active');

let inc = 0;
let allTask = []
let oldTask = []

function displayLi(el) {
    const task = `<li>
                    <input id='${el.id}' onclick="checkEl(this)" class="chkBox" type="checkbox">
                    <span ondblclick="editElement(this.parentElement)"><input type="text" class="editInput" value="${el.value}" disabled></span>
                    <a onclick="editElement(this.parentElement)" href="#"><i class="fa-solid fa-pen-to-square"></i></a>
                    <a onclick="deleteEl(this.parentElement)" href="#"><i class="fa-solid fa-delete-left"></i></a>
                  </li>`;
    listItem.insertAdjacentHTML('afterbegin', task);
}

function addElement() {
    const text = inputText.value;
    if (text != '') {
        let flag = false;
        for (let i of allTask) {
            if (i.value == text) {
                flag = true;
            }
        }
        if (flag) {
            alert(`${text} task already exists!`)
        } else {
            allTask = [...oldTask]
            allTask.push({
                id: inc,
                value: text.toLowerCase(),
                isCheck: false
            });
            inc++;
            oldTask = [...allTask]
            inputText.value = "";
            inputText.focus();
            displayByCondition(allTask);
            displayAllButton.classList.add('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.remove('active');
        }
    } else {
        alert("Enter task to add!");
    }
}

addButton.addEventListener('click', function () {
    addElement();
})

inputText.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        addElement();
    } else {
        if (searchButton.classList.contains('search')) {
            searchEl();
        }
    }
})

function searchEl() {
    const txt = inputText.value;
    listItem.textContent = "";
    for (let el of allTask) {
        let x = el.value.search(txt);
        if (x >= 0) {
            displayLi(el);
        }
    }
}

searchButton.addEventListener('click', function () {
    searchButton.classList.toggle('search');
    if (!searchButton.classList.contains('search')) {
        displayByCondition(allTask);
    } else {
        searchEl()
    }
    inputText.focus();
})

function disableEditInput(editInputs) {
    for (let i = 0; i < editInputs.length; i++) {
        editInputs[i].children[1].children[0].classList.remove('actv');
        editInputs[i].children[1].children[0].setAttribute("disabled", "true")
        editInputs[i].children[2].classList.remove('active');
    }
}

function editElement(el) {
    const idNo = el.children[0].getAttribute('id');
    const editInput = el.children[1].children[0];
    const oldText = el.children[1].children[0].value;
    const editInputs = document.getElementsByTagName('li');

    disableEditInput(editInputs);
    el.children[2].classList.add('active');

    const end = editInput.value.length;
    editInput.setSelectionRange(end, end);

    editInput.classList.add('actv');
    editInput.removeAttribute("disabled");
    editInput.focus();

    editInput.addEventListener('blur', function () {
        if (editInput.value == "") {
            editInput.value = oldText;
            disableEditInput(editInputs);
        } else {
            for (let i of allTask) {
                if (i.id == idNo) {
                    i.value = editInput.value;
                    break;
                }
            }
            displayByCondition(allTask);
        }
    })

    editInput.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {
            if (editInput.value == "") {
                editInput.value = oldText;
                disableEditInput(editInputs);
            } else {
                for (let i of allTask) {
                    if (i.id == idNo) {
                        i.value = editInput.value;
                        break;
                    }
                }
                displayByCondition(allTask);
            }
        }
    })
}

function deleteEl(el) {
    const idNo = el.children[0].getAttribute('id');

    for (let [i, val] of allTask.entries()) {
        if (val.id == idNo) {
            allTask.splice(i, 1);
        }
    }
    for (let [i, val] of oldTask.entries()) {
        if (val.id == idNo) {
            oldTask.splice(i, 1);
        }
    }
    displayByCondition(allTask);
}

function checkEl(el) {
    const idNo = el.getAttribute('id');
    if (el.checked) {
        for (let val of allTask) {
            if (val.id == idNo) {
                val.isCheck = true;
            }
        }
        for (let val of oldTask) {
            if (val.id == idNo) {
                val.isCheck = true;
            }
        }
    } else if (!el.checked) {
        for (let val of allTask) {
            if (val.id == idNo) {
                val.isCheck = false;
            }
        }
        for (let val of oldTask) {
            if (val.id == idNo) {
                val.isCheck = false;
            }
        }
    }
    displayByCondition(allTask);
}

function displayByCondition(arr) {
    if (displayAllButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of arr) {
            displayLi(el);
            if (el.isCheck) {
                document.getElementById(`${el.id}`).checked = true;
            }
        }
    } else if (displayActiveButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of arr) {
            if (!el.isCheck) {
                displayLi(el);
            }
        }
    } else if (displayCompletedButton.classList.contains('active')) {
        listItem.textContent = "";
        for (let el of arr) {
            if (el.isCheck) {
                displayLi(el);
                document.getElementById(`${el.id}`).checked = true;
            }
        }
    }
}

function displayByConditionMobile(arr) {
    if (displayAllButtonMobile.classList.contains('active')) {
        console.log('All')
        listItem.textContent = "";
        for (let el of arr) {
            displayLi(el);
            if (el.isCheck) {
                document.getElementById(`${el.id}`).checked = true;
            }
        }
    } else if (displayActiveButtonMobile.classList.contains('active')) {
        console.log("Active")
        listItem.textContent = "";
        for (let el of arr) {
            if (!el.isCheck) {
                displayLi(el);
            }
        }
    } else if (displayCompletedButtonMobile.classList.contains('active')) {

        listItem.textContent = "";
        for (let el of arr) {
            if (el.isCheck) {
                displayLi(el);
                document.getElementById(`${el.id}`).checked = true;
            }
        }
    }
}

function selectEntriesMobile(el) {
    switch (el.getAttribute('id')) {
        case 'selectAllMobile':
            displayAllButtonMobile.classList.add('active');
            displayActiveButtonMobile.classList.remove('active');
            displayCompletedButtonMobile.classList.remove('active');
            displayAllButton.classList.add('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.remove('active');
            displayByConditionMobile(allTask)
            break;
        case 'selectActiveMobile':
            displayAllButtonMobile.classList.remove('active');
            displayActiveButtonMobile.classList.add('active');
            displayCompletedButtonMobile.classList.remove('active');
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.add('active');
            displayCompletedButton.classList.remove('active');
            displayByConditionMobile(allTask)
            break
        case 'selectCompletedMobile':
            displayAllButtonMobile.classList.remove('active');
            displayActiveButtonMobile.classList.remove('active');
            displayCompletedButtonMobile.classList.add('active');
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.add('active');
            displayByConditionMobile(allTask)
            break
    }
}

function selectEntries(el) {
    switch (el.getAttribute('id')) {
        case 'selectAll':
            displayAllButton.classList.add('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.remove('active');
            displayByCondition(allTask)
            getSortedValue();
            break;
        case 'selectActive':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.add('active');
            displayCompletedButton.classList.remove('active');
            displayByCondition(allTask)
            getSortedValue();
            break
        case 'selectCompleted':
            displayAllButton.classList.remove('active');
            displayActiveButton.classList.remove('active');
            displayCompletedButton.classList.add('active');
            displayByCondition(allTask)
            getSortedValue();
            break
    }
}

function getSelectedValue() {
    selectAction(actionDDL)
}

function getSelectedValueMobile() {
    selectAction(actionDDLMobile)
}

function selectAction(el) {
    switch (el.value) {
        case 'Delete All Selected':
            for (let i = 0; i < allTask.length; i++) {
                if (allTask[i].isCheck) {
                    allTask.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < oldTask.length; i++) {
                if (oldTask[i].isCheck) {
                    oldTask.splice(i, 1);
                    i--;
                }
            }
            displayByCondition(allTask);
            break;

        case 'Select All':
            for (let val of allTask) {
                val.isCheck = true;
            }
            displayByCondition(allTask);
            break;

        case 'Deselect All':
            for (let val of allTask) {
                val.isCheck = false;
            }
            displayByCondition(allTask);
            break;
    }
    setTimeout(() => el.selectedIndex = 0, 0)
}

function sortArr() {
    if (displayAllButton.classList.contains('active')) {
        return allTask;
    } else if (displayActiveButton.classList.contains('active')) {
        let activeTask = [];
        for (let el of allTask) {
            if (!el.isCheck) {
                activeTask.push(el);
            }
        }
        return activeTask;
    } else if (displayCompletedButton.classList.contains('active')) {
        let completeTask = [];
        for (let el of allTask) {
            if (el.isCheck) {
                completeTask.push(el);
            }
        }
        return completeTask;
    }
}

function getSortedValue() {
    selectSort(sortDDL)
}

function getSortedValueMobile() {
    selectSort(sortDDLMobile)
}

function selectSort(device) {
    switch (device.value) {
        case 'A-Z':
            allTask.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
            displayByCondition(allTask);
            break;

        case 'Z-A':
            allTask.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
            displayByCondition(allTask);
            break;

        case 'Newest':
            allTask = [...oldTask];
            displayByCondition(allTask);
            break;

        case 'Oldest':
            allTask = [...oldTask]
            displayByCondition(allTask.reverse())
            break;
    }
    setTimeout(() => device.selectedIndex = 0, 0)
}