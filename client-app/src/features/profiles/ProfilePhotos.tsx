import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/image-upload/PhotoUploadWidget';
import { Photo } from '../../app/models/photo';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

function ProfilePhotos({ profile }: Props) {

    const { profileStore: { isCurrentUser, uploadPhoto, isUploading, 
        setMainPhoto, isSettingMainPhoto, deletePhoto, isDeletingPhoto } } = useStore();

    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget]= useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file)
            .then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>) {
        setTarget(event.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>) {
        setTarget(event.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget 
                            uploadPhoto={handlePhotoUpload}
                            isLoading={isUploading} 
                        />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                basic
                                                color='green'
                                                content='Main'
                                                name={'main' + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === 'main' + photo.id && isSettingMainPhoto}
                                                onClick={event => handleSetMainPhoto(photo, event)}
                                            />
                                            <Button 
                                                basic
                                                color='red'
                                                icon='trash'
                                                name={photo.id}
                                                disabled={photo.isMain}
                                                loading={target === photo.id && isDeletingPhoto}
                                                onClick={event => handleDeletePhoto(photo, event)}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default observer(ProfilePhotos);