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
    Input
} from "reactstrap";
import { toast } from 'react-toastify';
import { useGetGradeWeightsQuery, useDeleteGradeWeightMutation } from "../../redux/features/gradeWeightAPI";  // Assumes you've set up the API slice
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { ChevronDown, MoreVertical, Edit, Trash2 } from "react-feather";
import DownloadCSV from "../../components/DownloadCSV";

const GradeWeights = () => {
    const navigate = useNavigate();
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: gradeWeights, refetch } = useGetGradeWeightsQuery();  // Fetch grade weights from the API

    const [modalVisibility, setModalVisibility] = useState(false);
    const [importModalVisibility, setImportModalVisibility] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedGradeWeightId, setSelectedGradeWeightId] = useState(null);
    const [deleteGradeWeight, { isLoading, isError, error, isSuccess, data }] = useDeleteGradeWeightMutation();

    useEffect(() => {
        refetch();  // Refetch grade weights data
    }, []);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Grade weight deleted successfully');
            refetch();  // Refetch the grade weights after deletion
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Error deleting grade weight';
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const columns = () => [
        {
            name: 'Item Type',
            selector: (row = {}) => row.item_type || '',
            sortable: true
        },
        {
            name: 'Course',
            selector: (row = {}) => row.course?.name || '',
            sortable: true
        },
        {
            name: 'Weight (%)',
            selector: (row = {}) => `${row.weight}%` || '',
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
                            <DropdownItem className="w-100" onClick={() => navigate(`/gradeWeights/update-gradeWeight/${row.id}`)}>
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

    const handleDeleteGradeWeight = () => {
        deleteGradeWeight(selectedGradeWeightId);
        setModalVisibility(false);
    };

    const openDeleteModal = (gradeWeightId) => {
        setSelectedGradeWeightId(gradeWeightId);
        setModalVisibility(true);
    };

    const handleImportSubmit = async () => {
        if (!file) {
            toast.error('Please select a CSV file to import.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/gradeWeights/import`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,  // Assuming token is stored in localStorage
                }
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Grade weights imported: ${result.successCount} added, ${result.errorCount} failed.`);
                if (result.errors.length > 0) {
                    result.errors.forEach(error => {
                        toast.error(`Failed to import: ${error.message}`);
                    });
                }
                setImportModalVisibility(false);
                refetch();  // Refetch grade weights after import
            } else {
                toast.error(result.message || 'Error importing grade weights');
            }
        } catch (error) {
            toast.error('Error uploading file.');
        }
    };

    return (
        <div className="main-content">
            <Row className="my-3">
                <Col>
                    <h4 className="main-title">Grade Weights</h4>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <a href="/gradeWeights/create-gradeWeight" className="btn btn-outline-primary btn-sm">Create Grade Weight</a>
                    <Button color="outline-secondary" className="btn-sm ms-2" onClick={() => setImportModalVisibility(true)}>Import CSV</Button>
                    <DownloadCSV data={gradeWeights} fileName="gradeWeight" />
                </Col>
            </Row>
            <Card>
                <DataTable
                    title="Grade Weights"
                    data={gradeWeights}  // Ensure data is an array
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
                <ModalHeader toggle={() => setModalVisibility(false)}>Delete Grade Weight</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this grade weight?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteGradeWeight} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Import CSV Modal */}
            <Modal isOpen={importModalVisibility} toggle={() => setImportModalVisibility(false)}>
                <ModalHeader toggle={() => setImportModalVisibility(false)}>Import Grade Weights from CSV</ModalHeader>
                <ModalBody>
                    <Input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".csv" />
                </ModalBody>
                <ModalFooter>
                    <Button color="outline-primary btn-sm" onClick={handleImportSubmit}>
                        Import
                    </Button>
                    <Button color="outline-secondary btn-sm" onClick={() => setImportModalVisibility(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default GradeWeights;
