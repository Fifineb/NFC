// src/composantes/common/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api/userService';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { user, addNotification } = useAuth();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await userService.updateProfile(formData);
            setMessage('Profil mis à jour');
            setIsEditing(false);
            addNotification({
                message: 'Votre profil a été mis à jour',
                type: 'success'
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Erreur lors de la mise à jour');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            await userService.changePassword(passwordData);
            setMessage('Mot de passe modifié');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            addNotification({ message: 'Votre mot de passe a été changé', type: 'success' });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Erreur lors du changement');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>{t('profile.title')}</h2>
                
                {message && <div className="message success">{message}</div>}
                
                <div className="profile-avatar">
                    <div className="avatar">
                        {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                    </div>
                </div>
                
                {!isEditing ? (
                    <div className="profile-info">
                        <p><strong>{t('profile.lastname')}:</strong> {user?.nom}</p>
                        <p><strong>{t('profile.firstname')}:</strong> {user?.prenom}</p>
                        <p><strong>{t('profile.email')}:</strong> {user?.email}</p>
                        <p><strong>{t('profile.role')}:</strong> {user?.role}</p>
                        <button onClick={() => setIsEditing(true)} className="btn-edit">
                            ✏️ {t('profile.edit')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <input
                            type="text"
                            placeholder={t('profile.lastname')}
                            value={formData.nom}
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder={t('profile.firstname')}
                            value={formData.prenom}
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                            required
                        />
                        <input
                            type="email"
                            placeholder={t('profile.email')}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                        <div className="form-actions">
                            <button type="submit" className="btn-save">{t('profile.save')}</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                                {t('profile.cancel')}
                            </button>
                        </div>
                    </form>
                )}

                <div className="password-section">
                    <h3>{t('profile.change_password')}</h3>
                    <form onSubmit={handleChangePassword} className="password-form">
                        <input
                            type="password"
                            placeholder={t('profile.old_password')}
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                            required
                        />
                        <input
                            type="password"
                            placeholder={t('profile.new_password')}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            required
                        />
                        <input
                            type="password"
                            placeholder={t('profile.confirm_password')}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            required
                        />
                        <button type="submit" className="btn-change">{t('profile.change')}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;