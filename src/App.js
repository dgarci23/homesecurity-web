import './App.css';
import React from "react";
import "@cloudscape-design/global-styles/index.css"
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box"

import Grid from "@cloudscape-design/components/grid"
import Sensor from "./Sensor"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userId: "dgarci23",
      status: "",
      sensors: {}
    }
  }

  async componentDidMount() {
    await fetch(`https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev/user/${this.state.userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({name: data.name, userId: data.userId});
      });

      await fetch(`https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev/sensor/${this.state.userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({sensors: data});
      });
  }

  render () { 
    
    const sensors = []
    let sensor = {}
    const colspan = []
    for (const sensorId in this.state.sensors) {
      sensor = this.state.sensors[sensorId];
      sensors.push(<Sensor userId={'dgarci23'} sensor={sensor} key={sensorId} sensorId={sensorId}/>);
      colspan.push({colspan:{default: 12, s:6, l:4}});
    }
    
    return (
    <div className="App">
      <Box padding="xxl">
        <Header variant="h1" title="App" description={`Welcome, ${this.state.name}`} actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button iconName="user-profile" variant="normal" href="" target="_blank"></Button>
            <Button iconName="external" variant="normal" href="" target="_blank"></Button>
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
