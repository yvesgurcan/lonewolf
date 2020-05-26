import React, { Component, useState, useEffect } from 'react'
import { Provider, connect } from 'react-redux'
import { useTranslation } from 'react-i18next';

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
    ButtonContainer, // mimicks React Native built-in component
} from './WebComponents'
import Styles from './Styles'

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
    ButtonContainer, // mimicks React Native built-in component
} from './NativeComponents'
import Styles from './StylesNative'
*/

// Shared Components
import {
    ShowDetails,
    Group,
    Input,
    Spacer,
} from './UtilityComponents'

let APItimeout = null

export default function App(props) {
    return (
        <Provider store={store}>
            <CharacterSheet/>
        </Provider>
    )
}

function CharacterSheetView(props) {
    const {t} = useTranslation();

    useEffect(() => {
        console.log("Set debugApp to true to see game state data.")

        props.dispatch({type: "INIT"})
        props.dispatch({type: "INIT_REQUEST_FEEDBACK"})
    }, []);

    return (
        <View style={Styles.Body}>
            <Header1>{t('character_sheet')}</Header1>
            <LinkToProject/>
            <GameMetaData/>
            <Book/>
            <Combat>
                <Endurance/>
            </Combat>
            <Weapons/>
            <Weaponmastery/>
            <Kai/>
            <Magnakai/>
            <LoreCircles/>
            <BeltPouch/>
            <Meals/>
            <Backpack/>
            <SpecialItems/>
            <Notes/>
            <GameState/>
            <SaveAndLoadRemotely/>
            <Spacer/>
        </View>
    )
}
const CharacterSheet = connect(mapStateToProps)(CharacterSheetView)

function LinkToProject() {
    return (
        <View>
            <Link href="https://www.projectaon.org/en/Main/Books" target="_blank">Project Aon</Link>
        </View>
    )
}

function GameMetaDataView(props) {
    const {t} = useTranslation();
    
    return (
        <ShowDetails label="game_id" startVisible>
            <Text>{props.RequestFeedback.actualGameID !== undefined ? String(props.RequestFeedback.actualGameID) : "-"}</Text>
            <Label>{t("game_started")}</Label>
            <Text>{props.CharacterSheet.GameStarted}</Text>
            <Label>{t("game_last_saved")}</Label>
            <Text>{props.CharacterSheet.GameSaved || "-"}</Text>
        </ShowDetails>
    )
}
const GameMetaData = connect(mapStateToProps)(GameMetaDataView)

function BookView(props) {
    const {t} = useTranslation();

    const onChange = (input) => {
        let bookNumber = 0

        let Book = props.Books.filter((book, index) => {
            if (String(index) + " - " + t(book.name) === input.value) {
                bookNumber = index
                return true
            }
            return false
        })[0]

        Book = {...Book, number: bookNumber}

        props.dispatch({type: "UPDATE_BOOK", value: Book, API: props.API, save: true})
    }

    return (
        <ShowDetails label="book">
            <Input name="Book" value={props.CharacterSheet.Book ? props.CharacterSheet.Book.number + " - " + t(props.CharacterSheet.Book.name) : null} select={props.Books} optGroups={props.BookGroups} showIndex onChange={onChange}/>
            {props.CharacterSheet.Book ? <BookLinks/> : null}
            <Section/>
        </ShowDetails>
    )
}
const Book = connect(mapStateToProps)(BookView)

function BookLinksView(props) {
    const {t} = useTranslation();

    return (
        <View>
            <Link target="_blank" href={props.CharacterSheet.Book.url + props.BookURLs.toc}>{t("table_contents")}</Link>
            {" "}|{" "}
            <Link target="_blank" href={props.CharacterSheet.Book.url + props.BookURLs.map}>{t("map")}</Link>
        </View>
    )
}
const BookLinks = connect(mapStateToProps)(BookLinksView)

