import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CVForm from '../../components/CV/CVForm/CVForm';

export default function EditCV() {
    const router = useRouter();
    const { id } = router.query; // Récupère l'ID depuis l'URL
    const [cv, setCv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Attend que l'ID soit disponible

        const fetchCV = async () => {
            try {
                console.log(`Récupération du CV avec l'ID : ${id}`); // Debug
                const response = await axios.get(`/api/cv/${id}`, {
                    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
                });
                setCv(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération du CV :", err);
                setError(err.response?.data?.message || "CV non trouvé");
            } finally {
                setLoading(false);
            }
        };

        fetchCV();
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            console.log("ID du CV :", id); // Vérifiez que l'ID est correct
            console.log("Données envoyées :", data); // Vérifiez la structure des données
            const response = await axios.put(`/api/cv/${id}`, data, {
                baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
            });
            router.push('/cv');
        } catch (err) {
            console.error("Erreur complète :", err.response || err);
            alert(`Échec : ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!cv) return <div>CV non trouvé</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800">Modifier le CV</h1>
            <CVForm onSubmit={handleSubmit} cv={cv} />
        </div>
    );
}
