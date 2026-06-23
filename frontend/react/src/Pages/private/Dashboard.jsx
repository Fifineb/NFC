import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api/userService';
import {
    BiUser, BiMapPin, BiUserCheck, BiEnvelope,
    BiPhone, BiEdit, BiLock, BiPackage,
    BiTransfer, BiBarChartAlt2, BiCalendar, BiCheckCircle,
    BiSave, BiX, BiKey
} from 'react-icons/bi';
import '../../assets/styles/dashboard.css';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user: authUser, updateUser } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    
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

    return (
        <div className="dashboard">
            {/* Message de notification */}
            {message.text && (
                <div className={`message-toast ${message.type}`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            {/* Bannière hero */}
            <div className="banner">
                <div className="banner-content">
                    <div className="banner-avatar">{user.avatar}</div>
                    <div className="banner-info">
                        <h1 className="banner-name">{user.firstName} {user.lastName}</h1>
                        <p className="banner-tagline">Make Your Stock Smarter.</p>
                        <div className="banner-badges">
                            <span className="badge"><BiUserCheck /> {user.role}</span>
                            <span className="badge"><BiMapPin /> {user.unite}</span>
                            <span className="badge badge-green"><BiCheckCircle /> {user.statut}</span>
                        </div>
                    </div>
                    <div className="banner-since">
                        <span className="since-label">Membre depuis</span>
                        <span className="since-value">{user.since}</span>
                    </div>
                </div>
            </div>

            {/* Stats rapides */}
            <div className="stats-row">
                {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-body">
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Informations personnelles */}
            <div className="per--info">
                <div className="section-header">
                    <h2 className="section-title"><BiUser /> {t('profile.title')}</h2>
                    {!editMode ? (
                        <button className="btn-edit" onClick={() => setEditMode(true)}>
                            <BiEdit /> {t('profile.edit')}
                        </button>
                    ) : (
                        <div className="edit-buttons">
                            <button className="btn-save" onClick={handleSaveProfile} disabled={loading}>
                                <BiSave /> {loading ? 'Enregistrement...' : t('profile.save')}
                            </button>
                            <button className="btn-cancel" onClick={cancelEdit}>
                                <BiX /> {t('profile.cancel')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="info-grid">
                    <div className="info-field">
                        <span className="field-label"><BiUser /> {t('profile.firstname')}</span>
                        {editMode ? (
                            <input 
                                className="field-input" 
                                type="text" 
                                name="firstName" 
                                value={form.firstName} 
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="field-value">{user.firstName}</span>
                        )}
                    </div>
                    <div className="info-field">
                        <span className="field-label"><BiUser /> {t('profile.lastname')}</span>
                        {editMode ? (
                            <input 
                                className="field-input" 
                                type="text" 
                                name="lastName" 
                                value={form.lastName} 
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="field-value">{user.lastName}</span>
                        )}
                    </div>
                    <div className="info-field">
                        <span className="field-label"><BiEnvelope /> {t('profile.email')}</span>
                        {editMode ? (
                            <input 
                                className="field-input" 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="field-value">{user.email}</span>
                        )}
                    </div>
                    <div className="info-field">
                        <span className="field-label"><BiPhone /> {t('profile.phone')}</span>
                        {editMode ? (
                            <input 
                                className="field-input" 
                                type="tel" 
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="field-value">{user.phone}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Sécurité */}
            <div className="per--info">
                <div className="section-header">
                    <h2 className="section-title"><BiLock /> Sécurité</h2>
                </div>
                <div className="security-row">
                    <div className="security-item">
                        <span className="sec-label">Mot de passe</span>
                        <span className="sec-value">••••••••••</span>
                    </div>
                    <button className="btn-change-pwd" onClick={() => setPasswordModal(true)}>
                        <BiLock /> Changer le mot de passe
                    </button>
                </div>
            </div>

            {/* Modal Changer mot de passe */}
            {passwordModal && (
                <div className="modal-overlay" onClick={() => setPasswordModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><BiKey /> Changer le mot de passe</h3>
                            <button className="modal-close" onClick={() => setPasswordModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Mot de passe actuel</label>
                                <input 
                                    type="password" 
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Entrez votre mot de passe actuel"
                                />
                            </div>
                            <div className="form-group">
                                <label>Nouveau mot de passe</label>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirmer le mot de passe</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirmez votre nouveau mot de passe"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setPasswordModal(false)}>Annuler</button>
                            <button className="btn-save" onClick={handleChangePassword} disabled={loading}>
                                {loading ? 'Chargement...' : 'Changer le mot de passe'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

    
        </div>
    );
};

export default Dashboard;