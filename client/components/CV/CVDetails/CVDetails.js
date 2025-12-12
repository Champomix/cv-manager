// components/CV/CVDetails.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiCalendar, FiBriefcase, FiMail, FiPhone, FiMapPin, FiStar,
    FiX, FiBookOpen, FiTrash2, FiEdit
} from 'react-icons/fi';

export default function CVDetails({ cv, onClose, onEdit, onDelete }) {
    if (!cv) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Détails du CV</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold">
                            {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                        </h3>
                        <p className="text-lg text-gray-600">{cv.personalInfo.profession}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-semibold mb-2">Informations personnelles</h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p>{cv.personalInfo.email}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Téléphone</p>
                                    <p>{cv.personalInfo.phone || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Adresse</p>
                                    <p>{cv.personalInfo.address || 'Non spécifiée'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Résumé</h4>
                            <p>{cv.summary || 'Aucun résumé disponible'}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Expériences professionnelles</h4>
                        {cv.experiences.length > 0 ? (
                            <ul className="space-y-4">
                                {cv.experiences.map((exp, index) => (
                                    <li key={index} className="p-4 border rounded-lg bg-gray-50">
                                        <h5 className="font-semibold">{exp.position}</h5>
                                        <p className="text-gray-600">{exp.company}</p>
                                        <p className="text-sm text-gray-500">
                                            {exp.startDate} - {exp.endDate || 'Présent'}
                                        </p>
                                        {exp.description && <p className="mt-2">{exp.description}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucune expérience professionnelle disponible</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Formations</h4>
                        {cv.educations.length > 0 ? (
                            <ul className="space-y-4">
                                {cv.educations.map((edu, index) => (
                                    <li key={index} className="p-4 border rounded-lg bg-gray-50">
                                        <h5 className="font-semibold">{edu.degree}</h5>
                                        <p className="text-gray-600">{edu.institution}</p>
                                        <p className="text-sm text-gray-500">
                                            {edu.startDate} - {edu.endDate || 'Présent'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucune formation disponible</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Compétences</h4>
                        {cv.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {cv.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>Aucune compétence disponible</p>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end space-x-4">
                    <button
                        onClick={() => onDelete(cv.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-700"
                    >
                        <FiTrash2 /> Supprimer
                    </button>
                    <button
                        onClick={() => onEdit(cv.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        <FiEdit /> Modifier
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
