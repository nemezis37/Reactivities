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
    useEffect(() => { 
        activityStore.loadActivity(id); 
    }, [id, activityStore.loadActivity])


    const { selectedActivity: activity, loadingInitial } = activityStore;

    if (!activity || loadingInitial)
        return <LoadingComponent />
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity}/>
            </Grid.Column>
        </Grid>
    )
})