import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActityList from './ActivityLits';
import { observer } from 'mobx-react-lite'
import LoadingComponent from '../../../layout/LoadingComponent';
import ActivityFilters from './ActivityFilter';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore()
    useEffect(() => {
        if(activityStore.activitiesRegestry.size<= 1)
            activityStore.loadActivities()  
    }, [activityStore.activitiesRegestry.size, activityStore.loadActivities]);

    if (activityStore.loadingInitial)
        return <LoadingComponent content='Loading activities ...' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActityList />
            </Grid.Column>
            <Grid.Column width='6'>
               <ActivityFilters/>
            </Grid.Column>
        </Grid>
    )
})