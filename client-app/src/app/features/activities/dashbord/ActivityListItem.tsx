import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../models/activity'
import {format} from 'date-fns'
interface Props {
    act: Activity
}

export default function ActivityListItem({ act }: Props) {
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='assets/user.png' />
                    </Item>
                    <Item.Content>
                        <Item.Header as={Link} to={`/activity/${act.id}`}>
                            {act.title}
                        </Item.Header>
                        <Item.Description>
                            Hosted by Bob
                        </Item.Description>
                    </Item.Content>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' />{format( act.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {act.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{act.description}</span>
                <Button as={Link}
                    to={`/activity/${act.id}`}
                    color='teal'
                    floated='right'
                    content='View' />
            </Segment>
        </Segment.Group>
    )
}