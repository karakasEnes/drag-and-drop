const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;
let currentColumn;
let draggedItem;
let draggedColumnIndex;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}
//filterArray
function filteredArrayFunc(arr) {
  return arr.filter((item) => item !== null);
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((name, index) => {
    const filteredArray = filteredArrayFunc(listArrays[index]);
    localStorage.setItem(`${name}Items`, JSON.stringify(filteredArray));
  });

  backlogListArray = filteredArrayFunc(backlogListArray);
  progressListArray = filteredArrayFunc(progressListArray);
  completeListArray = filteredArrayFunc(completeListArray);
  onHoldListArray = filteredArrayFunc(onHoldListArray);

  // localStorage.setItem("backlogItems", JSON.stringify(backlogListArray));
  // localStorage.setItem("progressItems", JSON.stringify(progressListArray));
  // localStorage.setItem("completeItems", JSON.stringify(completeListArray));
  // localStorage.setItem("onHoldItems", JSON.stringify(onHoldListArray));
}

//drag//drop settings
function drag(ev) {
  draggedItem = ev.target;

  //indentify draggedColumnIndex
  const draggedItemParentId = draggedItem.parentElement.id;

  if (draggedItemParentId === "backlog-list") {
    draggedColumnIndex = 0;
  } else if (draggedItemParentId === "progress-list") {
    draggedColumnIndex = 1;
  } else if (draggedItemParentId === "complete-list") {
    draggedColumnIndex = 2;
  } else if (draggedItemParentId === "on-hold-list") {
    draggedColumnIndex = 3;
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  //remove Class from columns
  listColumns.forEach((col) => {
    col.classList.remove("over");
  });

  // add item to column that we are oN
  listColumns[currentColumn].appendChild(draggedItem);

  //update Arrays after drop finished
  updateArrays();
  updateSavedColumns();
}

function dragEnter(columnIndex) {
  listColumns[columnIndex].classList.add("over");
  currentColumn = columnIndex;
}

// when drop happen this function should run
function updateArrays() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const droppedItemText = draggedItem.textContent;

  //dropped array
  listArrays[currentColumn].push(droppedItemText);

  //dragged array
  const draggedArray = listArrays[draggedColumnIndex];
  draggedArray.splice(draggedArray.indexOf(droppedItemText, 1));
}

//updateItem
function updateItem(column, index) {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const selectedColumn = listColumns[column];
  const selectedItem = selectedColumn.children[index];

  if (!selectedItem.textContent) {
    delete listArrays[column][index];
  }

  updateSavedColumns();
  updateDOM();
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);

  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");

  listEl.contentEditable = true;
  listEl.setAttribute("onfocusout", `updateItem(${column}, ${index})`);
  //appendItem
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  // updateSavedColumns();
}

// add item & hide item
function showTextArea(indexNumber) {
  addBtns[indexNumber].style.visibility = "hidden";
  saveItemBtns[indexNumber].style.display = "flex";
  addItemContainers[indexNumber].style.display = "flex";
  textEditAble(indexNumber);
}

function hideTextArea(indexNumber) {
  addBtns[indexNumber].style.visibility = "visible";
  saveItemBtns[indexNumber].style.display = "none";
  addItemContainers[indexNumber].style.display = "none";
  textAreaToColumnArray(indexNumber);
}

//textArea (if you click addItem button this will work)
function textEditAble(indexNumber) {
  const textArea = addItems[indexNumber];
  textArea.contentEditable = true;
  textArea.textContent = "";
}

//textAreaToLocalArray (if you click saveItem button this will work)
function textAreaToColumnArray(indexNumber) {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const textArea = addItems[indexNumber];
  listArrays[indexNumber].push(textArea.textContent);
  updateSavedColumns();
  updateDOM();
}

// onLoad
updateDOM();
