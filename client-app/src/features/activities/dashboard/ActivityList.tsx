import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";


function ActivityList() {
    const { activityStore } = useStore();
    const { deleteActivity, activitiesByDate, isLoading } = activityStore;

    const [target, setTarget] = useState('');

    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(event.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as={'a'}>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    onClick={() => activityStore.selectActivity(activity.id)}
                                    floated="right"
                                    content="View"
                                    color="blue" />
                                <Button
                                    onClick={(event) => handleDeleteActivity(event, activity.id)}
                                    name={activity.id}
                                    loading={isLoading && target === activity.id}
                                    floated="right"
                                    content="Delete"
                                    color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
}

export default observer(ActivityList);