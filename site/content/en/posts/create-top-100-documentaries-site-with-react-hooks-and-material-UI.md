---
title:          "Create Top 100 Documentaries Site With React Hooks and Material UI"
date:           2019-02-07
draft:          false
tags:           ["js", "react", "node"]
description:    "React Hooks, an awesome feature which is available in React v16.7.0-alpha, 
                 is able to simplify React state and lifecycle features from function components. 
                 Material-UI, a compact, customizable, and beautiful collection of components for React, 
                 is easy to make use of Material Design elements in React web or mobile applications. 
                 This post will cover the implementation of React Hooks and Material-UI to build a top 100 documentaries site.
"
image:          ""
---

[React Hooks][], an awesome feature which is available in React v16.7.0-alpha, 
is able to simplify React state and lifecycle features from function components. 
[Material-UI][], a compact, customizable, and beautiful collection of components for React, 
is easy to make use of Material Design elements in React web or mobile applications. 
This post will cover the implementation of React Hooks and Material-UI to build a [Top 100 Documentaries Site].

![snapshot](/src/img/posts/20190207_create-top-100-documentaries-site-with-react-hooks-and-material-UI/snapshot.webp)

### Project structure

Project structure is essential for productivity and maintenance. 
There are tons of structure recommendations out there, such as Brad Frost’s [Atomic Design] and Redux’s [Ducks System].
These are best practices I follow[^fn1]<sup>,</sup>[^fn2]<sup>,</sup>[^fn3]<sup>,</sup>[^fn4]<sup>,</sup>[^fn5]<sup>,</sup>[^fn6].

- Move files around until it feels right
- Moving files should be effortless
- Structure should encourage scalability and reusability
- Separating stateful containers from stateless components.
- Grouping components by route

```bash       
tree
  ├── .env                                Environment variables configuration
  ├── .gitignore                          git ignore configuration
  ├── README.md                           Documentation
  ├── package.json                        npm configuration
  ├── public/                             public resources folder
  └── src                                 Main scripts folder
       ├── components/                    React basic components folder
       ├── data/                          Public data folder
       ├── page                           React routes folder
       │    ├── comment/                  Comment page folder
       │    ├── error/                    Error page folder
       │    ├── home/                     Home page folder
       │    │    ├── containers/          Home page pure components
       │    │    └── index.js             Home page entry file
       │    ├── statistics/               Statistics page folder
       │    └── App.js                    Define root layout and routes
       ├── utils/                         Helper functions folder
       ├── bootstrap.js                   Material-UI stytle initialization
       ├── index.css                      Global style
       ├── index.js                       Main js file
       └── serviceWorker.js               Service worker configuration
```
### Data Source

The detail of the documentaries are scraped from [IMDB][], which is the world's most popular and authoritative source for movie, TV and celebrity content.

```javascript
// Execute immediately
(async () => {
  const documentaries = []
  let promises = []

  // Convert documentaries list csv to array
  const CSV = fs.readFileSync(inputFile, 'utf8')
  const ARR = CSVToArray(CSV)
  // Separate array into small chunks to fetch concurrently
  const chunkArray = chunk(ARR, NUM_PER_FETCH)

  for (let arr of chunkArray) {
    arr.forEach(ele => {
      // Enable scrapers
      ele.length > 1 && promises.push(new Scraper(ele[0], ele[1]).fetch())
    })
    await Promise.all(promises).then(res => res.forEach(ele => documentaries.push(ele)))
    // Clear promise array
    promises = []
  }
  // Write result to json file
  fs.writeFileSync(outputFile, JSON.stringify(documentaries))
})()
```

The final scraped json file:

```json
[
  {
    "docResource": "https://www.imdb.com/title/tt6769208/?ref_=adv_li_i",
    "docTitle": "Blue Planet II",
    "docYear": "2017",
    "imgTitle": "MV5BNjI1M2ZjMzItZWI4Ny00ZWJlLWI0ZDAtMTJhNDQxOWZjM2M5XkEyXkFqcGdeQXVyMjExMjk0ODk@._V1_SY1000_CR0,0,759,1000_AL_.jpg",
    "country": [ "UK" ],
    "summaryText": "David Attenborough returns to the world's oceans in this sequel to the acclaimed documentary filming rare and unusual creatures of the deep, as well as documenting the problems our oceans face.",
    "ratingValue": "9.3",
    "ratingCount": "14,814"
  }
]
```

