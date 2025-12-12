// components/CV/CVListPage.js
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
    FiEdit, FiTrash2, FiStar, FiSearch, FiPlus, FiBookOpen
} from 'react-icons/fi';
import CVDetails from '../CVDetails/CVDetails';
import styles from './CVListPage.module.css';

export default function CVListPage() {
    const [cvs, setCvs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFavorite, setFilterFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedCV, setSelectedCV] = useState(null);

    const api = axios.create({
        baseURL: 'http://localhost:5001/api',
        headers: { 'Content-Type': 'application/json' }
    });

    // ---------------------------
    // Fetch des CVs
    useEffect(() => {
        async function fetchCVs() {
            try {
                const res = await api.get('/cvs');
                setCvs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCVs();
    }, []);

    // ---------------------------
    // Handlers
    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer ce CV ?')) return;

        try {
            await api.delete(`/cv/${id}`);
            setCvs(prev => prev.filter(cv => cv.id !== id));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    const handleToggleFavorite = async (id) => {
        const cv = cvs.find(cv => cv.id === id);
        if (!cv) return;

        const updated = { ...cv, isFavorite: !cv.isFavorite };

        try {
            await api.put(`/cv/${id}`, updated);
            setCvs(prev => prev.map(item => item.id === id ? updated : item));
        } catch (err) {
            console.error(err);
        }
    };

    // ---------------------------
    // Filtrage optimisé (useMemo)
    const filteredCVs = useMemo(() => {
        const searchText = searchTerm.toLowerCase();

        const deepSearch = (obj) =>
            typeof obj === "string"
                ? obj.toLowerCase().includes(searchText)
                : typeof obj === "object" && obj !== null
                    ? Object.values(obj).some(deepSearch)
                    : false;

        return cvs.filter(cv =>
            (searchTerm === '' || deepSearch(cv)) &&
            (!filterFavorite || cv.isFavorite)
        );
    }, [cvs, searchTerm, filterFavorite]);

    // ---------------------------
    // Render

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Mes CVs</h1>

            {/* Zone recherche + actions */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search bar moderne */}
                <div className="relative w-full md:w-1/2">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Rechercher un CV..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full
                            pl-10
                            pr-4
                            py-2
                            bg-white/80
                            backdrop-blur-sm
                            border
                            border-gray-200
                            shadow-sm
                            rounded-full
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            transition-all
                            appearance-none
                            placeholder-gray-400
                            h-10
                            text-sm
                            leading-tight
                            box-border
                        "
                        style={{ paddingLeft: '1rem' }}
                        aria-label="Recherche de CV"
                    />
                </div>


                {/* Boutons */}
                <div className="flex items-center gap-3">
                    {/* Bouton Favoris */}
                    <button
                        onClick={() => setFilterFavorite(!filterFavorite)}
                        className={`
                            flex items-center gap-2 px-5 py-3 rounded-xl transition-all
                            shadow-sm border
                            ${filterFavorite
                                ? "bg-blue-600 border-blue-700 text-white hover:bg-blue-700"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }
                        `}
                    >
                        <FiStar className={`text-lg ${filterFavorite ? "text-yellow-300" : "text-gray-400"}`} />
                        {filterFavorite ? "Masquer les favoris" : "Afficher uniquement les favoris"}
                    </button>

                    {/* Lien Nouveau CV */}
                    <Link
                        href="/cv/new"
                        className="
                            flex items-center gap-2 px-5 py-3 rounded-xl
                            bg-green-500 text-white
                            hover:bg-green-600
                            shadow-sm
                            transition-all
                        "
                    >
                        <FiPlus className="text-lg" />
                        Créer un nouveau CV
                    </Link>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Chargement des CVs...</p>
                </div>
            )}

            {/* AUCUN CV */}
            {!loading && filteredCVs.length === 0 && (
                <div className="text-center py-12">
                    <FiBookOpen className="text-4xl mb-4 text-blue-200 mx-auto" />
                    <p className="text-xl mb-4">Aucun CV trouvé</p>

                    {searchTerm || filterFavorite ? (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterFavorite(false);
                            }}
                            className="text-blue-600 hover:underline text-lg font-medium"
                        >
                            Réinitialiser les filtres
                        </button>
                    ) : (
                        <Link
                            href="/cv/new"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg
                                       hover:bg-blue-700 transition shadow-md text-lg"
                        >
                            Créer votre premier CV
                        </Link>
                    )}
                </div>
            )}

            {/* LISTE DES CV */}
            {!loading && filteredCVs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCVs.map((cv) => (
                        <div key={cv.id} className={styles.cvCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>
                                    {cv.personalInfo.lastName} {cv.personalInfo.firstName}
                                </h2>
                                <Link
                                    href={`/cv/${cv.id}`}
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                >
                                    <FiEdit /> Modifier
                                </Link>
                            </div>

                            <button
                                onClick={() => handleToggleFavorite(cv.id)}
                                className={`${styles.favoriteBtn} ${cv.isFavorite ? styles.favorited : styles.notFavorited
                                    }`}
                            >
                                <FiStar />
                            </button>

                            <div className={styles.cardContent}>
                                {[
                                    ["Profession", cv.personalInfo.profession],
                                    ["Email", cv.personalInfo.email],
                                    ["Téléphone", cv.personalInfo.phone || "Non spécifié"],
                                    ["Adresse", cv.personalInfo.address || "Non spécifiée"],
                                    ["Résumé", cv.summary || "Aucun résumé disponible"],
                                    ["Expériences", `${cv.experiences.length} expérience(s)`],
                                    ["Formations", `${cv.educations.length} formation(s)`],
                                    ["Compétences", `${cv.skills.length} compétence(s)`],
                                ].map(([label, value], i) => (
                                    <div key={i} className={styles.infoItem}>
                                        <span className={styles.infoLabel}>{label}</span>
                                        <span className={styles.infoValue}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => handleDelete(cv.id)}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700"
                                >
                                    <FiTrash2 /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedCV && (
                <CVDetails
                    cv={selectedCV}
                    onClose={() => setSelectedCV(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
