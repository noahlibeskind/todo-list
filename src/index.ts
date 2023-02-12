import {v4 as uuidV4} from "uuid"
import {useState}  from 'react';

type Task = {
  id: string, 
  title: string, 
  completed: boolean, 
  createdAt: Date 
}

const [state, setState] = useState(false);

const todoList = document.querySelector<HTMLUListElement>("#todo-list")
const completedList = document.querySelector<HTMLUListElement>("#completed-list")

// "as..." indicates type either FormElement or null if nothing with that label exists
const form = document.getElementById("new-task-form") as HTMLFormElement | null 
const input = document.querySelector<HTMLInputElement>("#new-task-title")
const todoTasks: Task[] = loadTodoTasks()
const completedTasks: Task[] = loadCompletedTasks()


todoTasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }

  addListItem(newTask)
  input.value = ""
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  todoList?.append(item)
  todoTasks.push(task)
  
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    console.log(task.completed)
    saveTasks()
    let taskIndex = -1
    if (!task.completed) {
      for (let i = 0; i < todoTasks.length; i++) {
        if (todoTasks[i].id == task.id) {
          taskIndex = i
          break
        }
      }
      todoTasks.splice(taskIndex, 1)
      completedTasks.push(task)
    } else {
      for (let i = 0; i < completedTasks.length; i++) {
        if (completedTasks[i].id == task.id) {
          taskIndex = i
          break
        }
      }
      completedTasks.splice(taskIndex, 1)
      todoTasks.push(task)
    }
  })
  
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  label.append(checkbox, task.title)
  item.append(label)
  

}

function saveTasks() {
  localStorage.setItem("TODOTASKS", JSON.stringify(todoTasks))
  localStorage.setItem("COMPLETEDTASKS", JSON.stringify(completedTasks))
}

function loadTodoTasks(): Task[] {
  const todoTaskJSON = localStorage.getItem("TODOTASKS")

  if (!todoTaskJSON) return []
  return JSON.parse(todoTaskJSON)
}

function loadCompletedTasks(): Task[] {
  const completedTaskJSON = localStorage.getItem("COMPLETEDTASKS")

  if (!completedTaskJSON) return []
  return JSON.parse(completedTaskJSON)
}