/* React components that rely on web HTML tags */

import React, { Component } from 'react'
import Styles from './Styles'

export class View extends Component {
    render() {
        return (
            <div {...this.props} style={{...Styles.Boilerplate, ...this.props.style}}/>
        )
    }
}

export class Header1 extends Component {
    render() {
        return (
            <h1 style={{...Styles.Boilerplate, ...Styles.H1}}>{this.props.children}</h1>
        )
    }
}

export class Text extends Component {
    render() {
        return (
            <span {...this.props} style={{...Styles.Boilerplate, ...this.props.style}}/>
        )
    }
}

export class Link extends Component {
    state = {clicked: false, hovered: false}
    onClick = () => {
        this.setState({clicked: true})
        setTimeout(function() {this.clickedTimeout()}.bind(this), 500)
    }
    onHover = () => {
        this.setState({hovered: true})
    }
    onHoverOut = () => {
        this.setState({hovered: false})
    }
    clickedTimeout = () => {
        this.setState({clicked: false, hovered: false})
    }
    render() {
        return (
            <a
                href={this.props.href}
                target={this.props.target}
                onClick={this.onClick}
                onMouseEnter={this.onHover}
                onMouseMove={this.onHover}
                onMouseLeave={this.onHoverOut}
                style={{...(this.state.clicked ? Styles.LinkClicked : this.state.hovered ? Styles.LinkHovered : Styles.Link)}}>
                {this.props.children}
            </a>
        )
    }
}

export class TextWithInputFont extends Component {
    render() {
        return (
            <Text {...this.props} style={{...Styles.TextWithInputFont, ...this.props.style}}/>
        )
    }
}

export class Label extends Component {
    render() {
        return (
            <View style={{userSelect: "none", ...(this.props.noMargin ? null : Styles.LabelContainer)}} hidden={this.props.hidden} onClick={this.props.onClick}>
                <label style={Styles.Label}>{this.props.children}</label>
            </View>
        )
    }
}

export class LabelInline extends Component {
    render() {
        return (
            <label {...this.props} style={{...this.props.style}}>{this.props.children}.</label>
        )
    }
}

export class TextInput extends Component {
    render() {
        return (
            <input {...this.props} style={{...Styles.Boilerplate, ...this.props.style}}/>
        )
    }
}

export class TextArea extends Component {
    render() {
        return (
            <textarea {...this.props} style={{...Styles.Boilerplate, ...this.props.style}}/>
        )
    }
}

export class Picker extends Component {
    render() {
        return (
            <select {...this.props} style={{...Styles.Boilerplate, ...Styles.Select, ...this.props.style}}/>
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
    state = {clicked: false, hovered: false}
    onClick = (input) => {

        this.setState({clicked: true})
        setTimeout(function() {this.clickedTimeout()}.bind(this), 100)

        if (this.props.addFaceValue) {
            this.props.addFaceValue(this.props.title)
        }

        if (!this.props.onClick) return false
        this.props.onClick(input.target)
    }
    onHover = () => {
        this.setState({hovered: true})
    }
    onHoverOut = () => {
        this.setState({hovered: false})
    }
    clickedTimeout = () => {
        this.setState({clicked: false, hovered: false})
    }
    render() {

        if (this.props.hidden) return null
        return (
            <View style={this.props.inline ? {display: "inline-block"} : null}>
                <button
                    style={{...Styles.Boilerplate, ...(this.state.clicked ? Styles.ButtonClicked : this.state.hovered ? Styles.ButtonHovered : Styles.Button), ...this.props.style}}
                    onClick={this.onClick}
                    onMouseEnter={this.onHover}
                    onMouseMove={this.onHover}
                    onMouseLeave={this.onHoverOut}
                    disabled={this.props.disabled}>
                    {this.props.title}
                </button>
            </View>
        )
        
    }
}

export class ButtonContainer extends Component {
    render() {
        return (
            <View style={this.props.style}>
                <Button title={this.props.title} onClick={this.props.onClick} addFaceValue={this.props.addFaceValue} />
            </View>
        )
    }
}