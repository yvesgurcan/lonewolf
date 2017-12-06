const DOC = require('dynamodb-doc')
const dynamo = new DOC.DynamoDB()
const password = "ENTER_PASSWORD_HERE"
let gameID = null

exports.handler = (event, context, callback) => {
    
    if (event.password !== password) {
       callback(null, {error: true, message: "Incorrect password."}) 
    }
    else if (event.method === "get") {
        dynamo.getItem({TableName:"lonewolf", Key:{gameID: event.gameID}}, handleLoadGame)
    }
    else if (event.method === "post") {
        if (event.gameID !== undefined) {
            gameID = event.gameID
            dynamo.putItem({TableName:"lonewolf", Item:{gameID: String(gameID), gameState: event.gameState}}, handleSaveGame)
        }
        else {
            dynamo.scan({TableName: "lonewolf", AttributesToGet: ["gameID"]}, handleGameIDs)
        }
    }
    else {
        callback(null, {error: true, message: "Bad request: invalid method '" + event.method + "' parameter."})
    }
    
    function handleLoadGame(error, data) {
        if (error) {
            callback(null, {error: true, message: "Sorry, an error occurred.", errorDetails: error})
        }
        else {
            
            if (data.Item == null) {
                callback(null, {error: true, message: "Invalid game ID."})
            }
            else {
                callback(null, {gameState: data.Item.gameState})
            }
        }
    }
    
    function handleSaveGame(error, data) {
        if (error) {
            callback(null, {error: true, message: "Sorry, an error occurred.", errorDetails: error})
        }
        else {
            callback(null, {gameID: gameID})
        }
    }
    
    function handleGameIDs(error, data) {
        if (error) {
            callback(null, {error: true, message: "Sorry, an error occurred.", errorDetails: error})
        }
        else {
            
            let IDs = data.Items.map(function(item) {return Number(item.gameID)})
            
            if (IDs.length === 0) {
                gameID = 1          
            }
            else {
                gameID = Math.max(...IDs)+1
            }
            
            if (isNaN(gameID)) {
                gameID = Math.floor(Math.random*999)/999
            }
            
            
            dynamo.putItem({TableName:"lonewolf", Item:{gameID: String(gameID), gameState: event.gameState}}, handleSaveGame)
        }
    }
    
}