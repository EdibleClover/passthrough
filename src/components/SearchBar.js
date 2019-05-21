import React, { Component } from 'react'
import {
    Navbar,
    Input,
    InputGroup,
    InputGroupAddon,
    NavbarBrand,
    InputGroupText,
    FormFeedback
} from 'reactstrap';
import passThrough from './PassThrough.js';
export default class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            valid: ''
        }
    }
    validate = (e) => {
        let p = new passThrough(e.target.value)
        let q = p.validate();
        this.setState({ valid: q })
    }
    render(props) {
        return (
            <div style={this.props.sytle}>
                <Navbar color="dark" light expand="md" fixed='true'>
                    <NavbarBrand href='#' onClick={(e)=>this.props.onClick(e)}>Inspect</NavbarBrand>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            onChange={(e) => 
                                {
                                this.props.onChange(e)
                                this.validate(e)
                                }
                            }
                            invalid={this.state.valid !== "valid"}
                            valid={this.state.valid === "valid"}
                        />
                        <FormFeedback valid>
                        </FormFeedback>
                        <FormFeedback invalid>
                            {this.state.valid}
                        </FormFeedback>
                    </InputGroup>
                </Navbar>
            </div>
        )
    }
}

