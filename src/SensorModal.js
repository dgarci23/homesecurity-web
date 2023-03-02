import React from 'react';
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box"
import Input from "@cloudscape-design/components/input";
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from "@cloudscape-design/components/header"
import Select from '@cloudscape-design/components/select';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
class SensorModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible : false,
            userId : this.props.userId,
            name : "",
            id: "",
            type: ""
        }
    }

    path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

    resetState() {
        this.setState({name: "", phone: "", email: ""})
    }

    setVisible(value){
        this.setState({visible: value})
    }

    async createSensor() {
        const user = await Amplify.Auth.currentAuthenticatedUser();
        const token = user.signInUserSession.idToken.jwtToken;
        const queries = `sensorId=${this.state.id}&sensorStatus=disarmed&sensorName=${this.state.name}&sensorType=${this.state.type.value}`;
        fetch(`${this.path}/user/sensor/${this.state.userId}?${queries}`, {method: "POST", headers:{Authorization:token}});
    }

    render () {
        return (
            <div>
                <Button iconName="add-plus" onClick={()=>this.setVisible(true)}>Sensor</Button>
                <Modal
                    onDismiss={() => this.setVisible(false)}
                    visible={this.state.visible}
                    closeAriaLabel="Close modal"
                    footer={
                        <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={()=>{
                                this.setVisible(false);
                                this.resetState();
                            }}>Cancel</Button>
                            <Button variant="primary" onClick={()=>{
                                this.createSensor();
                                this.setVisible(false)}}>Create Sensor</Button>
                        </SpaceBetween>
                        </Box>
                    }
                    header="Sensor Registration"
                    >
                        <SpaceBetween size="m">
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Name</Header>
                          <Input value={this.state.name}
                            onChange={({ detail }) => this.setState({name:detail.value})}/>
                      </ColumnLayout>
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Sensor ID</Header>
                          <Input value={this.state.id} inputMode={"email"} type="email"
                            onChange={({ detail }) => this.setState({id:detail.value})}/>
                      </ColumnLayout>
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Sensor Type</Header>
                        <Select
                        selectedOption={this.state.type}
                        onChange={({ detail }) =>
                            this.setState({type:detail.selectedOption})
                        }
                        options={[
                            { label: "Gas Sensor", value: "gas" },
                            { label: "Movement Sensor", value: "movement" },
                            { label: "Magnetic Sensor", value: "magnetic" }
                        ]}
                        selectedAriaLabel="Selected"
                        />
                      </ColumnLayout>
                      </SpaceBetween>
                </Modal>
            </div>
        )
    }
}

export default SensorModal