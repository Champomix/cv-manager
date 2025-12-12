// components/CVCard.js
import { FiEye, FiEdit, FiTrash2, FiStar } from 'react-icons/fi';

export default function CVCard({ cv, onView, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{cv.firstName} {cv.lastName}</h2>
                    {cv.isFavorite && (
                        <span className="text-yellow-400">
                            <FiStar />
                        </span>
                    )}
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">{cv.jobTitle}</p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => onView(cv)}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    >
                        <FiEdit /> Voir
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(cv.id)}
                            className="text-green-500 hover:text-green-700"
                        >
                            <FiEdit />
                        </button>
                        <button
                            onClick={() => onDelete(cv.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
