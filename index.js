//Initialize web socket
const WebSocket = require('ws')
// const wss = new WebSocket.Server({ port: 8080 })
// wss.on('connection', ws => {
// 	ws.on('message', message => {
// 		console.log(`Received message => ${message}`)
// 	})
// 	ws.send('ho!')
// })

//Initialize app
const express = require('express')
const app = express()
app.listen(3000, ()=>{
	console.log("Listening at port 3000")
})
app.use(express.static('public'))
app.use(express.json({limit: "1mb"}))

//Initialize Database
const Datastore = require('nedb')
//const database = new Datastore("database.db")
const profileStore = new Datastore("profileStore.db")
profileStore.loadDatabase()

//Handle data from client-side login page
app.post('/login', (request, response)=>{
	console.log(request.body)
	let u = request.body.username
	let p = request.body.password
	profileStore.find({username: u}, (error, data) =>{		//Checks if username exists
		if(data.length == 0){			//Username doesnt exist
			response.json({
				successful: false,
				error: "username",
				comment: "Username does not exist"
			})
		}
		else{ 			//Username exists
			profileStore.find({username: u, password: p}, (error, data)=>{			//Checks if password matches username
				if(data.length == 0){				//Password doesnt match username
					response.json({
						successful: false,
						error: "password",
						comment: "Invalid Password"
					})
				}
				else{
					//console.log(data)
					response.json({
						username: u,
						successful: true,
						id: data[0]["_id"]
					})
				}
			})
		}
	})
})

//Handle data from client-side signup page
app.post('/signup', (request, response)=>{
	console.log(request.body)
	let u = request.body.username
	profileStore.find({username: u}, (error, data) =>{		//Checks if username already exists
		if(data.length == 0){					//Username doesn't exist and hence, profile can be created
			profileStore.insert({
				username: request.body.username,
				password: request.body.password,
				request: {
					incoming:	[],
					outgoing: []
				},
				friends: {
					//defaultFriend: [{message: "Default message", timeStamp: "Empty", type:"incoming/outgoing", status: "delivered/read/none"}]
				}
			})
			response.json({
				username: request.body.username,
				password: request.body.password,
				successful: true
			})
		}
		else{ 												//Username already exists
			console.log("Username already exists")
			response.json({
				successful: false,
				comment: "Username already exists"
			})
		}
	})
})

//Handle data from client-side profile page
app.post('/profile', (request, response)=>{
	// console.log(request.body)
	profileStore.find(request.body, (error, data)=>{
		if(data.length == 0){
			console.log("Not found")
			response.end()
		}
		else{
			console.log(data)
			response.json({
				username: data[0]["username"]
			})
		}
	})
})

//Handle data from friend search
app.post('/search', (request, response)=>{
	console.log(request.body)
	let text = new RegExp("^" + request.body.text)
	profileStore.find({username: text}, (error, data)=>{
		if(data.length == 0){
			console.log("Not found")
			response.json({
				successful: false,
				comment: "None Found"
			})
		}
		else{
			console.log(data)
			profileStore.findOne({username: request.body.user}, (error, data1)=>{
				let friends = [] 
				friends = Object.keys(data1.friends)
				// console.log("-------")
				// console.log(friends)
				let res = []
				for(let x of data){
					let counter = 0
					for(let y of friends){
						if(x.username != y){
							counter++
						}
					}
					if((x.username != request.body.user)&&(counter == friends.length)){
						res.push(x.username)
					}
				}
				response.json(res)
			})
		}
	})
})

//Handle friend requests
app.post('/friend-request', (request, response)=>{
	console.log(request.body)
	if (request.body.type == "send friend request"){
		profileStore.update({username: request.body.user}, {$addToSet: {"request.outgoing": request.body.friend}})
		profileStore.update({username: request.body.friend}, {$addToSet: {"request.incoming": request.body.user}})
		response.json({status: "successfully sent"})
	}
	else if(request.body.type == "cancel friend request"){
		profileStore.update({username: request.body.user}, {$pull: {"request.outgoing": request.body.friend}})
		profileStore.update({username: request.body.friend}, {$pull: {"request.incoming": request.body.user}})
		response.json({status: "successfully cancelled"})
	}
	else if(request.body.type == "fetch friend request list"){
		profileStore.findOne({username: request.body.user}, (error, data)=>{
			if(error){
				console.log(error)
				response.end()
			}else{
				console.log(data)
				response.json({requests: data.request.incoming})
			}
		})
	}
	else if(request.body.type == "reject friend request"){
		profileStore.update({username: request.body.user}, {$pull: {"request.incoming": request.body.friend}})
		profileStore.update({username: request.body.friend}, {$pull: {"request.outgoing": request.body.user}})
		response.json({status: "successfully removed from friend request list"})
	}
	else if(request.body.type == "accept friend request"){
		profileStore.update({username: request.body.user}, {$pull: {"request.incoming": request.body.friend}})
		profileStore.update({username: request.body.friend}, {$pull: {"request.outgoing": request.body.user}})
		let txt = "friends." + request.body.friend
		profileStore.update({username: request.body.user}, {$set: {[txt]: [{message: "", timeStamp: "", type: "", status: ""}]}})
		txt = "friends." + request.body.user
		profileStore.update({username: request.body.friend}, {$set: {[txt]: [{message: "", timeStamp: "", type: "", status: ""}]}})
		response.json({status: "successfully added friend"})
		// profileStore.update({username: request.body.user}, {$set: {[txt]: [{message: "testing 123", timeStamp: "worefa", type: "incoming/outgoing", status: "delivered/read"}]}})
	}
})

//Handle friends list requests
app.post('/friends-list', (request, response)=>{
	console.log(request.body)
	if (request.body.type == "fetch friends list"){
		profileStore.find({username: request.body.user}, {friends: 1, _id: 0}, (error, data)=>{
			if (error){
				console.log(error)
			}
			else{
				let data1 = {}
				Object.assign(data1, data[0].friends)
				console.log(Object.keys(data1))
				response.json(Object.keys(data1))
			}
		})
	}
	else if(request.body.type == "delete friend"){
		let txt = "friends." + request.body.friend
		profileStore.update({username: request.body.user}, {$unset: {[txt]: []}}, ()=>{
			response.json({status: "deleted"})
		})
	}
})

app.post('/chats', (request, response)=>{
//console.log(request.body)
	if(request.body.type == "fetch chats"){
		profileStore.findOne({username: request.body.user}, (error, data)=>{
			if(error){
				console.log(error)
			}
			else{
				//console.log(data)
				response.json(data.friends)
			}
		})
	}
	else if(request.body.type == "send chat"){
		let txt = "friends." + request.body.friend
		profileStore.update({username: request.body.user}, {$push: {[txt]: request.body.message}})
		txt = "friends." + request.body.user
		let reverseMesssage = {
			message: request.body.message.message,
			timeStamp: request.body.message.timeStamp,
			type: "incoming",
			status: "delivered"
		}
		profileStore.update({username: request.body.friend}, {$push: {[txt]: reverseMesssage}})
		response.json({status: "delivered"})
	}
})


