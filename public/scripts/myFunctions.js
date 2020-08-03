function isEmpty(field){		//Checks if a string is empty
	if((field === ",")||(field == "")){
		return true
	}
	else{
		return false
	}
}

function renderFriend(name, fontAwesomeButton){		//Creates a list item representing friend.. returns <li>
	let item = document.createElement("li")
	let button = document.createElement("span")
	item.className = "list-group-item item"
	button.className = "fa fa-pull-right fa-" + fontAwesomeButton
	item.textContent = name
	item.appendChild(button)
	return item
}
function renderRequest(name, fontAwesomeButton1, fontAwesomeButton2){		//Creates a list item representing friend.. returns <li>
	let item = document.createElement("li")
	let button1 = document.createElement("span")
	let button2 = document.createElement("span")
	item.className = "list-group-item item"
	button1.className = "fa fa-pull-right fa-" + fontAwesomeButton1
	button2.className = "fa fa-pull-right fa-" + fontAwesomeButton2
	item.textContent = name
	item.appendChild(button1)
	item.appendChild(button2)
	return item
}

function removeAllChildNodes(parent){
	while(parent.firstChild){
		parent.removeChild(parent.firstChild)
	}
}

function hideBlock(...block){
	console.log(arguments)
	for(let x of block){
		console.log(x)
		x.style.display = "none"
	}
}

function renderHeader(headerContainer, profileName, dataUp, isActive, pic){
	const dp = document.createElement("div")
	dp.className = isActive? "user-profile active" : "user-profile"
	dp.dataset.up = dataUp
	dp.id = profileName
	dp.style.backgroundImage = `url(${pic})`
	const name = document.createElement("span")
	name.textContent = profileName
	headerContainer.appendChild(dp)
	headerContainer.appendChild(name)
}

function renderChat(chat, chatArray, ID, isActive, profileName){
	let today = new Date()
	//"Timothy":[{message:"", timeStamp:"", type:"incoming/outgoing", status: "delivered/read/none"}]
	const chatContainer = document.createElement("div")
	chatContainer.dataset.name = profileName
	chatContainer.id = ID
	chatContainer.className = isActive? "chat-container active" : "chat-container"
	let timeStampCache = 0
	for(let x of chatArray){
		//console.log(x)
		if(timeStampCache != 0){
			if(isNewDay(x.timeStamp, timeStampCache)){
				const day = document.createElement("div")
				day.className = "day"
				day.innerHTML = relativeDay(today, x.timeStamp)
				chatContainer.appendChild(day)
			}
		}
		else if(timeStampCache == 0){
			const day = document.createElement("div")
			day.className = "day"
			day.innerHTML = relativeDay(today, x.timeStamp)
			chatContainer.appendChild(day)
		}
		timeStampCache = x.timeStamp
		const bubble = document.createElement("div"); 
		bubble.className = (x.type == "incoming")? "bubble" : "bubble bubble-alt"
		const message = document.createElement("p"); message.innerHTML = x.message
		const status = document.createElement("span")
		const dateStamp = document.createElement("span")
		dateStamp.className = x.type == "incoming"? "datestamp" : "datestamp dt-alt"
		dateStamp.innerHTML = x.timeStamp == ""? null : new Date(x.timeStamp).toLocaleTimeString()
		bubble.appendChild(message)
		if(x.type == "outgoing"){
			status.className = x.status == "delivered"? "fa fa-check" : "fa fa-registered"
			bubble.appendChild(status)
		}
		bubble.appendChild(dateStamp)
		chatContainer.appendChild(bubble)
		chatContainer.scrollTop = chatContainer.scrollHeight
	}
	chat.appendChild(chatContainer)
}

function renderProfile(headerContainer, chatContainer, profileName, chatArray, ID, isActive, pic){
	renderHeader(headerContainer, profileName, ID, isActive, pic)
	renderChat(chatContainer, chatArray, ID, isActive, profileName)
}
function isNewDay(time1, time2){
	let t1 = new Date(time1)
	let t2 = new Date(time2)
	let day1 = t1.getDay()
	let day2 = t2.getDay()
	if(day1 == day2){
		return false
	} else { return true	}
}

function weekDay(number){
	switch (number) {
		case 0:
			return "Sunday"
			break;
		case 1:
			return "Monday"
			break;
		case 2:
			return "Tuesday"
			break;
		case 3:
			return "Wednesday"
			break;
		case 4:
			return "Thursday"
			break;
		case 5:
			return "Friday"
			break;
		case 6:
			return "Saturday"
			break;
		default:
			break;
	}
}

function relativeDay(today, timeStamp){
	if (timeStamp == ""){
		return null
	}
	else{
			let day = new Date(timeStamp)
		let yesterday = (today.getDay() == 0)? 6 : today.getDay() - 1
		if ((today - day) < 604800000){
			switch (day.getDay()) {
				case today.getDay():
					return "Today"
					break;
				case yesterday:
					return "Yesterday"
					break;
				default:
					return day.toLocaleString()
					break;
			}
		}
		else {
			return day.toLocaleString()
		}
	}
	
}

