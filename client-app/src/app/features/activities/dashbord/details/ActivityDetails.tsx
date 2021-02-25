import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react'
import LoadingComponent from '../../../../layout/LoadingComponent';
import { useStore } from '../../../../stores/store'
import { observer } from 'mobx-react-lite'
import agent from '../../../../api/agent';

export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { id } = useParams<{ id: string }>();
    useEffect(() => { 
        activityStore.loadActivity(id); 
    }, [id, activityStore.loadActivity])


    const { selectedActivity: activity, loading } = activityStore;

    if (!activity || loading)
        return <LoadingComponent />
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button
                        as={Link} to={`/manage/${activity.id}`}
                        basic
                        color='blue'
                        content='Edit' />
                    <Button
                        as={Link}
                        to = {'/activities'}
                        basic
                        color='grey'
                        content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})