import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActityList from './ActivityLits';
import ActivityDetails from './details/ActivityDetails';
import ActivityForm from './form/ActivityForm';
import { observer } from 'mobx-react-lite'

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore()

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                    activityStore.edtitMode
                        ? <ActivityForm />
                        : activityStore.selectedActivity && <ActivityDetails />
                }
            </Grid.Column>
        </Grid>
    )
})