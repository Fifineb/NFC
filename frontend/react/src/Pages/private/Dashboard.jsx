import { useAuth } from '../../context/AuthContext';
import PrivateLayout from '../../composantes/layout/PrivateLayout';
import UserProfile from './UserProfile'; // ← rename the profile component

const Dashboard = () => {
    const { user } = useAuth();
    
    const renderDashboardByRole = () => {
        switch(user?.role) {
            case 'ADMINISTRATEUR':
                return <AdminDashboardContent />;
            case 'GESTIONNAIRE':
                return <ManagerDashboardContent />;
            case 'SUPERVISEUR':
                return <SupervisorDashboardContent />;
            default:
                return <UserProfile />;
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