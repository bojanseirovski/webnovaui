// import RegisterForm from 'components/modules/auth/RegisterForm';
import ExodusRegisterForm from 'components/modules/auth/ExodusRegisterForm';
// import AuthSimpleLayout from 'layouts/AuthSimpleLayout';
import ExodusAuthSimpleLayout from 'layouts/ExodusAuthSimpleLayout';

const Register = () => {
    return (
        <ExodusAuthSimpleLayout>
            <ExodusRegisterForm layout="simple" />
        </ExodusAuthSimpleLayout>
    );
};

export default Register;
