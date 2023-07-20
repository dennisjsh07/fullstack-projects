// var form = document.querySelector("form");
// // var ul = document.querySelector("ul");
// let myObj;

// form.addEventListener("submit",onSubmit);

// // async function onSubmit(e){
// //     e.preventDefault();

// //     myObj = {
// //         itemName: document.getElementById("item-name").value,
// //         description: document.getElementById("description").value,
// //         price: document.getElementById("price").value,
// //         qty: document.getElementById("qty").value,
// //     }

// //     try{
// //       const response = await axios.post("http://localhost:2000/items/add-items/",myObj);
// //       console.log(response);
// //       showInUi(response.data.allItems);
// //     } catch(err){
// //       console.log(err)
// //     }

// //     // clear fields...
// //     form.reset();
// // }

// async function onSubmit(e) {
//   e.preventDefault();

//   myObj = {
//     itemName: document.getElementById("item-name").value,
//     description: document.getElementById("description").value,
//     price: document.getElementById("price").value,
//     qty: document.getElementById("qty").value,
//   };

//   try {
//     const response = await axios.post("http://localhost:2000/items/add-items/", myObj);
//     console.log(response);
//     getRequest();

//     // Clear fields after successful submission
//     form.reset();
//   } catch (err) {
//     console.log(err);
//   }
// }


// async function getRequest() {
//   try {
//     const response = await axios.get("http://localhost:2000/items/get-items");
//     const items = response.data.allItems;
//     console.log(response);

//     var tableBody = document.getElementById("item-table");

//     // Clear the previous items by setting the innerHTML to an empty string
//     tableBody.innerHTML = '';

//     // Append the new items to the table
//     for (var i = 0; i < items.length; i++) {
//       showInUi(items[i]);
//     }

//   } catch (err) {
//     console.log(err);
//   }
// }

// function showInUi(myObj) {
//   var table = document.getElementById("item-table");

//   // Create table row
//   var newRow = table.insertRow();

//   // Create table cells for each item property
//   var itemNameCell = newRow.insertCell(0);
//   var descriptionCell = newRow.insertCell(1);
//   var priceCell = newRow.insertCell(2);
//   var qtyCell = newRow.insertCell(3);
//   var actionCell = newRow.insertCell(4); // Cell for buttons

//   // Populate table cells with item data
//   itemNameCell.textContent = myObj.itemName;
//   descriptionCell.textContent = myObj.description;
//   priceCell.textContent = myObj.price;
//   qtyCell.textContent = myObj.qty;

//   // Create a row with two columns using Bootstrap grid system
//   var buttonRow = document.createElement("div");
//   buttonRow.className = "row";

//   var selectColumn = document.createElement("div");
//   selectColumn.className = "col";

//   var deleteColumn = document.createElement("div");
//   deleteColumn.className = "col";

//   // Create a select element with options for quantities from 1 to 10
//   var selectElement = document.createElement("select");
//   selectElement.className = "form-select buy-btn btn-sm";
//   selectElement.onchange = function () {
//     onBuyClick(this.value);
//   };

//   for (let i = 1; i <= 10; i++) {
//     var optionElement = document.createElement("option");
//     optionElement.value = i;
//     optionElement.textContent = "Buy " + i;
//     selectElement.appendChild(optionElement);
//   }

//   selectColumn.appendChild(selectElement);

//   // Create delete button
//   var deleteBtn = document.createElement("button");
//   deleteBtn.className = "btn btn-danger delete-btn";
//   deleteBtn.appendChild(document.createTextNode("Delete"));
//   deleteColumn.appendChild(deleteBtn);

//   // Adding functionality to deleteBtn
//   deleteBtn.addEventListener("click", onDeleteClick);

//   // Add the columns to the row
//   buttonRow.appendChild(selectColumn);
//   buttonRow.appendChild(deleteColumn);

//   // Add the row to the action cell
//   actionCell.appendChild(buttonRow);

//   async function onDeleteClick(e) {
//     var userId = myObj.id;
//     console.log('pId', userId);
//     try {
//       const response = await axios.delete("http://localhost:2000/items/delete-items/" + userId);
//       console.log(response);
//       getRequest();
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// document.addEventListener('DOMContentLoaded',()=>{
//   getRequest();
// });
 
//-----------------------------------------------------------------------------------------------------------------------------------------

var form = document.querySelector("form");
let myObj;

form.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  myObj = {
    itemName: document.getElementById("item-name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    qty: document.getElementById("qty").value,
  };

  try {
    const response = await axios.post("http://localhost:2000/items/add-items/", myObj);
    console.log(response);
    getRequest();

    // Clear fields after successful submission
    form.reset();
  } catch (err) {
    console.log(err);
  }
}

async function getRequest() {
  try {
    const response = await axios.get("http://localhost:2000/items/get-items");
    const items = response.data.allItems;
    console.log(response);

    var tableBody = document.getElementById("item-table");

    // Clear the previous items by setting the innerHTML to an empty string
    tableBody.innerHTML = '';

    // Append the new items to the table
    for (var i = 0; i < items.length; i++) {
      showInUi(items[i]);
    }
  } catch (err) {
    console.log(err);
  }
}

function showInUi(myObj) {
  var table = document.getElementById("item-table");

  // Create table row
  var newRow = table.insertRow();

  // Create table cells for each item property
  var itemNameCell = newRow.insertCell(0);
  var descriptionCell = newRow.insertCell(1);
  var priceCell = newRow.insertCell(2);
  var qtyCell = newRow.insertCell(3);
  var actionCell = newRow.insertCell(4); // Cell for buttons

  // Populate table cells with item data
  itemNameCell.textContent = myObj.itemName;
  descriptionCell.textContent = myObj.description;
  priceCell.textContent = myObj.price;
  qtyCell.textContent = myObj.qty;

  // Create a row with two columns using Bootstrap grid system
  var buttonRow = document.createElement("div");
  buttonRow.className = "row";

  var selectColumn = document.createElement("div");
  selectColumn.className = "col";

  var deleteColumn = document.createElement("div");
  deleteColumn.className = "col";

  // Create a select element with options for quantities from 1 to 10
  var selectElement = document.createElement("select");
  selectElement.className = "form-select buy-btn btn-sm";
  selectElement.onchange = function () {
    onBuyClick(myObj.id, this.value);
  };

  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Qty";
  selectElement.appendChild(defaultOption);

  for (let i = 1; i <= 10; i++) {
    var optionElement = document.createElement("option");
    optionElement.value = i;
    optionElement.textContent = "Buy " + i;
    selectElement.appendChild(optionElement);
  };

  selectColumn.appendChild(selectElement);

  // Create delete button
  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger delete-btn btn-sm";
  deleteBtn.appendChild(document.createTextNode("Delete"));
  deleteColumn.appendChild(deleteBtn);

  // Adding functionality to deleteBtn
  deleteBtn.addEventListener("click", onDeleteClick);

  // Add the columns to the row
  buttonRow.appendChild(selectColumn);
  buttonRow.appendChild(deleteColumn);

  // Add the row to the action cell
  actionCell.appendChild(buttonRow);
}

async function onDeleteClick(e) {
  var userId = myObj.id;
  console.log('pId', userId);
  try {
    const response = await axios.delete("http://localhost:2000/items/delete-items/" + userId);
    console.log(response);
    getRequest();
  } catch (error) {
    console.log(error);
  }
}

async function onBuyClick(itemId, qtyToBuy) {
  try {
    const response = await axios.put(`http://localhost:2000/items/update-items/${itemId}`, {
      qtyToBuy: qtyToBuy,
    });
    console.log(response);
    getRequest();
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getRequest();
});