function onLoad(USERNAME, chatHeader,chatContainer){
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
	let data = {user: USERNAME, type: "fetch chats"}
	options = {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}
	fetch('/chats', options)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			let friends = Object.keys(data)
			let cont = 1
			for(let name of friends){
				let isActive = cont == 1 ? true : false
				renderProfile(chatHeader, chatContainer, name, data[name], "cont" + cont, isActive, "./Pictures/IMG_0161.JPG")
				//renderProfile(chatHeader, chatContainer, name, array, "cont" + cont, isActive, "./Pictures/IMG_0161.JPG")
				cont ++
			}
		})
}

function getActiveProfile(chatHeader){
	let recipient = ""
	myLoop: for(let i = 0; i < chatHeader.children.length; i += 2){
		//console.log(chatHeader.children[i].className)
		let friend = new RegExp("active")
		if(friend.test(chatHeader.children[i].className)){
			recipient = chatHeader.children[i].id
			break myLoop;
		}
	}
	return recipient
}
function getActiveProfileID(chatHeader){
	let recipient = ""
	myLoop: for(let i = 0; i < chatHeader.children.length; i += 2){
		//console.log(chatHeader.children[i].className)
		let friend = new RegExp("active")
		if(friend.test(chatHeader.children[i].className)){
			recipient = chatHeader.children[i].dataset.up
			break myLoop;
		}
	}
	return recipient
}

function addMessage(chatContainer, chatHeader, text, timeStamp){
	let dataset = getActiveProfileID(chatHeader)
	console.log("the id is " + dataset)
	for(let profile of chatContainer.children){
		if(dataset == profile.id){
			const bubble = document.createElement("div"); 
			bubble.className = "bubble bubble-alt"
			const message = document.createElement("p"); message.innerHTML = text
			const status = document.createElement("span")
			const dateStamp = document.createElement("span")
			dateStamp.className = "datestamp dt-alt"
			dateStamp.innerHTML = new Date(timeStamp).toLocaleTimeString()
			bubble.appendChild(message)
			status.className = "fa fa-check"
			bubble.appendChild(status)
			bubble.appendChild(dateStamp)
			profile.appendChild(bubble)
			profile.scrollTop = profile.scrollHeight
			break;
		}
	}
}

function numberOfMessagesServer(allChats, friend){			//checks number of messages with friend, stored in server
	return allChats[friend].length 
}
function numberOfMessagesLocal(chatContainer, friend){   			//checks number of messages exchanged with friend
	for(let profile of chatContainer.children){
		if(profile.dataset.name == friend){
			let count = 0
			for(let child of profile.children){
				if(/bubble/.test(child.className)){
					count++
				}
			}
			return count
		}
	}
}
function checkForIncoming(chatContainer, serverChatsObject, friend){	//checks if new message got to server.. returns number of messages. 0 if none
	for(let profile of chatContainer.children){
		if(profile.dataset.name == friend){
			if(numberOfMessagesServer(serverChatsObject, friend)>numberOfMessagesLocal(chatContainer, friend)){
				return numberOfMessagesServer(serverChatsObject, friend)- numberOfMessagesLocal(chatContainer, friend)
			}
			else{
				return 0
			}
		}
	}
}
function refreshSingleChat(chatContainer, serverChatsObject, friend){	//Refreshes chat with friend
	for(let profile of chatContainer.children){
		if(profile.dataset.name == friend){
			let difference = checkForIncoming(chatContainer, serverChatsObject, friend)
			if (difference != 0){
				let chatArray = serverChatsObject[friend]
				let start = chatArray.length - difference 
				for(let i = start; i < chatArray.length; i++){
					appendToIncoming(profile, chatArray[i])
				}
			}
		}
	}
}
function appendToIncoming(profile, messageObject){			//Adds new incoming message to chat 
			const bubble = document.createElement("div"); 
			bubble.className = "bubble"
			const message = document.createElement("p"); message.innerHTML = messageObject.message
			const dateStamp = document.createElement("span")
			dateStamp.className = "datestamp"
			dateStamp.innerHTML = new Date(messageObject.timeStamp).toLocaleTimeString()
			bubble.appendChild(message)
			bubble.appendChild(dateStamp)
			profile.appendChild(bubble)
			profile.scrollTop = profile.scrollHeight
}
function refreshAllChats(chatContainer){			//Refreshes all chats
	let data = {user: USERNAME, type: "fetch chats"}
	options = {
		method: 'POST',
		headers:{
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}

	fetch('/chats', options)
	.then(response => response.json())
	.then(data => {
		let counter = 0
		let friends = Object.keys(data)
		for(let i = 0; i < friends.length; i++){
			refreshSingleChat(chatContainer, data, friends[i])
		}
		chatInitiate()
	})
}