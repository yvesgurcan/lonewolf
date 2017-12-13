import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'

// Redux
import { store } from './Store'
import { mapStateToProps } from './mapStateToProps'

// Web Components (React)
import {
    View, // mimicks React Native built-in component
    Header1,
    Text, // mimicks React Native built-in component
    Link,
    TextWithInputFont,
    Label,
    LabelInline,
    Button, // mimicks React Native built-in component
    HR
} from './WebComponents'

// Native Components (React Native)
/*
import {
    View,
    Text,
    Button,
} from 'react-native'

import {
    Header1,
    Link,
    TextWithInputFont,
    Label,
    LabelInline,
    HR,
} from './NativeComponents'
*/

// Shared Components
import {
    ShowDetails,
    Group,
    Input,
    Spacer,
} from './UtilityComponents'

import Styles from './Styles'

let APItimeout = null

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
                <Combat>
                    <Endurance/>
                    <HR/>
                </Combat>
                <HR/>
                <Weapons/>
                <HR/>
                <Weaponmastery/>
                <Kai/>
                <Magnakai/>
                <LoreCircles/>
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
    render() {
        return (
            <ShowDetails label="Game ID" startVisible>
                <Text>{this.props.RequestFeedback.actualGameID !== undefined ? String(this.props.RequestFeedback.actualGameID) : "-"}</Text>
                <Label>Game Started</Label>
                <Text>{this.props.CharacterSheet.GameStarted}</Text>
                <Label>Game Last Saved</Label>
                <Text>{this.props.CharacterSheet.GameSaved || "-"}</Text>
            </ShowDetails>
        )
    }
}
const GameMetaData = connect(mapStateToProps)(GameMetaDataView)

class BookView extends Component {

