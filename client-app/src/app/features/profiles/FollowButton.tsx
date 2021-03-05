import { observe } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react'
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../models/ActivityAttendee';
import { useStore } from '../../stores/store';

interface Props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {

    const {profileStore, userStore} = useStore();
    const {updateFolowing, loading} = profileStore;

    if(userStore.user?.userName === profile.userName)
        return null;

    function handleFollow(e:SyntheticEvent, userName: string){
        e.preventDefault();
        profile.following? updateFolowing(userName, false) : updateFolowing(userName, true);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button fluid color='teal' content={profile.following? 'Following': 'Not following'} />
            </Reveal.Content>

            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    basic
                    fluid
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e)=> handleFollow(e, profile.userName)} />
            </Reveal.Content>
        </Reveal>
    )
})