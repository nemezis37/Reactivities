import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../features/activities/dashbord/ActivitiesDashbord';
import {v4 as uuid} from 'uuid';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)

  function onAcitvitySelected(id: string) {
    var activityToSelect = activities.find(x => x.id == id);
    setSelectedActivity(activityToSelect);
  }

  function onClearSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function onOpenForm(id?: string) {
    id? onAcitvitySelected(id): onClearSelectedActivity();
    setEditMode(true);
  }

  function onCloseForm() {
    setEditMode(false);
  }

  function createOrEditActivity(activity: Activity) {
      activity.id 
        ? setActivities([...activities.filter(x => x.id != activity.id), activity])
        : setActivities([...activities, {...activity, id: uuid()}]);
      setEditMode(false);
      setSelectedActivity(activity);
  }

  function onDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id != id)]);
  }


  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then((responce) => {
      setActivities(responce.data);
    })
  }, []);

  return (
    <>
      <NavBar onOpenForm={onOpenForm} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          onAcitvitySelected={onAcitvitySelected}
          onClearSelectedActivity={onClearSelectedActivity}
          editMode={editMode}
          onOpenForm={onOpenForm}
          onCloseForm={onCloseForm}
          createOrEditActivity={createOrEditActivity}
          onDeleteActivity={onDeleteActivity}/>
      </Container>
      
    </>
  );
}

export default App;
