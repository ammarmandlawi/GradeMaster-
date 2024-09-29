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
    CardBody,
    InputGroup,
    InputGroupText,
    Input,
    Badge
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import { ChevronDown, MoreVertical, Edit, Trash2, Search } from 'react-feather';
import { useGetAttendanceRecordsQuery, useDeleteAttendanceMutation } from '../../redux/features/attendanceAPI';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const Attendances = () => {
    const navigate = useNavigate();
    const [searchItem, setSearchItem] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);  // Holds both start and end date
    const [startDate, endDate] = dateRange;  // Destructure start and end date from the range

    const queryParams = {
        q: searchItem,
        status: statusFilter ? statusFilter.value : '',
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : '',
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : ''
    };

    const { data: attendanceRecords, refetch } = useGetAttendanceRecordsQuery(queryParams);
    const [deleteAttendance, { isSuccess, isError, error }] = useDeleteAttendanceMutation();
    const [modalVisibility, setModalVisibility] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    const statusOptions = [
        { value: 'present', label: 'Present' },
        { value: 'late', label: 'Late' },
        { value: 'absent', label: 'Absent' }
    ];

    useEffect(() => {
        if (isSuccess) {
            toast.success('Attendance deleted successfully');
            refetch();
        }
        if (isError) {
            toast.error(error?.data?.message || 'Error deleting attendance');
        }
    }, [isSuccess, isError]);

    const handleFilter = (q) => {
        setSearchItem(q);
    };

    const handleStatusChange = (selectedStatus) => {
        setStatusFilter(selectedStatus);
    };

    const renderStatus = (row = {}) => {
        const getBadgeColor = (status = '') => {
            switch (status.toLowerCase()) {
                case 'late':
                    return 'info';
                case 'present':
                    return 'primary';
                case 'absent':
                    return 'danger';
                default:
                    return 'danger';
            }
        };

        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={getBadgeColor(row.status)} className="px-3 py-2" pill>
                    {row.status}
                </Badge>
            </span>
        );
    };

    const columns = [
        {
            name: 'Student',
            selector: (row) => row.Student?.name || 'Unknown',
            sortable: true,
        },
        {
            name: 'Course',
            selector: (row) => row.course?.name || 'Unknown',
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row) => row.date,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => renderStatus(row),
            sortable: true,
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/attendances/update-attendance/${row.id}`)}>
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

    const openDeleteModal = (recordId) => {
        setSelectedRecordId(recordId);
        setModalVisibility(true);
    };

    const handleDelete = () => {
        deleteAttendance(selectedRecordId);
        setModalVisibility(false);
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Attendance Records</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/attendances/create-attendance" className="btn btn-outline-primary btn-sm">Create Attendance</a>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Row className="d-flex justify-content-end">
                        <Col md="3">
                            <InputGroup>
                                <InputGroupText>
                                    <Search size={14} />
                                </InputGroupText>
                                <Input id="search" type="text" value={searchItem} onChange={(e) => handleFilter(e.target.value ? e.target.value : '')} placeholder="Search by Student Name..." />
                            </InputGroup>
                            {searchItem && (
                                <Button
                                    size="sm"
                                    className="clear-link d-block"
                                    onClick={() => handleFilter('')}
                                    color="flat-light">
                                    clear
                                </Button>
                            )}
                        </Col>
                        <Col md="3">
                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={handleStatusChange}
                                placeholder="Filter by Status"
                                isClearable
                            />
                        </Col>
                        <Col md="3">
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                className='form-control'
                                isClearable
                                placeholderText="Select Date Range"
                            />
                        </Col>
                    </Row>
                </CardBody>
                <DataTable
                    title="Attendance"
                    data={attendanceRecords}
                    responsive
                    columns={columns}
                    noHeader
                    pagination
                    paginationRowsPerPageOptions={[15, 30, 50, 100]}
                    sortIcon={<ChevronDown />}
                />
            </Card>

            <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(false)}>
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Attendance Record</ModalHeader>
                <ModalBody>Are you sure you want to delete this attendance record?</ModalBody>
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

export default Attendances;