function SectionView(props) {
    const {t} = useTranslation();

    return (
        <View>
            <Group name="section" type="number" numbers noPlusAndMinus/>
            {props.CharacterSheet.Book && props.CharacterSheet.Section ? <Link target="_blank" href={props.CharacterSheet.Book.url + props.BookURLs.section.prepend + props.CharacterSheet.Section + props.BookURLs.section.append}>{t("go_to_section")}</Link> : null}
        </View>
    )
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
            if (this.props.checkLoreCircle("Circle of Fire")) {
                bonuses.push(<Text key="circle of fire">+2&nbsp;(circle&nbsp;of&nbsp;fire) </Text>)
                bonusValues.push(2)
            }
            if (this.props.checkLoreCircle("Circle of Light")) {
                bonuses.push(<Text key="circle of light">+3&nbsp;(circle&nbsp;of&nbsp;light) </Text>)
                bonusValues.push(3)
            }
            if (this.props.checkLoreCircle("Circle of Solaris")) {
                bonuses.push(<Text key="circle of solaris">+3&nbsp;(circle&nbsp;of&nbsp;solaris) </Text>)
                bonusValues.push(3)
            }
            if (this.props.checkLoreCircle("Circle of the Spirit")) {
                bonuses.push(<Text key="circle of the spirit">+3&nbsp;(circle&nbsp;of&nbsp;the&nbsp;spirit) </Text>)
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
                <ButtonContainer title="Archmaster Curing: +20 (once/100 days)" hidden={this.hideArchmasterCuring()} onClick={this.archmasterCuring} inline/>
                <ButtonContainer title="Heal to Max" onClick={this.toMax} inline/>
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
                {/* endurance */}
                {this.props.children}
                <ShowDetails label="Enemy Combat Skill">
                    <EnemyCombatSkill/>
                    <EnemyEndurance/>
                    <EnemyImmunity/>
                </ShowDetails>
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

                                        if (CharacterSheet["Weaponmastery" + weaponTypeList[t]]) {

                                            if (CharacterSheet.MagnakaiLevel && (CharacterSheet.MagnakaiLevel.toLowerCase().indexOf("scion-kai") > -1 || CharacterSheet.MagnakaiLevel.toLowerCase().indexOf("archmaster") > -1)) {

                                                bonuses.push(<Text key="weaponmastery1">+4&nbsp;(weaponmastery:&nbsp;{weapon}) </Text>)
                                                bonusValues.push(4)
                                                matchFound = true
                                                break

                                            }
                                            else {

                                                bonuses.push(<Text key="weaponmastery2">+3&nbsp;(weaponmastery:&nbsp;{weapon}) </Text>)
                                                bonusValues.push(3)
                                                matchFound = true
                                                break   

                                            }

                                        }
                                    }
                                }

                                if (matchFound) break

                            }
                        }
                    }
                }
            }
        
            if (this.props.checkLoreCircle("Circle of Fire")) {
                bonuses.push(<Text key="circle of fire">+1&nbsp;(circle&nbsp;of&nbsp;fire) </Text>)
                bonusValues.push(1)
            }
            if (this.props.checkLoreCircle("Circle of Solaris")) {
                bonuses.push(<Text key="circle of solaris">+1&nbsp;(circle&nbsp;of&nbsp;solaris) </Text>)
                bonusValues.push(1)
            }
            if (this.props.checkLoreCircle("Circle of the Spirit")) {
                bonuses.push(<Text key="circle of the spirit">+3&nbsp;(circle&nbsp;of&nbsp;the&nbsp;spirit) </Text>)
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
                <ButtonContainer title="Update Combat Skill" onClick={this.addBonus} inline/>
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
                    <ButtonContainer
                        title="Fight"
                        onClick={this.fight}
                        disabled={
                            this.props.CharacterSheet.CombatSkill === undefined
                            || this.props.CharacterSheet.CombatSkill === ""
                            || this.props.CharacterSheet.EnemyCombatSkill === undefined
                            || this.props.CharacterSheet.EnemyCombatSkill === ""
                        }
                    />
                    <ButtonContainer
                        title="Update Endurance"
                        onClick={this.updateEndurance}
                        disabled={
                            this.props.CharacterSheet.CombatSkill === undefined
                            || this.props.CharacterSheet.CombatSkill === ""
                            || this.props.CharacterSheet.EnemyCombatSkill === undefined
                            || this.props.CharacterSheet.EnemyCombatSkill === ""
                            || this.props.CharacterSheet.Endurance === undefined
                            || this.props.CharacterSheet.Endurance === ""
                            || this.props.CharacterSheet.EnemyEndurance === undefined
                            || this.props.CharacterSheet.EnemyEndurance === ""
                        }
                    />
                    <ButtonContainer
                        title="Fight & Update Endurance"
                        onClick={this.fightAndUpdateEndurance}
                        disabled={
                            this.props.CharacterSheet.CombatSkill === undefined
                            || this.props.CharacterSheet.CombatSkill === ""
                            || this.props.CharacterSheet.EnemyCombatSkill === undefined
                            || this.props.CharacterSheet.EnemyCombatSkill === ""
                            || this.props.CharacterSheet.Endurance === undefined
                            || this.props.CharacterSheet.Endurance === ""
                            || this.props.CharacterSheet.EnemyEndurance === undefined
                            || this.props.CharacterSheet.EnemyEndurance === ""
                        }
                    />
                    <ButtonContainer title="Clear Enemy Stats" onClick={this.clearEnemyStats}/>
                </ShowDetails>
                <ShowDetails label="Random Number" startVisible>
                    <TextWithInputFont>{this.state.number} {this.props.CharacterSheet.WeaponmasteryBow ? "(bow weaponmastery: +3)" : null}</TextWithInputFont>
                    <ButtonContainer title="Generate Random Number" onClick={this.generateRandomNumber}/>
                </ShowDetails>
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
                <LabelInline htmlFor="UsePsiSurge" style={Styles.CheckboxLabel}>Use Psi-surge</LabelInline>
            </View>
        )
    }
}
const UsePsiSurge = connect(mapStateToProps)(UsePsiSurgeView)

