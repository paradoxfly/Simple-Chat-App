const usrnme = document.getElementById("username")
const psswrd = document.getElementById("password")
const submit = document.getElementById("submit")
const passwordErrorText = document.getElementById("passwordErrorText")
const usernameErrorText = document.getElementById("usernameErrorText")
const defaultClass = usrnme.className
let username = ","
let password = ","
usrnme.addEventListener("input", event=>{ //Stores username to "username" variable
	username = event.target.value
})
psswrd.addEventListener("input", event=>{ //Stores password to "password" variable
	password = event.target.value
})

submit.addEventListener("click", event =>{
	event.preventDefault()
	if(isEmpty(username)&&isEmpty(password)){
		usrnme.className += " textBoxError"
		psswrd.className += " textBoxError"
		console.log("Both fields are empty")
		usernameErrorText.innerHTML = "<strong>Both fields must be filled</strong>"
		passwordErrorText.innerHTML = ""
	} 
	else if(isEmpty(password)){
		usrnme.className = defaultClass
		psswrd.className += " textBoxError"
		console.log("Password field is empty")
		usernameErrorText.innerHTML = ""
		passwordErrorText.innerHTML = "Password field can't be left empty"
	}
	else if(isEmpty(username)){
		psswrd.className = defaultClass
		usrnme.className += " textBoxError"
		console.log("Username field is empty")
		usernameErrorText.innerHTML = "Username field can't be left empty"
		passwordErrorText.innerHTML = ""
	}
	else {
		data = {username, password, type: 'login'}
		options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}	
		fetch('/login', options)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			if (data.successful){
				console.log("Login was successful.. Profile exists")
				location.replace("http://localhost:3000/profile.html?"+data.id)
			}
			else{
				switch (data.error) {
					case "username":
						console.log(data.comment)
						psswrd.className = defaultClass
						usrnme.className += " textBoxError"
						break;
					case "password":
						usrnme.className = defaultClass
						psswrd.className += " textBoxError"
						console.log(data.comment)
						break;
					default:
						break;
				}
			}
		})
	}
})
