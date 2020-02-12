import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import App from './../components/App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('Testing App', () => {
    // no expect statement because if there is a crash during the test, it will fail
    // we are testing whether App loads without a crash
    it('App renders without crashing', () => {
        const wrapper = shallow(<App />);
    });

    it('title of the page is App Page', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('h1').first().text()).toBe('App page');
    });
});



