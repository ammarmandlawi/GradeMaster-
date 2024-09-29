/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Label, Card, CardBody, Button } from "reactstrap";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateTaskMutation } from "../../redux/features/taskAPI";
import { useGetCoursesQuery } from "../../redux/features/courseAPI";

const CreateTask = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [createTask, { isLoading, isSuccess, isError, error, data }] = useCreateTaskMutation();
    const { data: courses } = useGetCoursesQuery();

    const onSubmit = (formData) => {
        createTask(formData);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate("/tasks");
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error occurred';
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isLoading]);

    return (
        <>
            {isLoading ? <FullScreenLoader /> : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Create Task</h4>
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
                                                    <Label>Task Name</Label>
                                                    <input
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        {...register('name', { required: true })}
                                                    />
                                                    {errors.name && <small className="text-danger">Task name is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Type</Label>
                                                    <select
                                                        className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                                        {...register('type', { required: true })}
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="Assignment">Assignment</option>
                                                        <option value="Exam">Exam</option>
                                                    </select>
                                                    {errors.type && <small className="text-danger">Type is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Date</Label>
                                                    <input
                                                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                        type="date"
                                                        {...register('date')}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Select Course</Label>
                                                    <select
                                                        className={`form-control ${errors.course_id ? 'is-invalid' : ''}`}
                                                        {...register('course_id', { required: true })}
                                                    >
                                                        <option value="">Select Course</option>
                                                        {courses && courses.map(course => (
                                                            <option key={course.id} value={course.id}>{course.name}</option>
                                                        ))} 
                                                    </select>
                                                    {errors.course_id && <small className="text-danger">Course is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Description</Label>
                                                    <textarea
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        rows={4}
                                                        {...register('description', { required: true })}
                                                    ></textarea>
                                                    {errors.description && <small className="text-danger">Description is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-4">
                                            <Button color="outline-primary" className="btn-block" type="submit">Submit</Button>
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
}

export default CreateTask;
