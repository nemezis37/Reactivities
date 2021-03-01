import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button,  FormField,  Label,  Segment } from 'semantic-ui-react'
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite'
import { useHistory, useParams } from 'react-router-dom';
import { Activity } from '../../../../models/activity';
import LoadingComponent from '../../../../layout/LoadingComponent';
import { v4 as uuid } from 'uuid'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'

export default observer( function ActivityForm() {

    const {activityStore} = useStore();
    const history = useHistory();
    const [activity, setActivity] = useState<Activity>({ venue: '', city: '', category: '', date: '', description: '', id: '', title: '' })
    const {id} = useParams<{id: string}>()

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required')
    })

    useEffect(() =>{
        if(id){activityStore.loadActivity(id).then(act => setActivity(act!));}
    }, [id, activityStore.loadActivity])

    // async function onSubmit() {
    //     if(activity.id.length === 0)
    //     {
    //         activity.id = uuid();
    //         await activityStore.createActivity(activity)
    //         history.push(`/activity/${activity.id}`)
    //     }
    //     else
    //     {
    //         await activityStore.updateActivity(activity)
    //         history.push(`/activity/${activity.id}`)
    //     }
    // }

    // function onInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     var {name, value} = event.target;
    //     setActivity({...activity, [name]: value});
    // }
    if(activityStore.loadingInitial)
        return <LoadingComponent content='Loading activity...'/>
    return (
        <Segment clearing>
            <Formik 
            enableReinitialize 
            initialValues={activity} onSubmit={values => console.log(values)} 
            validationSchema={validationSchema}>
                {({handleSubmit}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
                        <FormField>
                            <Field placeholder='Title' name='title'/>
                            <ErrorMessage name='title' render={error => <Label color='red' content={error}/>}/>
                        </FormField>
                        <Field placeholder="Title" name="title"/>
                        <Field placeholder="Description"  name="description"/>
                        <Field placeholder="Category" name="category"/>
                        <Field type='date' placeholder="Date" name="date" />
                        <Field placeholder="Venue" name="venue" />
                        <Button
                            floated='right'
                            positive
                            type='submit'
                            content='Submit' 
                            loading={activityStore.loading}/>
                        <Button
                            floated='right'
                            type='submit'
                            content='Cancel'/>
                </Form>
                )}
            </Formik>
        </Segment>
    )
})