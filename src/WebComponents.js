/* React components that rely on web HTML tags */

import React, { Component, useState } from 'react'
import Styles from './Styles'
import { useTranslation } from 'react-i18next'

export function View(props) {
    return (
        <div {...props} style={{...Styles.Boilerplate, ...props.style}}/>
    )
}

export function Header1(props) {
    return (
        <h1 style={{...Styles.Boilerplate, ...Styles.H1}}>{props.children}</h1>
    )
}

export function Text(props) {
    return (
        <span {...props} style={{...Styles.Boilerplate, ...props.style}}/>
    )
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
            <label {...this.props} style={{...this.props.style}}>{this.props.children}</label>
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

export function Picker(props) {
    return (
        <select {...props} style={{...Styles.Boilerplate, ...Styles.Select, ...props.style}}/>
    )
}

export function PickerItemGroup(props) {
    return <optgroup {...props} />
}

export function PickerItem(props) {
    return <option {...props} />
}

export function Switch(props)  {
    // TODO: Actually implement this component to the main script
    return <input {...props} type="checkbox" />
}

export function Button(props) {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    const onClick = (input) => {
        setClicked(true);
        setTimeout(function() {clickedTimeout()}, 100)

        if (props.addFaceValue) {
            props.addFaceValue(props.title)
        }

        if (!props.onClick) return false
        props.onClick(input.target)
    }
    const onHover = () => {
        setHovered(true);
    }
    const onHoverOut = () => {
        setHovered(false);
    }
    const clickedTimeout = () => {
        setClicked(false);
        setHovered(false);
    }

    if (props.hidden) return null
    return (
        <View style={props.inline ? {display: "inline-block"} : null}>
            <button
                style={{...Styles.Boilerplate, ...(clicked ? Styles.ButtonClicked : hovered ? Styles.ButtonHovered : Styles.Button), ...props.style}}
                onClick={onClick}
                onMouseEnter={onHover}
                onMouseMove={onHover}
                onMouseLeave={onHoverOut}
                disabled={props.disabled}>
                {props.title}
            </button>
        </View>
    )
}

export function ButtonContainer(props) {
    const {t} = useTranslation();

    return (
        <View style={props.style}>
            <Button 
                title={t(props.title)} 
                disabled={props.disabled}
                hidden={props.hidden}
                onClick={props.onClick} 
                addFaceValue={props.addFaceValue} 
            />
        </View>
    )
}