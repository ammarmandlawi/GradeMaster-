/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
    Col,
    Row,
    Card,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import { ChevronDown, MoreVertical, Edit, Trash2 } from 'react-feather';
import { useGetEnrollmentsQuery, useDeleteEnrollmentMutation } from '../../redux/features/enrollmentAPI';
import { useNavigate } from 'react-router-dom';

const Enrollments = () => {
    const navigate = useNavigate();
    const { data: enrollments, refetch } = useGetEnrollmentsQuery();
    const [deleteEnrollment, { isSuccess, isError, error }] = useDeleteEnrollmentMutation();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Enrollment deleted successfully');
            refetch();
        }
        if (isError) {
            toast.error(error?.data?.message || 'Error deleting enrollment');
        }
    }, [isSuccess, isError]);

    const columns = [
        {
            name: 'Student',
            selector: (row) => row.student?.name || 'Unknown',
            sortable: true,
        },
        {
            name: 'Course',
            selector: (row) => row.course?.name || 'Unknown',
            sortable: true,
        },
        {
            name: 'Enrollment Date',
            selector: (row) => row.createdAt,
            sortable: true,
            format: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            name: 'Actions',
            cell: (row) => {
                return (
                    <UncontrolledDropdown>
                        <DropdownToggle tag="div" className="btn btn-sm">
                            <MoreVertical size={14} className="cursor-pointer action-btn" />
                        </DropdownToggle>
                        <DropdownMenu end container="body">
                            <DropdownItem className="w-100" onClick={() => navigate(`/enrollments/update-enrollment/${row.id}`)}>
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
            },
        },
    ];

    const openDeleteModal = (enrollmentId) => {
        setSelectedEnrollmentId(enrollmentId);
        setModalVisibility(true);
    };

    const handleDelete = () => {
        deleteEnrollment(selectedEnrollmentId);
        setModalVisibility(false);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Enrollment Records</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/enrollments/create-enrollment" className="btn btn-outline-primary btn-sm">Create Enrollment</a>
                </Col>
            </Row>
            <Card>
                <DataTable
                    title="Enrollments"
                    data={enrollments}
                    responsive
                    columns={columns}
                    noHeader
                    pagination
                    paginationRowsPerPageOptions={[15, 30, 50, 100]}
                    sortIcon={<ChevronDown />}
                />
            </Card>

            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(false)}>
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Enrollment Record</ModalHeader>
                <ModalBody>Are you sure you want to delete this enrollment record?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Enrollments;
