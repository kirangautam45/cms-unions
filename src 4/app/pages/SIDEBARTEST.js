<div>
            <div id="right-sidebar" className="settings-panel right-sidebar">
                <i className="settings-close mdi mdi-close" onClick={setPanel(false)}></i>
                <Tabs defaultActiveKey="TODOLIST" className="bg-gradient-primary" id="uncontrolled-tab-example">
                    <Tab eventKey="TODOLIST" title="TO DO LIST" className="test-tab">
                        <div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="px-3">
                                        <div>
                                            <h4 className="card-title"><Trans>Todo List</Trans></h4>
                                            <form className="add-items d-flex" >
                                                <input
                                                    type="text"
                                                    className="form-control h-auto"
                                                    placeholder="What do you need to do today?"
                                                    required />
                                                <button type="submit" className="btn btn-gradient-primary font-weight-bold"><Trans>Add</Trans></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="events py-4 border-bottom px-3">
                                <div className="wrapper d-flex mb-2">
                                    <i className="mdi mdi-circle-outline text-primary mr-2"></i>
                                    <span><Trans>Feb</Trans> 11 2018</span>
                                </div>
                                <p className="mb-0 font-weight-thin text-gray"><Trans>Creating component page</Trans></p>
                                <p className="text-gray mb-0"><Trans>build a js based app</Trans></p>
                            </div>
                            <div className="events pt-4 px-3">
                                <div className="wrapper d-flex mb-2">
                                    <i className="mdi mdi-circle-outline text-primary mr-2"></i>
                                    <span><Trans>Feb</Trans> 7 2018</span>
                                </div>
                                <p className="mb-0 font-weight-thin text-gray"><Trans>Meeting with Alisa</Trans></p>
                                <p className="text-gray mb-0 "><Trans>Call Sarah Graves</Trans></p>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>