# Understanding Jest
Jest a testing library developed and used internally by Facebook.

You cannot completely neglect one essential area of *software development*: automated testing. There are many different testing libraries or test runners available for JavaScript. However, today we'll learn about [**Jest**](https://jestjs.io/), a testing library developed and used internally by Facebook, that resembles *Mocha* the previous king of JavaScript testing libraries.

## Installing Jest

Jest works well for testing backends and it shines when it comes to testing *React applications*. Since tests are only executed during development, we will dive in and understand Jest from scratch by (1) creating a new directory, (2) running an npm project and (3) installing *Jest* as a development dependency with the command:

```javascript
$ mkdir understandingJest
$ npm init -y
$ npm install --save-dev jest
```

## Setting Jest
Even if the default [testing environment](https://jestjs.io/docs/configuration#testenvironment-string) in Jest is Node, it's best to specify it by easily adding the following to the end of the *package.json* file:

```javascript
{
	"jest": {
		"testEnvironment": "node"
	}
}
```
If you are building a web app, you can use a browser-like environment through `jsdom` instead.

The `jest` [command line runner](https://jestjs.io/docs/cli) has a number of useful options. So, to make our lives easier, we will define the *npm script* `test` to execute and report Jest tests with `--verbose` and `--runInBand`.

```javascript
{
	"scripts": {
		"test": "jest --verbose --runInBand"
	}
}
```

`--verbose` displays individual test results with the test suite hierarchy (more on that later with describe blocks) and `--runInBand` runs all tests serially in the current process, rather than creating a worker pool of child processes than run tests, which can be useful for debugging.

## Directory Structure for Testing
To adhere to Node.js best practices, create two folders named: (1) *test* and (2) *utils*. Inside test create a *understandingJest.test.js* file and inside utils create a *helper_functions.js* file. Last but not least, at the root directory let's create a *db.json* file. 

Your project should have the following directory structure:
```javascript
├── node_modules
├── test
│   └── understandingJest.test.js
├── utils
│   └── helper_functions.js
├── db.json
├── package-lock.json
├── package.json
```

## Helper Functions and Mock Data
Let's create some simple functions in our *helper_functions.js* file for `sum`, `average`, and `biggest` and export them to use for our automated testing:

```javascript
const sum = (a, b) => {
    return a + b
}

const average = array => {
    const reducer = (sum, item) => {
        return sum + item
    }

    return array.reduce(reducer, 0) / array.length
}

const biggest = array => {
    const reducer = (biggest, value) =>{
        return biggest > value ? biggest : value
    }
    
    return array.reduce(reducer, 0)
}

module.exports = {
    sum,
    average,
    largest
}
```

In our *db.json* file we are going to mock a JSON database for laptops. To keep things SS, we will only have a single item as follows:

```javascript
{
    "laptops": [
        {
            "name": "Macbook Pro 13",
            "price": {
                "amount": 1299,
                "currency": "USD"
            },
            "display": "Retina display",
            "onlyHasUSBTypeC": true,
            "hasTouchBar": true,
            "builtInApps": [
                "Siri",
                "Safari",
                "Messages",
                "Facetime"
            ]
        }
    ]
}
```
## Now let's do some Testing!
In Jest, individual test cases are defined with the `test` function. The first function parameter is the *test description* as a string. The second parameter is the testing function, that defines the functionality for the test case.

The test first executes the code to be tested, meaning that we run the testing functions and then it verifies the results with the [expect function](https://jestjs.io/docs/expect). The `expect` function gives you access to a number of 'matchers' that let you validate a ton of different things.

For now, let's take a look at a single test using our *understandingJest.test.js* file:

```javascript
const hf = require('../utils/helper_functions')

test('...sum value', () => {
    const result = hf.sum(5, 5)
    console.log(`The sum result is: ${result}`)
    expect(result).toEqual(10)
})
```
In the example above, we are bringing the helper function in `hf` to use inside our testing function as `hf.sum` to (1) add two values, (2) console log the result and (3) check if that result equals 10 as set arbitrarily. Remember, the ['matchers'](https://jestjs.io/docs/expect) can be set at will depending on our test case.

At this stage, we can run this sum test by using the following command:

```javascript
$ npm run test
```
and we should get the following results in our terminal:

```javascript
> understandingjest@1.0.0 test
> jest --verbose --runInBand

 PASS  tests/understandingJest.test.js
  ✓ ...sum value (18 ms)

  console.log
    The sum result is: 10

      at Object.<anonymous> (tests/understandingJest.test.js:6:13)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.483 s, estimated 1 s
Ran all test suites.
```
## Collection Blocks and more Testing
Describe blocks can be used for grouping tests into logical collections. The test output of Jest also uses the name of the described block. This time around, let's write some test to use the rest of our helper functions.

```javascript
const hf = require('../utils/helper_functions')

describe('What is the', () => {
    test('...sum value', () => {
        const result = hf.sum(5, 5)
        expect(result).toEqual(10)
    })
    test('...average value', () => {
        const result = hf.average([5, 5, 5, 5, 5])
        expect(result).toEqual(5)
    })
    test('...biggest value', () => {
        const result = hf.biggest([1, 15, 3, 2, 4])
        expect(result).toEqual(15)
    })
})
```
## Running tests one by one
The `npm test` command executes all of the tests of the application. When writing tests, it's usually best to execute only one or two tests at once. To run a single test (or describe block) we can specify the name of the test with the -t flag:

```javascript
$npm test -- -t 'name-of-spec'
```

Alternatively, if you have multiple testing files you can also choose to only run the tests found in a particular file

```javascript
$npm test -- tests/understandingJest.test.js
```

## Running tests from a database
To run backend tests using Jest, you can query databases using [SuperTest](https://github.com/visionmedia/supertest) and [SuperAgent](https://github.com/visionmedia/superagent) in an API-like fashion. Today we will go easier on us, and use the db.json we created earlier and explore the `.toHaveProperty(keyPath, value?)` matcher with the following tests:

```javascript
const db = require('../db.json')

const macbookPro = db.laptops.find(laptop => laptop.name === "Macbook Pro 13")

describe('The latest Macbook Pro is', () => {
    test('...very expensive', () => {
        expect(macbookPro.price.currency).toBe('USD')
        expect(macbookPro.price.amount).toBeGreaterThan(1000)
    })

    test('...probably the only computer with NO normal ports', () => {
        expect(macbookPro.onlyHasUSBTypeC).toBe(true)
    })

    test('...at least some builtInApps for free', () => {
        expect(macbookPro).toHaveProperty('builtInApps', ["Siri", "Safari", "Messages", "Facetime"])
    })
})

```
In the example above, we first start by getting the database from the *db.json* file. Then we find the object we want to test by using the `Array.prototype.find()` method. Finally we use our selected object and run tests for find out if our computer is (1) very expensive, (2) if it doesn't have normal ports, and (3) if it was the four built-in apps we need.

Test results would look as follows:

```javascript
> understandingjest@1.0.0 test
> jest --verbose --runInBand

 PASS  tests/understandingJest.test.js
  The latest Macbook Pro is
    ✓ ...very expensive (2 ms)
    ✓ ...probably the only computer with normal ports
    ✓ ...at least some builtInApps for free (1 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.501 s, estimated 1 s
Ran all test suites.
```
Feel free to look at the repository containing all the project files for this article [here](https://github.com/ekqt/understandingJest).

So off we go, hopefully, with a better understanding about Jest testing for applications. Thank you for reading and happy testing!

Get in touch:
[Whatsapp](http://wa.me/420608984789)
[Instagram](https://www.instagram.com/ekheinquarto/)
[Github](https://github.com/ekqt)
