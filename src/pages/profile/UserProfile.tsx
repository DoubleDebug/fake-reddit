import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { EditProfile } from './editProfile/EditProfile';
import { Profile } from './profile/Profile';

export const UserProfile: React.FC = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Profile />
            </Route>
            <Route path={`${path}/edit`}>
                <EditProfile />
            </Route>
        </Switch>
    );
};
