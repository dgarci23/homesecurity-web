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
import SensorModal from "./SensorModal"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userId: "dgarci23",
      status: "",
      sensors: []
    }
  }

  path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

  async componentDidMount() {
    await fetch(`${this.path}/user/${this.state.userId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({name: data.name, userId: data.userId});
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
          this.setState({...this.state, sensors: data})
        });
      }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
          <SensorModal/>
        </Box>
        <Button onClick={()=>this.reload()}>A</Button>
      </Box>
    </div>
  );}
}

export default App;
