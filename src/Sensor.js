import React from 'react';
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Button from "@cloudscape-design/components/button";
import Badge from "@cloudscape-design/components/badge";
import Icon from "@cloudscape-design/components/icon";

class Sensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId : this.props.userId,
            sensorId : this.props.sensorId,
            status : this.props.sensor.sensorStatus,
            name : this.props.sensor.sensorName,
            type : this.props.sensor.sensorType
        }
    }

    path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

    async changeStatus(status){
        await fetch(`${this.path}/sensor/dgarci23?sensorId=${this.state.sensorId}&sensorStatus=${status}`,{method:'PUT'})
          .then(response => response.json())
          .then(data => {return fetch(`https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev/sensor/${this.state.userId}`)})
          .then(res => res.json())
          .then(result => {this.setState({status: result[this.state.sensorId].sensorStatus});})
    
    }

    getIcon(){
        if (this.state.status==="triggered"){
            return <Icon name="status-warning" variant="error" size={"big"}/>
        } else if (this.state.status==="armed"){
            return <Icon name="status-positive" variant="success" size={"big"}/>
        } else if (this.state.status==="disarmed"){
            return <Icon name="status-pending" variant="disabled" size={"big"}/>
        }
    }

    getButton(){
        if (this.state.status==="armed"){
            return <Button onClick={()=>this.changeStatus("disarmed")}>Disarm</Button>
        } else if (this.state.status==="disarmed"){
            return <Button onClick={()=>this.changeStatus("armed")}>Arm</Button>
        }
    }

    render () {
        
        const header = <Header variant="h3" description={this.state.type.toUpperCase()} 
            actions={this.getIcon()}
            >{this.state.name}</Header>

        return (
            <Container header={header}>
              {this.getButton()}
            </Container>
        )
    }
}

export default Sensor;