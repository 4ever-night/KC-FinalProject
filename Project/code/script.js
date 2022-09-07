// console.log("nani")

//   side navbar
const menu_toggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menu_toggle.addEventListener('click' , () => {
menu_toggle.classList.toggle('is-active');
sidebar.classList.toggle('is-active');

})


// to do lis work place

const listsContainetr = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayCountainer =  document.querySelector('[data-list-display-countainer]')
const listCountElement = document.querySelector('[data-list-count]')
const listTitleElement = document.querySelector('[data-list-title]')
const tasksCountainer = document.querySelector('[data-tasks]')
const taskTemplete = document.getElementById(`task-templete`)
const newTaskInput = document.querySelector('[data-new-task-input]')
const newTaskForm = document.querySelector('[data-new-task-form]')
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-task-button]')






const LOCAL_STORAGE_LIST_KEY = 'task.list'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'




let lists =JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)




listsContainetr.addEventListener('click' , e => {
    if ( e.target.tagName.toLowerCase() === 'li')
    selectedListId = e.target.dataset.listId
    saveAndRender()
})


tasksCountainer.addEventListener('click' , e => {
    if (e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})


clearCompleteTaskButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})



deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})





newListForm.addEventListener('submit', e =>{
    e.preventDefault()
    const listName = newListInput.value 
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})


function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: [ ] }
}


newTaskForm.addEventListener('submit', e =>{
    e.preventDefault()
    const taskName = newTaskInput.value 
    if ( taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false }
}





function saveAndRender() {
    save()
    render()
}





function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}






function render() {
    clearElement(listsContainetr)
  renderList()
  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null) {
    listDisplayCountainer.style.display = 'none'
  }
  else{
    listDisplayCountainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksCountainer)
    renderTasks(selectedList)
  }
}





function renderTasks(selectedList) {
    selectedList.tasks.forEach(task =>{
    const taskElement = document.importNode(taskTemplete.content, true)
    const  checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksCountainer.appendChild(taskElement)
})
}





function renderTaskCount(selectedList) {
  const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTasksCount == 1 ? "task" : "tasks"
  listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`
}





function renderList() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if (list.id === selectedListId) {
        listElement.classList.add('is-active') }

        listsContainetr.appendChild(listElement)
    })

}




function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }

}
 


render()