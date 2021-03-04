import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../../layout/LoadingComponent';
import { useStore } from '../../../../stores/store'
import { observer } from 'mobx-react-lite'
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDeatailedChat';
import ActivityDetailedSidebar from './ActiviytyDeatailedSidebar';

export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { id } = useParams<{ id: string }>();
    const { selectedActivity: activity, loadingInitial, clearSeectedActivity } = activityStore;

    useEffect(() => { 
        activityStore.loadActivity(id); 
        return () => clearSeectedActivity();
    }, [id, activityStore.loadActivity, clearSeectedActivity])



    if (!activity || loadingInitial)
        return <LoadingComponent />
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat activityId={activity.id}/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity}/>
            </Grid.Column>
        </Grid>
    )
})