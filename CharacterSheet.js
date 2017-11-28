
class Input extends Component {
    onChange = (input) => {
        if (!this.props.onChange) return false
        this.props.onChange(input.target)
    }
    render() {
        return (
            <Text>
                <input name={this.props.name} value={this.props.value} type={this.props.type} onChange={this.onChange}/>
            </Text>
        )
    }
}

class Label extends Component {
    render() {
        return (
            <Text>
                <label>{this.props.children}</label>
            </Text>
        )
    }
}

class Group extends Component {
    render() {
        return (
            <View>
                <Label>{this.props.label}</Label>
                <Input name={this.props.name} value={this.props.value} type={this.props.type} onChange={this.props.on Change} />
            </View>
        )
    }
}

class Button extends Component {
    onClick = (input) => {
        if (!this.props.onClick) return false
        this.props.onClick(input.target)
    }
    render() {
        return (
            <button onClick={this.onClick}>{this.props.children}</button>
        )
    }
}

class RandomNumber extends Component {
    generateNumber = () => {
        let randomizer = [
            1,5,7,3,6,9,0,1,7,9,
            3,9,2,8,1,7,4,9,7,8,
            6,1,0,7,3,0,5,4,6,7,
            0,2,8,9,2,9,6,0,2,4,
            5,9,6,4,8,2,8,5,6,3,
            0,3,1,3,9,7	5,0,1,5,
            5,8,2,5,1,3,6,4,3,9,
            7,0,4,8,6,4,5,1,4,2,
            4,6,8,3,2,0,1,7,2,5,
            8,3,7,0,9,6,2,4,8,1,
        ]
        let random = Math.floor(Math.random() * randomizer.length)
        this.setState({number: randomizer[random]})
    }
    render() {
        return (
            <View>
                <Label>Number: {this.state.number}</Label>
                <Button onClick={this.generateNumber}>Random Number</Button>
            </View>
        )
    }
}
