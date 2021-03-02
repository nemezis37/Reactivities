import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header, Label } from 'semantic-ui-react'
import MyTextInput from '../../common/form/MyTextInput'
import { useStore } from '../../stores/store'

export default observer(function LoginForm() {

    const store = useStore()
    return (
        <Formik
            initialValues={{ email: '', password: '', error: '' }}
            onSubmit={(data,{setErrors}) => store.userStore.logIn(data).catch(error=> setErrors({error: 'Invalid email or password'}))}>
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content = 'Log in to reactivities'/>
                    <MyTextInput name='email' placeholder='email' />
                    <MyTextInput name='password' placeholder='password' type='password' />
                    <ErrorMessage name='error' render={()=> <Label basic color='red' style={{marginBotom: 20 }} content={errors.error} />} />
                    <Button loading={isSubmitting} positive fluid type='submit' content='Login'/>
                </Form>)}
        </Formik>
    )
})