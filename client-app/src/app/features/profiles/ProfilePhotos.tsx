import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent, useState } from 'react'
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react'
import PhotoUploadWidget from '../../common/ImageUpload/PhotoUploadWidget'
import { Photo, Profile } from '../../models/ActivityAttendee'
import { useStore } from '../../stores/store'

interface Props {
    profile: Profile
}

export default observer(function ProfilePhotos({ profile }: Props) {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, 
        loading, setMianPhoto, deletePhoto} } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('')

    function handleSetMainPhoto(photo: Photo, e : SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        setMianPhoto(photo);
    }

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false))
    }

    function handleDeletePhoto(photo: Photo, e : SyntheticEvent<HTMLButtonElement>){
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (<Button
                        floated='right'
                        basic
                        content={addPhotoMode ? 'Cancel' : 'Add photo'}
                        onClick={() => setAddPhotoMode(!addPhotoMode)}
                    />)}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading}/>
                    ) :
                        (
                            <Card.Group itemsPerRow={5}>
                                {profile.photos?.map(x => (<Card key={x.id}><Image src={x.url} />
                                {isCurrentUser && (<Button.Group fluid widths={2}>
                                    <Button
                                        basic
                                        color='green'
                                        content='Main'
                                        name={'main'+x.id}
                                        disabled={x.isMain}
                                        loading={target === 'main' + x.id && loading}
                                        onClick={(e) => handleSetMainPhoto(x, e)}
                                    />
                                    <Button
                                        basic
                                        color='red'
                                        icon='trash'
                                        loading={target==x.id && loading}
                                        onClick={(e)=> handleDeletePhoto(x, e)}
                                        disabled = {x.isMain}
                                        name={x.id}
                                    />
                                </Button.Group>)}
                                </Card>))}
                            </Card.Group>)
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})