import React, { Component } from 'react'
import {
    Row,
    Col,
    Input,
    InputGroup,
    FormFeedback,
    Collapse,
    Button,
    ButtonDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu

} from 'reactstrap';
import passThrough from '../PassThrough.js';
export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            valid: '',
            toggle: false,
            correctSig: ''
        }
    }
    validate = (e) => {
        let p = new passThrough(e.target.value)
        let q = p.validate();
        this.setState({ valid: q })
    }
    toggleOnClick = (prevState) => {
        this.setState(prevState => ({
            toggle: !prevState.toggle
        }));
    }
    //Create a string with all the actual lenghts of the passthroughs that are created
    correctSiganture = () => {
        const sig = this.props.sig;
        const decor = this.props.decorations
        fixSigWithDecorations(sig, decor)
        this.setState({ correctSig: "Will be correct" })
    }
    render(...props) {
        return (
            <div className="Header" >
                <MyInputGroup
                    onChange={(e) => {
                        this.props.onChange(e)
                        this.validate(e)
                        this.correctSiganture(e)
                    }}
                    valid={this.state.valid}
                    buttonText="Expand"
                    ButtonDropDown={false}
                    value={this.props.sig}
                >
                    <Button id="toggle" color="info" onClick={(e) => this.toggleOnClick(e)}>info</Button>
                </MyInputGroup>
                <Collapse isOpen={!this.state.toggle} navbar>
                    <MyInputGroup
                        value={this.state.correctSig}
                        onClick={(e) => this.props.onClick(e)}
                        buttonText="options"
                        ButtonDropDown="true"
                        onchange={"DoNothing"}
                    >
                        <DropButton></DropButton>
                    </MyInputGroup>
                </Collapse>
            </div>
        )
    }
}


const MyInputGroup = (props) => {
    return (
        <Row>
            <InputGroup>
                <Col sm="11" style={{ color: "#343a40" }} >
                    <Input
                        onChange={(e) => {
                            props.onChange(e)
                        }}
                        invalid={props.valid !== "valid"}
                        valid={props.valid === "valid"}
                        value={props.value}
                    />
                    <FormFeedback valid>
                    </FormFeedback>
                    <FormFeedback invalid>
                        {props.valid}
                    </FormFeedback>
                </Col>
                <Col sm="1">
                    {props.children}
                </Col>
            </InputGroup>
        </Row>
    )
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
//Build the signature again with correct passthrough numbers
const fixSigWithDecorations = (sig, ...decorations) => {
    console.log(decorations)
    if (typeof decorations[0] !== 'undefined' || decorations[0] !== null) {
        const decs = decorations[0]
        if (typeof decs === 'array') {
            decs.forEach((d, i) => {
                if (typeof d[i] !== 'undefined') {

                    console.log(d[i].anchor)
                    console.log(d[i].focus)

                }
            })
        }
    }



    //Again assuming all passthroughs are going to be even numbers in the array


}
