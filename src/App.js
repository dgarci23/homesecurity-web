import './App.css';
import React from "react";
import "@cloudscape-design/global-styles/index.css"
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box"

import Grid from "@cloudscape-design/components/grid"
import Sensor from "./Sensor"
import ProfileModal from "./ProfileModal"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userId: "dgarci23",
      phone: "",
      email: "",
      sensors: []
    }
  }

  path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

  async componentDidMount() {
    await fetch(`${this.path}/user/${this.state.userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({name: data.name, userId: data.userId, phone: data.phone, email: data.email});
      });

      await fetch(`${this.path}/sensor/${this.state.userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({sensors: Object.keys(data)});
      });

      this.interval = setInterval(()=>{
        fetch(`${this.path}/sensor/${this.state.userId}`)
        .then(response => response.json())
        .then(data => {
          this.setState({...this.state, sensors: Object.keys(data)})
        });
      }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateProfile = (name, email, phone) => {
    let updatePath = new URL(`${this.path}/user/${this.state.userId}`);
    if (name!=="") {
      updatePath.searchParams.append("name",name);
      this.setState({name: name})
    } else {
      updatePath.searchParams.append("name",this.state.name);
    }
    if (email!=="") {
      updatePath.searchParams.append("email",email);
      this.setState({email: email})
    } else {
      updatePath.searchParams.append("email",this.state.email);
    }
    if (phone!=="") {
      updatePath.searchParams.append("phone",phone);
      this.setState({phone: phone})
    } else {
      updatePath.searchParams.append("phone",this.state.phone);
    }
    fetch(updatePath, {method:"PUT"});
}


  render () { 

    const sensors = []
    const colspan = []
    this.state.sensors.forEach((sensorId)=>{
      sensors.push(<Sensor userId={'dgarci23'} key={sensorId} sensorId={sensorId}/>);
      colspan.push({colspan:{default: 12, s:6, l:4}});
    });
    
    return (
    <div className="App">
      <Box padding="xxl">
        <Header variant="h1" title="App" description={`Welcome, ${this.state.name}`} actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button iconName="external" variant="normal" href="" target="_blank"></Button>
            <ProfileModal name={this.state.name} phone={this.state.phone} email={this.state.email} userId={this.state.userId}
            updateProfile={this.updateProfile}/>
          </SpaceBetween>
          }>
          Home Security System
        </Header>
        <Box margin={{top:"xxxl"}}>
          <Grid gridDefinition={colspan}>
            {sensors}
          </Grid>
          
        </Box>
      </Box>
    </div>
  );}
}

export default App;
