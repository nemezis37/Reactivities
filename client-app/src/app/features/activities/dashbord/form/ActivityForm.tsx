import React, { useEffect, useState } from 'react'
import { Button, Segment } from 'semantic-ui-react'
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite'
import { useHistory, useParams } from 'react-router-dom';
import { ActivityFormValues } from '../../../../models/activity';
import LoadingComponent from '../../../../layout/LoadingComponent';
import { v4 as uuid } from 'uuid'
import { Formik, Form } from 'formik';
import * as Yup from 'yup'
import MyTextInput from '../../../../common/form/MyTextInput';
import MyTextArea from '../../../../common/form/MyTextArea';
import MySelectInput from '../../../../common/form/MySelectInput';
import { categroyOptions } from '../../../../common/form/options/category';
import MyDateInput from '../../../../common/form/MyDatePicker';

export default observer( function ActivityForm() {

    const {activityStore} = useStore();
    const history = useHistory();
    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues())
    const {id} = useParams<{id: string}>()

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

    useEffect(() =>{
        if(id){activityStore.loadActivity(id).then(act => setActivity(new ActivityFormValues(act)));}
    }, [id, activityStore.loadActivity])

    async function onFormSubmit(activity: ActivityFormValues) {
        if(!activity.id)
        {
            activity.id = uuid();
            await activityStore.createActivity(activity)
            history.push(`/activity/${activity.id}`)
        }
        else
        {
            await activityStore.updateActivity(activity)
            history.push(`/activity/${activity.id}`)
        }
    }

    if(activityStore.loadingInitial)
        return <LoadingComponent content='Loading activity...'/>
    return (
        <Segment clearing>
            <Formik 
            enableReinitialize 
            initialValues={activity} 
            onSubmit={values => onFormSubmit(values)} 
            validationSchema={validationSchema}>
                {({handleSubmit, isSubmitting, isValid, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >

                        <MyTextInput placeholder='Title' name='title' />
                        <MyTextArea rows={3} placeholder="Description"  name="description"/>
                        <MySelectInput options={categroyOptions} placeholder="Category" name="category"/>
                        <MyDateInput 
                            placeholderText="Date" 
                            name="date"
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa' />
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button
                            disabled = {isSubmitting || !isValid || !dirty}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit' 
                            loading={isSubmitting}/>
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