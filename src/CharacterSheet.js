import React, { Component } from 'react'
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'
import Reducers from './Reducers'

const store = createStore(
  Reducers,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.debugApp = true

let APItimeout = null

const mapStateToProps = (state, ownProps) => {
    return {
        ...state,
        ...ownProps,
        API(request, dispatch, gameState = null) {

            // get payload from state (optionally, gameState can be passed as an argument)
            let payload = {
                password: state.RequestFeedback.password === undefined ? undefined : String(state.RequestFeedback.password),
                gameID: state.RequestFeedback.gameID === undefined ? "" : String(state.RequestFeedback.gameID),
                gameState: gameState || state.CharacterSheet.GameState,
            }

            // debug
            if (window.debugApp && request === "loadgame") {

                console.log(
                    ["Load game API request.\n",
                    "Request payload: "].join(""), payload
                )
            }
            else if (window.debugApp && request === "savegame") {

                console.log(
                    ["Save game API request.\n",
                    "Request payload: "].join(""), payload
                )
            }

            // validation
            if (!payload.password) {

                if (window.debugApp) {
                    console.error("Can't send API request without a password.")
                }

                // autosave
                if (gameState != null) {
                    APItimeout = setTimeout(function() {
                        store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "You must enter the password to save automatically."})
                    }, 200)
                }

                return null
            }

            // autosave
            if (gameState != null) {

                clearTimeout(APItimeout)

                APItimeout = setTimeout(function() {
                    store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Saving..."})
                }, 50)

                
            }

            // parameters
            let url = "https://qdrc7541jc.execute-api.us-west-2.amazonaws.com/dev"
            let parameters = {}

            if (request === "loadgame") {

                url += "?gameID=" + (String(payload.gameID) || "") + "&password=" + (encodeURIComponent(String(payload.password)) || "")

                parameters = {
                    method: "get",
                    body: null,
                }

            }
            else if (request === "savegame") {
                let headers = new Headers()
                headers.append("Content-Type","application/json")

                parameters = {
                    headers: headers,
                    method: "post",
                    body: JSON.stringify(payload),
                }

            }
            else {

                if (window.debugApp) {

                    console.error("Unexpected request '" + request + "'. Unable to configure the request parameters.")
                }

                return null
            }

            // request
            fetch(url, parameters)
            .then(function(response) {

                return response.json()   

            }).then(function(responseContent) {

                // custom server error (ok = true)
                if (responseContent.error) {

                    clearTimeout(APItimeout)

                    return store.dispatch({type: "UPDATE_REQUEST_FEEDBACK", value: responseContent})

                }
                // success
                else {

                    store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Success!"})

                    APItimeout = setTimeout(function() {
                        store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: null})
                    }, 5000)

                    // response
                    handleResponse(request, responseContent, payload, dispatch)

                }

                

            }).catch(function(error) {

                // offline
                if(!navigator.onLine) {
                    return store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Request error: You are offline."})
                }

                // server error
                store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Request error: " + error.message + "."})

            })

            function handleResponse(request, responseContent, payload, dispatch) {

                if (window.debugApp) {

                    console.log(
                        ["API response resolved successfully.\n",
                        "Response content: "].join(""), responseContent
                    )

                }

                if (request === "loadgame" && dispatch) {
                    // replace value by actual response
                    store.dispatch({type: "LOAD_GAME_FROM_API", value: responseContent.gameState})
                    store.dispatch({type: "UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK", value: payload.gameID})
                }

                if (request === "savegame" && dispatch) {

                    // deleted game
                    if (responseContent.deleted) {
                        return store.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Game with ID '" + payload.gameID + "' was successfully deleted."})
                    }

                    
                }
                else if (request === "savegame") {
                    store.dispatch({type: "UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK", value: responseContent.gameID})
                }

            }
        },
        BookGroups: [
            {
                name: "Kai",
                position: 1
            },
            {
                name: "Magnakai",
                position: 7
            },
            {
                name: "Grand Master",
                position: 15
            },
        ],
        Books: [
            {
                name: "Select Book",
                url: null,
            },
            {
                name: "Flight from the Dark",
                url: "https://www.projectaon.org/en/xhtml/lw/01fftd/",
            },
            {
                name: "Fire on the Water",
                url: "https://www.projectaon.org/en/xhtml/lw/02fotw/",
            },
            {
                name: "The Caverns of Kalte",
                url: "https://www.projectaon.org/en/xhtml/lw/03tcok/",
            },
            {
                name: "The Chasm of Doom",
                url: "https://www.projectaon.org/en/xhtml/lw/04tcod/",
            },
            {
                name: "Shadow on the Sand",
                url: "https://www.projectaon.org/en/xhtml/lw/05sots/",
            },
            {
                name: "The Kingdoms of Terror",
                url: "https://www.projectaon.org/en/xhtml/lw/06tkot/",
            },
            {
                name: "Castle Death",
                url: "https://www.projectaon.org/en/xhtml/lw/07cd/",
            },
            {
                name: "The Jungle of Horrors",
                url: "https://www.projectaon.org/en/xhtml/lw/08tjoh/",
            },
            {
                name: "The Cauldron of Fear",
                url: "https://www.projectaon.org/en/xhtml/lw/09tcof/",
            },
            {
                name: "The Dungeons of Torgar",
                url: "https://www.projectaon.org/en/xhtml/lw/10tdot/",
            },
            {
                name: "The Prisoners of Time",
                url: "https://www.projectaon.org/en/xhtml/lw/11tpot/",
            },
            {
                name: "The Masters of Darkness",
                url: "https://www.projectaon.org/en/xhtml/lw/12tmod/",
            },
            {
                name: "The Plague Lords of Ruel",
                url: "https://www.projectaon.org/en/xhtml/lw/13tplor/",
            },
            {
                name: "The Captives of Kaag",
                url: "https://www.projectaon.org/en/xhtml/lw/14tcok/",
            },
            {
                name: "The Dark Crusade",
                url: "https://www.projectaon.org/en/xhtml/lw/15tdc/",
            },
            {
                name: "The Legacy of Vashna",
                url: "https://www.projectaon.org/en/xhtml/lw/16tlov/",
            },
            {
                name: "The Deathlord of Ixia",
                url: "https://www.projectaon.org/en/xhtml/lw/17tdoi/",
            },
            {
                name: "Dawn of the Dragons",
                url: "https://www.projectaon.org/en/xhtml/lw/18dotd/",
            },
            {
                name: "Wolf's Bane",
                url: "https://www.projectaon.org/en/xhtml/lw/19wb/",
            },
            {
                name: "The Curse of Naar",
                url: "https://www.projectaon.org/en/xhtml/lw/20tcon/",
            },
        ],
        BookURLs: {
            toc: "toc.htm",
            map: "map.htm",
            section: {prepend: "sect", append: ".htm"}
        },
        KaiLevels: [
            {name: "Initiate"},
            {name: "Aspirant"},
            {name: "Guardian"},
            {name: "Warmarn or Journeyman"},
            {name: "Savant"},
            {name: "Master"},
        ],
        KaiDisciplines: [
            {
                name: "",
            },
            {
                name: "Camouflage",
            },
            {
                name: "Hunting: no need for a Meal when instructed to eat",
            },
            {
                name: "Sixth Sense",
            },
            {
                name: "Tracking",
            },
            {
                name: "Healing: +1 ENDURANCE point for each section without combat",
            },
            {
                name: "Mindshield: no points lost when attacked by Mindblast",
            },
            {
                name: "Mindblast: +2 COMBAT SKILL points",
                CombatSkill: 2,
            },
            {
                name: "Animal Kinship",
            },
            {
                name: "Mind Over Matter",
            },
            {
                name: "Weaponskill in Dagger +2 COMBAT SKILL points if this weapon carried",
                weapon: "Dagger",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Spear +2 COMBAT SKILL points if this weapon carried",
                weapon: "Spear",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Mace +2 COMBAT SKILL points if this weapon carried",
                weapon: "Mace",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Short Sword +2 COMBAT SKILL points if this weapon carried",
                weapon: "Short Sword",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Warhammer +2 COMBAT SKILL points if this weapon carried",
                weapon: "Warhammer",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Sword +2 COMBAT SKILL points if this weapon carried",
                weapon: "Sword",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Axe +2 COMBAT SKILL points if this weapon carried",
                weapon: "Axe",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Quarterstaff +2 COMBAT SKILL points if this weapon carried",
                weapon: "Quarterstaff",
                CombatSkill: 2,
            },
            {
                name: "Weaponskill in Broadsword +2 COMBAT SKILL points if this weapon carried",
                weapon: "Broadsword",
                CombatSkill: 2,
            },
        ],
        BackpackItems: [
            "Meal"
        ],
        generateRandomNumber() {
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
            return randomizer[random]
        },
        fight(number, CombatRatio) {
            let results = {
                minus11: [
                    {enemy: 6, lonewolf: 0},
                    {enemy: 0, lonewolf: "dead"},
                    {enemy: 0, lonewolf: "dead"},
                    {enemy: 0, lonewolf: 8},
                    {enemy: 0, lonewolf: 8},
                    {enemy: 1, lonewolf: 7},
                    {enemy: 2, lonewolf: 6},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 4},
                    {enemy: 5, lonewolf: 3},
                ],
                minus10: [
                    {enemy: 7, lonewolf: 0},
                    {enemy: 0, lonewolf: "dead"},
                    {enemy: 0, lonewolf: 8},
                    {enemy: 0, lonewolf: 7},
                    {enemy: 1, lonewolf: 7},
                    {enemy: 2, lonewolf: 6},
                    {enemy: 3, lonewolf: 6},
                    {enemy: 4, lonewolf: 5},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                ],
                minus8: [
                    {enemy: 8, lonewolf: 0},
                    {enemy: 0, lonewolf: 8},
                    {enemy: 0, lonewolf: 7},
                    {enemy: 1, lonewolf: 6},
                    {enemy: 2, lonewolf: 6},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 5},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 2},
                ],
                minus6: [
                    {enemy: 9, lonewolf: 0},
                    {enemy: 0, lonewolf: 6},
                    {enemy: 1, lonewolf: 6},
                    {enemy: 2, lonewolf: 5},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 4},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 2},
                    {enemy: 8, lonewolf: 0},
                ],
                minus4: [
                    {enemy: 10, lonewolf: 0},
                    {enemy: 1, lonewolf: 6},
                    {enemy: 2, lonewolf: 5},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 4},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 2},
                    {enemy: 8, lonewolf: 1},
                    {enemy: 9, lonewolf: 0},
                ],
                minus2: [
                    {enemy: 11, lonewolf: 0},
                    {enemy: 2, lonewolf: 5},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 4},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 2},
                    {enemy: 8, lonewolf: 2},
                    {enemy: 9, lonewolf: 1},
                    {enemy: 10, lonewolf: 0},
                ],
                0: [
                    {enemy: 12, lonewolf: 0},
                    {enemy: 3, lonewolf: 5},
                    {enemy: 4, lonewolf: 4},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 2},
                    {enemy: 8, lonewolf: 2},
                    {enemy: 9, lonewolf: 1},
                    {enemy: 10, lonewolf: 0},
                    {enemy: 11, lonewolf: 0},
                ],
                2: [
                    {enemy: 14, lonewolf: 0},
                    {enemy: 4, lonewolf: 5},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 3},
                    {enemy: 8, lonewolf: 2},
                    {enemy: 9, lonewolf: 2},
                    {enemy: 10, lonewolf: 1},
                    {enemy: 11, lonewolf: 0},
                    {enemy: 12, lonewolf: 0},
                ],
                4: [
                    {enemy: 16, lonewolf: 0},
                    {enemy: 5, lonewolf: 4},
                    {enemy: 6, lonewolf: 3},
                    {enemy: 7, lonewolf: 3},
                    {enemy: 8, lonewolf: 2},
                    {enemy: 9, lonewolf: 2},
                    {enemy: 10, lonewolf: 2},
                    {enemy: 11, lonewolf: 1},
                    {enemy: 12, lonewolf: 0},
                    {enemy: 14, lonewolf: 0},
                ],
                6: [
                    {enemy: 18, lonewolf: 0},
                    {enemy: 6, lonewolf: 4},
                    {enemy: 7, lonewolf: 3},
                    {enemy: 8, lonewolf: 3},
                    {enemy: 9, lonewolf: 2},
                    {enemy: 10, lonewolf: 2},
                    {enemy: 11, lonewolf: 1},
                    {enemy: 12, lonewolf: 0},
                    {enemy: 14, lonewolf: 0},
                    {enemy: 16, lonewolf: 0},
                ],
                8: [
                    {enemy: "dead", lonewolf: 0},
                    {enemy: 7, lonewolf: 4},
                    {enemy: 8, lonewolf: 3},
                    {enemy: 9, lonewolf: 2},
                    {enemy: 10, lonewolf: 2},
                    {enemy: 11, lonewolf: 2},
                    {enemy: 12, lonewolf: 1},
                    {enemy: 14, lonewolf: 0},
                    {enemy: 16, lonewolf: 0},
                    {enemy: 18, lonewolf: 0},
                ],
                10: [
                    {enemy: "dead", lonewolf: 0},
                    {enemy: 8, lonewolf: 3},
                    {enemy: 9, lonewolf: 3},
                    {enemy: 10, lonewolf: 2},
                    {enemy: 11, lonewolf: 2},
                    {enemy: 12, lonewolf: 2},
                    {enemy: 14, lonewolf: 1},
                    {enemy: 16, lonewolf: 0},
                    {enemy: 18, lonewolf: 0},
                    {enemy: "dead", lonewolf: 0},
                ],
                11: [
                    {enemy: "dead", lonewolf: 0},
                    {enemy: 9, lonewolf: 3},
                    {enemy: 10, lonewolf: 2},
                    {enemy: 11, lonewolf: 2},
                    {enemy: 12, lonewolf: 2},
                    {enemy: 14, lonewolf: 1},
                    {enemy: 16, lonewolf: 1},
                    {enemy: 18, lonewolf: 0},
                    {enemy: "dead", lonewolf: 0},
                    {enemy: "dead", lonewolf: 0},
                ],

            }
            results.minus9 = results.minus10
            results.minus7 = results.minus8
            results.minus5 = results.minus6
            results.minus3 = results.minus4
            results.minus1 = results.minus2
            results[1] = results[2]
            results[3] = results[4]
            results[5] = results[6]
            results[7] = results[8]
            results[9] = results[10]

            return results[String(Math.max(-11,Math.min(CombatRatio,11))).replace("-","minus")][number]
        },
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

    componentDidMount() {
        console.log("Set debugApp to true to see game state data.")

        this.props.dispatch({type: "INIT"})
        this.props.dispatch({type: "INIT_REQUEST_FEEDBACK"})

    }

    render() {
        return (
            <View>
                <Header1>Character Sheet</Header1>
                <LinkToProject/>
                <HR/>
                <GameMetaData/>
                <HR/>
                <Book/>
                <HR/>
                <Endurance/>
                <HR/>
                <Combat/>
                <HR/>
                <Weapons/>
                <HR/>
                <Kai/>
                <BeltPouch/>
                <Meals/>
                <HR/>
                <Backpack/>
                <HR/>
                <SpecialItems/>
                <HR/>
                <Notes/>
                <HR/>
                <GameState/>
                <HR/>
                <SaveAndLoadRemotely/>
                <Spacer/>
            </View>
        )
    }
}
const CharacterSheet = connect(mapStateToProps)(CharacterSheetView)

