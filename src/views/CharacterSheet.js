import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { mapStateToProps } from '../lib/mapStateToProps';
import {
    View,
    Header1,
    Text,
    Link,
    TextWithInputFont,
    Label,
    LabelInline,
    ButtonContainer,
} from '../components/WebComponents';
import Styles from '../styles';
import { ShowDetails, Group, Input, Spacer } from '../components/UtilityComponents';

let APItimeout = null;

function CharacterSheetView(props) {
    const { t } = useTranslation();

    useEffect(() => {
        console.log('Set debugApp to true to see game state data.');

        props.dispatch({ type: 'INIT' });
        props.dispatch({ type: 'INIT_REQUEST_FEEDBACK' });
    }, []);

    return (
        <View style={Styles.Body}>
            <Header1>{t('CharacterSheet')}</Header1>
            <LinkToProject />
            <Language />
            <GameMetaData />
            <Book />
            <Combat>
                <Endurance />
            </Combat>
            <Weapons />
            <Weaponmastery />
            <Kai />
            <Magnakai />
            <LoreCircles />
            <BeltPouch />
            <Meals />
            <Backpack />
            <SpecialItems />
            <Notes />
            <GameState />
            <SaveAndLoadRemotely />
            <Spacer />
        </View>
    );
}
const CharacterSheet = connect(mapStateToProps)(CharacterSheetView);
export default CharacterSheet;

function LinkToProject() {
    return (
        <View>
            <Link
                href="https://www.projectaon.org/en/Main/Books"
                target="_blank"
            >
                Project Aon
            </Link>
        </View>
    );
}

function LanguageView(props) {
    const { t } = useTranslation();

    const langs = [{ name: 'en' }, { name: 'fr'}, { name: 'it' }];

    const onChange = (input) => {
        props.dispatch({
            type: 'CHANGE_LANG',
            value: input.value,
            API: props.API,
            save: true,
        });
        i18next.changeLanguage(input.value);
    };

    return (
        <ShowDetails label="Language">
            <Input
                key="Language"
                name="Language"
                select={langs}
                onChange={onChange}
            />
        </ShowDetails>
    );
}
const Language = connect(mapStateToProps)(LanguageView);

function GameMetaDataView(props) {
    const { t } = useTranslation();
    return (
        <ShowDetails label="GameId" startVisible>
            <Text>
                {props.RequestFeedback.actualGameID !== undefined
                    ? String(props.RequestFeedback.actualGameID)
                    : '-'}
            </Text>
            <Label>{t('GameStarted')}</Label>
            <Text>{props.CharacterSheet.GameStarted}</Text>
            <Label>{t('GameLastSaved')}</Label>
            <Text>{props.CharacterSheet.GameSaved || '-'}</Text>
        </ShowDetails>
    );
}
const GameMetaData = connect(mapStateToProps)(GameMetaDataView);

function BookView(props) {
    const onChange = (input) => {
        let bookNumber = 0;

        let Book = props.Books.filter((book, index) => {
            if (book.name === input.value) {
                bookNumber = index;
                return true;
            }
            return false;
        })[0];

        Book = { ...Book, number: bookNumber };

        props.dispatch({
            type: 'UPDATE_BOOK',
            value: Book,
            API: props.API,
            save: true,
        });
    };

    return (
        <ShowDetails label="Book">
            <Input
                name="Book"
                value={
                    props.CharacterSheet.Book
                        ? props.CharacterSheet.Book.name
                        : null
                }
                select={props.Books}
                optGroups={props.BookGroups}
                showIndex
                onChange={onChange}
            />
            {props.CharacterSheet.Book ? <BookLinks /> : null}
            <Section />
        </ShowDetails>
    );
}
const Book = connect(mapStateToProps)(BookView);

function BookLinksView(props) {
    const { t } = useTranslation();

    return (
        <View>
            <Link
                target="_blank"
                href={props.CharacterSheet.Book.url + props.BookURLs.toc}
            >
                {t('TableContents')}
            </Link>{' '}
            |{' '}
            <Link
                target="_blank"
                href={props.CharacterSheet.Book.url + props.BookURLs.map}
            >
                {t('Map')}
            </Link>
        </View>
    );
}
const BookLinks = connect(mapStateToProps)(BookLinksView);

function SectionView(props) {
    const { t } = useTranslation();

    return (
        <View>
            <Group name="Section" type="number" numbers noPlusAndMinus />
            {props.CharacterSheet.Book && props.CharacterSheet.Section ? (
                <Link
                    target="_blank"
                    href={
                        props.CharacterSheet.Book.url +
                        props.BookURLs.section.prepend +
                        props.CharacterSheet.Section +
                        props.BookURLs.section.append
                    }
                >
                    {t('GoToSection')}
                </Link>
            ) : null}
        </View>
    );
}
const Section = connect(mapStateToProps)(SectionView);

