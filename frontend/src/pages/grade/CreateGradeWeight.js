/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row, Card, CardBody, Form, Label } from 'reactstrap';
import classnames from 'classnames';
import { useCreateGradeWeightMutation } from '../../redux/features/gradeWeightAPI';
import { useGetCoursesQuery } from '../../redux/features/courseAPI'; // Fetch courses
import FullScreenLoader from '../../components/FullScreenLoader';
import { toast } from 'react-toastify';

const CreateGradeWeight = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [createGradeWeight, { isLoading, isSuccess, isError, error, data }] = useCreateGradeWeightMutation();
    const navigate = useNavigate();
    const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();  // Fetch available courses

    const onSubmit = (data) => {
        createGradeWeight(data);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Grade Weight updated successfully');
            navigate('/gradeWeights');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error occurred';
            toast.error(errorMsg);
        }
    }, [isLoading]);

    return (
        <>
            {isLoading || coursesLoading ? <FullScreenLoader /> : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Create Grade Weight</h4>
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
                                                    <Label>Course</Label>
                                                    <select
                                                        className={classnames('form-control', { 'is-invalid': errors.course_id })}
                                                        {...register('course_id', { required: true })}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courses && courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.course_id && <small className="text-danger">Course is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Item Type</Label>
                                                    <select
                                                        className={classnames('form-control', { 'is-invalid': errors.item_type })}
                                                        {...register('item_type', { required: true })}
                                                    >
                                                        <option value="Assignment">Assignment</option>
                                                        <option value="Exam">Exam</option>
                                                        <option value="Attendance">Attendance</option>
                                                    </select>
                                                    {errors.item_type && <small className="text-danger">Item type is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Weight</Label>
                                                    <input
                                                        className={classnames('form-control', { 'is-invalid': errors.weight })}
                                                        type="number"
                                                        {...register('weight', { required: true })}
                                                    />
                                                    {errors.weight && <small className="text-danger">Weight is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Button color="primary" className="mt-3" type="submit">Submit</Button>
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

export default CreateGradeWeight;