class LinkToProject extends Component {
    render() {
        return (
            <View>
                <Link href="https://www.projectaon.org/en/Main/Books" target="_blank">Project Aon</Link>
            </View>
        )
    }
}

class GameMetaDataView extends Component {

    state = {hideDetails: false}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Game ID</Label>
                <View hidden={this.state.hideDetails}>
                    <Text>{this.props.RequestFeedback.actualGameID !== undefined ? String(this.props.RequestFeedback.actualGameID) : "-"}</Text>
                    <Label>Game Started</Label>
                    <Text>{this.props.CharacterSheet.GameStarted}</Text>
                    <Label>Game Last Saved</Label>
                    <Text>{this.props.CharacterSheet.GameSaved || "-"}</Text>
                </View>
            </View>
        )
    }
}
const GameMetaData = connect(mapStateToProps)(GameMetaDataView)

class BookView extends Component {

    state = {hideDetails: false}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    onChange = (input) => {
        let bookNumber = 0
        let Book = this.props.Books.filter((book, index) => {

            if (book.name === index + " - " + input.value) {
                bookNumber = index
                return true
            }
            return false
        })[0]

        Book = {...Book, number: bookNumber}

        this.props.dispatch({type: "UPDATE_BOOK", value: Book, API: this.props.API, save: true})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Book</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="Book" value={this.props.CharacterSheet.Book ? this.props.CharacterSheet.Book.name : null} select={this.props.Books} optGroups={this.props.BookGroups} showIndex onChange={this.onChange}/>
                    {this.props.CharacterSheet.Book ? <BookLinks/> : null}
                    <Section/>
                </View>
            </View>
        )
    }
}
const Book = connect(mapStateToProps)(BookView)

