import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import { Activity } from '../../../../models/activity'

interface Props{
    activity: Activity,
    onClearSelectedActivity : () => void
    onOpenForm: (id: string) => void
}

export default function ActivityDetails({activity, onClearSelectedActivity, onOpenForm}:Props) {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
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
                      basic 
                      color='blue' 
                      content='Edit'                      
                      onClick={()=>onOpenForm(activity.id)}/>
                    <Button 
                      basic 
                      color='grey' 
                      content='Cancel' 
                      onClick={onClearSelectedActivity}/>
                </Button.Group>

            </Card.Content>
        </Card>
    )
}