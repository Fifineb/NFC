// composantes/layout/PrivateLayout.jsx
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

const PrivateLayout = ({ children }) => {
    return (
        <div className="private-layout">
            <Header />
            <div className="layout-container">
                <Sidebar />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;