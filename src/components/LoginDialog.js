import React, { useState } from 'react';
import { Dialog, Pane, TextInputField, Text } from 'evergreen-ui';
import { logIn } from '../services/bikeApi';

let LoginDialog = ({ isDialogShown, setDialogShown, setLoggedInUser }) => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    let [isLoading, setLoading] = useState(false);

    let [usernameError, setUsernameError] = useState(null);
    let [passwordError, setPasswordError] = useState(null);

    let handleLogin = () => {
        if (!username) {
            setUsernameError('Username must not be empty');
        }
        if (!password) {
            setPasswordError('Password must not be empty');
        }
        if (!username || !password) return;

        setLoading(true);
        logIn(username, password)
						.then(res => res.json())
            .then((user) => {
								console.log("USER", user);
                setLoading(false);
                setLoggedInUser(user);
                setDialogShown(false);
            })
            .catch((e) => {
                setLoading(false);
                setUsernameError(`Error logging in user ${username}`);
                console.error(e);
            });
    };

    return (
        <Dialog
            isShown={isDialogShown}
            title='Log in'
            onCloseComplete={() => setDialogShown(false)}
            confirmLabel='Log in'
            hasClose={false}
            isConfirmLoading={isLoading}
            onConfirm={handleLogin}
        >
            <Pane
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
            >
                <TextInputField
                    label='username'
                    onChange={(e) => {
                        setUsernameError(null);
                        setUsername(e.target.value);
                    }}
                    placeholder='username'
                    value={username}
                    marginTop={10}
                    validationMessage={usernameError}
                    width={300}
                ></TextInputField>
                <TextInputField
                    label='password'
                    onChange={(e) => {
                        setPasswordError(null);
                        setPassword(e.target.value);
                    }}
                    placeholder='password'
                    value={password}
                    width={300}
                    validationMessage={passwordError}
                ></TextInputField>
            </Pane>
        </Dialog>
    );
};
export { LoginDialog };
