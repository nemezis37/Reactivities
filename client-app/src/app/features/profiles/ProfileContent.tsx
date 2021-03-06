import { observer } from 'mobx-react-lite'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { Profile } from '../../models/ActivityAttendee'
import { useStore } from '../../stores/store'
import ProfileAbout from './ProfileAbout'
import ProfileAcitivities from './ProfileAcitivities'
import ProfileFollowings from './ProfileFollowings'
import ProfilePhotos from './ProfilePhotos'

interface Props{
    profile: Profile
}

export default observer( function ProfileContent({profile}:Props){
    
    const {profileStore} = useStore()

    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout profile={profile}/>},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />},
        {menuItem: 'Events', render: () => <ProfileAcitivities />},
        {menuItem: 'Folowers', render: () => <ProfileFollowings />},
        {menuItem: 'Folowing', render: () => <ProfileFollowings />},
    ]    
    return(
        <Tab menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
        />

    )
})