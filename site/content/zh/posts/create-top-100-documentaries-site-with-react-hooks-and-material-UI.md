---
title:          "利用React Hooks和Material-UI搭建纪录片Top100网页"
date:           2019-02-07
draft:          true
tags:           ["js", "react"]
description:    ""
image:          ""
---

React Hooks, an awesome feature which is available in React v16.7.0-alpha, 
is able to simplify React state and lifecycle features from function components. 
Material-UI, a compact, customizable, and beautiful collection of components for React, 
is easy to make use of Material Design elements in React web or mobile application. 
This post will cover the implementation of React Hooks and Material-UI to build a top 100 documentaries app.

### Snapshot

![snapshot](/src/img/posts/20190207_create-top-100-documentaries-site-with-react-hooks-and-material-UI/snapshot.webp)

### Project structure
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

The detail of the documentaries are scraped from [IMDB](https://www.imdb.com/), which is the world's most popular and authoritative source for movie, TV and celebrity content.

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
  // Write result to json
  fs.writeFileSync(outputFile, JSON.stringify(documentaries))
})()
```

### React Hooks

React Hooks are presented at React Conf 2018. According to [official documentation](https://reactjs.org/docs/hooks-overview.html), Hooks are functions that let you “hook into” React state and lifecycle features from function components, and as Dan Abramov said, unlike patterns like render props or higher-order components, Hooks don’t introduce unnecessary nesting into your component tree. They also don’t suffer from the drawbacks of mixins.

There are many benefits of migrating from traditional React features to new React Hooks such as easier state
management and cleaner code etc.

#### State management

Manage local state inside function components with useState()

```jsx harmony
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    return (
      <div>
        <input value={this.state.inputValue} onChange={this.handleInput} />
        {this.state.inputValue}
      </div>
    )
  }
}
```

```jsx harmony
function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInput = e => setInputValue(e.target.value);

  return (
    <div>
      <input value={inputValue} onChange={handleInput} />
      {inputValue}
    </div>
  );
}
```

#### Side effects

Perform component side effects with useEffect()

```jsx harmony
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

Simplify context consumption with useContext()

```jsx harmony
function App (){
  return (
    <ThemeContext.Consumer>
      { theme => <Main style={{background: theme.background}}/> }
    </ThemeContext.Consumer>
  )
}
```

```jsx harmony
function App (){
  const theme = useTheme();
  return <Main style={{background: theme.background}}/>
}
```

#### Stateful logic reuse

Share stateful logic across multiple components with custom hooks.

```jsx harmony
const useTitle = (title = '') => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

const useHover = (initial = false) => {
  const [hover, setHover] = useState(initial)
  const onMouseEnter = useCallback(() => setHover(true), [])
  const onMouseLeave = useCallback(() => setHover(false), [])
  return [hover, {onMouseEnter, onMouseLeave}]
}
```

### Lazy loading

The React.lazy function enables dynamic import components and routes (code splitting),
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
Material-UI is currently the most popular React UI framework,
it provides a lot of awesome features to help developers build beautiful UI with little efforts, such as CSS in JS and custom hooks.

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
