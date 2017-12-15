/* React Native equivalents of web HTML tags  */

/*
    Note: These components are not ready for React Native conversion yet. Resolve the TODOs first to export to a Native project.
*/

import React, { Component } from 'react'
import Styles from './StylesNative'

export class Header1 extends Component {
    render() {
        return (
            <Text>{this.props.children}</Text>
        )
    }
}

export class Link extends Component {
    render() {
        return (
            <Text href={this.props.href} target={this.props.target} onClick={this.props.onClick} style={{color: "-webkit-link", cursor: "pointer", userSelect: "none"}}>{this.props.children}</Text>
        )
    }
}

export class TextWithInputFont extends Component {
    render() {
        // TODO: substitute className for a stylesheet
        return (
            <Text className="input-font" {...this.props}/>
        )
    }
}

export class TextArea extends Component {
    render() {
        return (
            <TextInput {...this.props}/>
        )
    }
}

export class Label extends Component {
    render() {
        return (
            <View style={this.props.noColon ? null : Styles.Label} hidden={this.props.hidden} onClick={this.props.onClick}>
                <Text style={{fontWeight: "bold"}}>{this.props.children}{this.props.noColon ? null : ":"}</Text>
            </View>
        )
    }
}

export class LabelInline extends Component {
    render() {
        return (
            <Text {...this.props} style={{...this.props.style, userSelect: "none"}}>{this.props.children}.</Text>
        )
    }
}

export class PickerItemGroup extends Component {
    render() {
        // TODO: not sure exactly how to handle optgroup in React Native
        return <optgroup {...this.props} />
    }
}

export class PickerItem extends Component  {
    render() {
        return <Picker.Item {...this.props} />
    }
}