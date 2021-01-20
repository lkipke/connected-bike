import React, { useContext, useState } from 'react';
import { Dialog, Pane, TextInputField, Text, Button } from 'evergreen-ui';
import { logIn } from '../services/bikeApi';
import { UserContext } from './User';

let LoginDialog = () => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [isLoading, setLoading] = useState(false);
    let [usernameError, setUsernameError] = useState(null);
    let [passwordError, setPasswordError] = useState(null);
    let [isDialogShown, setDialogShown] = useState(false);

    let { user, setUser } = useContext(UserContext);

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
            .then((res) => res.json())
            .then((user) => {
                setLoading(false);
                setUser(user);
                setDialogShown(false);
            })
            .catch((e) => {
                setLoading(false);
                setUsernameError(`Error logging in user ${username}`);
                console.error(e);
            });
    };

    let onClick = () => {
        if (user) return;
        setDialogShown(true);
    };

    return (
        <>
            <Button appearance='minimal' onClick={onClick}>
                {user ? user.username : 'log in'}
            </Button>
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
                        type='password'
                    ></TextInputField>
                </Pane>
            </Dialog>
        </>
    );
};
export { LoginDialog };