    onChange = (input) => {
        let bookNumber = 0
        let Book = this.props.Books.filter((book, index) => {

            if (String(index) + " - " + book.name === input.value) {
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
            <ShowDetails label="Book">
                <Input name="Book" value={this.props.CharacterSheet.Book ? this.props.CharacterSheet.Book.number + " - " + this.props.CharacterSheet.Book.name : null} select={this.props.Books} optGroups={this.props.BookGroups} showIndex onChange={this.onChange}/>
                {this.props.CharacterSheet.Book ? <BookLinks/> : null}
                <Section/>
            </ShowDetails>
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
        
        if (CharacterSheet.Book && CharacterSheet.Book.number >= 6) {
            if (this.props.checkLoreCircle("Circle Of Fire")) {
                bonuses.push(<Text>+2&nbsp;(circle&nbsp;of&nbsp;fire) </Text>)
                bonusValues.push(2)
            }
            if (this.props.checkLoreCircle("Circle Of Light")) {
                bonuses.push(<Text>+3&nbsp;(circle&nbsp;of&nbsp;light) </Text>)
                bonusValues.push(3)
            }
            if (this.props.checkLoreCircle("Circle Of Solaris")) {
                bonuses.push(<Text>+3&nbsp;(circle&nbsp;of&nbsp;solaris) </Text>)
                bonusValues.push(3)
            }
            if (this.props.checkLoreCircle("Circle Of The Spirit")) {
                bonuses.push(<Text>+3&nbsp;(circle&nbsp;of&nbsp;the&nbsp;spirit) </Text>)
                bonusValues.push(3)
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

     hideArchmasterCuring = () => {

        let {CharacterSheet} = {...this.props}

        let hide = true

        if (CharacterSheet.Book && CharacterSheet.Book.number >= 6) {
            if (CharacterSheet.MagnakaiLevel &&CharacterSheet.MagnakaiLevel.toLowerCase().indexOf("archmaster") > -1) {
                for (let i = 1; i <= 10; i++) {
                    let kaiDiscipline = CharacterSheet["Magnakai" + i]
                    if (kaiDiscipline !== undefined) {
                        if (kaiDiscipline.toLowerCase().indexOf("curing") > -1) {
                            if (CharacterSheet.Endurance <= 6) {
                                hide = false
                                break                                
                            }
                        }
                    }
                }
            }
        }

        return hide

     }

     archmasterCuring = () => {

        this.props.dispatch({type: "ARCHMASTER_CURING", API: this.props.API, save: true})

     }

    render() {
        return (
            <ShowDetails label="Max Endurance">
                <Input name="MaxEndurance" type="number" />
                <Text>{this.getBonuses()}</Text>
                <Group name="Endurance" type="number" negativeNumbers/>
                <Button hidden={this.hideArchmasterCuring()} onClick={this.archmasterCuring} style={Styles.Button} inline>Archmaster Curing: +20 (once/100 days)</Button>
                <Button onClick={this.toMax} style={Styles.Button} inline>Heal to Max</Button>
            </ShowDetails>
        )
    }
}
const Endurance = connect(mapStateToProps)(EnduranceView)

class Combat extends Component {

    render() {
        return (
            <View>
                <CombatSkill/>
                <HR/>
                {/* endurance */}
                {this.props.children}
                <ShowDetails label="Enemy Combat Skill">
                    <EnemyCombatSkill/>
                    <EnemyEndurance/>
                    <EnemyImmunity/>
                </ShowDetails>
                <HR/>
                <CombatRatio/>
            </View>
        )
    }
}

class CombatSkillView extends Component {

    getBonuses = (returnRawData) => {

        let bonuses = []
        let bonusValues = []
        let {CharacterSheet, KaiDisciplines} = {...this.props}

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number < 6) {
            // bonuses from kai disciplines
            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Kai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("mindblast") > -1 && kaiDiscipline.toLowerCase().indexOf("mindshield") === -1 && !this.props.CharacterSheet.ImmunetoMindblast) {
                        bonuses.push(<Text key="mindblast">+2&nbsp;(mindblast) </Text>)
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
                                bonuses.push(<Text key="weaponskill">+2&nbsp;(weaponskill:&nbsp;{weapon}) </Text>)
                                bonusValues.push(2)
                                break
                            }
                        }
                    }
                }
            }
        }
        else {
            // bonuses from magnakai disciplines
            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Magnakai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("mindblast") > -1) {
                        if (this.props.CharacterSheet.UsePsiSurge) {
                            bonuses.push(<Text key="psi-surge">+4&nbsp;(psi-surge) </Text>)
                            bonusValues.push(4)
                        }
                        else if (!this.props.CharacterSheet.ImmunetoMindblast) {
                            bonuses.push(<Text key="mindblast">+2&nbsp;(mindblast) </Text>)
                            bonusValues.push(2)
                        }
                    }
                    else if (kaiDiscipline.toLowerCase().indexOf("weaponmastery") > -1) {

                        let weaponTypeList = ["Spear","Dagger","Mace","ShortSword","Warhammer","Bow","Axe","Sword","Quarterstaff","Broadsword"]

                        for (let x = 1; x <= 2; x++) {
                            let weapon = CharacterSheet["Weapon" + x]

                            if (weapon !== undefined && weapon !== "") {

                                let matchFound = false

                                for (let t = 0; t < 10; t++) {
                                    if (String(weapon).toLowerCase().replace(/ /g,"").indexOf(weaponTypeList[t].toLowerCase()) > -1) {

                                        if (CharacterSheet.MagnakaiLevel && (CharacterSheet.MagnakaiLevel.toLowerCase().indexOf("scion-kai") > -1 || CharacterSheet.MagnakaiLevel.toLowerCase().indexOf("archmaster") > -1)) {

                                            bonuses.push(<Text key="weaponmastery">+4&nbsp;(weaponmastery:&nbsp;{weapon}) </Text>)
                                            bonusValues.push(4)
                                            matchFound = true

                                            break
                                        }

                                        bonuses.push(<Text key="weaponmastery">+3&nbsp;(weaponmastery:&nbsp;{weapon}) </Text>)
                                        bonusValues.push(3)
                                        matchFound = true
                                        break
                                    }
                                }

                                if (matchFound) break

                            }
                        }
                    }
                }
            }
        
            if (this.props.checkLoreCircle("Circle Of Fire")) {
                bonuses.push(<Text>+1&nbsp;(circle&nbsp;of&nbsp;fire) </Text>)
                bonusValues.push(1)
            }
            if (this.props.checkLoreCircle("Circle Of Solaris")) {
                bonuses.push(<Text>+1&nbsp;(circle&nbsp;of&nbsp;solaris) </Text>)
                bonusValues.push(1)
            }
            if (this.props.checkLoreCircle("Circle Of The Spirit")) {
                bonuses.push(<Text>+3&nbsp;(circle&nbsp;of&nbsp;the&nbsp;spirit) </Text>)
                bonusValues.push(3)
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
            <ShowDetails label="Base Combat Skill">
                <Input name="BaseCombatSkill" type="number"/>
                <Button onClick={this.addBonus} style={Styles.Button} inline>Update Combat Skill</Button>
                <Text>{this.getBonuses()}</Text>
                <Group name="Combat Skill" type="number"/>
            </ShowDetails>
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
class EnemyImmunityView extends Component {

    hasMindBlast = () => {

        let {CharacterSheet} = {...this.props}

        let hasMindBlast = false

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number < 6) {

            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Kai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("mindblast") > -1 && kaiDiscipline.toLowerCase().indexOf("mindshield") === -1) {
                        hasMindBlast = true
                    }
                }
            }

        }
        else {

            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Magnakai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("mindblast") > -1 && kaiDiscipline.toLowerCase().indexOf("mindshield") === -1) {
                        hasMindBlast = true
                    }
                }
            }

        }

        return hasMindBlast
    }

    render() {
        return (
            <View hidden={!this.hasMindBlast()}>
                <Group name="Immune to Mindblast" type="checkbox" />
            </View>
        )
    }
}
const EnemyImmunity = connect(mapStateToProps)(EnemyImmunityView)

