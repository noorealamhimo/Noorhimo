import React, {useState} from 'react';
import './LoginForm.css';
import {useHistory, useLocation} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {signIn} from "../reducers/actions";
import {SIGN_IN_LOGIN_PASSWORD} from "../Lib/GetLogin";

/*const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};*/

/*function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <p>
            Welcome!{" "}
            <button
                onClick={() => {
                    fakeAuth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}*/

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const isDisabled = () => {
        return username.length < 3 || password.length < 3
    };
    /*let history = useHistory();
    let location = useLocation();

    let {from} = location.state || {from: {pathname: "/"}};
    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };*/

    return (
        <div className="row justify-content-center align-items-center">
            <Form className="LoginForm col-md-4">
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}
                                  value={username}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
                                  value={password}/>
                </Form.Group>
                {/*<Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>*/}
                <Button className="btn-block"
                        disabled={isDisabled()}
                        onClick={() => signIn(SIGN_IN_LOGIN_PASSWORD, username, password)}>
                    Sign in
                </Button>
            </Form>
        </div>
    );
}

export default LoginForm;
