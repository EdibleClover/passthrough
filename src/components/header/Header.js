import React, { Component } from 'react'
import MyInputGroup from './MyInputGroup.js'
import {
    Collapse,
    Button,
    ButtonDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu

} from 'reactstrap';
export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            valid: '',
            toggle: true,
            scrollLeft: '10'
        }
        /*
        * Creat Refs
        */
       this.textInput1 = React.createRef();
       this.textInput2 = React.createRef();

        }
    /**
     * handle the button drop down
     */
    toggleOnClick = (prevState) => {
        this.setState(prevState => ({
            toggle: !prevState.toggle
        }));
    }
    /**
     * Handle Scroll Behavior between inputs
     * Use the ref, created from inputField
     */
    handleScroll = (e) => {
        const scrollLeft1 = this.textInput1.current.textInput.current.scrollLeft
        this.textInput2.current.textInput.current.scrollLeft = scrollLeft1
    }
    render(...props) {
        return (
            <div className="Header" >
                <MyInputGroup
                    onChange={(e) => {
                        this.props.onChange(e)
                    }}
                    onScroll={(e) => this.handleScroll(e)}
                    valid={this.state.valid}
                    buttonText="Expand"
                    ButtonDropDown={false}
                    value={this.props.sig}
                    ref={this.textInput1}
                >
                <Button id="toggle" color="info" onClick={(e) => this.toggleOnClick(e)}>info</Button>
                </MyInputGroup>
                <Collapse isOpen={!this.state.toggle} navbar>
                    <MyInputGroup
                        value={this.props.exactSig}
                        onClick={(e) => this.props.onClick(e)}
                        buttonText="options"
                        ButtonDropDown="true"
                        ref={this.textInput2}
                    >
                        <DropButton></DropButton>
                    </MyInputGroup>
                </Collapse>
            </div>
        )
    }
}



const DropButton = (props) => {
    return (
        <ButtonDropdown isOpen={props.isOpen} toggle={props.toggle}>
            <DropdownToggle caret size="sm">
                {props.children}
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>)
}


