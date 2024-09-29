/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import {
    Col,
    Row,
    Card,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    CardBody,
    InputGroup,
    InputGroupText,
    Input
} from "reactstrap";
import { toast } from 'react-toastify';
import { useDeleteCourseMutation, useGetCoursesQuery } from "../../redux/features/courseAPI";
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { ChevronDown, MoreVertical, Edit, Trash2, Search } from "react-feather";

const Courses = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const [searchItem, setSearchItem] = useState('');
    const queryParams = {
        q: searchItem,
    };
    const { data: courses, refetch } = useGetCoursesQuery(queryParams);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [deleteCourse, { isLoading, isError, error, isSuccess, data }] = useDeleteCourseMutation();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Course deleted successfully');
            refetch(); // Refetch the courses after successful deletion
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error deleting course';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const columns = () => [
        {
            name: 'Name',
            selector: (row = {}) => row.name || '',
            sortable: true
        },
        {
            name: 'Description',
            selector: (row = {}) => truncateText(row.description || '', 50),  // Limit description to 50 characters
            sortable: true
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => {
                return (
                    <UncontrolledDropdown>
                        <DropdownToggle tag="div" className="btn btn-sm">
                            <MoreVertical size={14} className="cursor-pointer action-btn" />
                        </DropdownToggle>
                        <DropdownMenu end container="body">
                            <DropdownItem className="w-100" onClick={() => navigate(`/courses/update-course/${row.id}`)}>
                                <Edit size={14} className="mr-50" />
                                <span className="align-middle mx-2">Update</span>
                            </DropdownItem>
                            <DropdownItem className="w-100" onClick={() => openDeleteModal(row.id)}>
                                <Trash2 size={14} className="mr-50" />
                                <span className="align-middle mx-2">Delete</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                );
            }
        }
    ];

    const handleDeleteCourse = () => {
        deleteCourse(selectedCourseId);
        setModalVisibility(false);
    };

    const openDeleteModal = (courseId) => {
        setSelectedCourseId(courseId);
        setModalVisibility(true);
    };

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Courses</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/courses/create-course" className="btn btn-outline-primary btn-sm">Create Course</a>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Row className="justify-content-end">
                        <Col md="3" className="d-flex align-items-center">
                            <InputGroup>
                                <InputGroupText>
                                    <Search size={14} />
                                </InputGroupText>
                                <Input id="search" type="text" value={searchItem} onChange={(e) => handleFilter(e.target.value ? e.target.value : '')} placeholder="Search..." />
                            </InputGroup>
                            {searchItem && (
                                <Button
                                    size="sm"
                                    className="clear-link d-block"
                                    onClick={() => {
                                        handleFilter('');
                                    }}
                                    color="flat-light">
                                    clear
                                </Button>
                            )}
                        </Col>
                    </Row>
                </CardBody>
                <DataTable
                    title="Courses"
                    data={courses} // Make sure we provide an array to DataTable
                    responsive
                    className="react-dataTable"
                    noHeader
                    pagination
                    paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                    columns={columns()}
                    sortIcon={<ChevronDown />}
                />
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(false)}>
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Course</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this course?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteCourse} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Courses;
