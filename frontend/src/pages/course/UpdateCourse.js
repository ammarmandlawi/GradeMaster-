/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Form, Label, Card, CardBody, Button } from "reactstrap";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetCourseQuery, useUpdateCourseMutation } from "../../redux/features/courseAPI";

const UpdateCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: course, refetch } = useGetCourseQuery(id);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const [updateCourse, { isLoading, isError, error, isSuccess, data }] = useUpdateCourseMutation();

    const onSubmit = (data) => {
        updateCourse({ id: id, course: data });
    };

    useEffect(() => {
        if (course) {
            const fields = ['name', 'description'];
            fields.forEach((field) => setValue(field, course[field]));
        }
    }, [course]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
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
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h4 className="main-title">Update Course</h4>
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
                                                    <Label>Course Name</Label>
                                                    <input
                                                        className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                                        type="text"
                                                        id="name"
                                                        {...register('name', { required: true })}
                                                    />
                                                    {errors.name && <small className="text-danger">Course Name is required.</small>}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className='mb-2'>
                                                    <Label>Description</Label>
                                                    <textarea
                                                        className={`form-control ${classnames({ 'is-invalid': errors.description })}`}
                                                        id="description"
                                                        rows={5}
                                                        {...register('description', { required: true })}
                                                    ></textarea>
                                                    {errors.description && <small className="text-danger">Description is required.</small>}
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

export default UpdateCourse;