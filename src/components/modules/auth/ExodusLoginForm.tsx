// import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Button from 'components/base/Button';
import { useRef, useState } from 'react';
import { PhoenixButtonsDark_TypeDashing } from 'components/webnova/Wrapper/PhoenixButtonsDark_TypeDashing/PhoenixButtonsDark_TypeDashing';
// import AuthSocialButtons from 'components/common/AuthSocialButtons';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import InputDark_StateDefaultCaptionIcSS from 'components/webnova/Wrapper/InputDark_StateDefaultCaptionI/InputDark_StateDefaultCaptionI.module.css';
import { login } from 'helpers/api';
import ErrorMessage from 'helpers/ErrorMessage';

const ExodusLoginForm = ({ layout }: { layout: 'simple' | 'card' | 'split' }) => {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [toggleEmailErr, setToggleE] = useState(false);
  const [togglePasswordErr, setToggleP] = useState(false);
  let emailError = false;
  let passwordError = false;

  const validateAndLogin = () => {
    const username = emailRef.current.value;
    const password = passRef.current.value;

    emailError = false;
    passwordError = false;
    if (username.length < 3) {
      emailError = true;
    }
    if (password < 3) {
      passwordError = true;
    }

    setToggleE(emailError);
    setToggleP(passwordError);
    if (!emailError && !passwordError) {
      handlelogin(username, password);
    }
  }

  const handlelogin = (username: string, password: string) => {
    login(username, password, () => {
      window.location.href = "/pages/challenges";
    },
      () => {
        setToggleE(true);
      });
  };


  return (
    <>
      <div className="text-center mb-7">
        {/* <h3 className="text-1000">Sign In</h3> */}
        <p className="text-700"></p>
      </div>
      {/* <AuthSocialButtons title="Sign in" />
      <div className="position-relative">
        <hr className="bg-200 mt-5 mb-4" />
        <div className="divider-content-center">or use email</div>
      </div> */}
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor="email"></Form.Label>
        <div className="form-icon-container">
          <Form.Control
            id="email"
            type="email"
            ref={emailRef}
            className={`${InputDark_StateDefaultCaptionIcSS.root}`}
            placeholder="ENTER YOUR EMAIL"
          />
          {toggleEmailErr ? <ErrorMessage type={"email"} message={"invalid email"} /> : null}
        </div>
      </Form.Group>
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor="password"></Form.Label>
        <div className="form-icon-container">
          <Form.Control
            id="password"
            type="password"
            ref={passRef}
            className={`${InputDark_StateDefaultCaptionIcSS.root}`}
            placeholder="PASSWORD"
          />
          {togglePasswordErr ? <ErrorMessage type={"password"} message={"invalid password"} /> : null}
        </div>
      </Form.Group>
      {/* <Row className="flex-between-center mb-7">
        <Col xs="auto">
          <Form.Check type="checkbox" className="mb-0">
            <Form.Check.Input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              defaultChecked
            />
            <Form.Check.Label htmlFor="remember-me" className="mb-0">
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Col>
        <Col xs="auto">
          <Link
            to={`/pages/authentication/${layout}/forgot-password`}
            className="fs-9 fw-semi-bold"
          >
            Forgot Password?
          </Link>
        </Col>
      </Row> */}
      {/* <Button variant="primary" className="w-100 mb-3">Sign In</Button> */}
      <PhoenixButtonsDark_TypeDashing className="w-100 mb-3" text={{ label: "Sign In" }} onClick={validateAndLogin}/>
      <div className="text-center">
        <Link
          to={`/pages/authentication/${layout}/register`}
          className="fs-9 fw-bold"
        >
          Create an account
        </Link>
      </div>
    </>
  );
};

export default ExodusLoginForm;
