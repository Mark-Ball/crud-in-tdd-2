import React, { Component } from 'react';

class CreateForm extends Component {
    state = {
        name: '',
        age: null
    };

    onInputChange = fieldName => {
        return event => this.setState({ [fieldName]: event.target.value });
    };

    onFormSubmit = () => {
        const { name, age } = this.state;
        // http request to backend create method
        // create({ name, age });
    };
    
    render() {
        const { name, age } = this.state;

        return ( 
            <form onSubmit={this.onFormSubmit}>
                <h2>Add a new entry</h2>
                <div>
                    <label>Name</label>
                    <input type='text' name='name' onChange={this.onInputChange('name')} value={name} />
                </div>
                <div>
                    <label>Age</label>
                    <input type='text' name='age' onChange={this.onInputChange('age')} value={age} />
                </div>
                <input type='submit' />
            </form>
        )
    }
}

export default CreateForm;