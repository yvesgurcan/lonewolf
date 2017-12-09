/* React Native equivalents of web HTML tags  */

/*
    Note: These components are not ready for React Native conversion yet. Resolve the TODOs first to export to a Native project.
*/

import React, { Component } from 'react'

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

export class Label extends Component {
    render() {
        return (
            <View style={{marginTop: "10px"}} hidden={this.props.hidden} onClick={this.props.onClick}>
                <Text style={{fontWeight: "bold"}}>{this.props.children}:</Text>
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

export class HR extends Component {
    render() {
        // TODO: substitute web stylesheet for a React Native stylesheet
        return (
            <hr style={{marginTop: "20px", marginBottom: "20px"}}/>
        )
    }
}