class BookLinksView extends Component {

    render() {
        return (
            <View>
                <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.toc}>Table of Contents</Link>
                {" "}|{" "}
                <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.map}>Map</Link>
            </View>
        )
    }
}
const BookLinks = connect(mapStateToProps)(BookLinksView)

class SectionView extends Component {
    render() {
        return (
            <View>
                <Group name="Section" type="number" numbers noPlusAndMinus/>
                {this.props.CharacterSheet.Book && this.props.CharacterSheet.Section ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.section.prepend + this.props.CharacterSheet.Section + this.props.BookURLs.section.append}>Go to Section</Link> : null}
            </View>
        )
    }
}
const Section = connect(mapStateToProps)(SectionView)

class EnduranceView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    getBonuses = (returnRawData) => {

        let bonuses = []
        let bonusValues = []
        let {CharacterSheet} = {...this.props}

        // bonuses from special items
        for (let i = 1; i <= 16; i++) {
            let item = CharacterSheet["SpecialItem" + i]
            if (item !== undefined && item.length > 0) {
                let bonusTextIndex = item.toLowerCase().indexOf("endurance")
                if (bonusTextIndex > -1) {
                    let bonusValueIndex = item.substring(Math.min(bonusTextIndex-5, bonusTextIndex),item.length).indexOf("+")
                    if (bonusValueIndex > -1) {
                        let bonusValueAbsoluteIndex = bonusTextIndex-Math.min(5, bonusTextIndex)+bonusValueIndex
                        let bonusValue = item.substring(bonusValueAbsoluteIndex,bonusValueAbsoluteIndex+3)
                        bonuses.push(<Text key={Math.random()}>+{Number(Math.floor(bonusValue))}&nbsp;(special&nbsp;item) </Text>)
                        bonusValues.push(Number(Math.floor(bonusValue)))
                    }
                }
            }
        }
        
