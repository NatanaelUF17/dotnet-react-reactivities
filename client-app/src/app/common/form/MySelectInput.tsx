import { useField } from "formik";
import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

function MySelectInput({ name, label, placeholder, options }: Props) {
    
    const [field, meta, helpers] = useField(name);
    
    return (
        <Form.Field error={!!meta.error && meta.touched}>
            <label>{label}</label>
            <Select 
                clearable
                options={options}
                value={field.value || null}
                onChange={(event, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}

export default MySelectInput;