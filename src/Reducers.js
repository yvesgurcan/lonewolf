import {combineReducers} from 'redux'

function CharacterSheet(State = null, Action) {

    let NewState = {...State}

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
    else if (Action.type === "HEAL+1") {
        NewState.Endurance = Math.min(NewState.MaxEndurance || ++NewState.Endurance,++NewState.Endurance)
    }
    else {
        NewState[Action.type] = Action.value
    }

    if (Action.type === "CombatSkill") {
        NewState.CombatRatio = Action.value - State.EnemyCombatSkill
    }
    else if (Action.type === "EnemyCombatSkill") {
        NewState.CombatRatio = State.CombatSkill - Action.value
    }

    let GameState = {...NewState}
    delete GameState.GameState
    NewState.GameState = JSON.stringify({CharacterSheet: GameState})

    return NewState

}

export default combineReducers({
    CharacterSheet
})