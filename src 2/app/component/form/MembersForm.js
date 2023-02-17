import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Modal } from "react-bootstrap"
import DatePicker from "react-datepicker";

const MembersForm = (props) => {
    const { register, handleSubmit, setValue } = useForm();
    const {
        rowData,
        isEdit,
        onFormSubmit,
        handleCancelMembersForm,
        state,
        setState,
        startDate,
        setStartDate
    } = props;

    const handleDateChange = (date) => {
        console.log("date____", date)
        setStartDate(date)
    }
    useEffect(() => {
        let abortController = new AbortController();
        if (isEdit && rowData) {
            const fields = [
                "firstName",
                "lastName",
                "paid",
            ];
            fields.forEach((field) => setValue(field, rowData[field]));
            setStartDate(new Date(rowData['becomeMember']));
        }
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="members-form">
            <Form.Group
                className="mb-3"
            >
                <Form.Label>First Name</Form.Label>
                <Form.Control as="input" required name="firstName" {...register("firstName")} placeholder="First Name" />
            </Form.Group>
            <Form.Group
                className="mb-3"
            >
                <Form.Label>Last Name</Form.Label>
                <Form.Control as="input" required name="lastName" {...register("lastName")} placeholder="Last Name" />
            </Form.Group>
            <Form.Group
                className="mb-3"
            >
                <Form.Label>Membersship Start Date</Form.Label>
                <DatePicker dateFormat="dd MMMM, yyyy" className="form-control"
                    selected={startDate} onChange={handleDateChange}
                />
            </Form.Group>

            <div className="form-group">
                <div className="form-check d-flex align-items-center">
                    <input className="form-check-input ml-0" type="checkbox" {...register('paid')} id="paid" />
                    <label className="form-check-label" htmlFor="paid">
                        Paid
                    </label>
                </div>
            </div>
            <div className='d-flex justify-content-end p-1'>
                <Button variant="outline-secondary" className="mr-3" onClick={handleCancelMembersForm}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    {isEdit ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
};
export default MembersForm;
