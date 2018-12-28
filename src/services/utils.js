export const saveStateToLocalStorage = state => {
    // for every key in the state
    for (let key in state) {
        // save to localStorage
        localStorage.setItem(key, JSON.stringify(state[key]));
    }
};

export const hydrateStateWithLocalStorage = state => {
    let newState = {};

    for (let key in state) {
        // if the key exists in localStorage
        if (localStorage.hasOwnProperty(key)) {
            // get the key's value from localStorage
            let value = localStorage.getItem(key);
            // parse the localStorage string
            try {
                value = JSON.parse(value);
            } catch (e) {
                // handle errors
            }
            newState = {...newState, ...{[key]: value}};
        }
    }
    return newState;
};

export const getValueFromKeyLocalStorage = key => {
    let newVar = '';
    if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (e) {
            // handle errors
        }
        newVar = value;
    }
    return newVar;

};
