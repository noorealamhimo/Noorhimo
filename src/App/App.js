import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import {StateContext, StateProvider} from '../reducers/state';
import {initialState, reducer} from '../reducers/mainReducer';
import Header from "../Header";
import Footer from "../Footer";

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));
const LoginForm = lazy(() => import('../LoginForm'));

function PrivateRoute({children, state, ...rest}) {
    console.log(state);
    return (
        <Route
            {...rest}
            render={({location}) =>
                state.user.isLoggedIn() ? (children) : (
                    <Redirect to={{pathname: "/login", state: {from: location}}}/>)
            }
        />
    );
}

class App extends Component {
    render() {
        return (
            <StateProvider initialState={initialState} reducer={reducer}>
                <StateContext.Consumer>
                    {({state}) => {
                        console.log(state);
                        return <Router>
                            <Header/>
                            <main role="main">
                                <div className="container">
                                    <Suspense fallback={<div className="App-loading text-center">
                                        <div className="spinner-border text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>}>
                                        <Switch>
                                            <Route path="/public">
                                                <Main/>
                                            </Route>
                                            <Route path="/settings">
                                                <div>Settings hehehehehe</div>
                                            </Route>
                                            <Route path="/login">
                                                <LoginForm/>
                                            </Route>
                                            <PrivateRoute path="/protected" state={state}>
                                                <Dashboard/>
                                            </PrivateRoute>
                                        </Switch>
                                    </Suspense>
                                </div>
                            </main>
                            <Footer/>
                        </Router>;
                    }}
                </StateContext.Consumer>
            </StateProvider>);
    }
}

export default App;
