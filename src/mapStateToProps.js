import {store} from './Store'

let APItimeout = null

export const mapStateToProps = (state, ownProps) => {
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
            if (window && window.debugApp && request === "loadgame") {

                console.log(
                    ["Load game API request.\n",
                    "Request payload: "].join(""), payload
                )
            }
            else if (window && window.debugApp && request === "savegame") {

                console.log(
                    ["Save game API request.\n",
                    "Request payload: "].join(""), payload
                )
            }
            
            // validation
            if (!payload.password) {

                if (window && window.debugApp) {
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

                if (window && window.debugApp) {

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
        MagnakaiLevels: [
            {name: "Kai Master Superior"},
            {name: "Primate"},
            {name: "Tutelary"},
            {name: "Principalin"},
            {name: "Mentora"},
            {name: "Scion-kai"},
            {name: "Archmaster"},
            {name: "Kai Grand Master"},
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