### React Hooks

React Hooks are presented at React Conf 2018. According to [official documentation](https://reactjs.org/docs/hooks-overview.html), Hooks are functions that let you “hook into” React state and lifecycle features from function components[^fn7], 
and as Dan Abramov said, unlike patterns like render props or higher-order components, Hooks don’t introduce unnecessary nesting into your component tree. They also don’t suffer from the drawbacks of mixins[^fn8].

There are many benefits of migrating from traditional React features to new React Hooks such as easier state
management and cleaner code etc[^fn9].

#### State management

Manage local state inside function components with useState()[^fn10]

```jsx harmony
// Traditional class component state management
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) { this.setState({ inputValue: e.target.value }) }

  render() {
    return (
      <>
        <input value={this.state.inputValue} onChange={this.handleInput} />
        {this.state.inputValue}
      </>
    )
  }
}
```

```jsx harmony
// Functional component state management with Hooks
function App() {
  const [inputValue, setInputValue] = useState("");
  const handleInput = ({ target: { value } }) => setInputValue(value);

  return (
    <>
      <input value={inputValue} onChange={handleInput} />
      {inputValue}
    </>
  );
}
```

#### Side effects

Perform component side effects with useEffect()[^fn11]

```jsx harmony
// Traditional class component side effects
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { mousePosition: { x: 0, y: 0 } };
    this.handleMousePosition = this.handleMousePosition.bind(this);
  }

  handleMousePosition(e) {
    this.setState({ mousePosition: { x: e.clientX, y: e.clientY } });
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.handleMousePosition);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMousePosition);
  }

  render() {
    return <div>{`x: ${this.state.mousePosition.x}, y: ${this.state.mousePosition.y}`}</div>;
  }
}
```

```jsx harmony
// Functional component side effects with Hooks
function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMousePosition = e => setMousePosition({x: e.clientX,y: e.clientY});
    window.addEventListener("mousemove", handleMousePosition);
    return () => {
      window.removeEventListener("mousemove", handleMousePosition);
    };
  }, []);

  return <div>{`x: ${mousePosition.x}, y: ${mousePosition.y}`}</div>;
}
```

#### Context consumption

Simplify context consumption with useContext()[^fn12]<sup>,</sup>[^fn13]

```jsx harmony
// Traditional class component context consumption
function App (){
  return (
    <ThemeContext.Consumer>
      { theme => <Main style={{background: theme.background}}/> }
    </ThemeContext.Consumer>
  )
}
```

```jsx harmony
// Functional component context consumption with Hooks
function App (){
  const theme = useTheme();
  return <Main style={{background: theme.background}}/>
}
```

#### Stateful logic reuse

Share stateful logic across multiple components with custom hooks[^fn14]<sup>,</sup>[^fn15]

```jsx harmony
// Custom Hooks
const useTitle = title => useEffect(() => { document.title = title }, [title]);

const useHover = (initial = false) => {
  const [hover, setHover] = useState(initial)
  const onMouseEnter = useCallback(() => setHover(true), [])
  const onMouseLeave = useCallback(() => setHover(false), [])
  return [hover, {onMouseEnter, onMouseLeave}]
}
```

### Lazy loading

The React.lazy function enables dynamic import components and routes (code splitting)[^fn16]<sup>,</sup>[^fn17]<sup>,</sup>[^fn18],
which is critical for better performance.

#### Components

```jsx harmony
const Child = React.lazy(() => import('./components'));

const Main = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Child />
  </Suspense>
)
```

#### Routes

```jsx harmony
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./page/Home'));
const About = lazy(() => import('./page/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```

### Material-UI
[Material-UI] is currently the most popular React UI framework,
it provides a lot of awesome features to help developers build beautiful UI with little efforts, 
such as CSS in JS and custom hooks etc.

```jsx harmony
const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing.unit * 4,
    color: theme.color
  }
}));

function App() {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <CircularProgress
      className={classes.progress}
      size={theme.spacing.unit * 10}
    />
  );
}

ReactDOM.render(
  <ThemeProvider theme={createMuiTheme({ color: "#212121" })}>
    <App />
  </ThemeProvider>,
  document.querySelector("#root")
);
```

### Helper functions

This is a tiny project without database. All of the data manipulations are in client side with helper functions.

```javascript
// Sort documentaries by keys, such as sort by year
const sortBy = (arr, compare) =>
  arr.map((item, index) => ({item, index}))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({item}) => item)

// Count documentaries for statistics, such as count by year
const countBy = (arr, fn) =>
  (fn ? arr.map(typeof fn === 'function' ? fn : val => val[fn]) : arr).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
```

### Performance

Interactive sites often send too much JavaScript to clients, which is bad for use experiences because JavaScript is
is a kind of expensive resource and it can delay user interactivity[^fn19].

There are many effective ways to optimize react apps such as Server Side Render, Code Splitting, Lazy Loading and Inline Critical Resources[^fn20]<sup>,</sup>[^fn21].


![audits](/src/img/posts/20190207_create-top-100-documentaries-site-with-react-hooks-and-material-UI/audits.webp)

### Summary

This is a rough introduction for my first React app, The most important lesson I learned is "Refactor, refactor and refactor"[^fn22]. 

[^fn1]: [React File Structure](https://react-file-structure.surge.sh)
[^fn2]: [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
[^fn3]: [Folder Structure in React Apps](https://blog.usejournal.com/folder-structure-in-react-apps-c2ae8974d21f)
[^fn4]: [Structuring React Projects — a Definitive Guide](https://blog.bitsrc.io/structuring-a-react-project-a-definitive-guide-ac9a754df5eb)
[^fn5]: [Fractal — A react app structure for infinite scale](https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af)
[^fn6]: [Structuring projects and naming components in React](https://hackernoon.com/structuring-projects-and-naming-components-in-react-1261b6e18d76)
[^fn7]: [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)
[^fn8]: [Making Sense of React Hooks](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
[^fn9]: [Why React Hooks, and how did we even get here?](https://medium.freecodecamp.org/why-react-hooks-and-how-did-we-even-get-here-aa5ed5dc96af)
[^fn10]: [Hooks at a Glance](https://reactjs.org/docs/hooks-overview.html)
[^fn11]: [Hook me up: Intro to React Hooks](https://blog.usejournal.com/react-hooks-death-of-classes-and-lifecycles-c8db5956558c)
[^fn12]: [Replacing Redux with the new React context API](https://medium.freecodecamp.org/replacing-redux-with-the-new-react-context-api-8f5d01a00e8c)
[^fn13]: [Manage global state with React Hooks](https://medium.com/@Charles_Stover/manage-global-state-with-react-hooks-6065041b55b4)
[^fn14]: [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)
[^fn15]: [Simple Code Reuse with React Hooks](https://blog.bitsrc.io/simple-code-reuse-with-react-hooks-432f390696bf)
[^fn16]: [Lazy Loading Routes in React](https://scotch.io/tutorials/lazy-loading-routes-in-react)
[^fn17]: [How to use React.lazy and Suspense for components lazy loading](https://medium.freecodecamp.org/how-to-use-react-lazy-and-suspense-for-components-lazy-loading-8d420ecac58)
[^fn18]: [Code-Splitting](https://reactjs.org/docs/code-splitting.html)
[^fn19]: [The Cost Of JavaScript In 2018](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4)
[^fn20]: [A React And Preact Progressive Web App Performance Case Study: Treebo](https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299)
[^fn21]: [Lessons Learned: Code Splitting with Webpack and React](https://hackernoon.com/lessons-learned-code-splitting-with-webpack-and-react-f012a989113)
[^fn22]: [The most important lessons I’ve learned after a year of working with React](https://medium.freecodecamp.org/mindset-lessons-from-a-year-with-react-1de862421981)

[Top 100 Documentaries Site]: https://tree.valley.me/
[React Hooks]: https://reactjs.org/docs/hooks-intro.html
[Material-UI]: https://material-ui.com
[IMDB]: https://www.imdb.com/
[Atomic Design]: http://bradfrost.com/blog/post/atomic-web-design/
[Ducks System]: https://github.com/erikras/ducks-modular-redux
