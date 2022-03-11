import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
}

function ActivityForm({ activity: selectedActivity, closeForm, createOrEdit }: Props) {

    const initialActivityState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialActivityState);

    function handleSubmit() {
        createOrEdit(activity);
    }

    function handleInputChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input
                    value={activity.title}
                    onChange={handleInputChanged}
                    placeholder="Title"
                    name="title" />
                <Form.TextArea
                    value={activity.description}
                    onChange={handleInputChanged}
                    placeholder="Description"
                    name="description" />
                <Form.Input
                    value={activity.category}
                    onChange={handleInputChanged}
                    placeholder="Category"
                    name="category" />
                <Form.Input
                    value={activity.date}
                    onChange={handleInputChanged}
                    placeholder="Date"
                    name="date" />
                <Form.Input
                    value={activity.city}
                    onChange={handleInputChanged}
                    placeholder="City"
                    name="city" />
                <Form.Input
                    value={activity.venue}
                    onChange={handleInputChanged}
                    placeholder="Venue"
                    name="venue" />
                <Button floated="right" positive type="submit" content="Submit" />
                <Button
                    onClick={closeForm}
                    floated="right"
                    type="button"
                    content="Cancel"
                />
            </Form>
        </Segment>
    );
}

export default ActivityForm;