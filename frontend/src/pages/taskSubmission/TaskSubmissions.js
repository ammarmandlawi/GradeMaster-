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
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    CardBody,
    InputGroup,
    InputGroupText,
    Input
} from "reactstrap";
import { toast } from 'react-toastify';
import { useGetTaskSubmissionsQuery, useDeleteTaskSubmissionMutation } from "../../redux/features/taskSubmissionAPI";  // Assumes you've set up the API slice
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { ChevronDown, MoreVertical, Edit, Trash2, Search } from "react-feather";

const TaskSubmissions = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const [searchItem, setSearchItem] = useState('');
    const queryParams = {
        q: searchItem,
    };
    const { data: submissions, refetch } = useGetTaskSubmissionsQuery(queryParams);  // Fetch task submissions from the API

    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
    const [deleteTaskSubmission, { isLoading, isError, error, isSuccess, data }] = useDeleteTaskSubmissionMutation();

    useEffect(() => {
        refetch();  // Refetch task submissions data
    }, []);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Task submission deleted successfully');
            refetch();  // Refetch the task submissions after deletion
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error deleting task submission';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    const columns = () => [
        {
            name: 'Task Name',
            selector: (row = {}) => row.task?.name || '',
            sortable: true
        },
        {
            name: 'Student Name',
            selector: (row = {}) => row.student?.name || '',
            sortable: true
        },
        {
            name: 'Grade',
            selector: (row = {}) => row.grade || '',
            sortable: true
        },
        {
            name: 'Submission Date',
            selector: (row = {}) => new Date(row.submission_date).toLocaleDateString() || '',
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/taskSubmissions/update-taskSubmission/${row.id}`)}>
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

    const handleDeleteTaskSubmission = () => {
        deleteTaskSubmission(selectedSubmissionId);
        setModalVisibility(false);
    };

    const openDeleteModal = (submissionId) => {
        setSelectedSubmissionId(submissionId);
        setModalVisibility(true);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Task Submissions</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/taskSubmissions/create-taskSubmission" className="btn btn-outline-primary btn-sm">Create Task Submission</a>
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
                    title="Task Submissions"
                    data={submissions}
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
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Task Submission</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this task submission?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteTaskSubmission} disabled={isLoading}>
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

export default TaskSubmissions;
