import React from 'react';
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
    Input,
    Label,
    CardBody,
    InputGroup,
    InputGroupText,
} from "reactstrap";
import { toast } from 'react-toastify';
import { useGetStudentsQuery, useDeleteStudentMutation } from "../../redux/features/studentAPI";
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { ChevronDown, MoreVertical, Edit, Trash2, Search } from "react-feather";
import DownloadCSV from '../../components/DownloadCSV';

const Students = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const [searchItem, setSearchItem] = useState('');
    const queryParams = {
        q: searchItem,
    };
    const { data: students, refetch } = useGetStudentsQuery(queryParams);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [importModalVisibility, setImportModalVisibility] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [deleteStudent, { isLoading, isError, error, isSuccess, data }] = useDeleteStudentMutation();

    const [file, setFile] = useState(null);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Student deleted successfully');
            refetch();
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error deleting student';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading, isSuccess, isError, data, refetch, error]);

    const truncateText = (text, maxLength = 50) => {
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
            name: 'Email',
            selector: (row = {}) => row.email || '',
            sortable: true
        },
        {
            name: 'Phone',
            selector: (row = {}) => row.phone || '',
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row = {}) => row.gender || '',
            sortable: true
        },
        {
            name: 'Date of Birth',
            selector: (row = {}) => row.date_of_birth || '',
            sortable: true
        },
        {
            name: 'Address',
            selector: (row = {}) => truncateText(row.address || '', 50),
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/students/update-student/${row.id}`)}>
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

    const handleDeleteStudent = () => {
        deleteStudent(selectedStudentId);
        setModalVisibility(false);
    };

    const openDeleteModal = (studentId) => {
        setSelectedStudentId(studentId);
        setModalVisibility(true);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) {
            toast.error('Please select a CSV file to import.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/students/import`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || 'Students imported successfully');
                setImportModalVisibility(false);
                refetch();
            } else {
                toast.error(result.message || 'Error importing students');
            }
        } catch (error) {
            toast.error('Error uploading file.');
        }
    };

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Students</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/students/create-student" className="btn btn-outline-primary btn-sm">Create Student</a>
                    <Button color="outline-secondary" className="ms-2 btn-sm" onClick={() => setImportModalVisibility(true)}>
                        Import CSV
                    </Button>
                    {/* Use the DownloadCSV component */}
                    <DownloadCSV data={students} fileName="students" />
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
                    title="Students"
                    data={students}
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
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Student</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this student?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteStudent} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Import CSV Modal */}
            <Modal isOpen={importModalVisibility} toggle={() => setImportModalVisibility(false)}>
                <ModalHeader toggle={() => setImportModalVisibility(false)}>Import Students from CSV</ModalHeader>
                <ModalBody>
                    <Label for="csvFile">Select CSV File</Label>
                    <Input type="file" id="csvFile" onChange={handleFileChange} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleImport}>Import</Button>
                    <Button color="secondary" onClick={() => setImportModalVisibility(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Students;
