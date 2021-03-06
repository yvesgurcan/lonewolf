import React, { useState } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import { useTranslation } from 'react-i18next';
import { mapStateToProps } from '../lib/mapStateToProps';
import {
    View,
    Text,
    Label,
    LabelInline,
    TextInput,
    TextArea,
    Picker,
    PickerItemGroup,
    PickerItem,
    Switch,
    Button,
} from './WebComponents';
import Styles from '../styles';

export function ShowDetails(props) {
    const { t } = useTranslation();
    const [hideDetails, setHideDetails] = useState(!props.startVisible);

    const toggleDetails = () => {
        setHideDetails(!hideDetails);
    };

    return (
        <View style={Styles.Container}>
            <Label onClick={toggleDetails} noMargin>
                <Text style={Styles.Arrow}>{hideDetails ? '▶' : '▼'}</Text>{' '}
                {t(props.label)}
            </Label>
            <Details hideDetails={hideDetails}>{props.children}</Details>
        </View>
    );
}

function Details(props) {
    if (Transition) {
        return (
            <Transition in={!props.hideDetails} timeout={0}>
                {(status) => (
                    <View hidden={props.hideDetails} className={status}>
                        {props.children}
                    </View>
                )}
            </Transition>
        );
    }

    return <View hidden={props.hideDetails}>{props.children}</View>;
}

export function Group(props) {
    const { t } = useTranslation();

    return (
        <View hidden={props.hidden}>
            <Label hidden={props.type === 'checkbox'}>
                {t(props.name)}
                {props.append ? <Text> ({t(props.append)})</Text> : null}
            </Label>
            <Input
                name={props.name.replace(/ /g, '')}
                type={props.type}
                numbers={props.numbers}
                negativeNumbers={props.negativeNumbers}
                noPlusAndMinus={props.noPlusAndMinus}
                select={props.select}
                box={props.box}
                inline={props.type === 'checkbox'}
            />
            <LabelInline
                htmlFor={props.name.replace(/ /g, '')}
                hidden={props.type !== 'checkbox'}
                style={
                    props.type !== 'checkbox'
                        ? null
                        : { ...Styles.CheckboxLabel }
                }
            >
                {t(props.name)}
                {props.append ? <Text> ({t(props.append)})</Text> : null}
            </LabelInline>
        </View>
    );
}

