import Button from 'components/base/Button';
import { useRef, useState } from 'react';
// import AuthSocialButtons from 'components/common/AuthSocialButtons';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { register } from 'helpers/api';
import ErrorMessage from 'helpers/ErrorMessage';

const RegisterForm = ({ layout }: { layout: 'simple' | 'card' | 'split' }) => {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const passRef2 = useRef(null);
  const [toggleEmailErr, setToggleE] = useState(false);
  const [togglePasswordErr, setToggleP] = useState(false);
  const [toggleUsernameErr, setToggleU] = useState(false);
  const [togglePassword2Err, setToggleP2] = useState(false);
  let emailError = false;
  let usernameError = false
  let passwordError = false;
  let password2Error = false;

  const validateAndRegister = () => {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passRef.current.value;
    const password2 = passRef2.current.value;

    emailError = false;
    usernameError = false
    passwordError = false;
    password2Error = false;

    if (username.length < 3) {
      usernameError = true;
    }
    if (email.length < 3 || !validateEmail(email)) {
      emailError = true;
    }
    if (password < 3) {
      passwordError = true;
    }
    if (password2 < 3) {
      password2Error = true;
    }

    setToggleE(emailError);
    setToggleP(passwordError);
    setToggleP2(password2Error);
    setToggleU(usernameError)
    if (!emailError && !passwordError && !password2Error && !usernameError) {
      handleRegister(username, email, password, password2);
    }
  }

  const validateEmail = (email: string) => {
    return email.
    match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleRegister = (username: string, email: string, password: string, password2: string) => {
    register(username, email, password, password2, () => {
      window.location.href = "/pages/challenges";
    },
      () => {
        setToggleE(true);
      });
  };
  return (
    <>
      <div className="text-center mb-7">
        <h3 className="text-1000">Sign Up</h3>
        <p className="text-700">Create your account today</p>
      </div>
      {/* <AuthSocialButtons title="Sign up" />
      <div className="position-relative mt-4">
        <hr className="bg-200" />
        <div className="divider-content-center">or use email</div>
      </div> */}
      <Form>
        <Form.Group className="mb-3 text-start">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control id="name" type="text" placeholder="Name" ref={usernameRef} />
          {toggleUsernameErr ? <ErrorMessage type={"username"} message={"Invalid username, only letters are allowed."} /> : null}
        </Form.Group>
        <Form.Group className="mb-3 text-start">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder="name@example.com"
            ref={emailRef}
          />
          {toggleEmailErr ? <ErrorMessage type={"email"} message={"Invalid email."} /> : null}
        </Form.Group>
        <Row className="g-3 mb-3">
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control id="password" type="text" placeholder="Password" ref={passRef} />
              {togglePasswordErr ? <ErrorMessage type={"password"} message={"Invalid password."} /> : null}
            </Form.Group>
          </Col>
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">
                Confirm Password
              </Form.Label>
              <Form.Control
                id="confirmPassword"
                type="text"
                placeholder="Confirm Password"
                ref={passRef2}
              />
              {togglePassword2Err ? <ErrorMessage type={"password"} message={"Invalid password."} /> : null}
            </Form.Group>
          </Col>
        </Row>
        <Form.Check type="checkbox" className="mb-3">
          <Form.Check.Input
            type="checkbox"
            name="termsService"
            id="termsService"
          />
          <Form.Check.Label htmlFor="termsService" className="fs-9 text-none">
            I accept the <Link to="#!">terms </Link>and{' '}
            <Link to="#!">privacy policy</Link>
          </Form.Check.Label>
        </Form.Check>
        <Button variant="primary" className="w-100 mb-3" onClick={validateAndRegister}>
          Sign up
        </Button>
        <div className="text-center">
          <Link
            to={`/pages/authentication/${layout}/login`}
            className="fs-9 fw-bold"
          >
            Sign in to an existing account
          </Link>
        </div>
      </Form>
    </>
  );
};

export default RegisterForm;
