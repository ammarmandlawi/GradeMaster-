/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Col, Row, Form, Label, Card, CardBody, Button } from 'reactstrap';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useCreateAttendanceMutation } from '../../redux/features/attendanceAPI';
import { useGetStudentsQuery } from '../../redux/features/studentAPI';
import { useGetCoursesQuery } from '../../redux/features/courseAPI';

const CreateAttendance = () => {
    const navigate = useNavigate();
    const { data: students, isLoading: studentsLoading } = useGetStudentsQuery();
    const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();
    const [createAttendance, { isLoading, isError, error, isSuccess, data }] = useCreateAttendanceMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (formData) => {
        createAttendance(formData);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Attendance recorded successfully');
            navigate('/attendances');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error occurred';
            toast.error(errorMsg);
        }
    }, [isSuccess, isError]);

    return (
        <>
            {isLoading || studentsLoading || coursesLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Create Attendance</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md="6">
                                                <div className="mb-2">
                                                    <Label>Student</Label>
                                                    <select
                                                        className={`form-control ${classnames({
                                                            'is-invalid': errors.student_id,
                                                        })}`}
                                                        {...register('student_id', { required: true })}
                                                    >
                                                        <option value="">Select Student</option>
                                                        {students &&
                                                            students.map((student) => (
                                                                <option key={student.id} value={student.id}>
                                                                    {student.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.student_id && (
                                                        <small className="text-danger">Student is required.</small>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="mb-2">
                                                    <Label>Course</Label>
                                                    <select
                                                        className={`form-control ${classnames({
                                                            'is-invalid': errors.course_id,
                                                        })}`}
                                                        {...register('course_id', { required: true })}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courses &&
                                                            courses.map((course) => (
                                                                <option key={course.id} value={course.id}>
                                                                    {course.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.course_id && (
                                                        <small className="text-danger">Course is required.</small>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="mb-2">
                                                    <Label>Date</Label>
                                                    <input
                                                        type="date"
                                                        className={`form-control ${classnames({
                                                            'is-invalid': errors.date,
                                                        })}`}
                                                        {...register('date', { required: true })}
                                                    />
                                                    {errors.date && (
                                                        <small className="text-danger">Date is required.</small>
                                                    )}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="mb-2">
                                                    <Label>Status</Label>
                                                    <select
                                                        className={`form-control ${classnames({
                                                            'is-invalid': errors.status,
                                                        })}`}
                                                        {...register('status', { required: true })}
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                        <option value="Late">Late</option>
                                                    </select>
                                                    {errors.status && (
                                                        <small className="text-danger">Status is required.</small>
                                                    )}
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
    );
};

export default CreateAttendance;
