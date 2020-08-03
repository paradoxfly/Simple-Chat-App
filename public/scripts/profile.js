//const { response } = require("express")
let chatHeader = document.getElementById("chat-header")
let CHAT = document.getElementById("chat")
let USERNAME

const profileName = document.getElementById("profile-name")
const profileID = location.search.slice(1)
console.log(profileID)
let data = {_id: profileID}
options = {
	method: 'POST',
	headers:{
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(data)
}	
fetch('/profile', options)
	.then(response => response.json())
	.then(data => {
		profileName.innerHTML = data.username
		USERNAME = data.username
		onLoad(USERNAME, chatHeader, CHAT)
		console.log(chatHeader.children)
		console.log("--------")
		console.log(CHAT.children)
		setTimeout(() => {
			chatInitiate()
			for(let x of CHAT.children){
				x.scrollTop = x.scrollHeight
			}
		}, 1000);
	})
	.catch(error => console.log(error))



const logOut = document.getElementById("log-out")
const startChat = document.getElementById("start-chat")
const chatBox = document.getElementById("chat-box")
let searchText = ","
const searchBox = document.getElementById("search-box")
const search = document.getElementById("search")
const searchButton = document.getElementById("search-button")
const addFriendsList = document.getElementById("add-friends-list")
const addFriend = document.getElementById("add-friend")
const friendRequestBox = document.getElementById("friend-request-box")
const friendRequest = document.getElementById("friend-request")
const friendRequestList = document.getElementById("friend-request-list")
const deleteFriendBox = document.getElementById("delete-friend-box")
const friendsList = document.getElementById("friends-list")
const deleteFriend = document.getElementById("delete-friend")

logOut.addEventListener("click", event =>{
	location.replace("/index.html")
})
startChat.addEventListener("click", event =>{
	if(chatBox.style.display == "none"){
		hideBlock(searchBox, friendRequestBox, deleteFriendBox); addFriend.innerHTML = "Add Friend"; friendRequest.innerHTML = "Friend Requests"; deleteFriend.innerHTML = "Delete Friend";
		chatBox.style.display = "block"
		startChat.innerHTML = "Close Chats"
		
	}
	else if(chatBox.style.display == "block"){
		chatBox.style.display = "none"
		startChat.innerHTML = "Open Chats"
	}
})
search.addEventListener("input", event=>{
	searchText = event.target.value
})
searchButton.addEventListener("click", event =>{
	removeAllChildNodes(addFriendsList)
	if(!isEmpty(searchText)){
		let data = {text: searchText, user: USERNAME}
		options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		fetch('/search', options)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				for(let x of data){
					let element = renderFriend(x, "plus")
					let child = element.childNodes[1]
					let classStore = element.className
					let childClassStore = "fa fa-pull-right fa-"
					addFriendsList.appendChild(element)
					element.addEventListener("click", event=>{
						element.className += " click"
						setTimeout(() => {
							let temp = child.className.length - 1
							let data
							element.className = classStore
							if(child.className[temp] == "s"){
								child.className = childClassStore + "check"
								data = {user: USERNAME, friend: x, type: "send friend request"}
							} else {
								child.className = childClassStore + "plus"
								data = {user: USERNAME, friend: x, type: "cancel friend request"}
							}
							options = {
								method: 'POST',
								headers:{
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(data)
							}
							fetch('/friend-request', options)
						}, 150);	
					})
				}
			})
			.catch(err => console.log(err))
	}
})
addFriend.addEventListener("click", event=>{
	if(searchBox.style.display == "none"){
		hideBlock(chatBox, friendRequestBox, deleteFriendBox); startChat.innerHTML = "Chat With Friends"; friendRequest.innerHTML = "Friend Requests"; deleteFriend.innerHTML = "Delete Friend";
		searchBox.style.display = "block"
		addFriend.innerHTML = "Close Add-Friends Panel"
	}
	else if(searchBox.style.display == "block"){
		searchBox.style.display = "none"
		addFriend.innerHTML = "Add Friend"
	}
})
friendRequest.addEventListener("click", event =>{
	if(friendRequestBox.style.display == "none"){
		hideBlock(chatBox, searchBox); startChat.innerHTML = "Chat With Friends"; addFriend.innerHTML = "Add Friend";
		friendRequestBox.style.display = "block"
		friendRequest.innerHTML = "Close Friend-Request Panel"
		removeAllChildNodes(friendRequestList)
		let data = {user: USERNAME, type: "fetch friend request list"}
		options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		fetch('/friend-request', options)
			.then(response=> response.json())
			.then(data => {
				console.log(data)
				for(let x of data.requests){
					let element = renderRequest(x, "user-times", "user-plus")
					console.log(element.childNodes)
					let reject = element.childNodes[1]
					let accept = element.childNodes[2]
					accept.style.cursor = "pointer"
					reject.style.cursor = "pointer"
					let classStore = element.className
					let childClassStore = "fa fa-pull-right fa-"
					friendRequestList.appendChild(element)
					accept.addEventListener("click", event =>{
						let newElement = renderFriend(x, "check")
						element.replaceWith(newElement)
						let data = { user: USERNAME, friend: x, type: "accept friend request"}
						let options = {
							method: 'POST',
							headers:{
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(data)
						}
						fetch('/friend-request', options)
							.then(response => response.json())
							.then(data => console.log(data))
							.catch(error => console.log(error))
					})
					reject.addEventListener("click", event =>{
						friendRequestList.removeChild(element)
						let data = { user: USERNAME, friend: x, type: "reject friend request"}
						let options = {
							method: 'POST',
							headers:{
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(data)
						}
						fetch('/friend-request', options)
						.then(response => response.json())
						.then(data => console.log(data))
						.catch(error => console.log(error))
					})
				}
				
			})
	}
	else if(friendRequestBox.style.display == "block"){
		friendRequestBox.style.display = "none"
		friendRequest.innerHTML = "Friend Requests"
	}
})
deleteFriend.addEventListener("click", event =>{
	if(deleteFriendBox.style.display == "none"){
		hideBlock(chatBox, friendRequestBox, searchBox); startChat.innerHTML = "Chat With Friends"; friendRequest.innerHTML = "Friend Requests"; addFriend.innerHTML = "Add Friend";
		deleteFriendBox.style.display = "block"
		deleteFriend.innerHTML = "Close Panel"
		removeAllChildNodes(friendsList)
		let data = {user: USERNAME, type: "fetch friends list"}
		options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		fetch('/friends-list', options)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				for (let name of data){
					let element = renderFriend(name, "times")
					let del = element.childNodes[1]
					del.style.cursor = "pointer"
					friendsList.appendChild(element)
					del.addEventListener("click", event =>{
						friendsList.removeChild(element)
						let data = {user: USERNAME, friend: name, type: "delete friend"}
						options = {
							method: 'POST',
							headers:{
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(data)
						}
						fetch('/friends-list', options)
							.then(response => response.json())
							.then(data => console.log(data))
					})
				}
			})
			.catch(error => console.log(error))
	}
	else if(deleteFriendBox.style.display == "block"){
		deleteFriendBox.style.display = "none"
		deleteFriend.innerHTML = "Delete Friend"
	}
})

let date = new Date()


//renderHeader(chatHeader, "Frey", "cont3", false, "./Pictures/IMG_0161.JPG")

let array = [
	{
		message: "Hello my niggi",
		timeStamp: date - 604800000,
		type: "outgoing",
		status: "read"
	},
	{
		message: "Hafa",
		timeStamp: date - 304800000,
		type: "incoming",
		status: "read"
	},
	{
		message: "I'm good bro",
		timeStamp: date - 301800000,
		type: "outgoing",
		status: "read"
	},
	{
		message: "Hello my niggi",
		timeStamp: date - 604800000,
		type: "incoming",
		status: "read"
	},
	{
		message: "Hello my niggi",
		timeStamp: date - 86400000,
		type: "outgoing",
		status: "read"
	},
	{
		message: "Hello my niggi",
		timeStamp: date - 86000,
		type: "outgoing",
		status: "delivered"
	}
]
//renderProfile(chatHeader, CHAT, "Adamu", array, "cont3", false, "./Pictures/IMG_0161.JPG")
const messageBox = document.getElementById("text-message")
const sendMessage = document.getElementById("send-message")
let messageText = ","
messageBox.addEventListener("input", event =>{
	messageText = event.target.value 
})
sendMessage.addEventListener("click", event =>{
	console.log(messageText)
	console.log("-----")
	let recipient = getActiveProfile(chatHeader)
	console.log("Recipient is " + recipient)
	//messageBox.value = ""
	let timeStamp = new Date()
	if(!isEmpty(messageText)){
		messageBox.value = ""
		addMessage(CHAT, chatHeader, messageText, timeStamp)
		console.log(CHAT.children)
		chatInitiate()
		let data = {user: USERNAME, friend: recipient, message: {message: messageText, timeStamp: timeStamp, type: "outgoing", status : "delivered"}, type: "send chat"}
		messageText = ","
		options = {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}	
		// fetch('/chats', options)
		// 	.then(response => response.json())
		// 	.then(data => console.log(data))
	}
})
//"Timothy":[{message:"", timeStamp:"", type:"incoming/outgoing", status: "delivered/read/none"}]
setTimeout(() => {
	setInterval(() => {
		refreshAllChats(CHAT)
	}, 2000);
}, 5000);