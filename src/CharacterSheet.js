import React, { Component } from 'react'
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'
import Reducers from './Reducers'

const store = createStore(
  Reducers,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const mapStateToProps = (state, ownProps) => {
    return {
        ...state,
        ...ownProps
    }
}

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <CharacterSheet/>
            </Provider>
        )
    }
}


class CharacterSheetView extends Component {
    render() {
        return (
            <View>
                <Header1>Character Sheet</Header1>
                <Section/>
                <HR/>
                <CombatSkill/>
                <Endurance/>
                <EnemyCombatSkill/>
                <EnemyEndurance/>
                <CombatRatio/>
                <RandomNumber/>
                <HR/>
                <Kai/>
                <Weapons/>
                <BeltPouch/>
                <Meals/>
                <Backpack/>
                <SpecialItems/>
                <HR/>
                <SaveAndLoad/>
            </View>
        )
    }
}
const CharacterSheet = connect(mapStateToProps)(CharacterSheetView)

class SaveAndLoadView extends Component {

    state = {gameId: null}

    loadGame = () => {
        this.props.dispatch({type: "LOAD_GAME", value: this.props.CharacterSheet.GameState})
    }
    modifyGameState = (input) => {
        this.props.dispatch({type: "MODIFY_GAME_STATE", value: input.value})
    }
    clear = () => {
        this.props.dispatch({type: "CLEAR_GAME_STATE"})
    }
    modifyRemoteGameId = (input) => {
        this.setState({gameId: input.value})
    }
    loadGameRemotely = () => {
        console.log("coming soon")
    }
    saveGameRemotely = () => {
        console.log("coming soon")
    }
    render() {
        return (
            <View>
                <Label>Game State</Label>
                <Input name="GameState" onChange={this.modifyGameState} box/>
                <Button onClick={this.loadGame}>Load  Local Game</Button>
                <Button onClick={this.clear}>Clear</Button>
                <Label>Remote Game ID</Label>
                <Input value={this.state.gameId} onChange={this.modifyRemoteGameId}/>
                <Button onClick={this.loadGameRemotely}>Load Game Remotely</Button>
                <Button onClick={this.saveGameRemotely}>Save Game Remotely</Button>
            </View>
        )
    }
}
const SaveAndLoad = connect(mapStateToProps)(SaveAndLoadView)

class Section extends Component {
    render() {
        return (
            <View>
                <Group name="Section"  type="number"/>
            </View>
        )
    }
}

class CombatSkill extends Component {
    render() {
        return (
            <View>
                <Group name="Base Combat Skill" type="number"/>
                <Group name="Combat Skill" type="number"/>
            </View>
        )
    }
}

class EnduranceView extends Component {
    HealIncrement = () => {
        this.props.dispatch({type: "HEAL+1"})
    }
    render() {
        return (
            <View>
                <Group name="Max Endurance" type="number" />
                <Group name="Endurance" type="number" />
                <Button onClick={this.HealIncrement}>Heal +1</Button>
            </View>
        )
    }
}
const Endurance = connect(mapStateToProps)(EnduranceView)

class EnemyCombatSkill extends Component {
    render() {
        return (
            <View>
                <Group name="Enemy Combat Skill"  type="number"/>
            </View>
        )
    }
}

class EnemyEndurance extends Component {
    render() {
        return (
            <View>
                <Group name="Enemy Endurance" type="number" />
            </View>
        )
    }
}

class CombatRatioView extends Component {
    render() {
        return (
            <View>
                <Label>Combat Ratio</Label>
                <TextWithInputFont>{this.props.CharacterSheet.CombatRatio || "-"}</TextWithInputFont>
            </View>
        )
    }
}
const CombatRatio = connect(mapStateToProps)(CombatRatioView)

class Kai extends Component {
    render() {
        return (
            <View>
                <Label>Kai Disciplines</Label>
                <View>
                    <Input name="Kai1" />
                </View>
                <View>
                    <Input name="Kai2" />
                </View>
                <View>
                    <Input name="Kai3" />
                </View>
                <View>
                    <Input name="Kai4" />
                </View>
                <View>
                    <Input name="Kai5" />
                </View>
                <View>
                    <Input name="Kai6" />
                </View>
                <View>
                    <Input name="Kai7" />
                </View>
                <View>
                    <Input name="Kai8" />
                </View>
                <View>
                    <Input name="Kai9" />
                </View>
                <View>
                    <Input name="Kai10" />
                </View>
            </View>
        )
    }
}

class WeaponsView extends Component {
    render() {
        return (
            <View>
                <Label>Weapons</Label>
                <View>
                    <Input name="Weapon1" />
                </View>
                <View>
                    <Input name="Weapon2" />
                </View>
            </View>
        )
    }
}
const Weapons = connect(mapStateToProps)(WeaponsView)

class BeltPouchView extends Component {
    render() {
        return (
            <View>
                <Group name="Belt Pouch" append="50 gold crowns maximum" type="number"/>
            </View>
        )
    }
}
const BeltPouch = connect(mapStateToProps)(BeltPouchView)

