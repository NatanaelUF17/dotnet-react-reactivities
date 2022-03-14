import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActityList";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    isEditMode: boolean;
    isSubmitting: boolean;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

function ActivityDashboard({ activities, selectActivity, selectedActivity, cancelSelectActivity,
    isEditMode, openForm, closeForm, createOrEdit, deleteActivity, isSubmitting }: Props) {
    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity} 
                    isSubmitting={isSubmitting} 
                />
            </Grid.Column>
            <Grid.Column width={'6'}>
                {selectedActivity && !isEditMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {isEditMode &&
                    <ActivityForm
                        activity={selectedActivity}
                        closeForm={closeForm}
                        createOrEdit={createOrEdit}
                        isSubmitting={isSubmitting}
                    />
                }
            </Grid.Column>
        </Grid>
    );
}

export default ActivityDashboard;