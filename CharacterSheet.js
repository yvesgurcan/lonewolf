
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



class RandomNumber extends Component {
    generateNumber = () => {
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
