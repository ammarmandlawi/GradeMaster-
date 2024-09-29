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
import { useGetTasksQuery, useDeleteTaskMutation } from "../../redux/features/taskAPI";  // Assumes you've set up the API slice
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { ChevronDown, MoreVertical, Edit, Trash2, Search } from "react-feather";

const Tasks = () => {
    const navigate = useNavigate();
    const [searchItem, setSearchItem] = useState('');
    const queryParams = {
        q: searchItem,
    };
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: tasks, refetch } = useGetTasksQuery(queryParams);  // Fetch tasks from the API

    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [deleteTask, { isLoading, isError, error, isSuccess, data }] = useDeleteTaskMutation();

    useEffect(() => {
        refetch();  // Refetch tasks data
    }, []);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Task deleted successfully');
            refetch();  // Refetch the tasks after deletion
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error deleting task';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const columns = () => [
        {
            name: 'Name',
            selector: (row = {}) => row.name || '',
            sortable: true
        },
        {
            name: 'Type',
            selector: (row = {}) => row.type || '',
            sortable: true
        },
        {
            name: 'Date',
            selector: (row = {}) => new Date(row.date).toLocaleDateString() || '',
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/tasks/update-task/${row.id}`)}>
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

    const handleDeleteTask = () => {
        deleteTask(selectedTaskId);
        setModalVisibility(false);
    };

    const openDeleteModal = (taskId) => {
        setSelectedTaskId(taskId);
        setModalVisibility(true);
    };

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Tasks</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/tasks/create-task" className="btn btn-outline-primary btn-sm">Create Task</a>
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
                    title="Tasks"
                    data={tasks}
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
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Task</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this task?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteTask} disabled={isLoading}>
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

export default Tasks;
