import React, { SyntheticEvent, useState } from 'react'
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../models/activity';

interface Props {
    activities: Activity[]
    onAcitvitySelected: (id: string) => void,
    onDeleteActivity: (id: string) => void,
    submitting: boolean

}

export default function ActityList({ activities, onAcitvitySelected, onDeleteActivity, submitting }: Props) {

    var [target, setTarget] = useState('');

    function onDlele(ev: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(id)
        onDeleteActivity(id)
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(act => (
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
                                    onClick={() => onAcitvitySelected(act.id)}
                                    floated='right'
                                    content='View'
                                    color='blue' />
                                <Button
                                    onClick={(ev) => onDlele(ev, act.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red' 
                                    loading ={submitting && target == act.id}/>
                                <Label basic content={act.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>))}
            </Item.Group>
        </Segment>
    )
}