class CombatRatioView extends Component {

    state = {number: "-", damage: {}, round: 0}

    fight = () => {
        
        let number = this.props.generateRandomNumber()
        let damageNumber = number
        
        if (this.props.CharacterSheet.WeaponmasteryBow) {
            damageNumber += 3
        }

        let state = {
            number: number,
            damage: this.props.fight(damageNumber, this.props.CharacterSheet.CombatRatio),
            round: this.state.round + 1,
        }

        this.setState(state)

        return state
    }

    updateEndurance = (input, damage = null) => {

        if (damage == null && this.state.damage.enemy === undefined && this.state.damage.lonewolf === undefined) return null

        if (this.props.CharacterSheet.UsePsiSurge) {
            damage = {...(damage || this.state.damage)}
            damage.lonewolf = damage.lonewolf + 2
        }

        this.props.dispatch({type: "UPDATE_ENDURANCE", value: (damage || this.state.damage), API: this.props.API, save: true})
    }

    fightAndUpdateEndurance = () => {
        let damage = this.fight().damage
        
        this.updateEndurance(null, damage)
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
                <ShowDetails label="Combat Ratio">
                    <TextWithInputFont>
                    {
                        this.props.CharacterSheet.CombatRatio === undefined
                        ||  this.props.CharacterSheet.CombatRatio === null
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
                        {" "}
                        <Text hidden={!this.props.CharacterSheet.UsePsiSurge}>
                            (-2 psi-surge)
                        </Text>
                    </TextWithInputFont>
                    <Label>Round</Label>
                    <TextWithInputFont>
                        {this.state.round}
                    </TextWithInputFont>
                    <UsePsiSurge/>
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
                </ShowDetails>
                <HR/>
                <Label>Random Number</Label>
                <TextWithInputFont>{this.state.number} {this.props.CharacterSheet.WeaponmasteryBow ? "(bow weaponmastery: +3)" : null}</TextWithInputFont>
                <Button onClick={this.generateRandomNumber}>Generate Number</Button>
            </View>
        )
    }
}
const CombatRatio = connect(mapStateToProps)(CombatRatioView)

class UsePsiSurgeView extends Component {

