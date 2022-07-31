import { SetStateAction } from 'react';

export const stateUpdateWrapperUseJSON = (oldState: any, newState: any, updateFunction: (value: SetStateAction<any>) => void) => {
    if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
        updateFunction(newState);
    }
};

