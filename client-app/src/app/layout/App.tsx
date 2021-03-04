import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite'
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ActivitiesDashbord from '../features/activities/dashbord/ActivitiesDashbord';
import ActivityForm from '../features/activities/dashbord/form/ActivityForm';
import ActivityDetails from '../features/activities/dashbord/details/ActivityDetails';
import TestErrors from '../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../features/errors/NotFound';
import ServerError from '../features/errors/ServerError';
import LoginForm from '../features/user/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/form/modals/ModalContainer'
import ProfilePage from '../features/profiles/ProfilePage';

function App() {

  const location = useLocation()
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.jwt)
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    else  
      commonStore.setAppLoaded();
    } , [userStore, commonStore])

  if(!commonStore.appLoadet)
    return <LoadingComponent content='Loading app...'/>
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer/>
      <Route path='/' exact component={HomePage} />
      <Route path='/(.+)' render={() =>
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route path='/activities' exact component={ActivitiesDashbord} />
              <Route path='/activity/:id' exact component={ActivityDetails} />
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
              <Route path='/profiles/:userName' component={ProfilePage}/>
              <Route path='/errors' component={TestErrors} />
              <Route path='/server-error' component={ServerError} />
              <Route path='/login' component={LoginForm} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      } />
    </>
  );
}

export default observer(App);
