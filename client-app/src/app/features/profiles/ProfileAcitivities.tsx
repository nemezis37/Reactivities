import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Image, Tab, TabProps } from 'semantic-ui-react';
import { UserActivity } from '../../models/ActivityAttendee';
import { useStore } from '../../stores/store'
import {format} from 'date-fns'

const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } },
]

export default observer(function ProfileActivities() {

    const { profileStore } = useStore();

    const { loadUserActivities, profile, loadingActivities, userActivities } = profileStore;

    useEffect(() => {
        loadUserActivities(profile!.userName);
    }, [loadUserActivities, profile])

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserActivities(profile!.userName, panes[data.activeIndex as number].pane.key)
    }

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='calendar' content={'Activities'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        panes={panes}
                        menu={{ secondary: true, pointing: true }}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map((a: UserActivity) => (
                            <Card
                                as={Link}
                                to={`/activities/${a.id}`}
                                key={a.id}>
                                <Image src={`/assets/categoryImages/${a.category}.jpg`}
                                    style={{ minHeight: 100, objectFit: 'cover' }} />

                                <Card.Content>
                                    <Card.Header textAlign='center'>{a.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div> {format(new Date(a.date), 'do LLL')}</div>
                                        <div> {format(new Date(a.date), 'h:m a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )


})