    hasPsiSurge = () => {

        let {CharacterSheet} = {...this.props}

        let hasPsiSurge = false

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6) {

            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Magnakai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("psi-surge") > -1) {
                        hasPsiSurge = true
                    }
                }
            }

        }

        return hasPsiSurge

    }

    render() {
        return (
            <View hidden={!this.hasPsiSurge()}>
                <Input name="UsePsiSurge" type="checkbox" inline />
                <LabelInline htmlFor="UsePsiSurge">Use Psi-surge</LabelInline>
            </View>
        )
    }
}
const UsePsiSurge = connect(mapStateToProps)(UsePsiSurgeView)

class WeaponsView extends Component {

    render() {
        return (
            <ShowDetails label="Weapons">
                {this.props.numberSequence(2).map(number => <Input key={number} name={"Weapon" + number} />)}
            </ShowDetails>
        )
    }
}
const Weapons = connect(mapStateToProps)(WeaponsView)

class WeaponmasteryView extends Component {

    hasWeaponmastery = () => {
        
        let {CharacterSheet} = {...this.props}

        let hasWeaponmastery = false

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number > 6) {

            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet["Magnakai" + i]
                if (kaiDiscipline !== undefined) {
                    if (kaiDiscipline.toLowerCase().indexOf("weaponmastery") > -1) {
                        hasWeaponmastery = true
                    }
                }
            }

        }

        return hasWeaponmastery

    }

    render() {
        return (
            <View hidden={!this.hasWeaponmastery()}>
                <ShowDetails label="Weaponmastery">
                    <View>
                        <Input name="WeaponmasterySpear" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasterySpear">Spear</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryDagger" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryDagger">Dagger</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryMace" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryMace">Mace</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryShortSword" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryShortSword">Short Sword</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryWarhammer" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryWarhammer">Warhammer</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryBow" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryBow">Bow</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryAxe" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryAxe">Axe</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasterySword" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasterySword">Sword</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryQuarterstaff" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryQuarterstaff">Quarterstaff</LabelInline>
                    </View>
                    <View>
                        <Input name="WeaponmasteryBroadsword" type="checkbox" inline/>
                        <LabelInline htmlFor="WeaponmasteryBroadsword">Broadsword</LabelInline>
                    </View>
                </ShowDetails>
                <HR/>
            </View>
        )
    }
}
const Weaponmastery = connect(mapStateToProps)(WeaponmasteryView)

class KaiView extends Component {

    state = {hideDetails: true}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {

        if (!this.props.CharacterSheet.Book || (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6)) {
            return null
        }

        return (
            <View>
                <ShowDetails label="Kai Disciplines">
                    {this.props.numberSequence(10).map(number => {
                        return (
                            <View>
                                <Input name={"Kai" + number} select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number <= number-5}/>
                            </View>
                        )
                    })}
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.disciplines}>Disciplines</Link> : null}
                    <Group name="Kai Level" select={this.props.KaiLevels}/>
                </ShowDetails>
                <HR/>
            </View>
        )
    }
}
const Kai = connect(mapStateToProps)(KaiView)

class MagnakaiView extends Component {

    render() {

        if (!this.props.CharacterSheet.Book || (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number < 6)) {
            return null
        }

        return (
            <View>
                <ShowDetails label="Magnakai Disciplines">
                    {this.props.numberSequence(10).map(number => {
                        return (
                            <View>
                                <Input name={"Magnakai" + number} select={this.props.MagnakaiDisciplines} optGroups={this.props.LoreCircles} select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number <= number+2}/>
                            </View>
                        )
                    })}
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.disciplines}>Disciplines</Link> : null}
                    <Group name="Magnakai Level" select={this.props.MagnakaiLevels}/>
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.improveddisciplines}>Improved Disciplines</Link> : null}
                </ShowDetails>
                <HR/>
            </View>
        )
    }
}
const Magnakai = connect(mapStateToProps)(MagnakaiView)

