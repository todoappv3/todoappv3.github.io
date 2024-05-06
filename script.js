//learning localStorage by building todo app
//LocalStorage is a web storage feature of JavaScript that lets you persist data by storing the data as a key:value pair

const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const taskData = JSON.parse(localStorage.getItem("data")) || []; //will store all the tasks along with their associated data / initial taskData to be the retrieval of data from local storage or an empty array

let currentTask = {}; //will be used to track the state when editing and discarding tasks

const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  };

  localStorage.setItem("data", JSON.stringify(taskData));

  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  //this is a keyword that refers to the current context. In this case this points to the element that triggers the event – the buttons
  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button type="button" class="btn" onclick="editTask(this)">Edit</button>
          <button type="button" class="btn" onclick="deleteTask(this)">Delete</button>
        </div>
      `)
    }
  );
};

const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);

  localStorage.setItem("data", JSON.stringify(taskData));
  //to update taskData after a task is deleted insted of using removeItem since i used splice() to remove the deleted task from taskData
};
const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  currentTask = taskData[dataArrIndex];
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

/*
You've retrieved the task item(s) now, but they still don't reflect in the UI when the page loads. However, they appear when you add a new task

if taskData has a length greater than 0, the code inside the if statement block will run. If taskData has a length of 0, the code inside the if statement block will not run
*/

if (taskData.length) {
  updateTaskContainer();
};

openTaskFormBtn.addEventListener("click", () => taskForm.classList.toggle("hidden"));

closeTaskFormBtn.addEventListener("click", () => {
  //confirmCloseDialog.showModal(); //showModal() method that can be used to display a modal dialog box on a web page
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); //to stop the browser from refreshing the page after submitting the form
  
  /*
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  //findIndex() array method finds and returns the index of the first element in an array that meets the criteria specified by a provided testing function. If no such element is found, the method returns -1
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`, //to set all id lowerCase and date.now() is to make the id unique by adding the date number of milliseconds
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  };
  taskData.forEach(({id, title, date, description}) => {
    (tasksContainer.innerHTML += `
      <div class="task" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        <button type="button" class="btn">Edit</button>
        <button type="button" class="btn">Delete</button>
      </div>
    `)
  });
  reset(); //clear the input fields and also hide the form modal for the user to see the added task
  */

  addOrUpdateTask();
});
/*
const myTaskArr = [
  { task: "Walk the Dog", date: "22-04-2022" },
  { task: "Read some books", date: "02-11-2023" },
  { task: "Watch football", date: "10-08-2021" },
];

##################################################################
localStorage offers methods for saving, retrieving, and deleting items. The items you save can be of any JavaScript data type
use : setItem() / getItem() / removeItem() / clear()
you can find it in console -> Application -> local Storage
##################################################################
localStorage.setItem("data", myTaskArr);
return [object Object] This is because everything you save in localStorage needs to be in string format u need to wrap it in JSON.stringify()
##################################################################
localStorage.setItem("data", JSON.stringify(myTaskArr));
##################################################################
localStorage.removeItem("data");
data item removed console.log(getTaskArr or getTaskArrObj) will return null
##################################################################
localStorage.clear();
won't just delete a single item from local storage but will remove all items will return null in the console / You don't need to pass in anything
##################################################################
const getTaskArr = localStorage.getItem("data");
console.log(getTaskArr);
result: [{"task":"Walk the Dog","date":"22-04-2022"},{"task":"Read some books","date":"02-11-2023"},{"task":"Watch football","date":"10-08-2021"}]
##################################################################
to get the saved item in it original form:

const getTaskArrObj = JSON.parse(localStorage.getItem("data"));
console.log(getTaskArrObj); 

result: array of objects
[ { task: 'Walk the Dog', date: '22-04-2022' },
  { task: 'Read some books', date: '02-11-2023' },
  { task: 'Watch football', date: '10-08-2021' } ]
##################################################################
*/
