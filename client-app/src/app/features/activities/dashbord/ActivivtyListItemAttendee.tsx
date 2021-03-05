import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../models/ActivityAttendee'
import ProfileCard from '../../profiles/ProfileCard'

interface Props {
    attendees: Profile[]
}

export default observer(function ActivityListItemAttende({attendees}: Props) {

    const styles = {
        borderColor:'orange',
        borderWidth: 3
    }

    return (<List horizontal >
        {
            attendees.map( x => (
                <Popup hoverable
                    key = {x.userName}
                    trigger={<List.Item key={x.userName} as={Link} to={`/profiles/${x.userName}`} >
                    <Image 
                    size='mini' 
                    circular src={x.image ||'/assets/user.png'} 
                    bordered
                    style={x.following ? styles:null}/>
                </List.Item>}
                >
                    <Popup.Content>
                        <ProfileCard profile={x}/>
                    </Popup.Content>
                </Popup>
                ))
        }
    </List>)
})