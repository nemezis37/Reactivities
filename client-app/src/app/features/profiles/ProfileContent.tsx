import { observer } from 'mobx-react-lite'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { Profile } from '../../models/ActivityAttendee'
import ProfilePhotos from './ProfilePhotos'

interface Props{
    profile: Profile
}

export default observer( function ProfileContent({profile}:Props){
    
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <Tab.Pane>Events</Tab.Pane>},
        {menuItem: 'Folowing', render: () => <Tab.Pane>Folowing</Tab.Pane>},
        {menuItem: 'Folowers', render: () => <Tab.Pane>Folowers</Tab.Pane>},
    ]    
    return(
        <Tab menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
        />

    )
})