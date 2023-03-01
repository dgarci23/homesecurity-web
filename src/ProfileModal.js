import React from 'react';
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box"
import Input from "@cloudscape-design/components/input";
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from "@cloudscape-design/components/header"

class ProfileModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible : false,
            name : "",
            phone: "",
            email: ""
        }
    }

    path = "https://aapqa4qfkg.execute-api.us-east-1.amazonaws.com/dev"

    resetState() {
        this.setState({name: "", phone: "", email: ""})
    }

    setVisible(value){
        this.setState({visible: value})
    }

    render () {
        return (
            <div>
                <Button iconName="user-profile" onClick={()=>this.setVisible(true)}>Profile</Button>
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
                                this.props.updateProfile(this.state.name, this.state.email, this.state.phone)
                                this.setVisible(false)}}>Update</Button>
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

export default ProfileModal