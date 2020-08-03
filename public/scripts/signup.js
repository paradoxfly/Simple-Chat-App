const usrnme = document.getElementById("username")
const psswrd = document.getElementById("password")
const usernameErrorText = document.getElementById("usernameErrorText")
const passwordErrorText = document.getElementById("passwordErrorText")
const formContainer = document.getElementById("container")
const successText = document.getElementById("success-text")

let username = ","
let password = ","
let signup = document.getElementById("signup")
let initclass = psswrd.className
usrnme.addEventListener("input", event=>{
	username = event.target.value
})
psswrd.addEventListener("input", event=>{
	password = event.target.value
})

signup.addEventListener("click", event =>{
	event.preventDefault()
	if(isEmpty(username)&&isEmpty(password)){
		usrnme.className += " textBoxError"
		psswrd.className += " textBoxError"
		console.log("Both fields are empty")
		usernameErrorText.innerHTML = "Both fields must be filled"
		passwordErrorText.innerHTML = ""
	}
	else if(isEmpty(password)){
		console.log("Password field empty")
		usernameErrorText.innerHTML = ""
		passwordErrorText.innerHTML = "Password field can't be left empty"
		psswrd.className += " textBoxError"
		usrnme.className = initclass
	} 
	else if(isEmpty(username)){
		console.log("Username field empty")
		usernameErrorText.innerHTML = "Username field can't be left empty"
		passwordErrorText.innerHTML = ""
		psswrd.className = initclass
		usrnme.className += " textBoxError" 
	}
	else{
		data = {username, password, type: 'signup'}
			options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}	
		fetch('/signup', options)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				if (!data.successful){
					passwordErrorText.innerHTML = ""
					usernameErrorText.innerHTML = "The username has already been taken by a user"
					usrnme.className += " textBoxError"
					psswrd.className = initclass
					console.log("The current password is " + password)
				}
				else{
					formContainer.style.display = "none"
					successText.style.display = "block"
				}
			})
	}
})
