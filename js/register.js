const urlBase = 'http://134.199.207.149/LAMPAPI';
const extension = 'php';

function register(){
    let firstName = document.getElementById("userFirstName").value;
    let lastName = document.getElementById("userLastName").value;
    let login = document.getElementById("userLogin");
    let password = document.getElementById("userPassword");

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/AddUser.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            let response = JSON.parse(xhr.responseText);

            if(response.success){
                document.getElementById("userResult").innerHTML = "User added successfully!"
            }
            else{
                document.getElementById("userResult").innerHTML = "Error: " + response.error;
            }
        }
    }

    xhr.send(jsonPayload);
}