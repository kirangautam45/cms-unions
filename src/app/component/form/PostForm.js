import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Modal } from "react-bootstrap"

const PostForm = (props) => {
    const { register, handleSubmit, errors, reset, setValue } = useForm();
    const [previewMode, setPreviewMode] = useState();
    const {
        onPostSubmit,
        rowData,
        isEdit,
        topicRequest,
        handleImageModal,
        handleCancelPostModal,
        isDraft,
        imageUpload,
        url,
        state,
        setState,
        uploadImageData
    } = props;

    const handlePreviewMode = () => {
        setPreviewMode(true);
    }

    const handleCancelPreviewMode = () => {
        setPreviewMode(false);
    }

    const handleText = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        let abortController = new AbortController();
        if (isEdit && rowData) {
            console.log("rowData", rowData)
            const fields = [
                "postTitle",
                "postTopicName",
                "postDescription"
            ];
            setValue("postTitle", rowData["title"]);
            setValue("postTopicName", rowData["topicName"]);
            setValue("postDescription", rowData["text"]);
        }
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <form onSubmit={handleSubmit(onPostSubmit)}>
            <div className="row mb-3 d-flex justify-content-between">
                <div className='col-md-5'>
                    <select class="custom-select custom-select-sm"
                        required
                        {...register('postTopicName', {
                            onChange: ((e) => handleText(e))
                        })}
                    >
                        <option value="">Select Topic</option>
                        {topicRequest.topicData.map((row, i) => {
                            return (
                                <option value={row.title}>{row.title}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='col-md-7 text-right'>
                    <Button variant="outline-primary" size="sm" onClick={handlePreviewMode}>
                        Preview Post
                    </Button>
                </div>
            </div>
            <Form.Group
                className="mb-3"
            >
                <Form.Control as="input"
                    {...register('postTitle', {
                        onChange: ((e) => handleText(e))
                    })}
                    required
                    placeholder="Write your post title" />
            </Form.Group>

            <Form.Group
                className="mb-3"
            >
                <Form.Control as="textarea"
                    rows={10}
                    onChange={handleText}
                    {...register('postDescription', {
                        onChange: ((e) => handleText(e))
                    })}
                    required
                    placeholder="Write your post description" />
            </Form.Group>

            <div className="position-relative h-10rem rounded-lg cursor-pointer border-dashed border-light border-gray-200 bg-white d-flex justify-content-center align-items-center">
                <div className="position-absolute p-3">
                    <div className="d-flex flex-column align-items-center">
                        {isEdit ? (
                            <img src={(url != "") ? url : rowData && rowData.image ? rowData.image.link : require("../../../assets/images/no-image.jpg")} className="img-thumbnail preview-img" />
                        ) : (
                            url ? (
                                <img src={(url != "") ? url : require("../../../assets/images/no-image.jpg")} className="img-thumbnail preview-img" />
                            ) : (
                                <>
                                    <i className="fa fa-cloud-upload fa-3x text-gray-200"></i>
                                    <span className="d-block text-secondary font-weight-normal">Attach you files here</span>
                                    <span className="d-block text-secondary font-weight-normal">or</span>
                                    <span className="d-block text-info font-weight-normal">Browse files</span>
                                </>
                            )
                        )}

                    </div>
                    <input type="file"
                        className="h-100 w-100 opacity-0 imagefile"
                        name="imageFile"
                        {...register("imageFile")}
                        onChange={(e) => uploadImageData(e)}
                    />

                </div>
            </div>

            <div className='row d-flex justify-content-between mt-3'>
                <div className="col-md-2 text-left">
                    <Button variant="outline-secondary" className="btn-light" size="sm" onClick={handleCancelPostModal}>
                        Cancel
                    </Button>
                </div>
                <div className="col-md-9 text-right">
                    <Button variant="outline-secondary"
                        type="submit"
                        onClick={e => {
                            setState({ ...state, "isDraft": true });
                        }} size="sm">
                        Save as Draft
                    </Button>
                    <Button variant="primary"
                        size="sm"

                        type="submit"
                        onClick={e => {
                            setState({ ...state, "isPublished": true });
                        }}>
                        Publish
                    </Button>
                    {/* {isEdit ? (
                        <>
                            <Button variant="outline-secondary" size="sm" onClick={handleImageModal}>
                                {rowData && rowData.image && rowData.image ? "Change Image" : "Upload Image"}
                            </Button>
                            <Button variant="primary" type="submit" size="sm">
                                Update
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline-secondary"
                                type="submit"
                                disabled={imageUpload ? true : false}
                                onClick={e => {
                                    setState({ ...state, "isDraft": true });
                                }} size="sm">
                                Save as Draft
                            </Button>
                            <Button variant="outline-secondary" disabled={isDraft ? false : true} size="sm" onClick={handleImageModal}>
                                Upload Image
                            </Button>
                            <Button variant="primary"
                                size="sm"

                                type="submit"
                                onClick={e => {
                                    setState({ ...state, "isPublished": true });
                                }}>
                                Publish
                            </Button>
                        </>
                    )} */}

                </div>
            </div>
            <Modal show={previewMode} onHide={handleCancelPreviewMode} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="primary-font h5">Preview Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEdit ? (
                        state && state.rowData && (
                            <div class="card mb-3">
                                <div class="row no-gutters">
                                    <div class="col-md-3">
                                        {url ? <img src={url} class="card-img" alt="..." />
                                            : rowData && rowData.image && rowData.image.link ? <img src={rowData.image.link} class="card-img img-thumbnail" alt="No-Image" />
                                                : <img src={require("../../../assets/images/no-image.jpg")} class="card-img img-thumbnail" alt="No-Image" />
                                        }
                                    </div>
                                    <div class="col-md-9">
                                        <div class="card-body d-flex flex-column pl-3 pt-0 ">
                                            <div className='d-flex flex-row justify-content-between'>
                                                <h5 class="card-title">{state.postTitle || state.rowData.title}</h5>
                                            </div>
                                            <p class="card-text pb-4">{state.postDescription || state.rowData.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        state && (
                            <div class="card mb-3">
                                <div class="row no-gutters">
                                    <div class="col-md-3">
                                        {url ? <img src={url} class="card-img" alt="..." />
                                            :
                                            <img src={require("../../../assets/images/no-image.jpg")} class="card-img img-thumbnail" alt="No-Image" />}
                                    </div>
                                    <div class="col-md-9">
                                        <div class="card-body d-flex flex-column pl-3 pt-0 ">
                                            <div className='d-flex flex-row justify-content-between'>
                                                <h5 class="card-title">{state.postTitle}</h5>
                                            </div>
                                            <p class="card-text pb-4">{state.postDescription}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </Modal.Body>
            </Modal>
        </form>
    );
};
export default PostForm;