function EnduranceView(props) {
    const { t } = useTranslation();

    const getBonuses = (returnRawData) => {
        let bonuses = [];
        let bonusValues = [];
        let { CharacterSheet } = { ...props };

        // bonuses from special items
        for (let i = 1; i <= 16; i++) {
            let item = CharacterSheet['SpecialItem' + i];
            if (item !== undefined && item.length > 0) {
                let bonusTextIndex = item
                    .toLowerCase()
                    .indexOf(t('Endurance').toLowerCase());
                if (bonusTextIndex > -1) {
                    let bonusValueIndex = item
                        .substring(
                            Math.min(bonusTextIndex - 5, bonusTextIndex),
                            item.length
                        )
                        .indexOf('+');
                    if (bonusValueIndex > -1) {
                        let bonusValueAbsoluteIndex =
                            bonusTextIndex -
                            Math.min(5, bonusTextIndex) +
                            bonusValueIndex;
                        let bonusValue = item.substring(
                            bonusValueAbsoluteIndex,
                            bonusValueAbsoluteIndex + 3
                        );
                        bonuses.push(
                            <Text key={Math.random()}>
                                +{Number(Math.floor(bonusValue))}&nbsp;(
                                {t('SpecialItem').toLowerCase()}){' '}
                            </Text>
                        );
                        bonusValues.push(Number(Math.floor(bonusValue)));
                    }
                }
            }
        }

        if (CharacterSheet.Book && CharacterSheet.Book.number >= 6) {
            if (props.checkLoreCircle('Circle of Fire')) {
                bonuses.push(
                    <Text key="circle of fire">
                        +2&nbsp;(circle&nbsp;of&nbsp;fire){' '}
                    </Text>
                );
                bonusValues.push(2);
            }
            if (props.checkLoreCircle('Circle of Light')) {
                bonuses.push(
                    <Text key="circle of light">
                        +3&nbsp;(circle&nbsp;of&nbsp;light){' '}
                    </Text>
                );
                bonusValues.push(3);
            }
            if (props.checkLoreCircle('Circle of Solaris')) {
                bonuses.push(
                    <Text key="circle of solaris">
                        +3&nbsp;(circle&nbsp;of&nbsp;solaris){' '}
                    </Text>
                );
                bonusValues.push(3);
            }
            if (props.checkLoreCircle('Circle of the Spirit')) {
                bonuses.push(
                    <Text key="circle of the spirit">
                        +3&nbsp;(circle&nbsp;of&nbsp;the&nbsp;spirit){' '}
                    </Text>
                );
                bonusValues.push(3);
            }
        }

        if (returnRawData === true) {
            return bonusValues;
        }

        return bonuses.map((bonus) => {
            return bonus;
        });
    };

    // const addBonus = () => {

    //     let bonuses = getBonuses(true)

    //     props.dispatch({type: "MaxEndurance", value: (props.CharacterSheet.MaxEndurance || 0) + (bonuses.length > 0 ? bonuses.reduce((sum, value) => {return sum+value}) : 0), API: props.API, save: true})
    // }

    const toMax = () => {
        if (
            props.CharacterSheet.MaxEndurance === '' ||
            props.CharacterSheet.MaxEndurance === undefined
        ) {
            props.dispatch({ type: 'MaxEndurance', value: 0 });
        } else {
            // TODO: vedere cosa fa getBonuses()
            let totalMax = props.CharacterSheet.MaxEndurance;
            props.dispatch({
                type: 'Endurance',
                value: totalMax || 0,
                API: props.API,
                save: true,
            });
        }
    };

    const hideArchmasterCuring = () => {
        let { CharacterSheet } = { ...props };

        let hide = true;

        if (CharacterSheet.Book && CharacterSheet.Book.number >= 6) {
            const magnakaiLevel = props.getMagnakaiLevel();
            if (
                magnakaiLevel === 'magnakaiarchmaster' ||
                magnakaiLevel === 'magnakaikaigrandmaster'
            ) {
                const magnakaiDisciplines = props.getMagnakaiDisciplines();
                if (magnakaiDisciplines.includes('MagnakaiCuring')) {
                    if (CharacterSheet.Endurance <= 6) {
                        hide = false;
                    }
                }
            }
        }

        return hide;
    };

    const archmasterCuring = () => {
        props.dispatch({
            type: 'ARCHMASTER_CURING',
            API: props.API,
            save: true,
        });
    };

    return (
        <ShowDetails label="MaxEndurance">
            <Input name="MaxEndurance" type="number" />
            <Text>{getBonuses()}</Text>
            <Group name="Endurance" type="number" negativeNumbers />
            <ButtonContainer
                title="ArchmasterCuring"
                hidden={hideArchmasterCuring()}
                onClick={archmasterCuring}
                inline
            />
            <ButtonContainer title="HealToMax" onClick={toMax} inline />
        </ShowDetails>
    );
}
const Endurance = connect(mapStateToProps)(EnduranceView);