        if (returnRawData === true) {
            return bonusValues
        }

        return bonuses.map(bonus => {return bonus})
    }

    addBonus = () => {
        
         let bonuses = this.getBonuses(true)
 
         this.props.dispatch({type: "MaxEndurance", value: (this.props.CharacterSheet.MaxEndurance || 0) + (bonuses.length > 0 ? bonuses.reduce((sum, value) => {return sum+value}) : 0), API: this.props.API, save: true})
 
     }

     toMax = () => {

        this.props.dispatch({type: "Endurance", value: this.props.CharacterSheet.MaxEndurance || 0, API: this.props.API, save: true})

        if (this.props.CharacterSheet.MaxEndurance === "" || this.props.CharacterSheet.MaxEndurance === undefined) {
            this.props.dispatch({type: "MaxEndurance", value: 0})
        }
        
     }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Max Endurance</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="MaxEndurance" type="number" />
                    <Text>{this.getBonuses()}</Text>
                    <Group name="Endurance" type="number" negativeNumbers/>
                    <Button onClick={this.toMax} style={{marginRight: "5px"}} inline>Heal to Max</Button>
                </View>
            </View>
        )
    }
}
const Endurance = connect(mapStateToProps)(EnduranceView)

class Combat extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <CombatSkill/>
                <HR/>
                <Label onClick={this.toggleDetails}>Enemy Combat Skill</Label>
                <View hidden={this.state.hideDetails}>
                    <EnemyCombatSkill/>
                    <EnemyEndurance/>
                    <EnemyImmunity/>
                    <CombatRatio/>
                </View>
            </View>
        )
    }
}

class CombatSkillView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    getBonuses = (returnRawData) => {

