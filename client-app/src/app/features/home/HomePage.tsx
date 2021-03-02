import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react'
import { useStore } from '../../stores/store'
import LoginForm from '../user/LoginForm'
import RegisterForm from '../user/RegisterForm'

export default observer( function HomePage(){
    const {userStore, modalStore} = useStore();

    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBotom: 12}}/>
                    Reactivities
                </Header>
                {
                    userStore.isLoggedIn
                    ? <>
                        <Header as='h2' inverted content='Welcome to reactivities'/>

                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to activies
                        </Button>
                    </>
                    : 
                    <>
                        <Button positive onClick={() => modalStore.openModal(<LoginForm/>)}>
                            Login
                        </Button>
                        <Button  onClick={() => modalStore.openModal(<RegisterForm/>)}>
                            Register
                        </Button>
                    </>
                }
                
            </Container>
        </Segment>
    )
})