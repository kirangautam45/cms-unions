import React, { useRef, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import timeZone from "../../../helper/timezones.json";
import 'react-tagsinput/react-tagsinput.css'

const EventForm = (props) => {
    const { register, handleSubmit } = useForm();
    const [state, setState] = useState({
        tags: []
    })
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const {
        panel,
        setPanel
    } = props;
    const [url, setUrl] = useState('');
    const [imageRowData, setImageRowData] = useState("");

    const inputFile = useRef(null)

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    const removeImage = () => {
        setUrl('')
    };

    const handleChange = (tags) => {
        setState({ ...state, tags })
    }
    
    const uploadImageData = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("multipartFile", e.target.files[0]);
        setImageRowData(formData);
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = function (ev) {
                setUrl(ev.target.result)
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <Modal show={panel}
            backdrop="static"
            onHide={() => setPanel(false)}
            className="modal_outer right_modal">
            <Modal.Header closeButton>
                <Modal.Title>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className='event-form'>
                    <div className="form-group card">
                        {url ? <>
                            <button type="button" className="close" aria-label="Close" onClick={removeImage}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <img src={url} alt="cover-img" className="card-img-top" />
                        </> : (
                            <div className="card-body d-flex flex-row justify-content-center align-items-center">
                                <div className="cover-button">
                                    <input type="file" id='file'
                                        ref={inputFile}
                                        // {...register("imageFile")}
                                        onChange={(e) => uploadImageData(e)}
                                        style={{ display: 'none' }} />
                                    <button type="button" className="btn btn-sm" onClick={onButtonClick}>
                                        <img src={require("../../../assets/images/icon/add.svg")} alt="add_icon"/>
                                        Add Cover
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-group d-flex flex-row justify-content-between">
                        <label htmlFor="privateSwitch" className='mb-0'>Private?</label>
                        <Form.Check
                            type="switch"
                            id="privateSwitch"
                            label=""
                            className="pl-0"
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="cost" className='mb-0'>Cost</label>
                        <div className='d-flex flex-row justify-content-between'>
                            <Form.Check
                                name="cost"
                                type="radio"
                                label="Free"
                                checked
                                id="cost"
                            />
                            <Form.Check
                                name="cost"
                                type="radio"
                                label="Paid"
                                id="cost"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventName">Event Name</label>
                        <input type="text" className="form-control round" id="eventName" placeholder="Event Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventName">Time Zone</label>

                        <select className="form-control round">
                            <option value="">Select TimeZone</option>
                            {
                                timeZone.map((row, i) => {
                                    return (
                                        <option value={row.value}>{row.text}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="eventDescription">Event Description</label>
                        <input type="text" className="form-control round" id="eventDescription" placeholder="Event Description" />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="startDate">Start Date</label>
                            <DatePicker dateFormat="dd MMMM, yyyy" className="form-control round" selected={startDate} onChange={(date) => setStartDate(date)} />
                            {/* <input type="date" className="form-control round" id="startDate" placeholder="Email" /> */}
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="endDate">End Date</label>
                            <DatePicker dateFormat="dd MMMM, yyyy" className="form-control round" selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="checkTimeDate" />
                            <label className="form-check-label" htmlFor="checkTimeDate">
                                Add End Date and Time
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="startTime">Start Time</label>
                            <input type="time" className="form-control round" />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="endTime">End Time</label>
                            <input type="time" className="form-control round" />
                        </div>
                    </div>
                    <div className="d-flex flex-column form-group tags">
                        <div class="tags-header d-flex flex-row">
                            <p class="tag-icon"><img src={require("../../../assets/images/icon/label-tag.svg")} /></p>
                            <label class="d-flex flex-column mb-0">Add Tags <span className="tag-subtitle">You are able to select multiple</span></label>
                        </div>
                        <div className="d-flex flex-row tags-list">
                            <button className="btn btn-outline-secondary d-flex flex-row align-items-center">
                                <span>Offensive Ball Handler</span>
                                <img src={require("../../../assets/images/icon/close.svg")} alt="close_icon" className="pl-2" />
                            </button>
                            <button className="btn btn-outline-secondary d-flex flex-row align-items-center">
                                <span>Scoring Rebounder</span> <img src={require("../../../assets/images/icon/close.svg")} alt="close_icon" className="pl-2" />
                            </button>
                            <button className="btn btn-outline-secondary d-flex flex-row align-items-center">
                                <span>Defensive Rebounder</span> <img src={require("../../../assets/images/icon/close.svg")} alt="close_icon" className="pl-2" />
                            </button>
                        </div>
                        <div className="d-flex flex-row tags-list">
                            <button className="btn btn-outline-secondary d-flex flex-row align-items-center">
                                <span>Defensive Rebounder</span> <img src={require("../../../assets/images/icon/close.svg")} alt="close_icon" className="pl-2" />
                            </button>
                            <button className="btn btn-outline-secondary d-flex flex-row align-items-center">
                                <span>Defensive Rebounder</span> <img src={require("../../../assets/images/icon/close.svg")} alt="close_icon" className="pl-2" />
                            </button>
                        </div>
                    </div>
                    <div className='mt-5 d-flex justify-content-end'>
                        <Button variant="outline-secondary" className="mr-3 border-round-8" onClick={() => setPanel(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" className="border-round-8" type="submit">
                            Create
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EventForm
