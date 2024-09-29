/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../../assets/img/logo.png';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useLoginUserMutation } from '../../redux/features/authAPI';
import loginImg from '../../assets/img/login.png';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully logged in');
            navigate("/courses");
        }

        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    return (
        <div className="auth-wrapper auth-cover">
            <div className="auth-inner row m-0">
                <div className="d-none d-lg-flex col-lg-8 align-items-center p-5">
                    <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                        <img className="img-fluid" src={loginImg} alt="Login" />
                    </div>
                </div>
                <div className="d-flex col-lg-4 align-items-center auth-bg px-2 p-lg-5">
                    <div className="col-12 col-sm-8 col-md-6 col-lg-12 px-xl-2 mx-auto">
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="auth-img" src={logo1Img} alt="Materials" />
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <h4 className="text-center">Login your account</h4>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Username</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                    type="username"
                                    id="username"
                                    {...register('username', { required: true })}
                                />
                                {errors.username && <small className="text-danger">Username is required.</small>}
                            </FormGroup>
                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </FormGroup>

                            <div className="mt-3">
                                <Button color="primary" className="btn btn-block w-100" type="submit">
                                    LOGIN
                                </Button>
                            </div>
                            <div className="mt-4 d-flex justify-content-center">
                                <p>
                                    New on our platform?{' '}
                                    <Link to="/register">
                                        <span className='fw-bold'>Create an account</span>
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
