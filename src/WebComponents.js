/* React components that rely on web HTML tags */

import React, { Component } from 'react'
import Styles from './Styles'

export class View extends Component {
    render() {
        return (
            <div {...this.props}/>
        )
    }
}

export class Header1 extends Component {
    render() {
        return (
            <h1>{this.props.children}</h1>
        )
    }
}

export class Text extends Component {
    render() {
        return (
            <span {...this.props}/>
        )
    }
}

export class Link extends Component {
    render() {
        return (
            <a href={this.props.href} target={this.props.target} onClick={this.props.onClick} style={Styles.Link}>{this.props.children}</a>
        )
    }
}

export class TextWithInputFont extends Component {
    render() {
        return (
            <Text className="input-font" {...this.props}/>
        )
    }
}

export class Label extends Component {
    render() {
        return (
            <View style={this.props.noColon ? null : Styles.Label} hidden={this.props.hidden} onClick={this.props.onClick}>
                <label style={{fontWeight: "bold"}}>{this.props.children}{this.props.noColon ? null : ":"}</label>
            </View>
        )
    }
}

export class LabelInline extends Component {
    render() {
        return (
            <label {...this.props} style={{...this.props.style, userSelect: "none"}}>{this.props.children}.</label>
        )
    }
}

export class TextInput extends Component {
    render() {
        return (
            <input {...this.props}/>
        )
    }
}

export class TextArea extends Component {
    render() {
        return (
            <textarea {...this.props}/>
        )
    }
}

export class Picker extends Component {
    render() {
        return (
            <select {...this.props} />
        )
    }
}

export class PickerItemGroup extends Component {
    render() {
        return <optgroup {...this.props} />
    }
}

export class PickerItem extends Component  {
    render() {
        return <option {...this.props} />
    }
}

export class Switch extends Component  {
    render() {
        // TODO: Actually implement this component to the main script
        return <input {...this.props} type="checkbox" />
    }
}

export class Button extends Component {
    onClick = (input) => {

        if (this.props.addFaceValue) {
            this.props.addFaceValue(this.props.children)
        }

        if (!this.props.onClick) return false
        this.props.onClick(input.target)
    }
    render() {

        if (this.props.hidden) return null
        return (
            <View style={this.props.inline ? {display: "inline-block"} : null}>
                <button style={{...Styles.Button, ...this.props.style}} onClick={this.onClick} disabled={this.props.disabled}>{this.props.children}</button>
            </View>
        )
        
    }
}