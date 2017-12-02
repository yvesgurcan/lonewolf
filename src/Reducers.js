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

const InitState = {
    GameStarted: GenerateFormattedDate(new Date()),
}

function CharacterSheet(State = InitState, Action) {

    let NewState = {...State}

    // special actions
    if (Action.type === "LOAD_GAME") {
        NewState = JSON.parse(Action.value).CharacterSheet
        NewState.GameState = Action.value
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
        NewState.EnemyEndurance -= Action.value.enemy
        NewState.Endurance -= Action.value.lonewolf
    }
    else if (Action.type === "CLEAR_ENEMY_STATS") {
        NewState.EnemyEndurance = ""
        NewState.EnemyCombatSkill = ""
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
        if (isNaN(Number(Action.value)) || Action.value === "") {
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

    let GameState = {...NewState}
    delete GameState.GameState
    NewState.GameState = JSON.stringify({CharacterSheet: GameState})

    return NewState

}

export default combineReducers({
    CharacterSheet
})