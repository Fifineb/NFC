import React, { useState, useEffect } from 'react';
import { regionService } from '../../services/api/axiosConfig';

const Regions = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newRegion, setNewRegion] = useState({
        nomR: '',
        description: '',
        adresseR: ''
    });

    // Charger les régions au chargement du composant
    useEffect(() => {
        loadRegions();
    }, []);

const loadRegions = async () => {
    try {
        setLoading(true);

        const response = await regionService.getAll();

        console.log("RESPONSE =", response);       
        console.log("DATA =", response.data);      

        setRegions(response.data); 

        setError(null);
    } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les régions');
    } finally {
        setLoading(false);
    }
};

    const handleAddRegion = async (e) => {
        e.preventDefault();
        try {
            await regionService.add(newRegion);
            setShowForm(false);
            setNewRegion({ nomR: '', description: '', adresseR: '' });
            loadRegions(); // Recharger la liste
        } catch (err) {
            console.error('Erreur lors de l\'ajout:', err);
            setError('Impossible d\'ajouter la région');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRegion(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Chargement des régions...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Gestion des Régions
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                    {showForm ? 'Annuler' : '+ Nouvelle Région'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Formulaire d'ajout */}
            {showForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
                    <h2 className="text-lg font-semibold mb-4">Ajouter une région</h2>
                    <form onSubmit={handleAddRegion}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom de la région *
                                </label>
                                <input
                                    type="text"
                                    name="nomR"
                                    value={newRegion.nomR}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    name="adresseR"
                                    value={newRegion.adresseR}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newRegion.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tableau des régions */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Adresse
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {regions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    Aucune région trouvée
                                </td>
                            </tr>
                        ) : (
                            regions.map((region) => (
                                <tr key={region.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {region.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {region.nomR}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {region.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {region.adresseR}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                            onClick={() => {/* Modifier */}}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => {/* Supprimer */}}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Regions;
