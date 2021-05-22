import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';
import { getCurrentSpec, changeSpec, setManager, updateAuthInfo, logout } from "./swagger-manager";
import { getAuthInfo, getCurrentProfile, getProfiles, saveAuthInfo } from "./auth-manager";

class App extends Component {
  state = {
    currentSpec: null,
    currentProfile: getCurrentProfile(),
    profiles: getProfiles(),
    specs: null,
    configError: null,
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
    console.log(system);
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

    const updateUrl = system.specActions.updateUrl
    system.specActions.updateUrl = (...data) => {
      console.log(...data);
      updateUrl(...data)
    }

    setManager(system)

    updateAuthInfo(getAuthInfo(this.state.currentProfile))
  }

  componentDidMount = () => {
    fetch('/config.json')
    .catch(configError => this.setState({ configError }))
    .then(res => res.json())
    .catch(configError => this.setState({ configError }))
    .then(specs => {
      this.setState({
        specs,
        currentSpec: getCurrentSpec(specs)
      })
    })
  }

  render() {
    const { currentSpec, currentProfile, profiles, specs } = this.state
    const value = profiles.filter(v => v.value === currentProfile)[0]

    if (this.state.configError)
      return <div>
        {this.state.configError.toString()}
      </div>
    if (!specs)
      return <div></div>

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
        deepLinking
        docExpansion="none"
      />
      </div>
  }
}

export default App
