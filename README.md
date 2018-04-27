# react-state-utils
manage state global reactjs project

# ConnectGlobalState
Usage
  - Connect Component to state global
  ```sh
      class App extends Component {
        render() {
            return (
                <div>
                    <h3>App Component</h3>
                </div>
            );
        }
    }

    export default connectGlobalState(App);
  ```
  - Set state global ```this.setGlobalState({ [stateName]:[stateValue] })```
  ```sh
   this.setGlobalState({name:'Bob'})
  ```
  - Get state global ```this.globalState.[stateName]```
  ```sh
  this.globalState.name //Bob
  ```
