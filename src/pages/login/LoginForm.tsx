import css from './LoginForm.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, ThemeProvider } from '@mui/material';
import { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Login } from './login/Login';
import { SignUp } from './signUp/SignUp';
import { UserContext } from '../../context/UserContext';
import { tabsTheme } from '../newPost/selectFlairs/SelectFlairsStyles';

interface ILoginFormProps {
    tab: 'sign up' | 'log in';
}

export const LoginForm: React.FC<ILoginFormProps> = (props) => {
    const user = useContext(UserContext);
    const [tabIndex, setTabIndex] = useState(props.tab);

    if (user) return <Redirect to="/" />;

    return (
        <div className={`contentBox ${css.container}`}>
            <ThemeProvider theme={tabsTheme}>
                <TabContext value={tabIndex}>
                    <TabList onChange={(_, val) => setTabIndex(val)}>
                        <Tab value="log in" label="Log in" color="red" />
                        <Tab value="sign up" label="Sign up" />
                    </TabList>
                    <TabPanel value="log in">
                        <Login setTabIndexCallback={setTabIndex} />
                    </TabPanel>
                    <TabPanel value="sign up">
                        <SignUp setTabIndexCallback={setTabIndex} />
                    </TabPanel>
                </TabContext>
            </ThemeProvider>
        </div>
    );
};
