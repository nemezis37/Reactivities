import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../models/activity'
import {format} from 'date-fns'
import ActivivtyListItemAttendee from './ActivivtyListItemAttendee'
interface Props {
    act: Activity
}

export default function ActivityListItem({ act }: Props) {
    return (
        <Segment.Group>
            <Segment>
                {act.isCanceled && 
                    <Label
                        attached='top'
                        color='red'
                        content='Canceled'
                        style={{textAlign: 'center'}}
                    />}
                <Item.Group>
                    <Item>
                        <Item.Image stile={{marginBotom: 3}} size='tiny' circular src={ act.host?.image || 'assets/user.png'} />
                    </Item>
                    <Item.Content>
                        <Item.Header as={Link} to={`/activity/${act.id}`}>
                            {act.title}
                        </Item.Header>
                        <Item.Description>
                            Hosted by <Link to={`/profiles/${act.host?.userName}`}>{act.host?.displayName} </Link> 
                        </Item.Description>
                        {act.isHost && (<Item.Description><Label basic color='orange' content='You are hosting this activity'/></Item.Description>)}
                        {act.isGoing && !act.isHost && (<Item.Description><Label basic color='green' content='You are going to this activity'/></Item.Description>)}
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
                <ActivivtyListItemAttendee attendees={act.attendees!}/>
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