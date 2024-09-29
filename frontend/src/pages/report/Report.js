/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useGetReportQuery } from "../../redux/features/reportAPI";
import { Col, Row, Card, CardBody } from "reactstrap";
import FullScreenLoader from "../../components/FullScreenLoader";


const Report = () => {
    const { data: reports, refetch, isLoading } = useGetReportQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <>
            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="main-content">
                    <Row className="my-3">
                        <Col>
                            <h2 className="main-title">Student Performance Reports</h2>
                        </Col>
                    </Row>

                    {reports && reports.length > 0 ? (
                        reports.map((studentReport) => (
                            <Card key={studentReport.studentId} className="mb-4 shadow-sm" style={{ padding: '30px' }}> 
                                <CardBody>
                                    {/* Student Information */}
                                    <Row className="mb-4">
                                        <Col>
                                            <h3 className="student-name">Student: {studentReport.studentName}</h3>
                                            <p><strong>Student ID:</strong> {studentReport.studentId}</p>
                                        </Col>
                                    </Row>

                                    {/* Courses Information */}
                                    {studentReport.courses.length > 0 ? (
                                        studentReport.courses.map((course, courseIndex) => (
                                            <div key={courseIndex} className="course-section mb-4">
                                                <h4 className="course-name">Course: {course.courseName}</h4>

                                                {/* Attendance Section */}
                                                <div className="attendance-section mb-3">
                                                    <h5 className="section-title">Attendance</h5>
                                                    {course.attendance.length > 0 ? (
                                                        <ul>
                                                            {course.attendance.map((record, index) => (
                                                                <li key={index}>
                                                                    <p><strong>Date:</strong> {record.date}</p>
                                                                    <p><strong>Status:</strong> {record.status}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No attendance records available</p>
                                                    )}
                                                </div>

                                                {/* Tasks and Grades Section */}
                                                <div className="tasks-section mb-3">
                                                    <h5 className="section-title">Task Submissions</h5>
                                                    {course.tasks.length > 0 ? (
                                                        <ul>
                                                            {course.tasks.map((task, index) => (
                                                                <li key={index}>
                                                                    <p><strong>Task ID:</strong> {task.task_id}</p>
                                                                    <p><strong>Grade:</strong> {task.grade}</p>
                                                                    <p><strong>Submission Date:</strong> {task.submission_date}</p>
                                                                    <p><strong>Feedback:</strong> {task.feedback || 'No feedback'}</p>

                                                                    {/* Student Details */}
                                                                    <h6>Submitted By:</h6>
                                                                    <p><strong>Name:</strong> {task.student.name}</p>
                                                                    <p><strong>Email:</strong> {task.student.email}</p>
                                                                    <p><strong>Phone:</strong> {task.student.phone}</p>
                                                                    <p><strong>Gender:</strong> {task.student.gender}</p>
                                                                    <p><strong>Date of Birth:</strong> {task.student.date_of_birth}</p>
                                                                    <p><strong>Address:</strong> {task.student.address}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No task submissions available</p>
                                                    )}
                                                </div>

                                                {/* Overall Grade Section */}
                                                <div className="grades-section">
                                                    <h5 className="section-title">Total Grade: {course.totalGrade || 'N/A'}</h5>
                                                    {course.gradeWeights.length > 0 && (
                                                        <div>
                                                            <h6>Grade Weights</h6>
                                                            <ul>
                                                                {course.gradeWeights.map((weight, index) => (
                                                                    <li key={index}>
                                                                        <p><strong>Weight Type:</strong> {weight.item_type}</p>
                                                                        <p><strong>Weight Percentage:</strong> {weight.weight}%</p>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No courses available for this student.</p>
                                    )}
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardBody>
                                <p>No report data available</p>
                            </CardBody>
                        </Card>
                    )}
                </div>
            )}
        </>
    );
};

export default Report;
