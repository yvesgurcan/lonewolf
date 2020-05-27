import {store} from './Store'

let APItimeout = null

export const mapStateToProps = (state, ownProps) => {
    return {
        ...state,
        ...ownProps,
        numberSequence(iterations) {
            return Array.from(new Array(iterations),(val,index)=>index+1)
        },
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
                name: "GrandMaster",
                position: 15
            },
        ],
        Books: [
            {
                name: "SelectBook",
                url: null,
            },
            {
                name: "Book01",
                url: "https://www.projectaon.org/en/xhtml/lw/01fftd/",
            },
            {
                name: "Book02",
                url: "https://www.projectaon.org/en/xhtml/lw/02fotw/",
            },
            {
                name: "Book03",
                url: "https://www.projectaon.org/en/xhtml/lw/03tcok/",
            },
            {
                name: "Book04",
                url: "https://www.projectaon.org/en/xhtml/lw/04tcod/",
            },
            {
                name: "Book05",
                url: "https://www.projectaon.org/en/xhtml/lw/05sots/",
            },
            {
                name: "Book06",
                url: "https://www.projectaon.org/en/xhtml/lw/06tkot/",
            },
            {
                name: "Book07",
                url: "https://www.projectaon.org/en/xhtml/lw/07cd/",
            },
            {
                name: "Book08",
                url: "https://www.projectaon.org/en/xhtml/lw/08tjoh/",
            },
            {
                name: "Book09",
                url: "https://www.projectaon.org/en/xhtml/lw/09tcof/",
            },
            {
                name: "Book10",
                url: "https://www.projectaon.org/en/xhtml/lw/10tdot/",
            },
            {
                name: "Book11",
                url: "https://www.projectaon.org/en/xhtml/lw/11tpot/",
            },
            {
                name: "Book12",
                url: "https://www.projectaon.org/en/xhtml/lw/12tmod/",
            },
            {
                name: "Book13",
                url: "https://www.projectaon.org/en/xhtml/lw/13tplor/",
            },
            {
                name: "Book14",
                url: "https://www.projectaon.org/en/xhtml/lw/14tcok/",
            },
            {
                name: "Book15",
                url: "https://www.projectaon.org/en/xhtml/lw/15tdc/",
            },
            {
                name: "Book16",
                url: "https://www.projectaon.org/en/xhtml/lw/16tlov/",
            },
            {
                name: "Book17",
                url: "https://www.projectaon.org/en/xhtml/lw/17tdoi/",
            },
            {
                name: "Book18",
                url: "https://www.projectaon.org/en/xhtml/lw/18dotd/",
            },
            {
                name: "Book19",
                url: "https://www.projectaon.org/en/xhtml/lw/19wb/",
            },
            {
                name: "Book20",
                url: "https://www.projectaon.org/en/xhtml/lw/20tcon/",
            },
        ],
        BookURLs: {
            toc: "toc.htm",
            map: "map.htm",
            section: {prepend: "sect", append: ".htm"},
            disciplines: "discplnz.htm",
            improveddisciplines: "imprvdsc.htm",
            lorecircles: "lorecrcl.htm",
        },
        KaiLevels: [
            {
                name: "KaiInitiate",
                disciplines: 5
            },
            {
                name: "KaiAspirant",
                disciplines: 6
            },
            {
                name: "KaiGuardian",
                disciplines: 7
            },
            {
                name: "KaiWarmarnJourneyman",
                disciplines: 8
            },
            {
                name: "KaiSavant",
                disciplines: 9
            },
            {
                name: "KaiMaster",
                disciplines: 10
            }
        ],
        KaiDisciplines: [
            {
                name: "",
            },
            {
                name: "KaiCamouflage",
            },
            {
                name: "KaiHunting",
            },
            {
                name: "KaiSixthSense",
            },
            {
                name: "KaiTracking",
            },
            {
                name: "KaiHealing",
            },
            {
                name: "KaiMindshield",
            },
            {
                name: "KaiMindblast",
                CombatSkill: 2,
            },
            {
                name: "KaiAnimalKinship",
            },
            {
                name: "KaiMindOverMatter",
            },
            {
                name: "KaiWeaponskillDagger",
                weapon: "Dagger",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillSpear",
                weapon: "Spear",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillMace",
                weapon: "Mace",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillShortSword",
                weapon: "Short Sword",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillWarhammer",
                weapon: "Warhammer",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillSword",
                weapon: "Sword",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillAxe",
                weapon: "Axe",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillQuarterstaff",
                weapon: "Quarterstaff",
                CombatSkill: 2,
            },
            {
                name: "KaiWeaponskillBroadsword",
                weapon: "Broadsword",
                CombatSkill: 2,
            },
        ],
        MagnakaiLevels: [
            {
                name: "MagnakaiKaiMasterSuperior",
                disciplines: 3
            },
            {
                name: "MagnakaiPrimate",
                disciplines: 4
            },
            {
                name: "MagnakaiTutelary",
                disciplines: 5
            },
            {
                name: "MagnakaiPrincipalin",
                disciplines: 6
            },
            {
                name: "MagnakaiMentora",
                disciplines: 7
            },
            {
                name: "MagnakaiScionKai",
                disciplines: 8
            },
            {
                name: "MagnakaiArchmaster",
                disciplines: 9
            },
            {
                name: "MagnakaiKaiGrandMaster",
                disciplines: 10
            },
        ],
        LoreCircles: [
            {
                name: "CircleFireSolaris",
                position: 1,
            },
            {
                name: "CircleFire",
                position: 3,
            },
            {
                name: "CircleLight",
                position: 5,
            },
            {
                name: "CircleSolaris",
                position: 8,
            },
            {
                name: "CircleSpirit",
                position: 11,
            },
        ],
        MagnakaiDisciplines: [
            {
                name: "",
            },
            {
                name: "MagnakaiHuntmastery",
            },
            {
                name: "MagnakaiWeaponmastery",
            },
            {
                name: "MagnakaiAnimalControl",
            },
            {
                name: "MagnakaiCuring",
            },
            {
                name: "MagnakaiInvisibility",
            },
            {
                name: "MagnakaiPathsmanship",
            },
            {
                name: "MagnakaiPsiSurge",
            },
            {
                name: "MagnakaiPsiScreen",
            },
            {
                name: "MagnakaiNexus",
            },
            {
                name: "MagnakaiDivination",
            },
        ],
        BackpackItems: [
            "Meal",
            "Potions of Laumspur +4 Endurance",
            "Shovel",
            "Hourglass",
            "Torch",
            "Tinderbox",
        ],
        checkLoreCircle(LoreCircle) {

            let {CharacterSheet} = {...state}

            let requirementMet = false
            let requiredCount  = 0

            for (let i = 1; i <= 10; i++) {
                
                let magnakaiDiscipline = CharacterSheet["Magnakai" + i]

                if (magnakaiDiscipline !== undefined && magnakaiDiscipline !== "") {

                    switch(LoreCircle) {

                        default:
                            break
                        
                        case "CircleFire":

                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaihuntmastery") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaiweaponmastery") > -1) {
                                requiredCount++
                            }

                            if (requiredCount === 2) {
                                requirementMet = true
                            }

                            break

                        case "CircleLight":

                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaianimalcontrol") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaicuring") > -1) {
                                requiredCount++
                            }

                            if (requiredCount === 2) {
                                requirementMet = true
                            }

                            break

                        case "CircleSolaris":

                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaihuntmastery") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaiinvisibility") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaipathsmanship") > -1) {
                                requiredCount++
                            }

                            if (requiredCount === 3) {
                                requirementMet = true
                            }

                            break

                        case "CircleSpirit":

                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaipsisurge") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaipsiscreen") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakainexus") > -1) {
                                requiredCount++
                            }
                            if (magnakaiDiscipline.toLowerCase().indexOf("magnakaidivination") > -1) {
                                requiredCount++
                            }

                            if (requiredCount === 4) {
                                requirementMet = true
                            }

                            break
                    }
                }
            }

            return requirementMet
        },
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