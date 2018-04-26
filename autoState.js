import React from "react";

// autoState ======================================================================= //
// TODO: Rewrite like connectGlobalState style: use auto add _global and set instead of list
let _autoStateGlobalState = null;
let _autoStateConnectedComponents = [];
export var globalStore = (component) => {
    _autoStateConnectedComponents.push(component);

    if (!_autoStateGlobalState) {
        _autoStateGlobalState = new Proxy({}, {
            get: (target, name) => {
                return target[name];
            },
            set: (target, name, value) => {
                target[name] = value;

                // Update only connect component
                _autoStateConnectedComponents.forEach(_component => {
                    if (_component._global.includes(name)) {
                        _component.forceUpdate();
                    }
                });

                return true;
            }
        })
    }

    return _autoStateGlobalState;
};


/**
 * Auto update localState, globalState when localState, globalState changed
 * @param WrappedComponent
 */
export function autoState(WrappedComponent) {
    WrappedComponent.prototype.componentWillMount = function() {
        let component = this;

        let autoUpdateState = {
            get: (target, name) => {
                return target[name];
            },
            set: (target, name, value) => {
                target[name] = value;
                component.forceUpdate();
                return true;
            }
        };

        let _localState = this.localState || {};
        component.localState = new Proxy(_localState, autoUpdateState);

        if (component._global) {
            component.globalState = globalStore(component);
        }
    };

    return (props) => <WrappedComponent {...props} />
}
