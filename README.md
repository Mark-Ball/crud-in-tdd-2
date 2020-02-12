# CRUD in TDD

This project is to practice test driven development. To practice this, a full CRUD resource will be built with a React front-end. The Express back end has been omitted, and any http requests from the React app which would normally be sent to a route in the Express app now connect directly to a controller.

# Setup

Create a ```.env``` file with the following:

```
DB_HOST=mongodb://localhost/crud-in-tdd
DB_HOST_TESTING=mongodb://localhost/crud-in-tdd-testing`
```

# Testing

Testing will be conducted with Jest and Enzyme.

## Notes on testing

### 1. Using console.log within a test does not work as expected

If we use Enzyme's ```shallow``` function to create a virtual component, console.logging the output does not create the expected result, instead we must use the debug() function.

```Javascript
const wrapper = shallow(<CreateForm />);
console.log(wrapper); // ShallowWrapper {}
console.log(wrapper.debug()); // prints full html
```

# Steps 

- create boilerplate
- create
- read
- update
- delete