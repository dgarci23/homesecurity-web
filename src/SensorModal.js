import React from 'react';
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box"
import Input from "@cloudscape-design/components/input";


class SensorModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible : false
        }
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
                    <Button onClick={()=>this.setVisible(false)} variant="link">Cancel</Button>
                    <Button onClick={()=>this.setVisible(false)} variant="primary">Ok</Button>
                    </SpaceBetween>
                </Box>
                }
                header="User Profile"
            >
                Review and edit the profile information.
            <Input
                value={"a"}
                onChange={event =>
                //setInputValue(event.detail.value)
                {}}
            />
            </Modal>
            </div>
        )
    }
}

export default SensorModal