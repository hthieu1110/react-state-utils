import React from 'react';

// connectGlobalState ======================================================================= //
let _components = [];
let _globalState = {};

/**
 * Set globalState using function setGlobalState
 * @param WrappedComponent
 *
 * In wrapped component: just use this.globalState.varName
 * by get value from globalState, we add watcher automatically to component
 * and component will re-render only when this varName is changed from globalState
 *
 * For changing global state: use this.setGlobalState, everything just work like this.setState
 */
export function connectGlobalState(WrappedComponent) {
    WrappedComponent.prototype.setGlobalState = async function(newState) {
        // do not use array function, use 'function' instead for having 'this' pointing to WrappedComponent
        let component = this;

        let updatedAttrs = Object.keys(newState);

        // If value is Promise then we have to wait for having value
        let _update = new Promise(resolve => {
            updatedAttrs.forEach(async (attr) => {
                let newVal = newState[attr];
                if (typeof (newVal) === 'object' && 'then' in newVal) {
                    newVal = await newVal;
                }

                component.globalState[attr] = newVal;
                resolve();
            });
        });

        // Wait for all value updated
        await _update;

        // Update only component which listens to updated attr
        _components.forEach(_component => {
            let shouldUpdate = false;

            updatedAttrs.forEach(attr => {
                if (_component._global.has(attr)) {
                    shouldUpdate = true;
                }
            });

            shouldUpdate && _component.forceUpdate();
        });
    };

    WrappedComponent.prototype.componentWillMount = function() {
        let component = this;

        component._global = new Set();

        component.globalState = new Proxy({}, {
            get: (target, name) => {
                component._global.add(name);
                return _globalState[name];
            },
            set: (target, name, value) => {
                component._global.add(name);
                _globalState[name] = value;
                return true;
            }
        });

        _components.push(component);
    };

    return (props) => <WrappedComponent {...props} />
}
