import {combineReducers} from 'redux'

function GenerateFormattedDate(TimeInMilliseconds) {
return [
    [
        TimeInMilliseconds.getMonth()+1,
        TimeInMilliseconds.getDate(),
        TimeInMilliseconds.getFullYear(),
        ].join("/"),
        "at",
        [
        PadNumber(TimeInMilliseconds.getHours()),
        PadNumber(TimeInMilliseconds.getMinutes()),
        ].join(":")
    ].join(" ")
}

function PadNumber(NumberToPad) {
    if (NumberToPad < 10) {
        return "0" + NumberToPad
    }
    else {
        return NumberToPad
    }
}

const InitStateRequestFeedback = {
    error: false,
    message : "",
}

function RequestFeedback(State = InitStateRequestFeedback, Action) {

    let NewState = {...State}

    switch(Action.type) {
        case "UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK":
            NewState.actualGameID = Action.value
            // falls through
        case "UPDATE_GAME_ID_REQUEST_FEEDBACK":
            NewState.gameID = Action.value
            break
        case "UPDATE_PASSWORD_REQUEST_FEEDBACK":
            NewState.password = Action.value
            break
        case "UPDATE_VALIDATION_REQUEST_FEEDBACK":
            NewState.message = Action.value
            break
        case "UPDATE_REQUEST_FEEDBACK":
            NewState = {...NewState, ...Action.value}
            break

        case "INIT_REQUEST_FEEDBACK":
        default:
            break

    }

    return NewState

}

const InitState = {
    GameStarted: GenerateFormattedDate(new Date()),
}

function CharacterSheet(State = InitState, Action) {

    let NewState = {...State}

    if (Action.type.indexOf("REQUEST_FEEDBACK") > -1) {
        return NewState
    }

    // special actions
    if (Action.type === "INIT") {

        let storedState = localStorage.getItem("GameState")

        if (storedState !== null) {

            if (window.debugApp) {
                console.log(
                    ["Game loaded locally.\n",
                    "localStorage: ",storedState].join("")
                )    
            }

            NewState = JSON.parse(storedState).CharacterSheet
            
        }

    }
    else if (Action.type === "LOAD_GAME" || Action.type === "LOAD_GAME_FROM_API") {

        if (Action.value === "") {
            
            NewState = {...InitState}

            let GameState = {CharacterSheet: {...NewState}}

            NewState.GameState = JSON.stringify(GameState)
            localStorage.setItem("GameState", NewState.GameState)

            if (window.debugApp) {
                console.log(
                    ["Game reset locally.\n",
                    "localStorage: ",NewState.GameState].join("")
                )    
            }

            return NewState
        }

        NewState = JSON.parse(Action.value).CharacterSheet
        NewState.GameState = Action.value

        if (!NewState.GameStarted) {
            NewState.GameStarted = GenerateFormattedDate(new Date())
        }

        if (!NewState.GameSaved) {
            NewState.GameSaved = GenerateFormattedDate(new Date())
        }

        let GameState = {...NewState}
        delete GameState.GameState
        NewState.GameState = JSON.stringify({CharacterSheet: GameState})

        localStorage.setItem("GameState", NewState.GameState)

        if (window.debugApp) {
            if (Action.type === "LOAD_GAME") {
                console.log(
                    ["Game loaded locally from text area.\n",
                    "localStorage: ",NewState.GameState].join("")
                )
            }
        }
        
        return NewState
    }
    else if (Action.type === "MODIFY_GAME_STATE") {

        NewState.GameState = Action.value

        return NewState
    }
    else if (Action.type === "CLEAR_GAME_STATE") {
        NewState.GameState = ""
        return NewState
    }
    else if (Action.type === "UPDATE_BOOK") {
        NewState.Book = Action.value
    }
    else if (Action.type === "UPDATE_ENDURANCE") {
        NewState.EnemyEndurance = Math.max(0, NewState.EnemyEndurance - Action.value.enemy)
        NewState.Endurance = Math.max(0, NewState.Endurance - Action.valsue.lonewolf)
    }
    else if (Action.type === "CLEAR_ENEMY_STATS") {
        NewState.EnemyEndurance = ""
        NewState.EnemyCombatSkill = ""
        NewState.ImmunetoMindblast = false
    }
    else if (Action.type.indexOf("INCREMENT") > -1) {
        let property = Action.type.replace("INCREMENT_", "")
        NewState[property] = NewState[property] ? Math.floor(++NewState[property]) : 1
    }
    else if (Action.type.indexOf("DECREMENT") > -1) {
        let property = Action.type.replace("DECREMENT_", "")
        NewState[property] = NewState[property] ? Math.floor(Math.max(0,--NewState[property])) : 0
    }
    // default action
    else {
        if (isNaN(Number(Action.value)) || Action.value === "" || Action.value === true || Action.value === false) {
            NewState[Action.type] = Action.value            
        }
        else {
            NewState[Action.type] = Math.floor(Math.max(0, Number(Action.value)))
        }
    
    }

    // additional actions
    if (Action.type === "CombatSkill" || Action.type.indexOf("_CombatSkill") > -1) {
        NewState.CombatRatio = (Action.value || NewState.CombatSkill) - State.EnemyCombatSkill
    }
    else if (Action.type === "EnemyCombatSkill" || Action.type.indexOf("_EnemyCombatSkill") > -1) {
        NewState.CombatRatio = State.CombatSkill - (Action.value || NewState.EnemyCombatSkill)
    }
    else if (Action.type === "BeltPouch" || Action.type.indexOf("_BeltPouch") > -1) {
        NewState.BeltPouch = Math.min(50, NewState.BeltPouch)
    }
    else if (Action.type === "Endurance" || Action.type.indexOf("_Endurance") > -1) {

        NewState.Endurance = Math.min(NewState.MaxEndurance !== undefined && NewState.MaxEndurance !== "" ? NewState.MaxEndurance : NewState.Endurance, NewState.Endurance)


    }

    let GameState = {...NewState}
    delete GameState.GameState
    NewState.GameState = JSON.stringify({CharacterSheet: GameState})

    if (Action.type.indexOf("@@") === -1 && JSON.stringify(State) !== JSON.stringify(NewState)) {

        localStorage.setItem("GameState", NewState.GameState)

        /*if (window.debugApp) {
            console.log(
                ["Game saved locally.\n",
                "localStorage: ",NewState.GameState].join("")
            )
        }*/

        if (Action.API && NewState.Autosave) {

            // debugger

            // TODO: Grab gameID from RequestFeedback when saving.

            Action.API(Action.request || "savegame", {gameState: NewState.GameState}, false)            
        }

    }

    return NewState

}

export default combineReducers({
    RequestFeedback,
    CharacterSheet,
})