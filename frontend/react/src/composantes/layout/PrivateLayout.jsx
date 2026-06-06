import Header from '../common/Header';

const PrivateLayout = ({ children }) => {
    return (
        <div className="private-layout">
            <Header />
            <div className="layout-container">
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;