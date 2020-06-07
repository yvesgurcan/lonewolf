import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const CharacterSheet = lazy(() => import('./CharacterSheet'));

export default () => {
    const { t } = useTranslation();
    return (
        <Suspense fallback={t('Loading...')}>
            <CharacterSheet />
        </Suspense>
    );
};
