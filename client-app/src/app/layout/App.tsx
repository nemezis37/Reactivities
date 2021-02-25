import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite'
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ActivitiesDashbord from '../features/activities/dashbord/ActivitiesDashbord';
import ActivityForm from '../features/activities/dashbord/form/ActivityForm';
import ActivityDetails from '../features/activities/dashbord/details/ActivityDetails';

function App() {

  const location = useLocation()
  return (
    <>
      <Route path='/' exact component={HomePage} />
      <Route path='/(.+)' render={() => 
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Route path='/activities' exact component={ActivitiesDashbord} />
            <Route path='/activity/:id' exact component={ActivityDetails} />
            <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
          </Container>
        </>
      } />
    </>
  );
}

export default observer(App);
