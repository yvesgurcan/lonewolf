import {combineReducers} from 'redux'

function CharacterSheet(State = null, Action) {

    let NewState = {...State}

    if (Action.type === "INIT") {
        NewState = {
            CombatSkill: "YO",
            Endurance: "",
        }
    }
    else if (Action.type === "LOAD_GAME") {
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
    else {
        NewState[Action.type] = Action.value
    }

    let GameState = {...NewState}
    delete GameState.GameState
    NewState.GameState = JSON.stringify({CharacterSheet: GameState})

    return NewState

}

export default combineReducers({
    CharacterSheet
})