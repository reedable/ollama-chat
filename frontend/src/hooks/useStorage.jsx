import stringify from 'json-stable-stringify';
import { useEffect, useState } from 'react';

export function useSessionStorage(key, initialValue = null) {
  return useStorage(sessionStorage, key, initialValue);
}

export function useLocalStorage(key, initialValue = null) {
  return useStorage(localStorage, key, initialValue);
}

/**
 * Usage)
 *
 *  // initializes the value if the value is not yet in storage
 *  const [value, setValue, updateValue] = useSessionStorage('BL.Timer', {
 *    hello: 'HELLO',
 *    world: 'WORLD'
 *  });
 *
 *  // replaces the entire object
 *  setValue({
 *    foo: 'FOO',
 *    bar: 'BAR'
 *  });
 *
 *  // removes foo, updates bar to 'Boo', and adds baz
 *  updateValue({
 *    foo: null,
 *    bar: 'Boo',
 *    baz: 'BAZ'
 *  });
 *
 *  // updates bar to 'ABC' but does not modify baz
 *  updateValue({
 *    bar: 'ABC'
 *  });
 */
function useStorage(storage, key, initialValue = null) {
  const [error, setError] = useState();

  const [value, setValue] = useState(() => {
    const string = storage.getItem(key);

    try {
      if (string) {
        const object = JSON.parse(string);
        return object;
      }

      storage.setItem(key, stringify(initialValue));
      return initialValue;
    } catch (e) {
      storage.removeItem(key);
      setError(e);
    }
  });

  const updateValue = (update) => {
    const newValue = { ...value, ...update };

    Object.entries(update)
      .filter(([, value]) => value === null)
      .forEach(([key]) => delete newValue[key]);

    setValue(newValue);
  };

  const removeValue = () => {
    setValue(null);
  };

  useEffect(() => {
    if (value === null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, stringify(value));
    }
  }, [value]);

  return [value, setValue, updateValue, removeValue, error];
}
