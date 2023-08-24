import React from "react";
import "../layout.css";
import { HomeOutlined, MedicineBoxOutlined, IdcardOutlined, CarryOutOutlined, TagOutlined, CompassOutlined, LogoutOutlined, FormOutlined, MenuOutlined, BellOutlined, UserOutlined, UserSwitchOutlined, EditOutlined, EditFilled, FacebookOutlined, InstagramOutlined, BarChartOutlined, WechatOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from 'antd';


function Layout({ children }) {
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate()

    const userMenu = [
        {
            name: 'Pagina principală',
            path: '/',
            icon: <HomeOutlined />
        },
        {
            name: 'Specialiștii noștri',
            path: '/programare',
            icon: <IdcardOutlined />
        },
        {
            name: 'Afecțiuni dermatologice',
            path: '/afectiuni',
            icon: <MedicineBoxOutlined />
        },
        {
            name: 'Programările tale',
            path: '/appointments',
            icon: <CarryOutOutlined />
        },
        {
            name: 'Prețuri',
            path: '/preturi',
            icon: <TagOutlined />
        },
        {
            name: 'Unde ne găsești?',
            path: '/location',
            icon: <CompassOutlined />
        },
        {
            name: 'Hai în echipa noastră!',
            path: '/aplica-doctor',
            icon: <FormOutlined />
        },
    ];

    const adminMenu = [
        {
            name: 'Pagina principală',
            path: '/',
            icon: <HomeOutlined />
        },
        {
            name: 'Useri',
            path: '/admin/usersList',
            icon: <UserSwitchOutlined />
        },
        {
            name: 'Doctori',
            path: '/admin/doctorsList',
            icon: <MedicineBoxOutlined />
        },
        {
            name: 'Editare categorii',
            path: '/admin/categoriesList',
            icon: <EditFilled />
        },
        {
            name: 'Editare afecțiuni',
            path: '/admin/diseaseList',
            icon: <EditOutlined />
        },
    ];

    const doctorMenu = [
        {
            name: 'Pagina principală',
            path: '/',
            icon: <HomeOutlined />
        },
        {
            name: 'Programările tale',
            path: '/doctor/appointments',
            icon: <CarryOutOutlined />
        },
        {
            name: 'Statistici programări',
            path: '/doctor/dashboard',
            icon: <BarChartOutlined />
        },
    ];

    const menuToBeRender = user?.esteAdmin ? adminMenu : user?.esteDoctor ? doctorMenu : userMenu;

    const role = user?.esteAdmin ? "admin" : user?.esteDoctor ? "doctor" : "user";

    return (
        <div className="main">
            <div className="d-flex layout">
                <div className='sideBar'>
                    <div className="sideBar-header">
                        <img src="/assets/Logo2.jpeg" alt="Logo" />
                    </div>
                    <div className="menu">
                        {menuToBeRender.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div key={menu.name} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                    <span className="icon">
                                        <Link to={menu.path}>{menu.icon}</Link>
                                    </span>
                                    <Link to={menu.path}>{menu.name}</Link>
                                    {menu.message}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="content">
                    <div className="header">
                        <span><MenuOutlined className="header-action-icon" /></span>
                        <div className="d-flex align-items-center px-4">
                            <Badge count={user?.unseenNot.length} onClick={() => navigate('/notificari')}>
                                <span><BellOutlined className='header-action-icon px-3' /></span>
                            </Badge>
                            {role === "doctor" && (
                                <Link to={`/doctor/profil/${user._id}`} className='header-action-icon mx-3'>
                                    <UserOutlined />
                                </Link>
                            )}
                            <div className={`header-action-icon px-3`} onClick={() => {
                                localStorage.clear()
                                navigate('/login')
                            }}>
                                <span className="iconLogout"><LogoutOutlined /></span>
                                {<Link to='/chat'></Link>}
                            </div>
                            <div className={`header-action-icon px-3`} onClick={() => {
                                navigate('/chat')
                            }}>
                                <span className="iconLogout"><WechatOutlined /></span>
                                {<Link to='/login'></Link>}
                            </div>
                            Bună, {user?.prenume}!
                        </div>
                    </div>

                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
            <br></br>
            <div className="footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Derma Health Expert. All rights reserved.</p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/">
                            <FacebookOutlined className="icons" />
                        </a>
                        <a href="https://www.instagram.com/">
                            <InstagramOutlined className="icons" />
                        </a>
                    </div>
                </div>
            </div>

            <br></br>
        </div>
    )
}

export default Layout;