function Combat(props) {
    return (
        <View>
            <CombatSkill />
            {/* endurance */}
            {props.children}
            <ShowDetails label="EnemyCombatSkill">
                <EnemyCombatSkill />
                <EnemyEndurance />
                <EnemyImmunity />
            </ShowDetails>
            <CombatRatio />
        </View>
    );
}

function CombatSkillView(props) {
    const { t } = useTranslation();

    const getBonuses = (returnRawData) => {
        let bonuses = [];
        let bonusValues = [];
        let { CharacterSheet, KaiDisciplines } = { ...props };

        // fight without weapon malus
        if (!CharacterSheet['Weapon1'] && !CharacterSheet['Weapon2']) {
            let weaponlessMalus = -4;

            const magnakaiDisciplines = props.getMagnakaiDisciplines();
            if (magnakaiDisciplines.includes('MagnakaiWeaponmastery')) {
                const magnakaiLevel = props.getMagnakaiLevel();
                if (
                    magnakaiLevel === 'magnakaitutelary' ||
                    magnakaiLevel === 'magnakaiprincipalin' ||
                    magnakaiLevel === 'magnakaimentora'
                ) {
                    weaponlessMalus = -2;
                } else if (
                    magnakaiLevel === 'magnakaiscionkai' ||
                    magnakaiLevel === 'magnakaiarchmaster' ||
                    magnakaiLevel === 'magnakaikaigrandmaster'
                ) {
                    weaponlessMalus = -1;
                }
            }

            bonuses.push(
                <Text key="weaponless">
                    {weaponlessMalus} ({t('Weaponless').toLowerCase()}){' '}
                </Text>
            );
            bonusValues.push(weaponlessMalus);
        }

        if (props.CharacterSheet.Book && props.CharacterSheet.Book.number < 6) {
            // bonuses from kai disciplines
            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet['Kai' + i];
                if (kaiDiscipline !== undefined) {
                    if (
                        kaiDiscipline.toLowerCase().indexOf('kaimindblast') >
                            -1 &&
                        !props.CharacterSheet.ImmuneToMindblast
                    ) {
                        bonuses.push(
                            <Text key="mindblast">
                                +2&nbsp;({t('Mindblast')}){' '}
                            </Text>
                        );
                        bonusValues.push(2);
                    } else if (
                        kaiDiscipline.toLowerCase().indexOf('kaiweaponskill') >
                        -1
                    ) {
                        for (let x = 1; x <= 2; x++) {
                            let weapon = CharacterSheet['Weapon' + x];
                            let weaponSkill = KaiDisciplines.filter(function (
                                kai
                            ) {
                                // special case: do not consider a "short sword" as a regular sword
                                if (
                                    weapon &&
                                    weapon
                                        .toLowerCase()
                                        .indexOf('short sword') > -1 &&
                                    kai.weapon &&
                                    kai.weapon.toLowerCase() === 'sword'
                                ) {
                                    return false;
                                }
                                return (
                                    kai.name === kaiDiscipline &&
                                    kai.weapon &&
                                    weapon &&
                                    weapon
                                        .toLowerCase()
                                        .indexOf(t(kai.weapon).toLowerCase()) >
                                        -1
                                );
                            });
                            if (weaponSkill.length > 0) {
                                let key = `weaponskill_${weapon}`;
                                bonuses.push(
                                    <Text key={key}>
                                        +2&nbsp;(
                                        {t('Weaponskill').toLowerCase()}:&nbsp;
                                        {weapon}){' '}
                                    </Text>
                                );
                                bonusValues.push(2);
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            // bonuses from magnakai disciplines
            const magnakaiDisciplines = props.getMagnakaiDisciplines();
            if (magnakaiDisciplines.includes('MagnakaiPsiSurge')) {
                if (props.CharacterSheet.UsePsiSurge) {
                    bonuses.push(
                        <Text key="psi-surge">+4&nbsp;(psi-surge) </Text>
                    );
                    bonusValues.push(4);
                } else if (!props.CharacterSheet.ImmuneToMindblast) {
                    bonuses.push(
                        <Text key="mindblast">+2&nbsp;({t('Mindblast')}) </Text>
                    );
                    bonusValues.push(2);
                }
            }
            if (magnakaiDisciplines.includes('MagnakaiWeaponmastery')) {
                let weaponTypeList = [
                    'Spear',
                    'Dagger',
                    'Mace',
                    'Short Sword',
                    'Warhammer',
                    'Bow',
                    'Axe',
                    'Sword',
                    'Quarterstaff',
                    'Broadsword',
                ];

                for (let x = 1; x <= 2; x++) {
                    let weapon = CharacterSheet['Weapon' + x];

                    if (weapon !== undefined && weapon !== '') {
                        let matchFound = false;

                        for (let j = 0; j < 10; j++) {
                            if (
                                String(weapon)
                                    .toLowerCase()
                                    .replace(/ /g, '')
                                    .indexOf(
                                        t(weaponTypeList[j])
                                            .toLowerCase()
                                            .replace(/ /g, '')
                                    ) > -1
                            ) {
                                if (
                                    CharacterSheet[
                                        'Weaponmastery' +
                                            weaponTypeList[j].replace(/ /g, '')
                                    ]
                                ) {
                                    const magnakaiLevel = props.getMagnakaiLevel();
                                    if (
                                        magnakaiLevel === 'magnakaiscionkai' ||
                                        magnakaiLevel ===
                                            'magnakaiarchmaster' ||
                                        magnakaiLevel ===
                                            'magnakaikaigrandmaster'
                                    ) {
                                        bonuses.push(
                                            <Text key="weaponmastery1">
                                                +4&nbsp;(
                                                {t(
                                                    'Weaponmastery'
                                                ).toLowerCase()}
                                                :&nbsp;{weapon}){' '}
                                            </Text>
                                        );
                                        bonusValues.push(4);
                                        matchFound = true;
                                        break;
                                    } else {
                                        bonuses.push(
                                            <Text key="weaponmastery2">
                                                +3&nbsp;(
                                                {t(
                                                    'Weaponmastery'
                                                ).toLowerCase()}
                                                :&nbsp;{weapon}){' '}
                                            </Text>
                                        );
                                        bonusValues.push(3);
                                        matchFound = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (matchFound) break;
                    }
                }
            }

            if (props.checkLoreCircle('CircleFire')) {
                bonuses.push(
                    <Text key="circle of fire">
                        +1&nbsp;({t('CircleFire').toLowerCase()}){' '}
                    </Text>
                );
                bonusValues.push(1);
            }
            if (props.checkLoreCircle('CircleSolaris')) {
                bonuses.push(
                    <Text key="circle of solaris">
                        +1&nbsp;({t('CircleSolaris').toLowerCase()}){' '}
                    </Text>
                );
                bonusValues.push(1);
            }
            if (props.checkLoreCircle('CircleSpirit')) {
                bonuses.push(
                    <Text key="circle of the spirit">
                        +3&nbsp;({t('CircleSpirit').toLowerCase()}){' '}
                    </Text>
                );
                bonusValues.push(3);
            }
        }

        // bonuses from special items
        for (let i = 1; i <= 16; i++) {
            let item = CharacterSheet['SpecialItem' + i];
            if (item !== undefined && item.length > 0) {
                let bonusTextIndex = item
                    .toLowerCase()
                    .indexOf(t('CombatSkill').toLowerCase());
                if (bonusTextIndex > -1) {
                    let bonusValueIndex = item
                        .substring(
                            Math.min(bonusTextIndex - 5, bonusTextIndex),
                            item.length
                        )
                        .indexOf('+');
                    if (bonusValueIndex > -1) {
                        let bonusValueAbsoluteIndex =
                            bonusTextIndex -
                            Math.min(5, bonusTextIndex) +
                            bonusValueIndex;
                        let bonusValue = item.substring(
                            bonusValueAbsoluteIndex,
                            bonusValueAbsoluteIndex + 3
                        );
                        bonuses.push(
                            <Text key={Math.random()}>
                                +{Number(Math.floor(bonusValue))}&nbsp;(
                                {t('SpecialItem').toLowerCase()}){' '}
                            </Text>
                        );
                        bonusValues.push(Number(Math.floor(bonusValue)));
                    }
                }
            }
        }

        if (returnRawData === true) {
            return bonusValues;
        }

        return bonuses.map((bonus) => {
            return bonus;
        });
    };

    const addBonus = () => {
        let bonuses = getBonuses(true);

        props.dispatch({
            type: 'CombatSkill',
            value:
                (props.CharacterSheet.BaseCombatSkill || 0) +
                (bonuses.length > 0
                    ? bonuses.reduce((sum, value) => {
                          return sum + value;
                      })
                    : 0),
            API: props.API,
            save: true,
        });
    };

    return (
        <ShowDetails label="BaseCombatSkill">
            <Input name="BaseCombatSkill" type="number" />
            <ButtonContainer
                title="UpdateCombatSkill"
                onClick={addBonus}
                inline
            />
            <Text>{getBonuses()}</Text>
            <Group name="CombatSkill" type="number" />
        </ShowDetails>
    );
}
const CombatSkill = connect(mapStateToProps)(CombatSkillView);

function EnemyCombatSkill() {
    return (
        <View>
            <Input name="EnemyCombatSkill" type="number" />
        </View>
    );
}

function EnemyEndurance() {
    return (
        <View>
            <Group name="EnemyEndurance" type="number" />
        </View>
    );
}
function EnemyImmunityView(props) {
    const hasMindBlast = () => {
        let { CharacterSheet } = { ...props };

        let hasMindBlast = false;

        if (props.CharacterSheet.Book && props.CharacterSheet.Book.number < 6) {
            for (let i = 1; i <= 10; i++) {
                let kaiDiscipline = CharacterSheet['Kai' + i];
                if (kaiDiscipline !== undefined) {
                    if (
                        kaiDiscipline.toLowerCase().indexOf('kaimindblast') > -1
                    ) {
                        hasMindBlast = true;
                    }
                }
            }
            return hasMindBlast;
        } else {
            return props.getMagnakaiDisciplines().includes('MagnakaiPsiSurge');
        }
    };

    return (
        <View hidden={!hasMindBlast()}>
            <Group name="ImmuneToMindblast" type="checkbox" />
        </View>
    );
}
const EnemyImmunity = connect(mapStateToProps)(EnemyImmunityView);

function CombatRatioView(props) {
    const { t } = useTranslation();

    const [sNumber, setNumber] = useState('-');
    const [sDamage, setDamage] = useState({ enemy: 0, lonewolf: 0 });
    const [sRound, setRound] = useState(0);

    const fight = () => {
        let number = props.generateRandomNumber();
        let damageNumber = number;

        if (props.CharacterSheet.WeaponmasteryBow) {
            damageNumber += 3;
        }

        setNumber(number);
        let damage = props.fight(
            damageNumber,
            props.CharacterSheet.CombatRatio
        );
        setDamage(damage);
        setRound(sRound + 1);

        return damage;
    };

    const updateEndurance = (input, damage = null) => {
        if (
            damage == null &&
            sDamage.enemy === undefined &&
            sDamage.lonewolf === undefined
        )
            return null;

        if (props.CharacterSheet.UsePsiSurge) {
            damage = { ...(damage || sDamage) };
            damage.lonewolf = damage.lonewolf + 2;
        }

        props.dispatch({
            type: 'UPDATE_ENDURANCE',
            value: damage || sDamage,
            API: props.API,
            save: true,
        });
    };

    const fightAndUpdateEndurance = () => {
        let damage = fight();
        updateEndurance(null, damage);
    };

    const clearEnemyStats = () => {
        props.dispatch({
            type: 'CLEAR_ENEMY_STATS',
            API: props.API,
            save: true,
        });
        setDamage({ enemy: 0, lonewolf: 0 });
        setRound(0);
    };

    const generateRandomNumber = () => {
        setNumber(props.generateRandomNumber());
    };

    return (
        <View>
            <ShowDetails label="CombatRatio">
                <TextWithInputFont>
                    {props.CharacterSheet.CombatRatio === undefined ||
                    props.CharacterSheet.CombatRatio === null ||
                    isNaN(props.CharacterSheet.CombatRatio) ||
                    props.CharacterSheet.CombatSkill === '' ||
                    props.CharacterSheet.EnemyCombatSkill === ''
                        ? '-'
                        : props.CharacterSheet.CombatRatio}
                </TextWithInputFont>
                <Label>{t('CombatResults')}</Label>
                <TextWithInputFont>
                    {t('Enemy')}:{' '}
                    {sDamage.enemy !== undefined
                        ? isNaN(sDamage.enemy * -1)
                            ? t(sDamage.enemy)
                            : sDamage.enemy * -1
                        : '-'}{' '}
                    / {t('LoneWolf')}:{' '}
                    {sDamage.lonewolf !== undefined
                        ? isNaN(sDamage.lonewolf * -1)
                            ? t(sDamage.lonewolf)
                            : sDamage.lonewolf * -1
                        : '-'}{' '}
                    <Text hidden={!props.CharacterSheet.UsePsiSurge}>
                        (-2 psi-surge)
                    </Text>
                </TextWithInputFont>
                <Label>{t('Round')}</Label>
                <TextWithInputFont>{sRound}</TextWithInputFont>
                <UsePsiSurge />
                <ButtonContainer
                    title="Fight"
                    onClick={fight}
                    disabled={
                        props.CharacterSheet.CombatSkill === undefined ||
                        props.CharacterSheet.CombatSkill === '' ||
                        props.CharacterSheet.EnemyCombatSkill === undefined ||
                        props.CharacterSheet.EnemyCombatSkill === ''
                    }
                />
                <ButtonContainer
                    title="UpdateEndurance"
                    onClick={updateEndurance}
                    disabled={
                        props.CharacterSheet.CombatSkill === undefined ||
                        props.CharacterSheet.CombatSkill === '' ||
                        props.CharacterSheet.EnemyCombatSkill === undefined ||
                        props.CharacterSheet.EnemyCombatSkill === '' ||
                        props.CharacterSheet.Endurance === undefined ||
                        props.CharacterSheet.Endurance === '' ||
                        props.CharacterSheet.EnemyEndurance === undefined ||
                        props.CharacterSheet.EnemyEndurance === ''
                    }
                />
                <ButtonContainer
                    title="FightUpdateEndurance"
                    onClick={fightAndUpdateEndurance}
                    disabled={
                        props.CharacterSheet.CombatSkill === undefined ||
                        props.CharacterSheet.CombatSkill === '' ||
                        props.CharacterSheet.EnemyCombatSkill === undefined ||
                        props.CharacterSheet.EnemyCombatSkill === '' ||
                        props.CharacterSheet.Endurance === undefined ||
                        props.CharacterSheet.Endurance === '' ||
                        props.CharacterSheet.EnemyEndurance === undefined ||
                        props.CharacterSheet.EnemyEndurance === ''
                    }
                />
                <ButtonContainer
                    title="ClearEnemyStats"
                    onClick={clearEnemyStats}
                />
            </ShowDetails>
            <ShowDetails label="RandomNumber" startVisible>
                <TextWithInputFont>
                    {sNumber}{' '}
                    {props.CharacterSheet.WeaponmasteryBow
                        ? t('RandomBowmasteryBonus')
                        : null}
                </TextWithInputFont>
                <ButtonContainer
                    title="GenerateRandomNumber"
                    onClick={generateRandomNumber}
                />
            </ShowDetails>
        </View>
    );
}
const CombatRatio = connect(mapStateToProps)(CombatRatioView);

function UsePsiSurgeView(props) {
    const { t } = useTranslation();

    const hasPsiSurge = () => {
        if (
            props.CharacterSheet.Book &&
            props.CharacterSheet.Book.number >= 6
        ) {
            return props.getMagnakaiDisciplines().includes('MagnakaiPsiSurge');
        }

        return false;
    };

    return (
        <View hidden={!hasPsiSurge()}>
            <Input name="UsePsiSurge" type="checkbox" inline />
            <LabelInline htmlFor="UsePsiSurge" style={Styles.CheckboxLabel}>
                {t('UsePsiSurge')}
            </LabelInline>
        </View>
    );
}
const UsePsiSurge = connect(mapStateToProps)(UsePsiSurgeView);

function WeaponsView(props) {
    return (
        <ShowDetails label="Weapons">
            {props.numberSequence(2).map((number) => (
                <Input key={number} name={'Weapon' + number} />
            ))}
        </ShowDetails>
    );
}
const Weapons = connect(mapStateToProps)(WeaponsView);

function WeaponmasteryView(props) {
    const hasWeaponmastery = () => {
        if (
            props.CharacterSheet.Book &&
            props.CharacterSheet.Book.number >= 6
        ) {
            return props
                .getMagnakaiDisciplines()
                .includes('MagnakaiWeaponmastery');
        }

        return false;
    };

    return (
        <View hidden={!hasWeaponmastery()}>
            <ShowDetails label="Weaponmastery">
                {[
                    'Spear',
                    'Dagger',
                    'Mace',
                    'Short Sword',
                    'Warhammer',
                    'Bow',
                    'Axe',
                    'Sword',
                    'Quarterstaff',
                    'Broadsword',
                ].map((weapon) => (
                    <WeaponMasteryCheckbox key={weapon} weapon={weapon} />
                ))}
            </ShowDetails>
        </View>
    );
}
const Weaponmastery = connect(mapStateToProps)(WeaponmasteryView);

function WeaponMasteryCheckbox(props) {
    const { t } = useTranslation();

    return (
        <View>
            <Input
                name={'Weaponmastery' + props.weapon.replace(/ /g, '')}
                type="checkbox"
                inline
            />
            <LabelInline
                htmlFor={'Weaponmastery' + props.weapon.replace(/ /g, '')}
                style={Styles.CheckboxLabel}
            >
                {t(props.weapon)}
            </LabelInline>
        </View>
    );
}

function KaiView(props) {
    const { t } = useTranslation();

    // const [hideDetails, setHideDetails] = useState(true);

    // const toggleDetails = () => {
    //     setHideDetails(!hideDetails);
    // }

    if (
        !props.CharacterSheet.Book ||
        (props.CharacterSheet.Book && props.CharacterSheet.Book.number >= 6)
    ) {
        return null;
    }

    let currentKaiLevel = null;
    if (props.CharacterSheet.KaiLevel) {
        currentKaiLevel = props.KaiLevels.filter(
            (kaiLevel) =>
                t(kaiLevel.name).toLowerCase() ===
                t(props.CharacterSheet.KaiLevel).toLowerCase()
        )[0];
    } else {
        currentKaiLevel = props.KaiLevels[0];
    }

    return (
        <View>
            <ShowDetails label="KaiDisciplines">
                {props.numberSequence(10).map((number) => (
                    <Input
                        key={'Kai' + number}
                        name={'Kai' + number}
                        select={props.KaiDisciplines}
                        hidden={
                            currentKaiLevel == null ||
                            number > currentKaiLevel.disciplines
                        }
                    />
                ))}
                {props.CharacterSheet.Book ? (
                    <Link
                        target="_blank"
                        href={
                            props.CharacterSheet.Book.url +
                            props.BookURLs.disciplines
                        }
                    >
                        {t('Disciplines')}
                    </Link>
                ) : null}
                <Group name="KaiLevel" select={props.KaiLevels} />
            </ShowDetails>
        </View>
    );
}
const Kai = connect(mapStateToProps)(KaiView);

function MagnakaiView(props) {
    const { t } = useTranslation();

    if (
        !props.CharacterSheet.Book ||
        (props.CharacterSheet.Book && props.CharacterSheet.Book.number < 6)
    ) {
        return null;
    }

    let currentMagnakaiLevel = null;
    const magnakaiLevel = props.getMagnakaiLevel();
    if (magnakaiLevel) {
        currentMagnakaiLevel = props.MagnakaiLevels.filter(
            (level) => level.name.toLowerCase() === magnakaiLevel
        )[0];
    } else {
        currentMagnakaiLevel = props.MagnakaiLevels[0];
    }

    return (
        <View>
            <ShowDetails label="MagnakaiDisciplines">
                {props.numberSequence(10).map((number) => (
                    <Input
                        key={'Magnakai' + number}
                        name={'Magnakai' + number}
                        select={props.MagnakaiDisciplines}
                        optGroups={props.LoreCircles}
                        hidden={
                            currentMagnakaiLevel == null ||
                            number > currentMagnakaiLevel.disciplines
                        }
                    />
                ))}
                {props.CharacterSheet.Book ? (
                    <Link
                        target="_blank"
                        href={
                            props.CharacterSheet.Book.url +
                            props.BookURLs.disciplines
                        }
                    >
                        {t('Disciplines')}
                    </Link>
                ) : null}
                <Group name="MagnakaiLevel" select={props.MagnakaiLevels} />
                {props.CharacterSheet.Book ? (
                    <Link
                        target="_blank"
                        href={
                            props.CharacterSheet.Book.url +
                            props.BookURLs.improveddisciplines
                        }
                    >
                        {t('ImprovedDisciplines')}
                    </Link>
                ) : null}
            </ShowDetails>
        </View>
    );
}
const Magnakai = connect(mapStateToProps)(MagnakaiView);

function LoreCirclesView(props) {
    const loreCircles = [
        {
            name: 'CircleFire',
            bonus: 'CircleFireBonus',
        },
        {
            name: 'CircleLight',
            bonus: 'CircleLightBonus',
        },
        {
            name: 'CircleSolaris',
            bonus: 'CircleSolarisBonus',
        },
        {
            name: 'CircleSpirit',
            bonus: 'CircleSpiritBonus',
        },
    ];
    return (
        <View
            hidden={
                !(
                    props.CharacterSheet.Book &&
                    props.CharacterSheet.Book.number >= 6
                )
            }
        >
            <ShowDetails label="LoreCircles">
                <NoLoreCircle />
                {loreCircles.map((circle) => (
                    <LoreCircleDescription key={circle.name} circle={circle} />
                ))}
                {props.CharacterSheet.Book ? (
                    <Link
                        target="_blank"
                        href={
                            props.CharacterSheet.Book.url +
                            props.BookURLs.lorecircles
                        }
                    >
                        Info
                    </Link>
                ) : null}
            </ShowDetails>
        </View>
    );
}
const LoreCircles = connect(mapStateToProps)(LoreCirclesView);

function NoLoreCircleView(props) {
    const { t } = useTranslation();

    return (
        <View
            hidden={
                props.checkLoreCircle('CircleFire') ||
                props.checkLoreCircle('CircleLight') ||
                props.checkLoreCircle('CircleSolaris') ||
                props.checkLoreCircle('CircleSpirit')
            }
        >
            <TextWithInputFont>{t('None')}</TextWithInputFont>
        </View>
    );
}
const NoLoreCircle = connect(mapStateToProps)(NoLoreCircleView);

function LoreCircleDescriptionView(props) {
    const { t } = useTranslation();

    let circle = props.circle;
    return (
        <View>
            <TextWithInputFont hidden={!props.checkLoreCircle(circle.name)}>
                {t(circle.name)}: {t(circle.bonus)}
            </TextWithInputFont>
        </View>
    );
}
const LoreCircleDescription = connect(mapStateToProps)(
    LoreCircleDescriptionView
);

function BeltPouchView() {
    return (
        <ShowDetails label="BeltPouch">
            <Input
                name="BeltPouch"
                type="number"
            />
        </ShowDetails>
    );
}
const BeltPouch = connect(mapStateToProps)(BeltPouchView);

function MealsView(props) {
    return (
        <View
            hidden={
                !props.CharacterSheet.Book ||
                props.CharacterSheet.Book.number !== 1
            }
        >
            <ShowDetails label="Meals">
                <Input name="Meals" type="number" />
            </ShowDetails>
        </View>
    );
}
const Meals = connect(mapStateToProps)(MealsView);

function BackpackView(props) {
    return (
        <ShowDetails label="BackpackItems">
            {props.numberSequence(8).map((number) => (
                <Input
                    key={'BackpackItem' + number}
                    name={'BackpackItem' + number}
                />
            ))}
        </ShowDetails>
    );
}
const Backpack = connect(mapStateToProps)(BackpackView);

function SpecialItemsView(props) {
    // const [hideDetails, setHideDetails] = useState(true);

    // const toggleDetails = () => {
    //     setHideDetails(!hideDetails);
    // }

    return (
        <ShowDetails label="SpecialItems">
            {props.numberSequence(16).map((number) => (
                <Input
                    key={'SpecialItem' + number}
                    name={'SpecialItem' + number}
                />
            ))}
        </ShowDetails>
    );
}
const SpecialItems = connect(mapStateToProps)(SpecialItemsView);

function NotesView() {
    return (
        <ShowDetails label="Notes">
            <Input name="Notes" box />
        </ShowDetails>
    );
}
const Notes = connect(mapStateToProps)(NotesView);

function GameStateView(props) {
    const loadGame = () => {
        props.dispatch({
            type: 'LOAD_GAME',
            value: props.CharacterSheet.GameState,
            API: props.API,
        });

        if (props.CharacterSheet.GameState === '') {
            props.dispatch({ type: 'UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK' });
        }
    };
    const modifyGameState = (input) => {
        props.dispatch({
            type: 'MODIFY_GAME_STATE',
            value: input.value,
            API: props.API,
        });
    };
    const clear = () => {
        props.dispatch({ type: 'CLEAR_GAME_STATE', API: props.API });
    };

    return (
        <ShowDetails label="GameState">
            <Input
                name="GameState"
                value={props.CharacterSheet.GameState}
                onChange={modifyGameState}
                box
            />
            <ButtonContainer
                title={
                    props.CharacterSheet.GameState === ''
                        ? 'StartNewGame'
                        : 'LoadCustomGameState'
                }
                onClick={loadGame}
            />
            <ButtonContainer title="ClearCustomGameState" onClick={clear} />
        </ShowDetails>
    );
}
const GameState = connect(mapStateToProps)(GameStateView);

function SaveAndLoadRemotelyView(props) {
    const { t } = useTranslation();

    const modifyGameID = (input) => {
        props.dispatch({
            type: 'UPDATE_GAME_ID_REQUEST_FEEDBACK',
            value: input.value,
        });
    };
    const modifyPassword = (input) => {
        props.dispatch({
            type: 'UPDATE_PASSWORD_REQUEST_FEEDBACK',
            value: input.value,
        });
    };
    const loadGameRemotely = () => {
        clearTimeout(APItimeout);

        if (
            props.RequestFeedback.gameID === undefined ||
            props.RequestFeedback.gameID === ''
        ) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'Please enter the ID of the game.',
            });
        }

        if (
            props.RequestFeedback.password === undefined ||
            props.RequestFeedback.password === ''
        ) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'Please enter the password.',
            });
        }
        if (props.RequestFeedback.password.length < 8) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'This password is too short.',
            });
        }

        props.dispatch({
            type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
            value: 'Loading...',
        });

        props.API('loadgame', true);
    };
    const saveGameRemotely = () => {
        clearTimeout(APItimeout);

        if (
            props.CharacterSheet.GameState === '' &&
            (props.RequestFeedback.gameID === undefined ||
                props.RequestFeedback.gameID === '')
        ) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'Please enter the ID of the game you wish to delete.',
            });
        }

        if (
            props.RequestFeedback.password === undefined ||
            props.RequestFeedback.password === ''
        ) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'Please enter the password.',
            });
        }
        if (props.RequestFeedback.password.length < 8) {
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'This password is too short.',
            });
        }

        props.dispatch({
            type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
            value: 'Saving...',
        });

        props.API('savegame', true);
    };
    const toggleAutoSave = (input) => {
        if (
            props.RequestFeedback.gameID === undefined ||
            props.RequestFeedback.gameID === ''
        ) {
            props.dispatch({ type: 'Autosave', value: false });
            return props.dispatch({
                type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
                value: 'Please enter a game ID before enabling autosaving.',
            });
        }

        props.dispatch({
            type: 'Autosave',
            value: input.checked,
            API: props.API,
            save: true,
        });
        props.dispatch({
            type: 'UPDATE_VALIDATION_REQUEST_FEEDBACK',
            value: null,
        });
    };

    return (
        <ShowDetails label="RemoteGameID">
            <Input
                value={props.RequestFeedback.gameID}
                onChange={modifyGameID}
                noAutoSave
            />
            <Label>{t("Password")}</Label>
            <Input
                type="password"
                value={props.RequestFeedback.password}
                onChange={modifyPassword}
                noAutoSave
            />
            <TextWithInputFont>
                {props.RequestFeedback ? props.RequestFeedback.message : null}
            </TextWithInputFont>
            <ButtonContainer
                title="LoadGameRemotely"
                onClick={loadGameRemotely}
            />
            <ButtonContainer
                title={
                    props.CharacterSheet.GameState === ''
                        ? 'DeleteGameRemotely'
                        : 'SaveGameRemotely'
                }
                onClick={saveGameRemotely}
            />
            <Input
                name="Autosave"
                type="checkbox"
                onChange={toggleAutoSave}
                inline
            />
            <LabelInline htmlFor="Autosave" style={Styles.CheckboxLabel}>
                {t('Autosave')}
            </LabelInline>
        </ShowDetails>
    );
}
const SaveAndLoadRemotely = connect(mapStateToProps)(SaveAndLoadRemotelyView);
