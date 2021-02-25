import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite'
import { useHistory, useParams } from 'react-router-dom';
import { Activity } from '../../../../models/activity';
import LoadingComponent from '../../../../layout/LoadingComponent';
import { v4 as uuid } from 'uuid'

export default observer( function ActivityForm() {

    const {activityStore} = useStore();
    const history = useHistory();
    const [activity, setActivity] = useState<Activity>({ venue: '', city: '', category: '', date: '', description: '', id: '', title: '' })
    const {id} = useParams<{id: string}>()

    useEffect(() =>{
        if(id){activityStore.loadActivity(id).then(act => setActivity(act!));}
    }, [id, activityStore.loadActivity])

    async function onSubmit() {
        if(activity.id.length === 0)
        {
            activity.id = uuid();
            await activityStore.createActivity(activity)
            history.push(`/activity/${activity.id}`)
        }
        else
        {
            await activityStore.updateActivity(activity)
            history.push(`/activity/${activity.id}`)
        }
    }

    function onInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        var {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }
    if(activityStore.loadingInitial)
        return <LoadingComponent content='Loading activity...'/>
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
                    content='Cancel'/>
            </Form>
        </Segment>
    )
})