        let bonuses = []
        let bonusValues = []
        let {CharacterSheet, KaiDisciplines} = {...this.props}

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number <= 6) {
            // bonuses from kai disciplines
            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Kai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("mindblast") > -1 && kaiDiscipline.toLowerCase().indexOf("mindshield") === -1 && !this.props.CharacterSheet.ImmunetoMindblast) {
                        bonuses.push(<Text key={Math.random()}>+2&nbsp;(mindblast) </Text>)
                        bonusValues.push(2)
                    }
                    else if (kaiDiscipline.toLowerCase().indexOf("weaponskill") > -1) {
                        for (let x = 1; x <= 2; x++) {
                            let weapon = CharacterSheet["Weapon" + x]
                            let weaponSkill = KaiDisciplines.filter(function(kai) {
                                // special case: do not consider a "short sword" as a regular sword
                                if (weapon && (weapon.toLowerCase().indexOf("short sword") > -1) && kai.weapon && kai.weapon.toLowerCase() === "sword") {
                                    return false
                                }
                                return kai.name === kaiDiscipline && kai.weapon && weapon && weapon.toLowerCase().indexOf(kai.weapon.toLowerCase()) > -1 
                            })
                            if (weaponSkill.length > 0) {
                                bonuses.push(<Text key={Math.random()}>+2&nbsp;(weaponskill:&nbsp;{weapon}) </Text>)
                                bonusValues.push(2)
                                break
                            }
                        }
                    }
                }
            }
        }

        // bonuses from special items
        for (let i = 1; i <= 16; i++) {
            let item = CharacterSheet["SpecialItem" + i]
            if (item !== undefined && item.length > 0) {
                let bonusTextIndex = item.toLowerCase().indexOf("combat skill")
                if (bonusTextIndex > -1) {
                    let bonusValueIndex = item.substring(Math.min(bonusTextIndex-5, bonusTextIndex),item.length).indexOf("+")
                    if (bonusValueIndex > -1) {
                        let bonusValueAbsoluteIndex = bonusTextIndex-Math.min(5, bonusTextIndex)+bonusValueIndex
                        let bonusValue = item.substring(bonusValueAbsoluteIndex,bonusValueAbsoluteIndex+3)
                        bonuses.push(<Text key={Math.random()}>+{Number(Math.floor(bonusValue))}&nbsp;(special&nbsp;item) </Text>)
                        bonusValues.push(Number(Math.floor(bonusValue)))
                    }
                }
            }
        }

        if (returnRawData === true) {
            return bonusValues
        }

        return bonuses.map(bonus => {return bonus})
    }

    addBonus = () => {
       
        let bonuses = this.getBonuses(true)

        this.props.dispatch({type: "CombatSkill", value: (this.props.CharacterSheet.BaseCombatSkill || 0) + (bonuses.length > 0 ? bonuses.reduce((sum, value) => {return sum+value}) : 0), API: this.props.API, save: true})

    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Base Combat Skill</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="BaseCombatSkill" type="number"/>
                    <Button onClick={this.addBonus} style={{marginRight: "5px"}} inline>Update Combat Skill</Button>
                    <Text>{this.getBonuses()}</Text>
                    <Group name="Combat Skill" type="number"/>
                </View>
            </View>
        )
    }
}
const CombatSkill = connect(mapStateToProps)(CombatSkillView)

