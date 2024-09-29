/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Label, Card, CardBody, Button } from "reactstrap";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateStudentMutation } from "../../redux/features/studentAPI";
import { useGetCoursesQuery } from "../../redux/features/courseAPI";  // Import the hook for fetching courses

const CreateStudent = () => {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [createStudent, { isLoading, isError, error, isSuccess, data }] = useCreateStudentMutation();
    const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();  // Fetch available courses

    const onSubmit = (data) => {
        // Transform selected courses into an array of course IDs
        data.courseIds = Array.from(data.courseIds).map(courseId => parseInt(courseId));
        createStudent(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate("/students");
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error occurred';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    return (
        <>
            {isLoading || coursesLoading ? (<FullScreenLoader />) : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Create Student</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Student Name</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                                        type="text"
                                                        id="name"
                                                        {...register('name', { required: true })}
                                                    />
                                                    {errors.name && <small className="text-danger">Student Name is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Email</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                                        type="email"
                                                        id="email"
                                                        {...register('email', { required: true })}
                                                    />
                                                    {errors.email && <small className="text-danger">Email is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Phone</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                                        type="text"
                                                        id="phone"
                                                        {...register('phone', { required: true })}
                                                    />
                                                    {errors.phone && <small className="text-danger">Phone is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Gender</Label>
                                                    <select
                                                        className={`form-control ${classnames({ 'is-invalid': errors.gender })}`}
                                                        id="gender"
                                                        {...register('gender', { required: true })}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {errors.gender && <small className="text-danger">Gender is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Date of Birth</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.date_of_birth })}`}
                                                        type="date"
                                                        id="date_of_birth"
                                                        {...register('date_of_birth', { required: true })}
                                                    />
                                                    {errors.date_of_birth && <small className="text-danger">Date of Birth is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Address</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                                                        id="address"
                                                        rows={3}
                                                        {...register('address', { required: true })}
                                                    />
                                                    {errors.address && <small className="text-danger">Address is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Course selection for multiple courses */}
                                        <Row>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Select Courses</Label>
                                                    <select
                                                        className={`form-control ${classnames({ 'is-invalid': errors.courseIds })}`}
                                                        id="courseIds"
                                                        multiple
                                                        {...register('courseIds', { required: true })}
                                                    >
                                                        {courses && courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.courseIds && <small className="text-danger">At least one course is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-4">
                                            <Button color="outline-primary" className="btn-block" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    )
}

export default CreateStudent;
