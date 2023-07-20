const form = document.querySelector("form");
const ul = document.querySelector("ul");

form.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const myObj = {
    expense: document.getElementById("expense-amt").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value
  };

  if (form.dataset.expenseId) { // if expenseId edit mode
    try {
      const expenseId = form.dataset.expenseId;
      const response = await axios.put(`http://localhost:5000/expense/update-expense/${expenseId}`, myObj);
      console.log(response);
      getRequest();
      exitEditMode();
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const response = await axios.post("http://localhost:5000/expense/add-expense", myObj);
      console.log(response);
      showInUi(response.data.newexpenseDetails);
    } catch (err) {
      console.log(err);
    }

    form.reset();
  }
}

function enterEditMode(expenseId) {
  form.dataset.expenseId = expenseId;
  document.getElementById("update").style.display = "block";
  document.getElementById("submit").style.display = "none";
}

function exitEditMode() {
  delete form.dataset.expenseId;
  document.getElementById("update").style.display = "none";
  document.getElementById("submit").style.display = "block";
}

async function getRequest() {
  try {
    const response = await axios.get("http://localhost:5000/expense/get-expense");
    const expenses = response.data.allExpenses;
    console.log(response);

    ul.innerHTML = '';

    for (let i = 0; i < expenses.length; i++) {
      showInUi(expenses[i]);
    }
  } catch (err) {
    console.log(err);
  }
}

function showInUi(data) {
  const li = document.createElement("li");
  li.className = "list-group-item p-1 mb-2";
  li.appendChild(document.createTextNode(data.expenseAmount + " - " + data.description));

  li.dataset.expenseId = data.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-dark btn-sm float-end delete";
  deleteBtn.appendChild(document.createTextNode("X"));
  li.appendChild(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-success btn-sm float-end me-2 edit";
  editBtn.appendChild(document.createTextNode("Edit"));
  li.appendChild(editBtn);

  ul.appendChild(li);

  deleteBtn.addEventListener("click", onDeleteClick);

  async function onDeleteClick(e) {
    const expenseId = data.id;
    console.log('deleting id', expenseId);
    try {
      const response = await axios.delete(`http://localhost:5000/expense/delete-expense/${expenseId}`);
      console.log(response);
      getRequest();
    } catch (err) {
      console.log(err);
    }
  }

  editBtn.addEventListener('click', onEditClick);

  function onEditClick(e) {
    const expenseId = data.id;
    console.log('editingId', expenseId);

    document.getElementById("expense-amt").value = data.expenseAmount;
    document.getElementById("description").value = data.description;
    document.getElementById("category").value = data.category;

    enterEditMode(expenseId);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getRequest();
});




