import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { login } from '../../store/login/actions/authenticate';
import { loginApi } from '../../services/auth';

const Login = () => {
  const history = useHistory();
  const { handleSubmit, register } = useForm();
  const [loader, setLoader] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = handleSubmit((data) => {
    setLoader(true);
    loginApi(data).then(res => {
      setLoader(false);
      if (res && res.data) {
        login(res.data.response.accessToken);
        history.push("/member")
      }
    }).catch((err) => {
      setLoader(false);
      if ((err && err.response && err.response.data) || (err && err.message)) {
        let msg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : err && err.message && err.message ? err.message : "Somthing Went Wrong"
        setErrMsg(msg);
      }
    });
  });


  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-center py-3 px-4 px-sm-5">
              <div className="brand-logo">
                <img src={require("../../assets/images/logo.svg")} alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="d-flex search-field">
                  <Form.Control type="email" placeholder="Username" {...register("username")} required size="lg" className="h-auto" />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control type="password" placeholder="Password" {...register("password")} required size="lg" className="h-auto" />
                </Form.Group>
                <div className="mt-3">
                  {loader ? (
                    <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" disabled type="submit">
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      LOADING...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    >
                      SIGN IN
                    </button>
                  )}

                </div>
                {errMsg && <p className="pt-2 text-danger">{errMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
