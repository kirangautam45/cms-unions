import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Slider from "react-slick";
import "../pages/styles.css"

// import { ToastContainer, toast } from "react-toastify";
import {
    Modal,
    Button
} from 'react-bootstrap';
import {
    createPosts,
    createTopics,
    getAllPosts,
    getAllTopics,
    uploadImage,
    transhPostData,
    deetePostData,
    updatePost,
    getPostCount,
    getPostbyTopic
} from '../../services/auth';
import { timeSince } from '../../helper/DateConversion';
import PostForm from "../component/form/PostForm"

const Post = () => {
    const { register, handleSubmit } = useForm();
    const [state, setState] = useState();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [url, setUrl] = useState("");
    const [type, setType] = useState("PUBLISHED");
    const [isTopicbyIdPost, setIsTopicbyIdPost] = useState(false);
    const [openTopicModal, setOpenTopicModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [topicId, setTopicId] = useState({});
    const [topicName, setTopicName] = useState('');
    const [isDraft, setIsDraft] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [imageUpload, setImageUpload] = useState(false);
    const [imageRowData, setImageRowData] = useState("");
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        centerMode: false,
        slidesToScroll: 7,
    };

    const [topicRequest, setTopicRequest] = useState({
        topicData: [],
        page: 0,
        totalItems: 0,
        perPage: 0,
    });
    const [counterData, setCounterData] = useState({
        publishedPosts: 0,
        draftedPosts: 0,
        trashedPosts: 0,
    });
    const [postRequest, setPostRequest] = useState({
        postData: [],
        page: 0,
        totalItems: 0,
        perPage: 0,
        id: "",
        hasNext: false,
        hasPrevious: false,
        isPostLoad: false,
    });

    const handlePostModal = () => {
        setState({ ...state, openPostModal: true })
    }

    const handleCancelPostModal = () => {
        Swal.fire({
            title: 'Did You save Post as Draft or Pulished?',
            text: "Because if you cancel all of your changes will be lost",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel It!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsEdit(false);
                setState({ ...state, openPostModal: false, rowData: [] })
            }
        })

    }

    const handleImageModal = () => {
        setOpenImageModal(true)
    }

    const handleTopicModal = () => {
        setOpenTopicModal(true)
    }

    const handleCancelTopicModal = () => {
        setOpenTopicModal(false)
    }

    const handleCloseviewMode = () => {
        setState({ rowData: [], viewMode: false })
    }
    const editPostData = (row, index) => {
        setState({ rowData: row, openPostModal: true })
        setIsEdit(true);
    }

    const onTopicSubmit = (formData, e) => {
        return addTopics(formData, e);
    }
    const addTopics = (data, e) => {
        createTopics({
            "title": data['topicName'],
            "text": "",
            "tags": [
            ],
            "topicColor": "linear-gradient(180deg, #edd338 36%, #fd6c12 135%)"
        })
            .then((res) => {
                if (res.data && res.data.statusCode === 200) {
                    setTopicRequest({
                        topicData: [res.data.response, ...topicRequest.topicData],
                        totalItems: topicRequest.totalItems + 1,
                        perPage: rowsPerPage,
                        page: page,
                        lastPage: page,
                    });
                    setOpenTopicModal(false);
                    Swal.fire({
                        text: "Topic Created Successfully",
                        icon: "success",
                    });
                    e.target.reset();
                }
                else {
                    console.log("topcis not create")
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err)
                }
            });
    }

    const onPostSubmit = (formData, e) => {
        Object.assign(formData, state)
        if (!isEdit) {
            return addPost(formData, e);
        } else {
            return editPost(formData, e);
        }
    }

    const addPost = (formData, e) => {
        let topicsId = ''
        if (formData["postTopicName"]) {
            var topicId = topicRequest.topicData.find(
                (el) => el.title.toLowerCase() === formData["postTopicName"].toLowerCase()
            );
            topicsId = topicId["id"];
        }
        formData['title'] = formData['postTitle']
        formData['text'] = formData['postDescription']
        formData['topicName'] = formData['postTopicName']
        formData['tags'] = []

        delete formData['postTitle']
        delete formData['postDescription']
        delete formData['openPostModal']
        delete formData['postTopicName']
        delete formData['isPostLoad']
        if (formData['isPublished']) {
            formData['isDraft'] = false
            setCounterData({
                ...counterData,
                publishedPosts: counterData.publishedPosts + 1,
            });
        }
        if (formData['isDraft']) {
            formData['isPublished'] = false
            setCounterData({
                ...counterData,
                draftedPosts: counterData.draftedPosts + 1,
            });
        }
        createPosts(formData, topicsId)
            .then((res) => {
                if (res.data && res.data.statusCode === 200) {
                    topicRequest.topicData.forEach(e => {
                        if (e.id === topicsId) {
                            e.numberOfPosts++
                        }

                    })
                    setIsDraft(true);
                    if (imageRowData) {
                        imagePostUpload(res.data.response.id);
                    }
                    else {
                        setPostRequest({
                            postData: [res.data.response, ...postRequest.postData],
                            totalItems: res.data.response.totalItems + 1,
                            perPage: rowsPerPage,
                            page: page,
                            lastPage: page,
                            id: res.data.response.id,
                            hasNext: res.data.response.hasNext,
                            hasPrevious: res.data.response.hasPrevious,
                        });


                    }
                    setState({ openPostModal: false })
                    if (state.isDraft) {
                        Swal.fire({
                            title: "Post Drafted",
                            icon: "success",
                        });
                    }
                    if (state.isPublished) {
                        Swal.fire({
                            title: "Post Published",
                            icon: "success",
                        });
                    }
                    e.target.reset();
                }
                else {
                    console.log("Post not create")
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err)
                }
            });
    }

    const editPost = (formData, e) => {

        formData['title'] = formData['postTitle']
        formData['text'] = formData['postDescription']
        formData['tags'] = []

        delete formData['postTopicName']
        delete formData['openPostModal']

        delete formData['imageFile']
        delete formData['rowData']
        delete formData['postDescription']
        delete formData['postTitle']
        delete formData['isPostLoad']
        if (formData['isPublished']) formData['isDraft'] = false
        if (formData['isDraft']) formData['isPublished'] = false
        updatePost(formData, state.rowData['id'])
            .then((res) => {
                if (res.data && res.data.statusCode === 200) {
                    if (url) {
                        imagePostUpload(state.rowData['id'])
                    } else {
                        postRequest.postData.splice(postRequest.postData.indexOf(state.rowData && state.rowData), 1, res.data.response);
                    }
                    setIsEdit(false);
                    setState({ rowData: [] })
                    e.target.reset();
                    Swal.fire({
                        text: "Post Updated",
                        icon: "success",
                    });
                }
                else {
                    console.log("Post not create")
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err)
                }
            });
    }

    const imagePostUpload = (imageId, e) => {
        uploadImage(imageRowData, imageId)
            .then((res) => {
                if (isEdit) {
                    postRequest.postData.splice(postRequest.postData.findIndex(object => {
                        return object.id === imageId;
                    }), 1, res.data.response);
                } else {
                    setPostRequest({
                        postData: [res.data.response, ...postRequest.postData],
                        totalItems: res.data.response.totalItems + 1,
                        perPage: rowsPerPage,
                        page: page,
                        lastPage: page,
                        id: res.data.response.id,
                        hasNext: res.data.response.hasNext,
                        hasPrevious: res.data.response.hasPrevious,
                    });
                }

                setUrl('');
                setImageUpload(true);
                setImageRowData('')
            })
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
        // setLoading(true);
        // let imageId = isEdit ? state.rowData.id : postRequest.id;
        // uploadImage(formData, imageId)
        //     .then((res) => {
        //         postRequest.postData.splice(postRequest.postData.findIndex(object => {
        //             return object.id === imageId;
        //         }), 1, res.data.response);
        //         setState({ ...state, rowData: res.data.response, openPostModal: false })
        //         setUrl('');
        //         setLoading(false)
        //         setImageUpload(true);
        //         setIsDraft(false);
        //         setOpenImageModal(false);
        //     })
    };

    const getAllPostCounter = async () => {
        await getPostCount()
            .then((res) => {
                if (res && res.data.statusCode && res.data.statusCode === 200) {
                    setCounterData({
                        publishedPosts: res.data.response.publishedPosts,
                        draftedPosts: res.data.response.draftedPosts,
                        trashedPosts: res.data.response.trashedPosts,
                    });
                }
            })
            .catch((err) => {
                if ((err && err.response && err.response.data) || (err && err.message)) {
                    let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                    console.log("message", msg)
                }
            });
    };

    const getAllTopicsData = async () => {
        await getAllTopics()
            .then((res) => {
                if (res && res.data.response && res.data.statusCode === 200) {
                    setTopicRequest({
                        topicData: [...topicRequest.topicData, ...res.data.response.topics],
                        totalItems: res.data.response.totalItems,
                        perPage: 10,
                        page: 0,
                        lastPage: 0
                    });
                }
            })
            .catch((err) => {
                if ((err && err.response && err.response.data) || (err && err.message)) {
                    let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                    console.log("message", msg)
                }
            });
    };

    const getAllPostData = async (page, rowsPerPage, type, isRef) => {
        setState({ isPostLoad: true })
        setIsTopicbyIdPost(false)
        setType(type)
        setTopicName('')
        await getAllPosts(page, rowsPerPage, type)
            .then((res) => {
                if (res && res.data.response && res.data.statusCode === 200) {
                    setPage(page + 1)
                    let result = res.data.response.posts.map(function (item) {
                        var obj = item.post ? item.post : item;
                        for (var o in item) {
                            if (o !== "post") obj[o] = item[o];
                        }
                        return obj;
                    })
                    if (isRef === 'isRefresh') {
                        setPostRequest({
                            postData: result,
                            totalItems: res.data.response.totalItems,
                            perPage: rowsPerPage,
                            page: page,
                            lastPage: page,
                            hasNext: res.data.response.hasNext,
                            hasPrevious: res.data.response.hasPrevious,
                        });
                    } else {
                        setPostRequest({
                            postData: [...postRequest.postData, ...result],
                            totalItems: res.data.response.totalItems,
                            perPage: rowsPerPage,
                            page: page,
                            lastPage: page,
                            hasNext: res.data.response.hasNext,
                            hasPrevious: res.data.response.hasPrevious,
                        });
                    }

                    setState({ isPostLoad: false })
                }
            })
            .catch((err) => {
                if ((err && err.response && err.response.data) || (err && err.message)) {
                    let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                    console.log("message", msg)
                }
            });
    };

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            className="seconary-font"
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {/* Render custom icon here */}
            {children}
        </a>
    ));
    const trashData = async (dt) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You wont to move this file to trash?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Move to trash!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await transhPostData(dt.id)
                    .then(async (res) => {
                        if (res) {

                            /*  if (isTopicbyIdPost) {
                                 console.log("delete from topic", topicId.id)
                                 await getPostbyTopic(topicId.id)
                                     .then((res) => {
                                         if (res && res.data.response && res.data.statusCode === 200) {
 
                                             let result = res.data.response.posts.map(function (item) {
                                                 var obj = item.post ? item.post : item;
                                                 for (var o in item) {
                                                     if (o != "post") obj[o] = item[o];
                                                 }
                                                 return obj;
                                             })
                                             setPostRequest({
                                                 postData: result,
                                                 totalItems: res.data.response.totalItems,
                                                 perPage: rowsPerPage,
                                                 page: page,
                                                 lastPage: page,
                                                 hasNext: res.data.response.hasNext,
                                                 hasPrevious: res.data.response.hasPrevious,
                                             });
                                             setState({ ...state, isPostLoad: false })
                                         }
                                     })
                                     .catch((err) => {
                                         if ((err && err.response && err.response.data) || (err && err.message)) {
                                             let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                                             console.log("message", msg)
                                         }
                                     });
                             } else {
                                 console.log("delete from other")
                                 await getAllPosts(0, rowsPerPage, "PUBLISHED")
                                     .then((res) => {
                                         if (res && res.data.response && res.data.statusCode === 200) {
                                             let result = res.data.response.posts.map(function (item) {
                                                 var obj = item.post ? item.post : item;
                                                 for (var o in item) {
                                                     if (o != "post") obj[o] = item[o];
                                                 }
                                                 return obj;
                                             })
                                             setPostRequest({
                                                 postData: result,
                                                 totalItems: res.data.response.totalItems,
                                                 perPage: rowsPerPage,
                                                 page: page,
                                                 lastPage: page,
                                                 hasNext: res.data.response.hasNext,
                                                 hasPrevious: res.data.response.hasPrevious,
                                             });
                                             setCounterData({
                                                 ...counterData,
                                                 trashedPosts: counterData.trashedPosts + 1,
                                             });
                                         }
                                     })
                                     .catch((err) => {
                                         if ((err && err.response && err.response.data) || (err && err.message)) {
                                             let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                                             console.log("message", msg)
                                         }
                                     });
                             } */

                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                        }
                    })
                    .catch((err) => {
                        if ((err && err.response && err.response.data) || (err && err.message)) {
                            let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                            console.log("message", msg)
                        }
                    });
            }
        })


    }
    const deletePostData = async (dt) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deetePostData(dt.id, dt.topicId)
                    .then(async (res) => {
                        if (res) {
                            var index = postRequest.postData.findIndex(function (o) {
                                return o.id === dt.id;
                            })
                            if (index !== -1) postRequest.postData.splice(index, 1);

                            /*  await getAllPosts(0, rowsPerPage, 'TRASHED')
                                 .then((res) => {
                                     if (res && res.data.response && res.data.statusCode === 200) {
                                         let result = res.data.response.posts.map(function (item) {
                                             var obj = item.post ? item.post : item;
                                             for (var o in item) {
                                                 if (o != "post") obj[o] = item[o];
                                             }
                                             return obj;
                                         })
                                         setPostRequest({
                                             postData: result,
                                             totalItems: res.data.response.totalItems,
                                             perPage: rowsPerPage,
                                             page: page,
                                             lastPage: page,
                                             hasNext: res.data.response.hasNext,
                                             hasPrevious: res.data.response.hasPrevious,
                                         });
                                     }
                                 })
                                 .catch((err) => {
                                     if ((err && err.response && err.response.data) || (err && err.message)) {
                                         let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                                         console.log("message", msg)
                                     }
                                 }); */
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                        }
                    })
                    .catch((err) => {
                        if ((err && err.response && err.response.data) || (err && err.message)) {
                            let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                            console.log("message", msg)
                        }
                    });
            }
        })


    }
    const changeTypeGetPost = async (type) => {
        setPage(0)
        setRowsPerPage(5)
        await getAllPostData(0, 5, type, "isRefresh")
    }
    const postFroTopic = async (row) => {
        setTopicName(row.title)
        setIsTopicbyIdPost(true)
        setTopicId(row)
        await getPostbyTopic(row.id)
            .then((res) => {
                if (res && res.data.response && res.data.statusCode === 200) {
                    let result = res.data.response.posts.map(function (item) {
                        var obj = item.post ? item.post : item;
                        for (var o in item) {
                            if (o !== "post") obj[o] = item[o];
                        }
                        return obj;
                    })
                    setPostRequest({
                        postData: result,
                        totalItems: res.data.response.totalItems,
                        perPage: rowsPerPage,
                        page: page,
                        lastPage: page,
                        hasNext: res.data.response.hasNext,
                        hasPrevious: res.data.response.hasPrevious,
                    });
                    setState({ ...state, isPostLoad: false })
                }
            })
            .catch((err) => {
                if ((err && err.response && err.response.data) || (err && err.message)) {
                    let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
                    console.log("message", msg)
                }
            });
    }
    useEffect(() => {
        let abortController = new AbortController();
        getAllTopicsData();
        getAllPostData(page, rowsPerPage, 'RECENT');
        getAllPostCounter();
        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <React.Fragment>
            {/* <ToastContainer /> */}
            <div className="page-header d-flex justify-content-between">
                <div className="h-100 pl-4">
                    <div className="title-border d-flex flex-column justify-content-center">
                        <h3 className="page-title">Overview</h3>
                    </div>
                </div>
                <div className="input-group p-2 mr-3 text-right" style={{ width: '367px' }}>
                    <input className="form-control rounded-pill py-2 pr-5 mr-1 bg-transparent"
                        type="search" placeholder="Search Topics and Posts" id="example-search-input1" />
                    <span className="input-group-append">
                        <div className="input-group-text border-0 bg-transparent ml-n5">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </div>
                    </span>
                </div>
            </div>

            <div className="mb-4 flex-row justify-content-between">
                <div className='create-post'>
                    <Dropdown>
                        <Dropdown.Toggle variant="btn btn-sm btn-primary mr-0">
                            <i className="mdi mdi-plus-circle-outline btn-icon-prepend mr-2"></i>
                            Add New
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="p-3" onClick={() => handleTopicModal()}><img src={require('../../assets/images/icon/notebook-write.svg')} alt="notebook-write" />Create Topics</Dropdown.Item>
                            <Dropdown.Item className="p-3" onClick={() => handlePostModal()}><img src={require('../../assets/images/icon/list-edit.svg')} alt="list-edit" />Create Post</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="frame-14885 flex-row-vstart-hstart post-menu">
                    <button className="rounded-3 btn btn-outline-secondary bg-white btn-icon-text btn-sm mr-3" onClick={() => changeTypeGetPost('PUBLISHED')}>
                        <div className="frame-14874 flex-row-vcenter-hstart">
                            <div className="frame-14881 flex-row-vcenter-hstart">
                                <img
                                    src={require('../../assets/images/icon/spark.svg')}
                                    alt="Not Found"
                                    className="icon-radio-selected"
                                />
                                <p className="txt-588">Published</p>
                            </div>
                            <p className="txt-7410">{counterData.publishedPosts}</p>
                        </div>
                    </button>
                    <button className="rounded-3 btn btn-outline-secondary bg-white btn-icon-text btn-sm mr-3" onClick={() => changeTypeGetPost('DRAFT')}>
                        <div className="frame-14874 flex-row-vcenter-hstart">
                            <div className="frame-14881 flex-row-vcenter-hstart">
                                <img
                                    src={require('../../assets/images/icon/archive-in.svg')}
                                    alt="Not Found"
                                    className="icon-radio-selected"
                                />
                                <p className="txt-588">Draft</p>
                            </div>
                            <p className="txt-7410">{counterData.draftedPosts}</p>
                        </div>
                    </button>
                    <button className="rounded-3 btn btn-outline-secondary bg-white btn-icon-text btn-sm mr-3" onClick={() => changeTypeGetPost('TRASHED')}>
                        <div className="frame-14874 flex-row-vcenter-hstart">
                            <div className="frame-14881 flex-row-vcenter-hstart">
                                <img
                                    src={require('../../assets/images/icon/delete.svg')}
                                    alt="Not Found"
                                    className="icon-radio-selected"
                                />
                                <p className="txt-035">Trashed</p>
                            </div>
                            <p className="txt-659">{counterData.trashedPosts}</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* <div className="mb-3 d-flex justify-content-between">
                <div className='create-post'>
                    <Dropdown>
                        <Dropdown.Toggle variant="btn btn-sm btn-primary">
                            <i className="mdi mdi-plus-circle-outline btn-icon-prepend mr-2"></i>
                            Add New
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="p-3" onClick={() => handleTopicModal()}><img src={require('../../assets/images/icon/notebook-write.svg')} alt="notebook-write" />Create Topics</Dropdown.Item>
                            <Dropdown.Item className="p-3" onClick={() => handlePostModal()}><img src={require('../../assets/images/icon/list-edit.svg')} alt="list-edit" />Create Post</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='text-right post-menu'>
                    <button type="button" onClick={() => changeTypeGetPost('PUBLISHED')} className="rounded-3 btn btn-outline-secondary bg-white btn-icon-text btn-sm">
                        <img src={require('../../assets/images/icon/spark.svg')} className="btn-icon-prepend" alt="icon-spark" />
                        <span>Published</span>
                        <span className='publish counter pl-2'>{counterData.publishedPosts}</span>
                    </button>
                    <button type="button" onClick={() => changeTypeGetPost('DRAFT')} className="btn btn-outline-secondary bg-white btn-icon-text btn-sm">
                        <img src={require('../../assets/images/icon/archive-in.svg')} className="btn-icon-prepend" alt="icon-spark" />
                        <span>Draft</span>
                        <span className='draft counter pl-2'>{counterData.draftedPosts}</span>
                    </button>
                    <button type="button" onClick={() => changeTypeGetPost('TRASHED')} className="btn btn-outline-secondary bg-white btn-icon-text btn-sm">
                        <img src={require('../../assets/images/icon/delete.svg')} className="btn-icon-prepend" alt="icon-spark" />
                        <span>Trashed</span>
                        <span className='trashed counter pl-2'>{counterData.trashedPosts}</span>
                    </button>
                </div>
            </div> */}

            {(type === 'PUBLISHED' || type === 'RECENT') &&
                <div className='d-flex flex-row'>
                    <div className='mh-100 col-12 slick_slider pl-0'>
                        <Slider {...settings}>
                            {topicRequest.topicData.length > 0 && topicRequest.topicData.map((row, i) => {
                                return (
                                    <a onClick={() => postFroTopic(row)}
                                    >
                                        <div className='mr-2'>
                                            <div className="topic-card d-flex flex-column pb-3 justify-content-end align-items-center">
                                                <div className="topic flex-col-vend-hstart">
                                                    <p className="txt-title">{row.title}</p>
                                                    <p className="txt-small">{row.numberOfPosts} Posts</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    /* <div className="card-deck col-12 p-0 mr-0">
                                        <div className="card topic-card text-white">
                                            <div className="card-body p-3 text-center d-flex flex-column">
                                                <h4 className="font-weight-medium mb-2">{row.title}
                                                </h4>
                                                <small>{row.numberOfPosts} Posts</small>
                                            </div>
                                        </div>
                                    </div> */

                                )
                            })}
                        </Slider>
                    </div>
                </div>
            }
            <div className="post mt-3">
                <div className="page-header d-flex justify-content-between">
                    <div className="h-100 pl-4">
                        <div className="title-border d-flex flex-column justify-content-center">
                            <h3 className="page-title">
                                {topicName ? (
                                    <>
                                        TOPIC : <span>{topicName}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{type.toLowerCase()}</span> post
                                    </>
                                )}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="card-group vgr-cards">
                    {postRequest.postData.length > 0 &&
                        <>
                            {
                                postRequest.postData.map((row, i) => {
                                    return (
                                        <div className="post-card flex-row-vend">
                                            {row && row.image && row.image.link ? <img src={row.image.link} className="post-card-img border-round-8" alt="Card image cap" />
                                                : <img src={require("../../assets/images/no-image.jpg")} className="post-card-img border-round-8" alt="No-Image" />}
                                            <div className="h-100 flex-col-hend">
                                                <div className="post-card-detail flex-col">
                                                    <div className="post-card-menu flex-row justify-content-between">
                                                        <p className="post-card-title">{row.title}</p>
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={CustomToggle} id="dropdownMenuOutlineButton3">
                                                                <i className="fas fa-ellipsis-h" aria-hidden="true" style={{ color: "#78707C" }}></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item className='mb-2' onClick={(e) => editPostData(row, i)}><img className='mr-2' alt="pencil_icon" src={require("../../assets/images/icon/pencil.svg")} />Edit</Dropdown.Item>
                                                                {(type !== 'TRASHED' && row.isTrashed != true) && <Dropdown.Item onClick={() => trashData(row)}><img className='mr-2' alt="delete-black_icon" src={require("../../assets/images/icon/delete-black.svg")} />Trash</Dropdown.Item>}
                                                                {type === 'TRASHED' && <Dropdown.Item onClick={() => deletePostData(row)}><img className='mr-2' alt="delete-black_icon" src={require("../../assets/images/icon/delete-black.svg")} />Delete</Dropdown.Item>}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                    <p className="post-card-desc">
                                                        {row.text}
                                                    </p>
                                                </div>
                                                <div className="post-card-bottom flex-row-vend justify-content-between">
                                                    <p className="txt-time">{timeSince(new Date(row.timeOfCreation))} ago</p>
                                                    <div className="flex-row-vstart-hstart">
                                                        <div className="flex-row-vcenter-hstart">
                                                            <img
                                                                src={require("../../assets/images/icon/eye.svg")}
                                                                alt="Not Found"
                                                                className="eye"
                                                            />
                                                            <p className="txt-views mr-2">Views</p>
                                                            <p className="txt-views">{row.numberOfViews} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })

                            }

                        </>
                    }
                </div>
                {postRequest.hasNext && !isTopicbyIdPost &&
                    <div className='row justify-content-center'>
                        {state.isPostLoad ? (
                            <button type="button" disabled
                                className="btn btn-outline-primary load-more">
                                <span className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true">
                                </span>
                                Loading...
                            </button>
                        ) : (
                            <button type="button" onClick={() => getAllPostData(page, rowsPerPage, type)}
                                className="btn btn-outline-primary load-more">
                                Load more
                            </button>
                        )}
                    </div>}
                {postRequest.hasNext && isTopicbyIdPost &&
                    <div className='row justify-content-center'>
                        {state.isPostLoad ? (
                            <button type="button" disabled
                                className="btn btn-outline-primary load-more">
                                <span className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true">
                                </span>
                                Loading...
                            </button>
                        ) : (
                            <button type="button" onClick={() => postFroTopic(topicId)}
                                className="btn btn-outline-primary load-more">
                                Load more
                            </button>
                        )}
                    </div>}
                {/* {postRequest.postData.length > 0 &&
                        <>
                            {postRequest.postData.map((row, i) => {
                                return (
                                    <div className="card mb-3 mt-3" key={i + 1}>
                                        <div className="card-horizontal d-flex flex-row p-3">
                                            <div className="img-square-wrapper">
                                                {row && row.image && row.image.link ? <img src={row.image.link} className="card-img" alt="..." /> : <img src="" className="card-img" alt="No-Image" />}
                                            </div>
                                            <div className="card-body">
                                                <div className="card-body d-flex flex-column pl-3 pt-0 ">
                                                    <div className='d-flex flex-row justify-content-between'>
                                                        <h5 className="card-title">{row.title}</h5>
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={CustomToggle} id="dropdownMenuOutlineButton3">
                                                                <i className="mdi mdi-dots-horizontal" />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item className="p-2" onClick={(e) => editPostData(row, i)}><i className="mdi mdi-square-edit-outline mr-2" />Edit</Dropdown.Item>
                                                                {type != 'TRASHED' && <Dropdown.Item className="p-2" onClick={() => trashData(row)}><i className="mdi mdi-delete mr-2" />Trash</Dropdown.Item>}
                                                                {type == 'TRASHED' && <Dropdown.Item className="p-2" onClick={() => deletePostData(row)}><i className="mdi mdi-delete mr-2" />Delete</Dropdown.Item>}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                    <p className="card-text pb-4">{row.text}</p>
                                                    <p className="card-text d-flex align-items-end">
                                                        <small className="text-muted">Last updated {timeSince(new Date(row.timeOfCreation))} ago</small>
                                                    </p>
                                                    <p className="card-text d-flex align-items-end">
                                                        <small className="text-muted">Views {row.numberOfViews}</small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {postRequest.hasNext && !isTopicbyIdPost &&
                                <div className='row justify-content-center'>
                                    {state.isPostLoad ? (
                                        <button type="button" disabled
                                            className="btn btn-outline-primary load-more">
                                            <span className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true">
                                            </span>
                                            Loading...
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => getAllPostData(page, rowsPerPage, type)}
                                            className="btn btn-outline-primary load-more">
                                            Load more
                                        </button>
                                    )}
                                </div>}
                            {postRequest.hasNext && isTopicbyIdPost &&
                                <div className='row justify-content-center'>
                                    {state.isPostLoad ? (
                                        <button type="button" disabled
                                            className="btn btn-outline-primary load-more">
                                            <span className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true">
                                            </span>
                                            Loading...
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => postFroTopic(topicId)}
                                            className="btn btn-outline-primary load-more">
                                            Load more
                                        </button>
                                    )}
                                </div>}
                        </>
                    } */}

            </div>
            <Modal show={state && state.openPostModal} backdrop="static" onHide={handleCancelPostModal} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="primary-font h5">{isEdit ? "Update Post" : "Create New Post"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEdit ? (
                        <PostForm
                            onPostSubmit={onPostSubmit}
                            rowData={state && state.rowData}
                            isEdit={isEdit}
                            topicRequest={topicRequest}
                            openImageModal={openImageModal}
                            handleImageModal={handleImageModal}
                            handleCancelPostModal={handleCancelPostModal}
                            isDraft={isDraft}
                            imageUpload={imageUpload}
                            url={url}
                            state={state}
                            setState={setState}
                            uploadImageData={uploadImageData}
                        />
                    ) : (
                        <PostForm
                            onPostSubmit={onPostSubmit}
                            isEdit={isEdit}
                            topicRequest={topicRequest}
                            openImageModal={openImageModal}
                            handleImageModal={handleImageModal}
                            handleCancelPostModal={handleCancelPostModal}
                            isDraft={isDraft}
                            imageUpload={imageUpload}
                            url={url}
                            state={state}
                            uploadImageData={uploadImageData}
                            setState={setState}
                        />
                    )}
                </Modal.Body>

            </Modal>
            <Modal show={openTopicModal} onHide={handleCancelTopicModal} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="primary-font h5">Create New Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onTopicSubmit)}>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Control as="input" name="topicName" {...register("topicName")} placeholder="Write topic name" />
                        </Form.Group>
                        <div className='d-flex justify-content-end p-1'>
                            <Button variant="outline-secondary" size="sm" onClick={handleCancelTopicModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit">
                                Create
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={state && state.viewMode && state.viewMode} onHide={handleCloseviewMode} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="primary-font h5">Preview Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {state && state.rowData && (
                        <div className="card mb-3">
                            <div className="row no-gutters">
                                <div className="col-md-3">
                                    {state.rowData.image && state.rowData.image.link ? <img src={state.rowData.image.link} className="card-img" alt="preview_img" /> : <img src={require("../../assets/images/no-image.jpg")} className="card-img" alt="preview_img" />}
                                </div>
                                <div className="col-md-9">
                                    <div className="card-body d-flex flex-column pl-3 pt-0 ">
                                        <div className='d-flex flex-row justify-content-between'>
                                            <h5 className="card-title">{state.rowData.title}</h5>
                                        </div>
                                        <p className="card-text pb-4">{state.rowData.text}</p>
                                        <p className="card-text d-flex align-items-end">
                                            <small className="text-muted">Last updated {timeSince(new Date(state.rowData.timeOfCreation))} ago</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </React.Fragment >
    );
}
export default Post;