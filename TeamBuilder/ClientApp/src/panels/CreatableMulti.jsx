﻿import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';
import { customCreatableSelect } from '../customize.js';

export default class CreatableMulti extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: props.data,
            selectedSkills: this.props.selectedSkills,
            style: customCreatableSelect
        }

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <CreatableSelect
                isDisabled={this.props.disabled ? this.props.disabled : false}
                styles={this.state.style}
                openMenuOnFocus={true}
                placeholder='Выберите скиллы'
                value={this.state.selectedSkills}
                isMulti
                onChange={this.props.handleChange}
                options={this.props.data}
                defaultValue={this.props.selected}
            />
        );
    }
}
