const InitState = {
    error: false,
    message: '',
};

export default (State = InitState, Action) => {
    let NewState = { ...State };

    switch (Action.type) {
        case 'UPDATE_ACTUAL_GAME_ID_REQUEST_FEEDBACK':
            NewState.actualGameID = Action.value;
        // falls through
        case 'UPDATE_GAME_ID_REQUEST_FEEDBACK':
            NewState.gameID = Action.value;
            break;
        case 'UPDATE_PASSWORD_REQUEST_FEEDBACK':
            NewState.password = Action.value;
            break;
        case 'UPDATE_VALIDATION_REQUEST_FEEDBACK':
            NewState.message = Action.value;
            break;
        case 'UPDATE_REQUEST_FEEDBACK':
            NewState = { ...NewState, ...Action.value };
            break;

        case 'INIT_REQUEST_FEEDBACK':
        default:
            break;
    }

    return NewState;
}
