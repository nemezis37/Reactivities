import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../models/activity';
import ActityList from './ActivityLits';
import ActivityDetails from './details/ActivityDetails';
import ActivityForm from './form/ActivityForm';

interface Props {
    activities: Activity[],
    selectedActivity: Activity | undefined
    onAcitvitySelected: (id: string) => void,
    onClearSelectedActivity: () => void
    editMode: boolean,
    onOpenForm: (id: string) => void,
    onCloseForm: () => void
    createOrEditActivity: (acitvity: Activity) => void,
    onDeleteActivity: (id: string) => void
}

export default function ActivityDashboard({ activities, selectedActivity, onAcitvitySelected, onClearSelectedActivity, editMode, onOpenForm, onCloseForm, createOrEditActivity, onDeleteActivity }: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActityList activities={activities} onAcitvitySelected={onAcitvitySelected} onDeleteActivity={onDeleteActivity} />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                    editMode
                        ? <ActivityForm selectedActivity={selectedActivity} onCloseForm={onCloseForm} createOrEditActivity={createOrEditActivity}/>
                        : selectedActivity && <ActivityDetails
                            activity={selectedActivity}
                            onClearSelectedActivity={onClearSelectedActivity}
                            onOpenForm={onOpenForm} />}
            </Grid.Column>
        </Grid>
    )
}