class EnemyCombatSkill extends Component {
    render() {
        return (
            <View>
                <Input name="EnemyCombatSkill"  type="number"/>
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
class EnemyImmunity extends Component {
    render() {
        return (
            <View>
                <Group name="Immune to Mindblast" type="checkbox" />
            </View>
        )
    }
}

class CombatRatioView extends Component {

    state = {number: "-", damage: {}, round: 0}

    fight = () => {
        
        let number = this.props.generateRandomNumber()
        
        this.props.dispatch({type: "FIGHT", API: this.props.API, save: true})

        let state = {
            number: number,
            damage: this.props.fight(number, this.props.CharacterSheet.CombatRatio),
            round: ++this.state.round,
        }

        this.setState(state)

        return state
    }

    updateEndurance = (damage = null) => {
        this.props.dispatch({type: "UPDATE_ENDURANCE", value: damage || this.state.damage, API: this.props.API, save: true})
    }

    fightAndUpdateEndurance = () => {
        let damage = this.fight().damage
        this.updateEndurance(damage)
    }

    clearEnemyStats = () => {
        this.props.dispatch({type: "CLEAR_ENEMY_STATS", API: this.props.API, save: true})
        this.setState({damage: {}, round: 0})
    }

    generateRandomNumber = () => {
        this.setState({number: this.props.generateRandomNumber()})
    }

    render() {
        return (
            <View>
                <View hidden={this.props.hideCR}>
                    <Label>Combat Ratio</Label>
                    <TextWithInputFont>
                    {
                        this.props.CharacterSheet.CombatRatio === undefined
                        || isNaN(this.props.CharacterSheet.CombatRatio)
                        || this.props.CharacterSheet.CombatSkill === ""
                        || this.props.CharacterSheet.EnemyCombatSkill === ""
                            ? "-"
                            : this.props.CharacterSheet.CombatRatio
                    }</TextWithInputFont>
                    <Label>Combat Results</Label>
                    <TextWithInputFont>
                        Enemy:{" "}
                        {this.state.damage.enemy !== undefined
                            ? isNaN(this.state.damage.enemy*-1)
                                ? this.state.damage.enemy
                                : this.state.damage.enemy*-1
                            : "-"
                        }
                        {" "}/{" "}
                        Lone Wolf:{" "}
                        {this.state.damage.lonewolf !== undefined
                            ? isNaN(this.state.damage.lonewolf*-1)
                                ? this.state.damage.lonewolf
                                : this.state.damage.lonewolf*-1
                            : "-"
                        }
                    </TextWithInputFont>
                    <Label>Round</Label>
                    <TextWithInputFont>
                        {this.state.round}
                    </TextWithInputFont>
                    <Button onClick={this.fight} disabled={
                        this.props.CharacterSheet.CombatSkill === undefined
                        || this.props.CharacterSheet.CombatSkill === ""
                        || this.props.CharacterSheet.EnemyCombatSkill === undefined
                        || this.props.CharacterSheet.EnemyCombatSkill === ""
                    }>Fight</Button>
                    <Button onClick={this.updateEndurance} disabled={
                        this.props.CharacterSheet.CombatSkill === undefined
                        || this.props.CharacterSheet.CombatSkill === ""
                        || this.props.CharacterSheet.EnemyCombatSkill === undefined
                        || this.props.CharacterSheet.EnemyCombatSkill === ""
                        || this.props.CharacterSheet.Endurance === undefined
                        || this.props.CharacterSheet.Endurance === ""
                        || this.props.CharacterSheet.EnemyEndurance === undefined
                        || this.props.CharacterSheet.EnemyEndurance === ""
                    }>Update Endurance</Button>
                    <Button onClick={this.fightAndUpdateEndurance} disabled={
                        this.props.CharacterSheet.CombatSkill === undefined
                        || this.props.CharacterSheet.CombatSkill === ""
                        || this.props.CharacterSheet.EnemyCombatSkill === undefined
                        || this.props.CharacterSheet.EnemyCombatSkill === ""
                        || this.props.CharacterSheet.Endurance === undefined
                        || this.props.CharacterSheet.Endurance === ""
                        || this.props.CharacterSheet.EnemyEndurance === undefined
                        || this.props.CharacterSheet.EnemyEndurance === ""
                    }>Fight & Update Endurance</Button>
                    <Button onClick={this.clearEnemyStats}>Clear Enemy Stats</Button>
                </View>
                <HR/>
                <Label>Random Number</Label>
                <TextWithInputFont>{this.state.number}</TextWithInputFont>
                <Button onClick={this.generateRandomNumber}>Generate Number</Button>
            </View>
        )
    }
}
const CombatRatio = connect(mapStateToProps)(CombatRatioView)

class KaiView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6) {
            return null
        }

        return (
            <View>
                <Label onClick={this.toggleDetails}>Kai Disciplines</Label>
                <View hidden={this.state.hideDetails}>
                    <View>
                        <Input name="Kai1" select={this.props.KaiDisciplines}/>
                    </View>
                    <View>
                        <Input name="Kai2" select={this.props.KaiDisciplines}/>
                    </View>
                    <View>
                        <Input name="Kai3" select={this.props.KaiDisciplines}/>
                    </View>
                    <View>
                        <Input name="Kai4" select={this.props.KaiDisciplines}/>
                    </View>
                    <View>
                        <Input name="Kai5" select={this.props.KaiDisciplines}/>
                    </View>
                    <View>
                        <Input name="Kai6" select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number < 2}/>
                    </View>
                    <View>
                        <Input name="Kai7" select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number < 3}/>
                    </View>
                    <View>
                        <Input name="Kai8" select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number < 4}/>
                    </View>
                    <View>
                        <Input name="Kai9" select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number < 5}/>
                    </View>
                    <View>
                        <Input name="Kai10" select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number < 6}/>
                    </View>
                    <Group name="Kai Level" select={this.props.KaiLevels}/>
                </View>
                <HR/>
            </View>
        )
    }
}
const Kai = connect(mapStateToProps)(KaiView)

class WeaponsView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Weapons</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="Weapon1" />
                    <Input name="Weapon2" />
                </View>
            </View>
        )
    }
}
const Weapons = connect(mapStateToProps)(WeaponsView)

class BeltPouchView extends Component {
    
    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Belt Pouch</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="BeltPouch" append="50 gold crowns max" type="number"/>
                </View>
            </View>
        )
    }
}
const BeltPouch = connect(mapStateToProps)(BeltPouchView)

class MealsView extends Component {
    render() {
        return (
            <View hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number !== 1}>
                <Group name="Meals" type="number" />
            </View>
        )
    }
}
const Meals = connect(mapStateToProps)(MealsView)

class BackpackView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Backpack Items</Label>
                <View hidden={this.state.hideDetails}>
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
            </View>
        )
    }
}
const Backpack = connect(mapStateToProps)(BackpackView)

class SpecialItemsView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Special Items</Label>
                <View hidden={this.state.hideDetails}>
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
                    <View>
                        <Input name="SpecialItem9" />
                    </View>
                    <View>
                        <Input name="SpecialItem10" />
                    </View>
                    <View>
                        <Input name="SpecialItem11" />
                    </View>
                    <View>
                        <Input name="SpecialItem12" />
                    </View>
                    <View>
                        <Input name="SpecialItem13" />
                    </View>
                    <View>
                        <Input name="SpecialItem14" />
                    </View>
                    <View>
                        <Input name="SpecialItem15" />
                    </View>
                    <View>
                        <Input name="SpecialItem16" />
                    </View>
                </View>
            </View>
        )
    }
}
const SpecialItems = connect(mapStateToProps)(SpecialItemsView)

class NotesView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Notes</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="Notes" box/>
                </View>
            </View>
        )
    }
}
const Notes = connect(mapStateToProps)(NotesView)

class GameStateView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    loadGame = () => {
        this.props.dispatch({type: "LOAD_GAME", value: this.props.CharacterSheet.GameState, API: this.props.API})

