// Pages/private/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api/userService';
import '../../assets/styles/profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
        telephone: user?.telephone || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateProfile(formData);
            updateUser(formData);
            setIsEditing(false);
            alert('Profil mis à jour !');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    return (
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Mon Profil</h1>
                    <button onClick={() => setIsEditing(!isEditing)} className="btn-edit">
                        {isEditing ? 'Annuler' : 'Modifier'}
                    </button>
                </div>
                
                <div className="profile-card">
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom</label>
                                <input value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
                            </div>
                            <button type="submit" className="btn-save">Enregistrer</button>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <p><strong>Nom :</strong> {user?.nom}</p>
                            <p><strong>Prénom :</strong> {user?.prenom}</p>
                            <p><strong>Email :</strong> {user?.email}</p>
                            <p><strong>Rôle :</strong> {user?.role}</p>
                            <p><strong>Téléphone :</strong> {user?.telephone || 'Non renseigné'}</p>
                        </div>
                    )}
                </div>
                
                <div className="profile-stats">
                    <div className="stat-card"><h3>142</h3><p>Matières gérées</p></div>
                    <div className="stat-card"><h3>38</h3><p>Mouvements</p></div>
                    <div className="stat-card"><h3>12</h3><p>Rapports générés</p></div>
                    <div className="stat-card"><h3>487</h3><p>Jours actif</p></div>
                </div>
            </div>
    );
};

export default Profile;