class WeaponsView extends Component {

    render() {
        return (
            <ShowDetails label="Weapons">
                {this.props.numberSequence(2).map(number =>
                    <Input key={number} name={"Weapon" + number} />
                )}
            </ShowDetails>
        )
    }
}
const Weapons = connect(mapStateToProps)(WeaponsView)

class WeaponmasteryView extends Component {

    hasWeaponmastery = () => {
        
        let {CharacterSheet} = {...this.props}

        let hasWeaponmastery = false

        if (this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6) {

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
                    {["Spear","Dagger","Mace","Short Sword","Warhammer","Bow","Axe","Sword","Quarterstaff"].map(weapon => <WeaponMasteryCheckbox key={weapon} weapon={weapon}/>)}
                </ShowDetails>
            </View>
        )
    }
}
const Weaponmastery = connect(mapStateToProps)(WeaponmasteryView)

class WeaponMasteryCheckbox extends Component {
    render() {
        return (
            <View>
                <Input name={"Weaponmastery" + this.props.weapon.replace(/ /g,"")} type="checkbox" inline/>
                <LabelInline htmlFor={"Weaponmastery" + this.props.weapon.replace(/ /g,"")} style={Styles.CheckboxLabel}>{this.props.weapon}</LabelInline>
            </View>
        )
    }
}

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
                    {this.props.numberSequence(10).map(number => 
                        <Input key={"Kai" + number} name={"Kai" + number} select={this.props.KaiDisciplines} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number <= number-5}/>
                    )}
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.disciplines}>Disciplines</Link> : null}
                    <Group name="Kai Level" select={this.props.KaiLevels}/>
                </ShowDetails>
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
                <ShowDetails label="Discipline Magnakai">
                    {this.props.numberSequence(10).map(number =>
                        <Input key={"Magnakai" + number} name={"Magnakai" + number} select={this.props.MagnakaiDisciplines} optGroups={this.props.LoreCircles} hidden={!this.props.CharacterSheet.Book || this.props.CharacterSheet.Book.number <= number+2}/>
                    )}
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.disciplines}>Disciplines</Link> : null}
                    <Group name="Livello Magnakai" select={this.props.MagnakaiLevels}/>
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.improveddisciplines}>Improved Disciplines</Link> : null}
                </ShowDetails>
            </View>
        )
    }
}
const Magnakai = connect(mapStateToProps)(MagnakaiView)

