var form = document.querySelector("form");
// var ul = document.querySelector("ul");
let myObj;

form.addEventListener("submit",onSubmit);

async function onSubmit(e){
    e.preventDefault();

    myObj = {
        itemName: document.getElementById("item-name").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        qty: document.getElementById("qty").value,
    }

    try{
      const response = await axios.post("https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList",myObj);
      console.log(response);
      getRequest();
    } catch(err){
      console.log(err)
    }

    // clear fields...
    form.reset();
}

async function getRequest() {
  try {
    const response = await axios.get("https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList");
    console.log(response);

    var tableBody = document.getElementById("item-table");

    // Clear the previous items by setting the innerHTML to an empty string
    tableBody.innerHTML = '';

    // Append the new items to the table
    for (var i = 0; i < response.data.length; i++) {
      showInUi(response.data[i]);
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

  // Create buttons
  var buyOneBtn = document.createElement("button");
  buyOneBtn.className = "btn btn-success buy-btn";
  buyOneBtn.appendChild(document.createTextNode("Buy 1"));

  var buyTwoBtn = document.createElement("button");
  buyTwoBtn.className = "btn btn-success buy-btn";
  buyTwoBtn.appendChild(document.createTextNode("Buy 2"));

  var buyThreeBtn = document.createElement("button");
  buyThreeBtn.className = "btn btn-success buy-btn";
  buyThreeBtn.appendChild(document.createTextNode("Buy 3"));

  var deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger delete-btn";
  deleteBtn.appendChild(document.createTextNode("Delete"));

  // Add buttons to the action cell
  actionCell.appendChild(buyOneBtn);
  actionCell.appendChild(buyTwoBtn);
  actionCell.appendChild(buyThreeBtn);
  actionCell.appendChild(deleteBtn);

  // Adding functionality to deleteBtn
  deleteBtn.addEventListener("click", onDeleteClick);

  async function onDeleteClick(e) {
    var userId = myObj._id;
    try {
      const response = await axios.delete("https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList/" + userId);
      console.log(response);
      getRequest();
    } catch (error) {
      console.log(error);
    }
  }

  // adding event listener for one click...
  buyOneBtn.addEventListener("click", onClickOne);

  // async function onClickOne(e){
  //   var itemId = myObj._id;
  //   // reduce the qty by one...
  //   if(myObj.qty>=1){
  //     updatedData = myObj.qty-1;
  //     try {
  //       const response = await axios.put("https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList/" + itemId, updatedData);
  //       console.log(response);
  //       getRequest(); 
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   else{
  //     // Display an error message if there are not enough items in stock
  //     alert("Not enough items in stock!");
  //   }
  // }
  // async function onClickOne(e) {
  //   var itemId = myObj._id;
  
  //   // Reduce the qty by one...
  //   if (myObj.qty >= 1) {
  //     // Create an updated item object with reduced quantity
  //     var updatedItem = { ...myObj, qty: myObj.qty - 1 };
  
  //     try {
  //       const response = await axios.put(
  //         "https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList/" + itemId,
  //         updatedItem
  //       );
  //       console.log(response);
  //       getRequest();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     // Display an error message if there are not enough items in stock
  //     alert("Not enough items in stock!");
  //   }
  // }

  async function onClickOne(e) {
    var itemId = myObj._id;
  
    // Reduce the qty by one...
    if (myObj.qty >= 1) {
      // Create an updated item object with reduced quantity
      var updatedItem = { ...myObj, qty: myObj.qty - 1 };
  
      try {
        const response = await axios.post(
          "https://crudcrud.com/api/711ea4431cb74f4ba9125e852da0b648/itemList/" + itemId,
          updatedItem
        );
        console.log(response);
        getRequest();
      } catch (error) {
        console.log(error);
        alert("An error occurred while updating the item.");
      }
    } else {
      // Display an error message if there are not enough items in stock
      alert("Not enough items in stock!");
    }
  }
  
  
}

document.addEventListener('DOMContentLoaded',()=>{
  getRequest();
});


