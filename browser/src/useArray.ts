import { Reducer, useCallback, useReducer } from 'react'

export type ArrayAction<T> = ArrayAddAction<T>
    | ArrayDeleteAction<T> | ArrayUpdateAction<T>

export interface ArrayAddAction<T> {
    type: 'Add';
    data: T;
}

export interface ArrayDeleteAction<T> {
    type: 'Remove';
    data: T;
}

export interface ArrayUpdateAction<T> {
    type: 'Update';
    data: T;
}

function ArrayReducer<T>(state: T[], action: ArrayAction<T>): T[] {
    switch (action.type) {
        case 'Add':
            return [...state, action.data]
        case 'Remove': {
            const index = state.indexOf(action.data)
            if (index >= 0) {
                return [...state.slice(0, index), ...state.slice(index + 1)]
            } else {
                return state
            }
        }
        case 'Update': {
            const index = state.indexOf(action.data)
            if (index >= 0) {
                return [...state.slice(0, index), action.data, ...state.slice(index + 1)]
            } else {
                return state
            }
        }
        default:
            throw new Error('unknown array action type')
    }
}

export interface UseArrayResult<T> {
    state: T[];
    add(data: T): void;
    remove(data: T): void;
    update(data: T): void;
}

export function useArray<T>(): UseArrayResult<T> {
    const [state, dispatch] = useReducer<Reducer<T[], ArrayAction<T>>>(ArrayReducer, [])
    const add = useCallback((data: T) => {
        dispatch({ type: 'Add', data })
    }, [])
    const remove = useCallback((data: T) => {
        dispatch({ type: 'Remove', data })
    }, [])
    const update = useCallback((data: T) => {
        dispatch({ type: 'Update', data })
    }, [])
    return {
        state,
        add,
        remove,
        update,
    }
}