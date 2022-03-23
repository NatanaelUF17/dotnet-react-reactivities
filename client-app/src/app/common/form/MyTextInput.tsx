import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

function MyTextInput({ placeholder, name, label }: Props) {
    
    const [field, meta] = useField(name);
    
    return (
        <Form.Field error={!!meta.error && meta.touched}>
            <label>{label}</label>
            <input 
                {...field} 
                placeholder={placeholder}
                name={name} 
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}

export default MyTextInput;