class MealsView extends Component {
    render() {
        return (
            <View>
            <Group name="Meals" type="number" />
            </View>
        )
    }
}
const Meals = connect(mapStateToProps)(MealsView)

class BackpackView extends Component {
    render() {
        return (
            <View>
                <Label>Backpack Items</Label>
                <View>
                    <Input name="BackpackItem1" />
                </View>
                <View>
                    <Input name="BackpackItem2" />
                </View>
                <View>
                    <Input name="BackpackItem3" />
                </View>
                <View>
                    <Input name="BackpackItem4" />
                </View>
                <View>
                    <Input name="BackpackItem5" />
                </View>
                <View>
                    <Input name="BackpackItem6" />
                </View>
                <View>
                    <Input name="BackpackItem7" />
                </View>
                <View>
                    <Input name="BackpackItem8" />
                </View>
            </View>
        )
    }
}
const Backpack = connect(mapStateToProps)(BackpackView)

class SpecialItemsView extends Component {
    render() {
        return (
            <View>
                <Label>Special Items</Label>
                <View>
                    <Input name="SpecialItem1" />
                </View>
                <View>
                    <Input name="SpecialItem2" />
                </View>
                <View>
                    <Input name="SpecialItem3" />
                </View>
                <View>
                    <Input name="SpecialItem4" />
                </View>
                <View>
                    <Input name="SpecialItem5" />
                </View>
                <View>
                    <Input name="SpecialItem6" />
                </View>
                <View>
                    <Input name="SpecialItem7" />
                </View>
                <View>
                    <Input name="SpecialItem8" />
                </View>
            </View>
        )
    }
}
const SpecialItems = connect(mapStateToProps)(SpecialItemsView)

class RandomNumber extends Component {

    state = {number: "-"}

    generateNumber = () => {
        let randomizer = [
            1,5,7,3,6,9,0,1,7,9,
            3,9,2,8,1,7,4,9,7,8,
            6,1,0,7,3,0,5,4,6,7,
            0,2,8,9,2,9,6,0,2,4,
            5,9,6,4,8,2,8,5,6,3,
            0,3,1,3,9,7,5,0,1,5,
            5,8,2,5,1,3,6,4,3,9,
            7,0,4,8,6,4,5,1,4,2,
            4,6,8,3,2,0,1,7,2,5,
            8,3,7,0,9,6,2,4,8,1,
        ]
        let random = Math.floor(Math.random() * randomizer.length)
        this.setState({number: randomizer[random]})
    }
    render() {
        return (
            <View>
                <Label>Random Number</Label>
                <TextWithInputFont>{this.state.number}</TextWithInputFont>
                <Button onClick={this.generateNumber}>Generate Number</Button>
            </View>
        )
    }
}

class Group extends Component {
    render() {
        return (
            <View>
                <Label>{this.props.name}{this.props.append ? <Text> ({this.props.append})</Text> : null}</Label>
                <Input
                    name={this.props.name.replace(/ /g,"")}
                    type={this.props.type}
                />
            </View>
        )
    }
}

class InputView extends Component {
    onChange = (input) => {
        if (this.props.onChange) {
            return this.props.onChange(input.target)
        }
        this.props.dispatch({type: this.props.name, value: input.target.value})
    }
    onClick = (input) => {
        input.target.select()
    }
    render() {
        if (this.props.box) {
            return (
                <View style={{marginBottom: "2px"}}>
                    <textarea
                        style={{width: "98%", height: "200px", padding: "2px"}}
                        value={this.props.CharacterSheet[this.props.name] || this.props.value || ""}
                        onChange={this.onChange}
                        onClick={this.onClick}
                    />
                </View>
            )
        }
        return (
            <View style={{marginBottom: "2px"}}>
                <input
                    style={{width: "98%", padding: "2px"}}
                    value={this.props.CharacterSheet[this.props.name] || this.props.value || ""}
                    type={this.props.type}
                    onChange={this.onChange}
                    onClick={this.onClick}
                />
            </View>
        )
    }
}
const Input = connect(mapStateToProps)(InputView)

class Label extends Component {
    render() {
        return (
            <View style={{marginTop: "10px"}}>
                <label style={{fontWeight: "bold"}}>{this.props.children}:</label>
            </View>
        )
    }
}

class Button extends Component {
    onClick = (input) => {
        if (!this.props.onClick) return false
        this.props.onClick(input.target)
    }
    render() {
        return (
            <View style={{marginTop: "10px"}}>
                <button onClick={this.onClick}>{this.props.children}</button>
            </View>
        )
    }
}

class Header1 extends Component {
    render() {
        return (
            <h1>{this.props.children}</h1>
        )
    }
}

class View extends Component {
    render() {
        return (
            <div {...this.props}/>
        )
    }
}

class Text extends Component {
    render() {
        return (
            <span {...this.props}/>
        )
    }
}

class TextWithInputFont extends Component {
    render() {
        return (
            <Text className="input-font" {...this.props}/>
        )
    }
}

class HR extends Component {
    render() {
        return (
            <hr/>
        )
    }
}