import React, { ChangeEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite'

export default observer( function ActivityForm() {

    const {activityStore} = useStore();

    var intialState = activityStore.selectedActivity ?? { venue: '', city: '', category: '', date: '', description: '', id: '', title: '' };

    var [activity, setActivity] = useState(intialState);

    function onSubmit() {
        activity.id 
        ? activityStore.updateActivity(activity)
        : activityStore.createActivity(activity)
    }

    function onInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        var {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={onSubmit}>
                <Form.Input placeholder="Title" name="title" value={activity.title} onChange={onInput} />
                <Form.TextArea placeholder="Description"  name="description" value={activity.description} onChange={onInput} />
                <Form.Input placeholder="Category" name="category" value={activity.category} onChange={onInput} />
                <Form.Input type='date' placeholder="Date" name="date" value={activity.date} onChange={onInput} />
                <Form.Input placeholder="Venue" name="venue" value={activity.venue} onChange={onInput} />
                <Button
                    floated='right'
                    positive
                    type='submit'
                    content='Submit' 
                    loading={activityStore.loading}/>
                <Button
                    floated='right'
                    type='submit'
                    content='Cancel'
                    onClick={() => activityStore.closeForm()} />
            </Form>
        </Segment>
    )
})