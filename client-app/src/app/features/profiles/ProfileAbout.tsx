import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import MyTextArea from '../../common/form/MyTextArea';
import MyTextInput from '../../common/form/MyTextInput';
import * as Yup from 'yup'
import { Profile } from '../../models/ActivityAttendee';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { ProfilesAboutFormValues } from '../../models/user';


interface Props {
    profile: Profile
}

export default observer(function ProfileAbout({ profile }: Props) {

    const { profileStore: { isCurrentUser, updateDetails } } = useStore()
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [formValues, setFormValues] = useState<ProfilesAboutFormValues>(new ProfilesAboutFormValues(profile))

    async function handleFormSubmit(data: ProfilesAboutFormValues){
        await updateDetails(data);
        setFormValues(data)
        setIsInEditMode(false)
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {isCurrentUser && (<Button
                        floated='right'
                        basic
                        content={isInEditMode ? 'Cancel' : 'Edit'}
                        onClick={() => setIsInEditMode(!isInEditMode)}
                    />)}
                </Grid.Column>
                <Grid.Column width={16}>
                    {isInEditMode 
                    ? (
                        <Formik
                            initialValues={formValues}
                            onSubmit={(data) => handleFormSubmit(data)}
                            validationSchema={Yup.object({ displayName: Yup.string().required() , bio: Yup.string()})}>
                            {
                                ({ handleSubmit, isSubmitting, isValid, dirty }) => (
                                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >

                                        <MyTextInput placeholder='Display name' name='displayName' />
                                        <MyTextArea rows={3} placeholder="Add your bio" name="bio" />
                                        <Button
                                            disabled={isSubmitting || !isValid || !dirty}
                                            floated='right'
                                            positive
                                            type='submit'
                                            content='Update profile'
                                            loading={isSubmitting} />
                                    </Form>)}
                        </Formik>
                    )
                :(<span style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</span>)}
                </Grid.Column>
            </Grid>

        </Tab.Pane>);
})