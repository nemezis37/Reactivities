import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite'
import ActivityListItem from './ActivityListItem';

export default observer(function ActityList() {

    const { activityStore } = useStore()
    const { activitiesGroupedByDate } = activityStore;

    return (
        <>
            {activitiesGroupedByDate().map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(act =>
                        <ActivityListItem key={act.id} act={act} />)
                    }
                </Fragment>
            ))}
        </>

    )
})