        if (this.props.CharacterSheet.GameState === "") {
            this.props.dispatch({type: "UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK"})
        }
    }
    modifyGameState = (input) => {
        this.props.dispatch({type: "MODIFY_GAME_STATE", value: input.value, API: this.props.API})
    }
    clear = () => {
        this.props.dispatch({type: "CLEAR_GAME_STATE", API: this.props.API})
    }
    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Game State</Label>
                <View hidden={this.state.hideDetails}>
                    <Input name="GameState" value={this.props.CharacterSheet.GameState} onChange={this.modifyGameState} box/>
                    <Button onClick={this.loadGame}>{this.props.CharacterSheet.GameState === "" ? <Text>Start New Game</Text> : <Text>Load Custom Game State</Text>}</Button>
                    <Button onClick={this.clear}>Clear Custom Game State</Button>
                </View>
            </View>
        )
    }
}
const GameState = connect(mapStateToProps)(GameStateView)

class SaveAndLoadRemotelyView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }
    modifyGameID = (input) => {
        this.props.dispatch({type: "UPDATE_GAME_ID_REQUEST_FEEDBACK", value: input.value})
    }
    modifyPassword = (input) => {
        this.props.dispatch({type: "UPDATE_PASSWORD_REQUEST_FEEDBACK", value: input.value})
    }
    loadGameRemotely = () => {

        clearTimeout(APItimeout)

        if (this.props.RequestFeedback.gameID === undefined || this.props.RequestFeedback.gameID === "") {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Please enter the ID of the game."})
        } 

        if (this.props.RequestFeedback.password === undefined || this.props.RequestFeedback.password === "") {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Please enter the password."})
        }
        if (this.props.RequestFeedback.password.length < 8) {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "This password is too short."})
        }

        this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Loading..."})
        
        this.props.API("loadgame", true)

    }
    saveGameRemotely = () => {

        clearTimeout(APItimeout)

        if (this.props.CharacterSheet.GameState === "" && (this.props.RequestFeedback.gameID === undefined || this.props.RequestFeedback.gameID === "")) {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Please enter the ID of the game you wish to delete."})
        }

        if (this.props.RequestFeedback.password === undefined || this.props.RequestFeedback.password === "") {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Please enter the password."})
        }
        if (this.props.RequestFeedback.password.length < 8) {
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "This password is too short."})
        }
        
        this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Saving..."})

        this.props.API("savegame", true)

    }
    toggleAutoSave = (input) => {

        if (this.props.RequestFeedback.gameID === undefined || this.props.RequestFeedback.gameID === "") {
            this.props.dispatch({type: "Autosave", value: false})
            return this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: "Please enter a game ID before enabling autosaving."})
        }

        this.props.dispatch({type: "Autosave", value: input.checked, API: this.props.API, save: true})
        this.props.dispatch({type: "UPDATE_VALIDATION_REQUEST_FEEDBACK", value: null})

    }
    render() {
        return (
            <View>
                <Label onClick={this.toggleDetails}>Remote Game ID</Label>
                <View hidden={this.state.hideDetails}>
                    <Input value={this.props.RequestFeedback.gameID} onChange={this.modifyGameID} noAutoSave/>
                    <Label>Password</Label>
                    <Input type="password" value={this.props.RequestFeedback.password} onChange={this.modifyPassword} noAutoSave/>
                    <View>{this.props.RequestFeedback ? this.props.RequestFeedback.message : null}</View>
                    <Button onClick={this.loadGameRemotely}>Load Game Remotely</Button>
                    <Button onClick={this.saveGameRemotely}>{this.props.CharacterSheet.GameState === "" ? "Delete Game Remotely" : "Save Game Remotely"}</Button>
                    <Input name="Autosave" type="checkbox" onChange={this.toggleAutoSave} inline/>
                    <LabelInline htmlFor="Autosave">Auto save</LabelInline>
                </View>
            </View>
        )
    }
}
const SaveAndLoadRemotely = connect(mapStateToProps)(SaveAndLoadRemotelyView)

class Spacer extends Component {
    render() {
        return (
            <View style={{height: "50px"}}/>
        )
    }
}

class Group extends Component {
    render() {
        return (
            <View hidden={this.props.hidden}>
                <Label hidden={this.props.type === "checkbox"}>{this.props.name}{this.props.append ? <Text> ({this.props.append})</Text> : null}</Label>
                <Input
                    name={this.props.name.replace(/ /g,"")}
                    type={this.props.type}
                    numbers={this.props.numbers}
                    negativeNumbers={this.props.negativeNumbers}
                    noPlusAndMinus={this.props.noPlusAndMinus}
                    select={this.props.select}
                    box={this.props.box}
                    inline={this.props.type === "checkbox"}
                />
                <LabelInline htmlFor={this.props.name.replace(/ /g,"")} hidden={this.props.type !== "checkbox"} style={this.props.type !== "checkbox" ? null : {height: "26px", display: "inline"}}>{this.props.name}{this.props.append ? <Text> ({this.props.append})</Text> : null}</LabelInline>

            </View>
        )
    }
}

class InputView extends Component {

    onChange = (input) => {

        if (this.props.onChange) {
            return this.props.onChange(input.target)
        }

        let value = null

        if (!input.target) {

            if (this.props.negativeNumbers) {
                value = (this.props.CharacterSheet[this.props.name] || 0) + Number(input)
            }
            else {
                value = (this.props.CharacterSheet[this.props.name] || "") + input                
            }


            return this.props.dispatch({type: this.props.name, value: value, API: this.props.API, save: true})
        }

        value = input.target.value

        if (this.props.type === "checkbox") {
            value = input.target.checked
        }

        this.props.dispatch({type: this.props.name, value: value, API: this.props.API, save: this.props.type === "checkbox"})
    }

    onBlur = () => {
        this.props.dispatch({type: "AUTO_SAVE", API: this.props.API, save: true})
    }

