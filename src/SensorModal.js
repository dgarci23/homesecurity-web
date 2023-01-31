import React from 'react';
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box"
import Input from "@cloudscape-design/components/input";
import { FormField } from '@cloudscape-design/components';
import TextContent from '@cloudscape-design/components/text-content';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from "@cloudscape-design/components/header"
import Select from '@cloudscape-design/components/select';

class SensorModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible : true,
            name : "",
            phone: "",
            email: ""
        }
    }

    path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

    updateProfile() {
        const updatePath = `${this.path}/user/${this.props.userId}`;
        
    }

    setVisible(value){
        this.setState({visible: value})
    }

    render () {
        return (
            <div>
                <Button onClick={()=>this.setVisible(true)}>Profile</Button>
                <Modal
                    onDismiss={() => this.setVisible(false)}
                    visible={this.state.visible}
                    closeAriaLabel="Close modal"
                    footer={
                        <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link">Cancel</Button>
                            <Button variant="primary" onClick={()=>this.updateProfile()}>Update</Button>
                        </SpaceBetween>
                        </Box>
                    }
                    header="Profile Information"
                    >
                        <SpaceBetween size="m">
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Name</Header>
                          <Input placeholder={this.props.name} value={this.state.name}
                            onChange={({ detail }) => this.setState({name:detail.value})}/>
                      </ColumnLayout>
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Email</Header>
                          <Input placeholder={this.props.email} value={this.state.email} inputMode={"email"} type="email"
                            onChange={({ detail }) => this.setState({email:detail.value})}/>
                      </ColumnLayout>
                      <ColumnLayout columns={2}>
                          <Header variant={"h4"}>Phone</Header>
                          <Input placeholder={this.props.phone} value={this.state.phone} inputMode={"numeric"}
                            onChange={({ detail }) => this.setState({phone:detail.value})}/>
                      </ColumnLayout>
                      </SpaceBetween>
                </Modal>
            </div>
        )
    }
}

export default SensorModal