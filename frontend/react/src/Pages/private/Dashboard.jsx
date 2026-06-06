import { useAuth } from '../../context/AuthContext';
import PrivateLayout from '../../composantes/layout/PrivateLayout';
import UserProfile from './UserProfile'; // ← rename the profile component

const Dashboard = () => {
    const { user } = useAuth();
    
<<<<<<< HEAD
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
    
=======
    // Utiliser les données réelles de l'utilisateur connecté
    const [user, setUser] = useState({
        firstName: authUser?.prenom || 'Oussama',
        lastName: authUser?.nom || 'Herhar',
        email: authUser?.email || 'oussama@gmail.com',
        phone: authUser?.telephone || '+213 557 123 456',
        role: authUser?.role || 'Administrateur',
        unite: 'Alger',
        statut: 'Actif',
        since: 'Janvier 2023',
        avatar: (authUser?.prenom?.charAt(0) || 'O') + (authUser?.nom?.charAt(0) || 'H'),
    });

    const [form, setForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const stats = [
        { icon: <BiPackage />, label: t('dashboard.matieres_gerées'), value: '142' },
        { icon: <BiTransfer />, label: t('dashboard.mouvements'), value: '38' },
        { icon: <BiBarChartAlt2 />, label: t('dashboard.rapports_generes'), value: '12' },
        { icon: <BiCalendar />, label: t('dashboard.jours_actif'), value: '487' },
    ];

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePasswordChange = e => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

    // Sauvegarder les modifications du profil
const handleSaveProfile = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
        // ✅ Envoyer seulement les champs modifiables
        const updatedData = {
            prenom: form.firstName,
            nom: form.lastName,
            telephone: form.phone
            // ⚠️ NE PAS envoyer email ici !
        };
        
        console.log('📤 Envoi des données:', updatedData);

        const response = await userService.updateProfile(updatedData);
        
        console.log('📥 Réponse reçue:', response);
        
        if (response && response.success === false) {
            throw new Error(response.message);
        }
        
        // Mettre à jour le contexte Auth
        updateUser({
            ...authUser,
            prenom: form.firstName,
            nom: form.lastName,
            telephone: form.phone
        });
        
        // Mettre à jour l'affichage local
        setUser(prev => ({
            ...prev,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone
        }));
        
        setMessage({ text: '✅ Profil mis à jour avec succès !', type: 'success' });
        setEditMode(false);
        
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        
    } catch (error) {
        console.error('❌ Erreur mise à jour:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour';
        setMessage({ text: errorMsg, type: 'error' });
    } finally {
        setLoading(false);
    }
};

    // Changer le mot de passe
    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            setMessage({ text: 'Le mot de passe doit contenir au moins 6 caractères', type: 'error' });
            return;
        }
        
        setLoading(true);
        setMessage({ text: '', type: '' });
        
        try {
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            
            setMessage({ text: 'Mot de passe changé avec succès !', type: 'success' });
            setPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            
        } catch (error) {
            console.error('Erreur changement mot de passe:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Erreur lors du changement de mot de passe', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
        });
        setEditMode(false);
    };

>>>>>>> cdb999b (listeproduit)
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