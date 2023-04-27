import './App.css';
import React from "react";
import "@cloudscape-design/global-styles/index.css"
import Dashboard from './Dashboard';
import { Button } from '@cloudscape-design/components';

import {Authenticator} from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const formFields = {
  signUp : {
    email: {isRequired: true},
    name : {isRequired: true},
    phone_number : {isRequired: true}
  }
}

const signUpAttributes = ["email", "name", "name"];
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render () { 
    
    return (
    <Authenticator formFields={formFields} signUpAttributes={signUpAttributes}>
      {({signOut, user})=> {
        
        if (user.username !== this.state.userId) {
          this.setState({userId: user.username})
        }

        if (this.state.userId === "") {
          return (<div></div>);
        }

        return (
            <div className="App">
              <Dashboard userId={user.username}/>
              <Button onClick={signOut}>Sign out</Button>
            </div>
        )
      }}
    </Authenticator>
  );}
}

export default App;
