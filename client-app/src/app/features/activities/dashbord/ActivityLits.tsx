import React, { SyntheticEvent, useState } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite'

export default observer(function ActityList() {

    var [target, setTarget] = useState('');

    const { activityStore } = useStore()

    function onDlele(ev: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(id)
        activityStore.deleteActivity(id)
    }

    return (
        <Segment>
            <Item.Group divided>
                {activityStore.activitiesByDate().map(act => (
                    <Item key={act.id}>
                        <Item.Content>
                            <Item.Header as='a' >{act.title}</Item.Header>
                            <Item.Meta>{act.date}</Item.Meta>
                            <Item.Description>
                                <div>{act.description}</div>
                                <div>{act.city}, {act.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    onClick={() => activityStore.selectActivity(act.id)}
                                    floated='right'
                                    content='View'
                                    color='blue' />
                                <Button
                                    onClick={(ev) => onDlele(ev, act.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    loading={activityStore.loading && target == act.id} />
                                <Label basic content={act.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>))}
            </Item.Group>
        </Segment>
    )
})