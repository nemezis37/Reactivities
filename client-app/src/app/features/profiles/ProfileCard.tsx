import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Icon, Image } from 'semantic-ui-react'
import { ActivityAttendee } from '../../models/ActivityAttendee'

interface Props {
    profile: ActivityAttendee
}

export default function ProfileCard({profile}: Props)
{
    return(
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src ={profile.image || '/assets/user.png'}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                    20 folowers
            </Card.Content>
        </Card>
    )
}