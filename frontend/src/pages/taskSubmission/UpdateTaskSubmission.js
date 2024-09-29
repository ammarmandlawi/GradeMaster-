/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Label, Card, CardBody, Button } from "reactstrap";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetTaskSubmissionQuery, useUpdateTaskSubmissionMutation } from "../../redux/features/taskSubmissionAPI";
import { useGetStudentsQuery } from "../../redux/features/studentAPI";
import { useGetTasksQuery } from "../../redux/features/taskAPI";
import { toast } from 'react-toastify';

const UpdateTaskSubmission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: submission, refetch } = useGetTaskSubmissionQuery(id);
    const { data: students } = useGetStudentsQuery();
    const { data: tasks } = useGetTasksQuery();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [updateTaskSubmission, { isLoading, isSuccess, isError, error, data }] = useUpdateTaskSubmissionMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (submission) {
            const fields = ['grade', 'submission_date', 'student_id', 'task_id', 'feedback'];
            fields.forEach((field) => setValue(field, submission[field]));
        }
    }, [submission]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Task submission updated successfully');
            navigate("/taskSubmissions");
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error occurred';
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isLoading]);

    const onSubmit = (formData) => {
        updateTaskSubmission({ id, taskSubmission: formData });
    };

    return (
        <>
            {isLoading ? <FullScreenLoader /> : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Update Task Submission</h4>
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
                                                    <Label>Grade</Label>
                                                    <input
                                                        className={`form-control ${errors.grade ? 'is-invalid' : ''}`}
                                                        type="number"
                                                        {...register('grade', { required: true })}
                                                    />
                                                    {errors.grade && <small className="text-danger">Grade is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Submission Date</Label>
                                                    <input
                                                        className={`form-control ${errors.submission_date ? 'is-invalid' : ''}`}
                                                        type="date"
                                                        {...register('submission_date', { required: true })}
                                                    />
                                                    {errors.student_id && <small className="text-danger">Submission Date is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Select Student</Label>
                                                    <select
                                                        className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                                                        {...register('student_id', { required: true })}
                                                    >
                                                        <option value="">Select Student</option>
                                                        {students && students.map(student => (
                                                            <option key={student.id} value={student.id}>{student.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.student_id && <small className="text-danger">Student is required.</small>}
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className='mb-2'>
                                                    <Label>Select Task</Label>
                                                    <select
                                                        className={`form-control ${errors.task_id ? 'is-invalid' : ''}`}
                                                        {...register('task_id', { required: true })}
                                                    >
                                                        <option value="">Select Task</option>
                                                        {tasks && tasks.map(task => (
                                                            <option key={task.id} value={task.id}>{task.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.task_id && <small className="text-danger">Task is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Feedback</Label>
                                                    <textarea
                                                        className={`form-control ${errors.feedback ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        rows={4}
                                                        {...register('feedback', { required: true })}
                                                    ></textarea>
                                                    {errors.feedback && <small className="text-danger">Feedback is required.</small>}
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

export default UpdateTaskSubmission;
