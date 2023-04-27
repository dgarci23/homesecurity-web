import React from 'react';
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import Icon from "@cloudscape-design/components/icon";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import Badge from '@cloudscape-design/components/badge';

Amplify.configure(awsconfig);

class Sensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : this.props.userId,
            sensorId : this.props.sensorId,
            status : "",
            name : "",
            type : "",
            hasBattery : true
        }
    }

    async componentDidMount() {
        const user = await Amplify.Auth.currentAuthenticatedUser();
        const token = user.signInUserSession.idToken.jwtToken;
        fetch(`${this.path}/user/sensor/${user.username}`, {method:"GET", headers:{Authorization:token}})
                .then(response => response.json())
                .then(data => { this.setState({
                    ...this.state,
                    status : data[this.state.sensorId].sensorStatus,
                    name : data[this.state.sensorId].sensorName,
                    type : data[this.state.sensorId].sensorType,
                    hasBattery : data[this.state.sensorId].battery
                });});

        this.interval = setInterval(async ()=>{
            fetch(`${this.path}/user/sensor/${user.username}`, {method:"GET", headers:{Authorization:token}})
                .then(response => response.json())
                .then(data => {this.setState({status: data[this.state.sensorId].sensorStatus, hasBattery : data[this.state.sensorId].battery});});
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

    async changeStatus(status){
        const user = await Amplify.Auth.currentAuthenticatedUser();
        const token = user.signInUserSession.idToken.jwtToken;
        await fetch(`${this.path}/user/sensor/dgarci23?sensorId=${this.state.sensorId}&sensorStatus=${status}`,
            {method:'PUT', headers: {Authorization:token}})
          .then(response => response.json())
          .then(data => {return fetch(`https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev/sensor/${user.username}`)})
          .then(res => res.json())
          .then(result => {this.setState({status: result[this.state.sensorId].sensorStatus});})
    }

    getIcon(){
        if (this.state.status==="triggered"){
            return <Icon name="status-warning" variant="error" size={"big"}/>
        } else if (this.state.status==="armed"){
            return <Icon name="status-positive" variant="success" size={"big"}/>
        } else if (this.state.status==="disarmed"){
            return <Icon name="status-stopped" variant="disabled" size={"big"}/>
        }
    }

    getButton(){
        if (this.state.status==="armed"){
            return <Button onClick={()=>this.changeStatus("disarmed")}>Disarm</Button>
        } else if (this.state.status==="disarmed"){
            return <Button onClick={()=>this.changeStatus("armed")}>Arm</Button>
        } else if (this.state.status==="triggered"){
            return <Button onClick={()=>this.changeStatus("armed")}>Acknowledge</Button>
        }
    }

    getBattery() {
        if (this.state.hasBattery==="false") {
            return <Badge color="red">Low Battery</Badge>
        }
    }

    render () {
        
        const header = <Header variant="h3" description={this.state.type.toUpperCase()} 
            actions={this.getIcon()}
            >{this.state.name}  {this.getBattery()} </Header>

        return (
            <Container header={header}>
              {this.getButton()}
            </Container>
        )
    }
}

export default Sensor;