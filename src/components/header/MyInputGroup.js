import React, { Component } from 'react'
import {
    Row,
    Col,
    Input,
    InputGroup,
    FormFeedback,
} from 'reactstrap';
export default class MyInputGroup extends Component {
    constructor(...props) {
        super(...props)
        this.state = {
            valid: ''
        }
    }
    validate = (e) => {
        let str = e.target.value
        let x
        if (str.match(',,,,')) {
            x = 'Too many commas found';
        } else if (str.match(',,,-,,,')) {
            x = 'Missing quantifier';
        } else if (str.match(/\d,{3}}.{1},{3}-?\d/)) {
            x = 'Passthroughs must be separated by at least 2 bytes'
        } else if (str.match(/^,{3}-?\d+,{3}}|,{3}-?\d+,{3}$/)) {
            x = "cannot start or end with a passthrough"
        }
        else {
            x = 'valid'
        }
        this.setState({ valid: x })
    }
    render(...props) {
        return (
            <Row>
                <InputGroup>
                    <Col sm="11" style={{ color: "#343a40" }} >
                        <Input
                            onChange={(e) => {
                                this.props.onChange(e)
                                this.validate(e)
                            }}
                            invalid={this.state.valid !== "valid"}
                            valid={this.state.valid === "valid"}
                            value={this.props.value}
                            selectionEnd={this.props.selectionEnd}
                        />
                        
                        <FormFeedback valid>
                        </FormFeedback>
                        <FormFeedback invalid>
                            {this.state.valid}
                        </FormFeedback>
                    </Col>
                    <Col sm="1">
                        {this.props.children}
                    </Col>
                </InputGroup>
            </Row>
        )
    }
}


