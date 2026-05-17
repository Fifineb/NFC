// Pages/private/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';
import PrivateLayout from '../../composantes/layout/PrivateLayout';

const Dashboard = () => {
    const { user } = useAuth();
    
    // Afficher différent contenu selon le rôle
    const renderDashboardByRole = () => {
        switch(user?.role) {
            case 'ADMINISTRATEUR':
                return <AdminDashboardContent />;
            case 'GESTIONNAIRE':
                return <ManagerDashboardContent />;
            case 'SUPERVISEUR':
                return <SupervisorDashboardContent />;
            default:
                return <StockerDashboardContent />;
        }
    };
    
    return (
        <PrivateLayout>
            <div className="dashboard-container">
                <h1>Tableau de bord</h1>
                {renderDashboardByRole()}
            </div>
        </PrivateLayout>
    );
};

export default Dashboard;