class LoreCirclesView extends Component {
    render() {
        return (
            <View hidden={!(this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6)}>
                <ShowDetails label="Lore Circles">
                    <View hidden={
                        this.props.checkLoreCircle("Circle Of Fire")
                        || this.props.checkLoreCircle("Circle Of Light")
                        || this.props.checkLoreCircle("Circle Of Solaris")
                        || this.props.checkLoreCircle("Circle Of The Spirit")
                        }>
                        <TextWithInputFont>None</TextWithInputFont>
                    </View>
                    <View>
                        <TextWithInputFont hidden={!this.props.checkLoreCircle("Circle Of Fire")}>Circle of Fire: +1 COMBAT +2 ENDURANCE</TextWithInputFont>
                    </View>
                    <View>
                        <TextWithInputFont hidden={!this.props.checkLoreCircle("Circle Of Light")}>Circle of Light: +3 ENDURANCE</TextWithInputFont>
                    </View> 
                    <View>
                        <TextWithInputFont hidden={!this.props.checkLoreCircle("Circle Of Solaris")}>Circle of Solaris: +1 COMBAT +3 ENDURANCE</TextWithInputFont>
                    </View>
                    <View>
                        <TextWithInputFont hidden={!this.props.checkLoreCircle("Circle Of The Spirit")}>Circle of the Spirit: +3 COMBAT +3 ENDURANCE</TextWithInputFont>
                    </View>
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.lorecircles}>Info</Link> : null}
                </ShowDetails>
                <HR/>
            </View>
        )
    }
}
const LoreCircles = connect(mapStateToProps)(LoreCirclesView)

class BeltPouchView extends Component {
    render() {
        return (
            <ShowDetails label="Belt Pouch">
                <Input name="BeltPouch" append="50 gold crowns max" type="number"/>
            </ShowDetails>
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
    render() {
        return (
            <ShowDetails label="Backpack Items">
                {this.props.numberSequence(8).map(number => {
                    return (
                        <View>
                            <Input name={"BackpackItem" + number} />
                        </View>
                    )
                })}
            </ShowDetails>
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
            <ShowDetails label="Special Items">
                {this.props.numberSequence(16).map(number => {
                    return (
                        <View>
                            <Input name={"SpecialItem" + number} />
                        </View>
                    )
                })}
            </ShowDetails>
        )
    }
}
const SpecialItems = connect(mapStateToProps)(SpecialItemsView)

class NotesView extends Component {
    render() {
        return (
            <ShowDetails label="Notes">
                <Input name="Notes" box/>
            </ShowDetails>
        )
    }
}
const Notes = connect(mapStateToProps)(NotesView)

class GameStateView extends Component {

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
            <ShowDetails label="Game State">
                <Input name="GameState" value={this.props.CharacterSheet.GameState} onChange={this.modifyGameState} box/>
                <Button onClick={this.loadGame}>{this.props.CharacterSheet.GameState === "" ? <Text>Start New Game</Text> : <Text>Load Custom Game State</Text>}</Button>
                <Button onClick={this.clear}>Clear Custom Game State</Button>
            </ShowDetails>
        )
    }
}
const GameState = connect(mapStateToProps)(GameStateView)

class SaveAndLoadRemotelyView extends Component {

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
            <ShowDetails label="Remote Game ID">
                <Input value={this.props.RequestFeedback.gameID} onChange={this.modifyGameID} noAutoSave/>
                <Label>Password</Label>
                <Input type="password" value={this.props.RequestFeedback.password} onChange={this.modifyPassword} noAutoSave/>
                <View>{this.props.RequestFeedback ? this.props.RequestFeedback.message : null}</View>
                <Button onClick={this.loadGameRemotely}>Load Game Remotely</Button>
                <Button onClick={this.saveGameRemotely}>{this.props.CharacterSheet.GameState === "" ? "Delete Game Remotely" : "Save Game Remotely"}</Button>
                <Input name="Autosave" type="checkbox" onChange={this.toggleAutoSave} inline/>
                <LabelInline htmlFor="Autosave">Auto save</LabelInline>
            </ShowDetails>
        )
    }
}
const SaveAndLoadRemotely = connect(mapStateToProps)(SaveAndLoadRemotelyView)