var form = document.querySelector("form");
var ul = document.querySelector("ul");

form.addEventListener("submit",onSubmit);

async function onSubmit(e){
    e.preventDefault();
    
    const myObj = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
    }
    
    if(form.dataset.userId){// If the form has a userId data attribute, it's in edit mode (PUT request)
        try{
            const userId = form.dataset.userId;
            const response = await axios.put(`http://localhost:8000/user/update-user/${userId}`,myObj);
              console.log(response);
              getRequest();
              exitEditMode();
       } catch(error){
        console.log(error);
       }  
    }
    else{ // not in edit mode...
        try {
            const response = await axios.post("http://localhost:8000/user/add-user",myObj);
              console.log(response);
              showInUi(response.data.newUserDetails);
        } catch (error) {
            console.log(error);
        }
    }
}

function enterEditMode(userId){
    form.dataset.userId = userId; // Set the user ID as a data attribute of the form
    document.getElementById("update").style.display = "block"; // Show the Update button
    document.getElementById("submit").style.display = "none"; // Hide the Get A Call button
}

function exitEditMode(){
    delete form.dataset.userId; // Remove the user ID from the form's data attribute
    document.getElementById("update").style.display = "none"; // Hide the Update button
    document.getElementById("submit").style.display = "block"; // Show the Get A Call button
}

async function getRequest(){
    try{
        const response = await axios.get("http://localhost:8000/user/get-users");
        console.log(response);

        const users = response.data.allUsers; // Extract the users array from the response

        ul.innerHTML = ''; // clear previous items

        for(var i=0;i<users.length;i++){
            showInUi(users[i]);
        }
    } catch(error){
        console.log(error);
    }
}

function showInUi(data){
  
    var li = document.createElement("li");
    li.className = "list-group-item mb-2";
    li.appendChild(document.createTextNode(data.name+" - "+data.phone));

    // add userId data attribute to list item...
    li.dataset.usetId = data.id;
    
    // add delete button
    deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm float-end delete"
    deleteBtn.appendChild(document.createTextNode("X"));
    li.appendChild(deleteBtn);

     // add Edit button
     editBtn = document.createElement("button");
     editBtn.className = "btn btn-primary btn-sm float-end me-2 edit";
     editBtn.appendChild(document.createTextNode("Edit"));
     li.appendChild(editBtn);

    ul.appendChild(li);
    
    // adding functionality to deleteBtn
    deleteBtn.addEventListener("click",onDeleteClick);

    async function onDeleteClick(e) {
        var userId = data.id;
        console.log('deleting id',userId);
        // delete HTTP function
        try {
            const response = await axios.delete("http://localhost:8000/user/delete-user/" + userId); // Add a slash before the :id parameter
            console.log(response);
            getRequest();
        } catch (error) {
            console.log(error);
        }
    }

    // adding functionality to edit button...
    editBtn.addEventListener("click",onEditClick);

    async function onEditClick(e){
        var userId = data.id;
        console.log('editing id',userId);
        // get user data associated with the click edit button...
        const userData = {
            name: data.name,
            email: data.email,
            phone: data .phone
        };
        // pre-populate the fields...
        document.getElementById('name').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;

        enterEditMode(userId);
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    getRequest();
});
 