import React, { useState, useEffect } from 'react';
import { Container, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../features/activities/dashbord/ActivitiesDashbord';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent';
import axios from 'axios';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  function onAcitvitySelected(id: string) {
    var activityToSelect = activities.find(x => x.id == id);
    setSelectedActivity(activityToSelect);
  }

  function onClearSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function onOpenForm(id?: string) {
    id
      ? onAcitvitySelected(id)
      : onClearSelectedActivity();
    setEditMode(true);
  }

  function onCloseForm() {
    setEditMode(false);
  }

  async function createOrEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.put(activity).then(() => {
        setActivities([...activities.filter(x => x.id != activity.id), activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    }
  }

  function onDeleteActivity(id: string) {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => { 
      setActivities([...activities.filter(x => x.id != id)]); 
      setSubmitting(false);
    });
  }

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0]
        activities.push(activity);
      });
      setActivities(activities);
      setLoading(false);
    })
  }, []);

  if (loading)
    return <LoadingComponent />
  return (
    <>
      <NavBar onOpenForm={onOpenForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          onAcitvitySelected={onAcitvitySelected}
          onClearSelectedActivity={onClearSelectedActivity}
          editMode={editMode}
          onOpenForm={onOpenForm}
          onCloseForm={onCloseForm}
          createOrEditActivity={createOrEditActivity}
          onDeleteActivity={onDeleteActivity}
          submitting={submitting}

        />
      </Container>

    </>
  );
}

export default App;
