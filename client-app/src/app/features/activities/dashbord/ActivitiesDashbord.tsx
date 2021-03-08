import React, { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import ActityList from './ActivityLits';
import { observer } from 'mobx-react-lite'
import LoadingComponent from '../../../layout/LoadingComponent';
import ActivityFilters from './ActivityFilter';
import { PagingParams } from '../../../models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore()
    const { loadActivities, activitiesRegestry, loadingInitial, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false))
    }

    useEffect(() => {
        if (activitiesRegestry.size <= 1)
            loadActivities()
    }, [activitiesRegestry.size, loadActivities]);

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (<InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                    initialLoad={false}>
                    <ActityList />
                </InfiniteScroll>)}

            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})