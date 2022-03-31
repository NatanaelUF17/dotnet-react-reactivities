import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

function ProfileAbout() {

    const { profileStore } = useStore();
    const { isCurrentUser, profile } = profileStore;
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left'
                        icon='user'
                        content={`About ${profile?.displayName}`}
                    />
                    {isCurrentUser && (
                        <Button 
                            floated='right'
                            basic
                            content={isEditMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setIsEditMode(!isEditMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                        {isEditMode ? (
                            <ProfileEditForm setEditMode={setIsEditMode} />
                        ) : (
                            <span style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio}</span>
                        )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
}

export default observer(ProfileAbout);