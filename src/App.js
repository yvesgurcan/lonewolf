import React, { Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { store } from './store/store';

const CharacterSheet = lazy(() => import('./views/CharacterSheet'));

export default () => {
    const { t } = useTranslation();
    useEffect(() => {
        let storedState = localStorage.getItem('GameState');
        if (storedState !== null) {
            const { CharacterSheet } = JSON.parse(storedState);
            i18next.changeLanguage(CharacterSheet.Language);
        }
    }, [])
    return (
        <Provider store={store}>
            <Suspense fallback={t('Loading')}>
                <CharacterSheet />
            </Suspense>
        </Provider>
    );
};
