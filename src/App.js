import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';
import { getCurrentSpec, changeSpec, setManager, specs, updateAuthInfo, logout } from "./swagger-manager";
import { getAuthInfo, getCurrentProfile, getProfiles, saveAuthInfo } from "./auth-manager";

class AppBar extends Component {
  state = {
    currentSpec: getCurrentSpec(),
  }
  changeSpec = (newValue, actionMeta) => {
    const { value } = newValue
    console.log(value);
    changeSpec(value)

    this.setState({
      currentSpec: value,
    })
  };
  handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };
  componentDidMount() {
  }
  render() {
    const { currentSpec } = this.state
    return (
      <CreatableSelect
        onChange={this.changeSpec}
        // onInputChange={this.handleInputChange}
        options={specs}
        defaultValue={currentSpec}
      />
    );
  }
}


class App extends Component {
  state = {
    currentSpec: getCurrentSpec(),
    currentProfile: getCurrentProfile(),
    profiles: getProfiles(),
  }

  changeSpec = (newValue, _) => {
    changeSpec(newValue)

    this.setState({
      currentSpec: newValue,
    })
  };

  changeProfile = (newValue, _) => {
    console.log('changeProfile', newValue, _);
    if (!newValue) return

    logout(getAuthInfo(this.state.currentProfile))

    const authInfo = getAuthInfo(newValue.value)
    updateAuthInfo(authInfo)
    this.setState({
      currentProfile: newValue.value,
    })
  }
  addNewProfile = (inputValue, actionMeta) => {
    console.log('addNewProfile', inputValue, actionMeta);
    if (actionMeta.action !== "set-value") {
      this._newProfile = inputValue
      return
    } else if (!this._newProfile)
      return

    if (Object.keys(getProfiles()).includes(this._newProfile))
      return

    this.setState({
      currentProfile: this._newProfile,
      profiles: saveAuthInfo(this._newProfile, null),
    })
  }

  setup = (system) => {
    const authorize = system.authActions.authorize
    system.authActions._oldAuthorize = authorize
    system.authActions.authorize = (payload) => {
      this.setState({
        profiles: saveAuthInfo(this.state.currentProfile, payload),
      })

      authorize(payload)
    }

    const logout = system.authActions.logout
    system.authActions._oldLogout = logout
    system.authActions.logout = (payload) => {
      this.setState({
        profiles: saveAuthInfo(this.state.currentProfile, null),
      })

      logout(payload)
    }

    setManager(system)

    updateAuthInfo(getAuthInfo(this.state.currentProfile))
  }

  render() {
    const { currentSpec, currentProfile, profiles } = this.state
    const value = profiles.filter(v => v.value === currentProfile)[0]
    console.log(this.state);

    return <div>
      <div>
        <table style={{width:'50%', marginLeft:'auto'}}>
          <tbody>
            <tr>
              <td style={{textAlign: 'right'}}>Profile :</td>
              <td>
                <CreatableSelect
                  onChange={this.changeProfile}
                  onInputChange={this.addNewProfile}
                  options={getProfiles()}
                  value={value}
                />
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: 'right' }}>Spec :</td>
              <td>
                <CreatableSelect
                  onChange={this.changeSpec}
                  // onInputChange={this.handleInputChange}
                  options={specs}
                  value={currentSpec}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <SwaggerUI
        onComplete={this.setup}
        url={currentSpec.value}
      />
      </div>
  }
}

export default App
