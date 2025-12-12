// pages/cv/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import CVForm from '../../components/CV/CVForm/CVForm';

export default function NewCV() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuration de base pour axios
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Création d\'un nouveau CV avec les données:', data);

      const response = await api.post('/api/cv', data);
      console.log('CV créé avec succès. ID:', response.data.id);

      // Redirection vers la page d'édition du nouveau CV
      router.push(`/cv/${response.data.id}`);

    } catch (err) {
      console.error('Erreur lors de la création:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      setError(
        err.response?.data?.message ||
        `Échec de la création (code: ${err.response?.status || 'inconnu'})`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Création du CV en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors de la création du CV
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setError(null)}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Réessayer ←
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nouveau CV</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <CVForm
          onSubmit={handleSubmit}
          isLoading={loading}
          mode="create"
        />
      </div>
    </div>
  );
}
