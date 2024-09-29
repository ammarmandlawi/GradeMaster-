/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { BookOpen, User, Settings, Clipboard, CheckCircle, BarChart2, Menu } from 'react-feather';
import logoImg from '../assets/img/logo-white.png';
import userImg from '../assets/img/user.png';
import { useLogoutUserMutation } from '../redux/features/userAPI';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation(); // Hook to get the current route

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const toggleSidebar = () => setIsOpen(!isOpen);  // Used for Sidebar toggle
    const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();
    const onLogoutHandler = () => {
        logoutUser();
    };

    // Effect hook to handle logout success or error notifications
    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            const errorMsg = error.data && error.data.message ? error.data.message : error.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    // Helper function to check if a route is active
    const isActiveRoute = (route) => location.pathname.includes(route);

    const handleNavLinkClick = () => {
        if (window.innerWidth <= 992) {
            setIsOpen(false); // Close sidebar
        }
    };

    return (
        <>
            {/* Header */}
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex align-items-center">
                        <div className="navbar-brand-box">
                            <Link to="/" className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={logoImg} alt="Logo" height="30" />
                                </span>
                            </Link>
                        </div>
                        <div className="d-lg-none ms-3">
                            <Menu size={24} style={{ color: 'black', cursor: 'pointer' }} onClick={toggleSidebar} />
                        </div>
                    </div>
                    <div className="d-inline-block">
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                            <DropdownToggle caret nav>
                                <img
                                    src={userImg}
                                    alt="Profile"
                                    className='user-img'
                                />
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem tag={Link} to="/profile">
                                    Profile
                                </DropdownItem>
                                <DropdownItem onClick={onLogoutHandler}>Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div id="sidebar-menu">
                    <Nav vertical>
                        <NavItem>
                            <Link
                                to="/courses"
                                className={`nav-link ${isActiveRoute('/courses') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <BookOpen size={18} className="me-2" /> Courses
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/students"
                                className={`nav-link ${isActiveRoute('/students') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <User size={18} className="me-2" /> Students
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/attendances"
                                className={`nav-link ${isActiveRoute('/attendances') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <CheckCircle size={18} className="me-2" /> Attendances
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/tasks"
                                className={`nav-link ${isActiveRoute('/tasks') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <Clipboard size={18} className="me-2" /> Tasks & Exams
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/taskSubmissions"
                                className={`nav-link ${isActiveRoute('/taskSubmissions') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <BookOpen size={18} className="me-2" /> Task Submissions
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/gradeWeights"
                                className={`nav-link ${isActiveRoute('/gradeWeights') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <BarChart2 size={18} className="me-2" /> Grade Weights
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link
                                to="/report"
                                className={`nav-link ${isActiveRoute('/report') ? 'active' : ''}`}
                                onClick={handleNavLinkClick}
                            >
                                <Settings size={18} className="me-2" /> Report
                            </Link>
                        </NavItem>
                    </Nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
