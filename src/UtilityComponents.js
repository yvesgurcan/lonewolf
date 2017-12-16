import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from './mapStateToProps'
import Transition from 'react-transition-group/Transition'
// const Transition = null

// Web Components (React)
import {
    View, // mimicks React Native built-in component
    Text, // mimicks React Native built-in component
    Label,
    LabelInline,
    TextInput, // mimicks React Native built-in component
    TextArea,
    Picker, // mimicks React Native built-in component
    PickerItemGroup,
    PickerItem, // mimicks React Native built-in component (Picker.Item)
    Switch, // mimicks React Native built-in component
    Button, // mimicks React Native built-in component
} from './WebComponents'
import Styles from './Styles'

// Native Components (React Native)
/*
import {
    View,
    Text,
    TextInput,
    Picker,
    Switch,
    Button,
} from 'react-native'

import {
    Label,
    LabelInline,
    PickerItemGroup,
    PickerItem,
    TextArea, // mimicks Web built-in component
} from './NativeComponents'
import Styles from './StylesNative'
*/

export class ShowDetails extends Component {

    state = {hideDetails: !this.props.startVisible}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View style={Styles.Container}>
                <Label onClick={this.toggleDetails} noMargin><Text style={Styles.Arrow}>{this.state.hideDetails ? "▶" : "▼"}</Text> {this.props.label}</Label>
                <Details hideDetails={this.state.hideDetails}>
                    {this.props.children}
                </Details>
            </View>
        )
    }
}

class Details extends Component {
    render() {
        if (Transition) {
            return (
                <Transition
                    in={!this.props.hideDetails}
                    timeout={0}>
                    {
                        (status) =>
                    <View hidden={this.props.hideDetails} className={status}>
                        {this.props.children}
                    </View>
                    }
                </Transition>
            )
        }
        return (
            <View hidden={this.props.hideDetails}>
                {this.props.children}
            </View>
        )
    }
}

export class Group extends Component {
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
                <LabelInline htmlFor={this.props.name.replace(/ /g,"")} hidden={this.props.type !== "checkbox"} style={this.props.type !== "checkbox" ? null : {...Styles.CheckboxLabel}}>{this.props.name}{this.props.append ? <Text> ({this.props.append})</Text> : null}</LabelInline>

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
                value = (this.props.CharacterSheet[this.props.name] || "") + String(input)
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
                return (<PickerItemGroup key={optGroup.name} label={optGroup.name}/>)
            })

            let options = this.props.select.map((option, index) => {

                

                return <PickerItem key={option.name}>{this.props.showIndex ? index + " - " + option.name : option.name}</PickerItem>
            })
            
            this.props.optGroups.map((optGroup, index) => {
                options.splice(optGroup.position, 0, optGroups[index])
                return null
            })

            return (options)
        }
        else {

            return (
                this.props.select.map((option, index) => {return <PickerItem key={option.name}>{this.props.showIndex ? index + " - " + option.name : option.name}</PickerItem>})
            )

        }
    }

    render() {
        if (this.props.hidden) return null
        if (this.props.select) {
            return (
                <View>
                    <Picker
                        id={this.props.name}
                        style={{...Styles.Input, ...Styles.InputMaxSize}}
                        value={this.props.value || this.props.CharacterSheet[this.props.name] || ""}
                        onChange={this.onChange}
                    >
                        {this.generateSelectOptions()}
                    </Picker>
                </View>
            )
        }
        if (this.props.box) {
            return (
                <View>
                    <TextArea
                        id={this.props.name}
                        style={{...Styles.Input, ...Styles.InputMaxSize, ...Styles.InputTextArea}}
                        value={this.props.value || this.props.CharacterSheet[this.props.name] || ""}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                    />
                </View>
            )
        }
        if (this.props.type === "checkbox") {
            return (
                <Switch
                    disabled={this.props.disabled}
                    id={this.props.name}
                    checked={(this.props.CharacterSheet[this.props.name] || false)}
                    onChange={this.onChange}
                />
            )
        }
        return (
            <View style={{display: (this.props.inline ? "inline-block" : null)}}>
                <TextInput
                    disabled={this.props.disabled}
                    id={this.props.name}
                    style={{...(this.props.type === "number" && !this.props.noPlusAndMinus ? Styles.InputVariableSize1 : Styles.InputVariableSize2), ...Styles.TextInput, ...Styles.Input}}
                    value={this.props.value || (this.props.CharacterSheet[this.props.name] === undefined ? "" : String(this.props.CharacterSheet[this.props.name]))}
                    type={this.props.type}
                    onChange={this.onChange}
                    onBlur={this.props.noAutoSave ? null : this.onBlur}
                />
                <Clear
                    hidden={this.props.type === "number" && !this.props.noPlusAndMinus}
                    clear={this.clear} />
                <PlusAndMinus
                    hidden={this.props.type !== "number" || this.props.noPlusAndMinus}
                    type={this.props.type}
                    noPlusAndMinus={this.props.noPlusAndMinus}
                    decrement={this.decrement}
                    increment={this.increment} />
                <PositiveNumbers
                    numbers={this.props.numbers}
                    onChange={this.onChange} />
                <NegativeNumbers
                    negativeNumbers={this.props.negativeNumbers}
                    onChange={this.onChange} />
            </View>
        )
    }
}
export const Input = connect(mapStateToProps)(InputView)

class Clear extends Component {
    render() {
        return (
            <Button hidden={this.props.hidden} style={Styles.ButtonContainer} onClick={this.props.clear} inline title="X"/>
        )
    }
}

class PlusAndMinusView extends Component {
    render() {
        return (
            <View hidden={this.props.hidden} style={this.props.hidden ? null : {...Styles.ButtonContainer, display: "inline"}}>
                <Button onClick={this.props.decrement} inline title="-"/>
                <Button onClick={this.props.increment} inline title="+"/>
            </View>
        )
    }
}
export const PlusAndMinus = connect(mapStateToProps)(PlusAndMinusView)

class PositiveNumbersView extends Component {
    render() {
        return (
            <View hidden={!this.props.numbers}>
                {this.props.numberSequence(9).map(number =>
                    <Button key={number} addFaceValue={this.props.onChange} inline title={String(number)}/>
                )}
                <Button addFaceValue={this.props.onChange} inline title="0"/>
            </View>
        )
    }
}
export const PositiveNumbers = connect(mapStateToProps)(PositiveNumbersView)

class NegativeNumbersView extends Component {
    render() {
        return (
            <View hidden={!this.props.negativeNumbers}>
                {this.props.numberSequence(9).map(number =>
                    <Button key={number*-1} addFaceValue={this.props.onChange} inline title={String(number*-1)}/>
                )}
            </View>
        )
    }
}
export const NegativeNumbers = connect(mapStateToProps)(NegativeNumbersView)

export class Spacer extends Component {
    render() {
        return (
            <View style={Styles.Spacer}/>
        )
    }
}