import { createStore } from 'redux';
import { combineReducers } from 'redux';
import RequestFeedback from './RequestFeedback';
import CharacterSheet from './CharacterSheet';

const reducers = combineReducers({
    RequestFeedback,
    CharacterSheet,
});

export const store = createStore(
    reducers,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