function InputView(props) {
    const { t } = useTranslation();

    const onChange = (input) => {
        if (props.onChange) {
            return props.onChange(input.target);
        }

        let value = null;

        if (!input.target) {
            if (props.negativeNumbers) {
                value = (props.CharacterSheet[props.name] || 0) + Number(input);
            } else {
                value =
                    (props.CharacterSheet[props.name] || '') + String(input);
            }

            return props.dispatch({
                type: props.name,
                value: value,
                API: props.API,
                save: true,
            });
        }

        value = input.target.value;

        if (props.type === 'checkbox') {
            value = input.target.checked;
        }

        props.dispatch({
            type: props.name,
            value: value,
            API: props.API,
            save: props.type === 'checkbox',
        });
    };

    const onBlur = () => {
        props.dispatch({ type: 'AUTO_SAVE', API: props.API, save: true });
    };

    const increment = () => {
        props.dispatch({
            type: 'INCREMENT_' + props.name,
            API: props.API,
            save: true,
        });
    };

    const decrement = () => {
        props.dispatch({
            type: 'DECREMENT_' + props.name,
            API: props.API,
            save: true,
        });
    };

    const clear = () => {
        if (!props.name) {
            return props.onChange('');
        }

        props.dispatch({
            type: props.name,
            value: '',
            API: props.API,
            save: true,
        });
    };

    const generateSelectOptions = () => {
        if (props.optGroups) {
            let optGroups = props.optGroups.map((optGroup, index) => {
                return (
                    <PickerItemGroup
                        key={optGroup.name}
                        label={t(optGroup.name)}
                    />
                );
            });

            let options = props.select.map((option, index) => {
                return (
                    <PickerItem key={option.name} value={option.name}>
                        {props.showIndex
                            ? index + ' - ' + t(option.name)
                            : t(option.name)}
                    </PickerItem>
                );
            });

            props.optGroups.map((optGroup, index) => {
                options.splice(optGroup.position, 0, optGroups[index]);
                return null;
            });

            return options;
        } else {
            return props.select.map((option, index) => {
                return (
                    <PickerItem key={option.name} value={option.name}>
                        {props.showIndex
                            ? index + ' - ' + t(option.name)
                            : t(option.name)}
                    </PickerItem>
                );
            });
        }
    };

    if (props.hidden) return null;
    if (props.select) {
        return (
            <View>
                <Picker
                    id={props.name}
                    style={{ ...Styles.Input, ...Styles.InputMaxSize }}
                    value={
                        props.value || props.CharacterSheet[props.name] || ''
                    }
                    onChange={onChange}
                >
                    {generateSelectOptions()}
                </Picker>
            </View>
        );
    }
    if (props.box) {
        return (
            <View>
                <TextArea
                    id={props.name}
                    style={{
                        ...Styles.Input,
                        ...Styles.InputMaxSize,
                        ...Styles.InputTextArea,
                    }}
                    value={
                        props.value || props.CharacterSheet[props.name] || ''
                    }
                    onChange={onChange}
                    onBlur={onBlur}
                />
            </View>
        );
    }
    if (props.type === 'checkbox') {
        return (
            <Switch
                disabled={props.disabled}
                id={props.name}
                checked={props.CharacterSheet[props.name] || false}
                onChange={onChange}
            />
        );
    }
    return (
        <View style={{ display: props.inline ? 'inline-block' : null }}>
            <TextInput
                disabled={props.disabled}
                id={props.name}
                style={{
                    ...(props.type === 'number' && !props.noPlusAndMinus
                        ? Styles.InputVariableSize1
                        : Styles.InputVariableSize2),
                    ...Styles.TextInput,
                    ...Styles.Input,
                }}
                value={
                    props.value ||
                    (props.CharacterSheet[props.name] === undefined
                        ? ''
                        : String(props.CharacterSheet[props.name]))
                }
                type={props.type}
                onChange={onChange}
                onBlur={props.noAutoSave ? null : onBlur}
            />
            <Clear
                hidden={props.type === 'number' && !props.noPlusAndMinus}
                clear={clear}
            />
            <PlusAndMinus
                hidden={props.type !== 'number' || props.noPlusAndMinus}
                type={props.type}
                noPlusAndMinus={props.noPlusAndMinus}
                decrement={decrement}
                increment={increment}
            />
            <PositiveNumbers numbers={props.numbers} onChange={onChange} />
            <NegativeNumbers
                negativeNumbers={props.negativeNumbers}
                onChange={onChange}
            />
        </View>
    );
}
export const Input = connect(mapStateToProps)(InputView);

function Clear(props) {
    return (
        <Button
            hidden={props.hidden}
            style={Styles.ButtonContainer}
            onClick={props.clear}
            inline
            title="X"
        />
    );
}

function PlusAndMinusView(props) {
    return (
        <View
            hidden={props.hidden}
            style={
                props.hidden
                    ? null
                    : { ...Styles.ButtonContainer, display: 'inline' }
            }
        >
            <Button onClick={props.decrement} inline title="-" />
            <Button onClick={props.increment} inline title="+" />
        </View>
    );
}
export const PlusAndMinus = connect(mapStateToProps)(PlusAndMinusView);

function PositiveNumbersView(props) {
    return (
        <View hidden={!props.numbers}>
            {props.numberSequence(9).map((number) => (
                <Button
                    key={number}
                    addFaceValue={props.onChange}
                    inline
                    title={String(number)}
                />
            ))}
            <Button addFaceValue={props.onChange} inline title="0" />
        </View>
    );
}
export const PositiveNumbers = connect(mapStateToProps)(PositiveNumbersView);

function NegativeNumbersView(props) {
    return (
        <View hidden={!props.negativeNumbers}>
            {props.numberSequence(9).map((number) => (
                <Button
                    key={number * -1}
                    addFaceValue={props.onChange}
                    inline
                    title={String(number * -1)}
                />
            ))}
        </View>
    );
}
export const NegativeNumbers = connect(mapStateToProps)(NegativeNumbersView);

export function Spacer() {
    return <View style={Styles.Spacer} />;
}
