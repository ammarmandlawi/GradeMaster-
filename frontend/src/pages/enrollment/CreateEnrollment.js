/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Label, Card, CardBody, Button } from "reactstrap";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useCreateEnrollmentMutation } from "../../redux/features/enrollmentAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetStudentsQuery } from "../../redux/features/studentAPI";
import { useGetCoursesQuery } from "../../redux/features/courseAPI";

const CreateEnrollment = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // Fetch students and courses
    const { data: students } = useGetStudentsQuery();
    const { data: courses } = useGetCoursesQuery();

    const [createEnrollment, { isLoading, isError, error, isSuccess, data }] = useCreateEnrollmentMutation();

    const onSubmit = (data) => {
        createEnrollment(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate("/enrollments");
        }

        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading, isError, isSuccess]);

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Manage Enrollment</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Student</Label>
                                                    <select
                                                        className={`form-control ${classnames({ 'is-invalid': errors.student_id })}`}
                                                        id="student_id"
                                                        {...register('student_id', { required: true })}
                                                    >
                                                        <option value="">Select Student</option>
                                                        {students?.map((student) => (
                                                            <option key={student.id} value={student.id}>
                                                                {student.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.student_id && <small className="text-danger">Student is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Course</Label>
                                                    <select
                                                        className={`form-control ${classnames({ 'is-invalid': errors.course_id })}`}
                                                        id="course_id"
                                                        {...register('course_id', { required: true })}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courses?.map((course) => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.course_id && <small className="text-danger">Course is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Action</Label>
                                                    <select
                                                        className={`form-control ${classnames({ 'is-invalid': errors.action })}`}
                                                        id="action"
                                                        {...register('action', { required: true })}
                                                    >
                                                        <option value="">Select Action</option>
                                                        <option value="enroll">Enroll</option>
                                                        <option value="unenroll">Unenroll</option>
                                                    </select>
                                                    {errors.action && <small className="text-danger">Action is required.</small>}
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

export default CreateEnrollment;
