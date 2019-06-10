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
            caretPos: 0
        }
    }
    toggleOnClick = (prevState) => {
        this.setState(prevState => ({
            toggle: !prevState.toggle
        }));
    }
    handleCaretPos = (e) => {
        console.log(e.target)
        let caretPos = e.target.selectionEnd
        this.setState({caretPos:caretPos})
    }
    //Create a string with all the actual lenghts of the passthroughs that are created
    render(...props) {
        return (
            <div className="Header" >
                <MyInputGroup
                    onChange={(e) => {
                        this.props.onChange(e)
                        this.handleCaretPos(e)
                    }}
                    valid={this.state.valid}
                    buttonText="Expand"
                    ButtonDropDown={false}
                    value={this.props.sig}
                    focus={this.state.focus}
                >
                    <Button id="toggle" color="info" onClick={(e) => this.toggleOnClick(e)}>info</Button>
                </MyInputGroup>
                <Collapse isOpen={!this.state.toggle} navbar>
                    <MyInputGroup
                        value={this.props.exactSig}
                        onClick={(e) => this.props.onClick(e)}
                        buttonText="options"
                        ButtonDropDown="true"
                        onChange={""}
                        focus={this.state.focus}
                        selectionEnd={this.state.selectionEnd}
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