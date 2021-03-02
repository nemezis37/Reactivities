import { ErrorMessage, Form, Formik } from 'formik'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Button, Header, Label } from 'semantic-ui-react'
import MyTextInput from '../../common/form/MyTextInput'
import { useStore } from '../../stores/store'
import * as Yup from 'yup'
import ValidationError from '../errors/ValidationErrors'


export default observer(function RegisterForm() {

    const store = useStore()
    return (
        <Formik
            initialValues={{ userName: '', displayName:'', email: '', password: '', backendValidationErrors: '' }}
            onSubmit={(data,{setErrors}) => store.userStore.register(data).catch(errorResponce => setErrors({backendValidationErrors: errorResponce}))}
            validationSchema={Yup.object({
                userName: Yup.string().required(),
                displayName: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            })}>
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content = 'Sign up to reactivities'/>
                    <MyTextInput name='userName' placeholder='User name' />
                    <MyTextInput name='displayName' placeholder='Display name' />
                    <MyTextInput name='email' placeholder='email' />
                    <MyTextInput name='password' placeholder='password' type='password' />
                    <ErrorMessage name='backendValidationErrors' render={()=> 
                        <ValidationError errors={errors.backendValidationErrors}/> }
                    />
                    <Button disabled={isSubmitting || !isValid || !dirty} loading={isSubmitting} positive fluid type='submit' content='Register'/>
                </Form>)}
        </Formik>
    )
})