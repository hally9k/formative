import { useEffect, useState, useReducer } from 'react';
import { Schema } from 'yup';

export { createFormReducer } from './reducer';
export { createDispatchers } from './actions';
export { createFormHooks } from './hooks';
export { createSelectors } from './selectors';

export function useForm<T>(defaultState: T, schema: Schema<T>) {
  const [hooks, updateHooks] = useState(null);

  const dispatchers = createDispatchers();

  const [state, dispatch] = useReducer(
    createFormReducer(dispatchers, defaultState, schema),
    defaultState
  );

  const selectors = createSelectors(state);
  const actionCreators = createFormActionCreators(actions, dispatch);

  useEffect(() => {
    updateHooks(createFormHooks());
  }, [state]);

  return hooks;
}
