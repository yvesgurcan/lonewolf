import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps } from './mapStateToProps'
import Transition from 'react-transition-group/Transition'

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

// Native Components (React Native)
/*
import {
    View,
    Text,
    TextInput,
    TextArea, // mimicks Web built-in component
    Picker,
    Switch,
    Button,
} from 'react-native'

import {
    Label,
    LabelInline,
    PickerItemGroup,
    PickerItem,
} from './NativeComponents'
*/

import Styles from './Styles'

export class ShowDetails extends Component {

    state = {hideDetails: !this.props.startVisible}

    toggleDetails = () => {
        this.setState({hideDetails: !this.state.hideDetails})
    }

    render() {
        return (
            <View style={Styles.Container}>
                <Label onClick={this.toggleDetails} noMargin><Text style={Styles.Arrow}>{this.state.hideDetails ? "▶" : "▼"}</Text> {this.props.label}</Label>
                <Transition
                    in={!this.state.hideDetails}
                    timeout={0}>
                    {
                        (status) =>
                    <View hidden={this.state.hideDetails} className={status}>
                        {this.props.children}
                    </View>
                    }
                </Transition>
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
                        style={{...Styles.Input, ...Styles.InputMaxSize, height: "200px"}}
                        value={this.props.value || this.props.CharacterSheet[this.props.name] || ""}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                    />
                </View>
            )
        }
        return (
            <View style={{display: (this.props.inline ? "inline-block" : null)}}>
                <TextInput
                    disabled={this.props.disabled}
                    id={this.props.name}
                    style={this.props.type === "checkbox" ? null : {width: (this.props.type === "number" && !this.props.noPlusAndMinus ? "calc(98% - 68px)" : "calc(98% - 36px)"), height: "26px", padding: "2px", ...Styles.Input}}
                    value={this.props.value || (this.props.CharacterSheet[this.props.name] === undefined ? "" : String(this.props.CharacterSheet[this.props.name]))}
                    checked={this.props.type === "checkbox" ? (this.props.CharacterSheet[this.props.name] || false) : null}
                    type={this.props.type}
                    onChange={this.onChange}
                    onBlur={this.props.type === "checkbox" || this.props.noAutoSave ? null : this.onBlur}
                />
                {(this.props.type !== "number" && this.props.type !== "checkbox") || this.props.noPlusAndMinus
                    ?
                    <Text style={Styles.ButtonContainer}>
                        <Button onClick={this.clear} inline>X</Button>
                    </Text>
                    : null
                }
                {this.props.type === "number" && !this.props.noPlusAndMinus
                    ?
                    <Text style={Styles.ButtonContainer}>
                        <Button onClick={this.decrement} inline>-</Button>
                        <Button onClick={this.increment} inline>+</Button>
                    </Text>
                    : null
                }
                {this.props.numbers
                    ? 
                    <View>
                        {this.props.numberSequence(9).map(number =>
                            <Button key={number} addFaceValue={this.onChange} inline>{number}</Button>
                        )}
                        <Button addFaceValue={this.onChange} inline>0</Button>
                    </View>
                    : null
                }
                {this.props.negativeNumbers
                    ? 
                    <View>
                        {this.props.numberSequence(9).map(number =>
                            <Button key={number*-1} addFaceValue={this.onChange} inline>{number*-1}</Button>
                        )}
                    </View>
                    : null
                }
            </View>
        )
    }
}
export const Input = connect(mapStateToProps)(InputView)

export class Spacer extends Component {
    render() {
        return (
            <View style={Styles.Spacer}/>
        )
    }
}