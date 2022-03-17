import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import Loading from "../../../app/layout/components/Loading";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";


function ActivityForm() {

    const { activityStore } = useStore();
    const { createActivity, updateActivity, isLoading, 
        loadActivity, isInitialLoading } = activityStore;
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) {
            loadActivity(id)
                .then(activity => setActivity(activity!));
        }
    }, [id, loadActivity]);

    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    function handleInputChanged(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    if (isInitialLoading) return <Loading content='Loading activity...'/>

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
                    type='date'
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
                <Button
                    loading={isLoading}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit" />
                <Button
                    as={Link} to={'/activities'}
                    floated="right"
                    type="button"
                    content="Cancel"
                />
            </Form>
        </Segment>
    );
}

export default observer(ActivityForm);