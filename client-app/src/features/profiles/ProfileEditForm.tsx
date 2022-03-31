import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";

interface Props {
    setEditMode: (isEditMode: boolean) => void;
}

function ProfileEditForm({ setEditMode }: Props) {

    const { profileStore: { profile, updateProfile } } = useStore();

    const initialValues = {
        displayName: profile?.displayName,
        bio: profile?.bio
    };

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
    });

    function handleUpdateProfile(values: Partial<Profile>) {
        updateProfile(values)
            .then(() => setEditMode(false))
    }

    return (
        <Formik 
            initialValues={initialValues} 
            onSubmit={values => {handleUpdateProfile(values)}}
            validationSchema={validationSchema}
        >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className="ui form">
                    <MyTextInput placeholder="Display Name" name="displayName" />
                    <MyTextArea rows={3} placeholder="Add your bio" name="bio" />
                    <Button 
                        positive
                        type='submit'
                        loading={isSubmitting}
                        content='Update profile'
                        floated='right'
                        disabled={!isValid || !dirty}
                    />
                </Form>
            )}
        </Formik>
    );
}

export default observer(ProfileEditForm);