    increment = () => {
        this.props.dispatch({type: "INCREMENT_" + this.props.name, API: this.props.API, save: true})
    }

    decrement = () => {
        this.props.dispatch({type: "DECREMENT_" + this.props.name, API: this.props.API, save: true})
    }

    clear = () => {

        if (!this.props.name) {
            return this.props.onChange("")
        }

        this.props.dispatch({type: this.props.name, value: "", API: this.props.API, save: true})
    }

    generateSelectOptions = () => {
        if (this.props.optGroups) {

            let optGroups = this.props.optGroups.map((optGroup, index) => {
                return (<optgroup key={optGroup.name} label={optGroup.name}/>)
            })

            let options = this.props.select.map((option, index) => {

                

                return <option key={option.name}>{this.props.showIndex ? index + " - " + option.name : option.name}</option>
            })
            
            this.props.optGroups.map((optGroup, index) => {
                options.splice(optGroup.position, 0, optGroups[index])
            })

            return (options)
        }
        else {

            return (
                this.props.select.map((option, index) => {return <option key={option.name}>{this.props.showIndex ? index + " - " + option.name : option.name}</option>})
            )

        }
    }

    render() {
        if (this.props.hidden) return null
        if (this.props.select) {
            return (
                <View style={{marginBottom: "8px"}}>
                    <select
                        id={this.props.name}
                        style={{width: "98%", padding: "2px"}}
                        value={this.props.value || this.props.CharacterSheet[this.props.name] || ""}
                        onChange={this.onChange}
                    >
                        {this.generateSelectOptions()}
                    </select>
                </View>
            )
        }
        if (this.props.box) {
            return (
                <View style={{marginBottom: "8px"}}>
                    <textarea
                        id={this.props.name}
                        style={{width: "98%", height: "200px", padding: "2px"}}
                        value={this.props.value || this.props.CharacterSheet[this.props.name] || ""}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                    />
                </View>
            )
        }
        return (
            <View style={{marginBottom: "8px", display: (this.props.inline ? "inline-block" : null)}}>
                <input
                    id={this.props.name}
                    style={this.props.type === "checkbox" ? null : {width: (this.props.type === "number" && !this.props.noPlusAndMinus ? "calc(98% - 68px)" : "calc(98% - 36px)"), height: "26px", padding: "2px"}}
                    value={this.props.value || (this.props.CharacterSheet[this.props.name] === undefined ? "" : String(this.props.CharacterSheet[this.props.name]))}
                    checked={this.props.type === "checkbox" ? (this.props.CharacterSheet[this.props.name] || false) : null}
                    type={this.props.type}
                    onChange={this.onChange}
                    onBlur={this.props.type === "checkbox" || this.props.noAutoSave ? null : this.onBlur}
                />
                {(this.props.type !== "number" && this.props.type !== "checkbox") || this.props.noPlusAndMinus
                    ?
                    <Text>
                        <Button style={{marginLeft: "5px", width: "25px", height: "34px"}} onClick={this.clear} inline>X</Button>
                    </Text>
                    : null
                }
                {this.props.type === "number" && !this.props.noPlusAndMinus
                    ?
                    <Text>
                        <Button style={{marginLeft: "5px", width: "25px", height: "34px"}} onClick={this.decrement} inline>-</Button>
                        <Button style={{marginLeft: "5px", width: "25px", height: "34px"}} onClick={this.increment} inline>+</Button>
                    </Text>
                    : null
                }
                {this.props.numbers
                    ? 
                    <View>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>1</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>2</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>3</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>4</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>5</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>6</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>7</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>8</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>9</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center"}} inline>0</Button>
                    </View>
                    : null
                }
                {this.props.negativeNumbers
                    ? 
                    <View>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-1</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-2</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-3</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-4</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-5</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-6</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-7</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-8</Button>
                        <Button addFaceValue={this.onChange} style={{marginRight: "5px", marginTop: "5px", width: "25px", height: "34px", textAlign: "center", padding: "3px"}} inline>-9</Button>
                    </View>
                    : null
                }
            </View>
        )
    }
}
const Input = connect(mapStateToProps)(InputView)

class Label extends Component {
    render() {
        return (
            <View style={{marginTop: "10px"}} hidden={this.props.hidden} onClick={this.props.onClick}>
                <label style={{fontWeight: "bold"}}>{this.props.children}:</label>
            </View>
        )
    }
}

class LabelInline extends Component {
    render() {
        return (
            <label {...this.props} style={{...this.props.style, userSelect: "none"}}>{this.props.children}.</label>
        )
    }
}

class Button extends Component {
    onClick = (input) => {

        if (this.props.addFaceValue) {
            this.props.addFaceValue(this.props.children)
        }

        if (!this.props.onClick) return false
        this.props.onClick(input.target)
    }
    render() {
        return (
            <View style={this.props.inline ? {display: "inline-block"} : {marginTop: "10px"}}>
                <button style={this.props.style} onClick={this.onClick} disabled={this.props.disabled}>{this.props.children}</button>
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

class Link extends Component {
    render() {
        return (
            <a href={this.props.href} target={this.props.target} onClick={this.props.onClick} style={{color: "-webkit-link", cursor: "pointer", userSelect: "none"}}>{this.props.children}</a>
        )
    }
}

class HR extends Component {
    render() {
        return (
            <hr style={{marginTop: "20px", marginBottom: "20px"}}/>
        )
    }
}