class LoreCirclesView extends Component {
    render() {
        const loreCircles = [
            {
                name: "Circle of Fire",
                bonus: "+1 COMBAT +2 ENDURANCE",
            },
            {
                name: "Circle of Light",
                bonus: "+3 ENDURANCE",
            },
            {
                name: "Circle of Solaris",
                bonus: "+1 COMBAT +3 ENDURANCE",
            },
            {
                name: "Circle of the Spirit",
                bonus: "+3 COMBAT +3 ENDURANCE",
            },
        ]
        return (
            <View hidden={!(this.props.CharacterSheet.Book && this.props.CharacterSheet.Book.number >= 6)}>
                <ShowDetails label="Lore Circles">
                    <NoLoreCircle/>
                    {loreCircles.map(circle => <LoreCircleDescription key={circle.name} circle={circle} />)}
                    {this.props.CharacterSheet.Book ? <Link target="_blank" href={this.props.CharacterSheet.Book.url + this.props.BookURLs.lorecircles}>Info</Link> : null}
                </ShowDetails>
            </View>
        )
    }
}
const LoreCircles = connect(mapStateToProps)(LoreCirclesView)

class NoLoreCircleView extends Component {
    render() {
        return (
            <View hidden={
                this.props.checkLoreCircle("Circle of Fire")
                || this.props.checkLoreCircle("Circle of Light")
                || this.props.checkLoreCircle("Circle of Solaris")
                || this.props.checkLoreCircle("Circle of the Spirit")
                }>
                <TextWithInputFont>None</TextWithInputFont>
            </View>    
        )
    }
}
const NoLoreCircle = connect(mapStateToProps)(NoLoreCircleView)

class LoreCircleDescriptionView extends Component {
    render() {
        let circle = this.props.circle
        return (
            <View>
                <TextWithInputFont hidden={!this.props.checkLoreCircle(circle.name)}>{circle.name}: {circle.bonus}</TextWithInputFont>
            </View>
        )
    }
}
const LoreCircleDescription = connect(mapStateToProps)(LoreCircleDescriptionView)

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
                <ShowDetails label="Meals">
                    <Input name="Meals" type="number" />
                </ShowDetails>
            </View>
        )
    }
}
const Meals = connect(mapStateToProps)(MealsView)

class BackpackView extends Component {
    render() {
        return (
            <ShowDetails label="Backpack Items">
                {this.props.numberSequence(8).map(number => 
                    <Input key={"BackpackItem" + number} name={"BackpackItem" + number} />
                )}
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
                {this.props.numberSequence(16).map(number =>
                    <Input key={"SpecialItem" + number} name={"SpecialItem" + number} />
                )}
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
                <ButtonContainer title={this.props.CharacterSheet.GameState === "" ? "Start New Game" : "Load Custom Game State"} onClick={this.loadGame}/>
                <ButtonContainer title="Clear Custom Game State" onClick={this.clear}/>
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
                <TextWithInputFont>{this.props.RequestFeedback ? this.props.RequestFeedback.message : null}</TextWithInputFont>
                <ButtonContainer title="Load Game Remotely" onClick={this.loadGameRemotely}/>
                <ButtonContainer title={this.props.CharacterSheet.GameState === "" ? "Delete Game Remotely" : "Save Game Remotely"} onClick={this.saveGameRemotely}/>
                <Input name="Autosave" type="checkbox" onChange={this.toggleAutoSave} inline/>
                <LabelInline htmlFor="Autosave" style={Styles.CheckboxLabel}>Auto save</LabelInline>
            </ShowDetails>
        )
    }
}
const SaveAndLoadRemotely = connect(mapStateToProps)(SaveAndLoadRemotelyView)