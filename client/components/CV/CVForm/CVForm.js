import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './CVForm.module.css';

const schema = yup.object().shape({
  personalInfo: yup.object().shape({
    firstName: yup.string()
      .required('Le prénom est obligatoire')
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
      .matches(/^[a-zA-ZàâäéèêëîïôöùûüÿçñÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇÑ\s\-']+$/, 'Caractères invalides'),

    lastName: yup.string()
      .required('Le nom est obligatoire')
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(50, 'Le nom ne doit pas dépasser 50 caractères')
      .matches(/^[a-zA-ZàâäéèêëîïôöùûüÿçñÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇÑ\s\-']+$/, 'Caractères invalides'),

    profession: yup.string()
      .required('La profession est obligatoire')
      .min(3, 'La profession doit contenir au moins 3 caractères')
      .max(100, 'La profession ne doit pas dépasser 100 caractères'),

    email: yup.string()
      .required('L\'email est obligatoire')
      .email('Format d\'email invalide')
      .max(255, 'L\'email ne doit pas dépasser 255 caractères'),

    phone: yup.string()
      .nullable()
      .notRequired()
      .matches(
        /^(\+?\d{1,3}[- ]?)?(\(?\d{2,3}\)?[- ]?)?\d{2}[- ]?\d{2}[- ]?\d{2}[- ]?\d{2}$/,
        'Numéro de téléphone invalide (ex: 0612345678 ou +33612345678)'
      ),

    address: yup.string()
      .nullable()
      .notRequired()
      .max(200, 'L\'adresse ne doit pas dépasser 200 caractères'),

    photo: yup.mixed()
      .test(
        "is-valid-photo",
        "La photo doit être au format JPEG/PNG et faire moins de 5MB",
        function (value) {
          const currentPhoto = this.parent.photo;

          // Debug (à garder temporairement pour vérifier)
          console.log("Validation - value:", value);
          console.log("Validation - currentPhoto:", currentPhoto);

          // Cas 1: Valeur est une string (URL existante ou nouvelle URL)
          if (typeof value === 'string') {
            // Si c'est une URL d'API existante, on l'accepte
            if (value.startsWith('/api/image/')) {
              return true;
            }
            // Sinon c'est une URL invalide
            return false;
          }

          // Cas 2: Pas de nouvelle valeur (null, undefined, ou tableau vide) ET photo existante
          if ((!value || (Array.isArray(value) && value.length === 0)) &&
            typeof currentPhoto === 'string' && currentPhoto.startsWith('/api/image/')) {
            return true;
          }

          // Cas 3: Pas de photo du tout
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return true;
          }

          // Cas 4: Nouvelle photo uploadée (File)
          if (value?.[0]) {
            const file = value[0];
            if (file.size > 5 * 1024 * 1024) {
              return false;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
              return false;
            }
            return true;
          }

          // Cas par défaut (ne devrait normalement pas arriver)
          return false;
        }
      )
      .transform((value, originalValue) => {
        // Si c'est un tableau de fichiers, on le garde tel quel
        if (originalValue?.[0] instanceof File) {
          return originalValue;
        }
        // Sinon on retourne la string (URL)
        return value;
      })

  }),

  summary: yup.string()
    .nullable()
    .notRequired()
    .max(1000, 'Le résumé ne doit pas dépasser 1000 caractères'),

  experiences: yup.array()
    .of(yup.object().shape({
      company: yup.string()
        .required('Le nom de l\'entreprise est obligatoire')
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

      position: yup.string()
        .required('Le poste est obligatoire')
        .min(3, 'Le poste doit contenir au moins 3 caractères')
        .max(100, 'Le poste ne doit pas dépasser 100 caractères'),

      startDate: yup.string()
        .required('La date de début est obligatoire')
        .test('is-date', 'Date invalide', value => {
          if (!value) return false;
          return !isNaN(Date.parse(value));
        }),

      endDate: yup.string()
        .nullable()
        .notRequired()
        .test('is-date', 'Date invalide', value => {
          if (!value) return true;
          return !isNaN(Date.parse(value));
        })
        .test('end-after-start', 'La date de fin doit être après la date de début',
          function (value) {
            const { startDate } = this.parent;
            if (!value || !startDate) return true;
            return new Date(value) >= new Date(startDate);
          }
        ),
      description: yup.string()
        .nullable()
        .notRequired()
        .max(1000, 'La description ne doit pas dépasser 1000 caractères')
    })),

  educations: yup.array()
    .of(yup.object().shape({
      institution: yup.string()
        .required('L\'établissement est obligatoire')
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

      degree: yup.string()
        .required('Le diplôme est obligatoire')
        .min(3, 'Le diplôme doit contenir au moins 3 caractères')
        .max(100, 'Le diplôme ne doit pas dépasser 100 caractères'),

      startDate: yup.string()
        .required('La date de début est obligatoire')
        .test('is-date', 'Date invalide', value => {
          if (!value) return false;
          return !isNaN(Date.parse(value));
        }),

      endDate: yup.string()
        .nullable()
        .notRequired()
        .test('is-date', 'Date invalide', value => {
          if (!value) return true;
          return !isNaN(Date.parse(value));
        })
        .test('end-after-start', 'La date de fin doit être après la date de début',
          function (value) {
            const { startDate } = this.parent;
            if (!value || !startDate) return true;
            return new Date(value) >= new Date(startDate);
          }
        )
    })),

  skills: yup.array()
    .of(yup.string()
      .required('La compétence ne peut pas être vide')
      .min(2, 'La compétence doit contenir au moins 2 caractères')
      .max(50, 'La compétence ne doit pas dépasser 50 caractères')
    )
});

export default function CVForm({ cv, onSubmit }) {
  const [photoPreview, setPhotoPreview] = useState(null);

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      personalInfo: {
        firstName: cv?.personalInfo?.firstName || '',
        lastName: cv?.personalInfo?.lastName || '',
        profession: cv?.personalInfo?.profession || '',
        email: cv?.personalInfo?.email || '',
        phone: cv?.personalInfo?.phone || null,
        address: cv?.personalInfo?.address || null,
        photo: cv?.personalInfo?.photo || null,
      },
      summary: cv?.summary || '',
      experiences: cv?.experiences?.length
        ? cv.experiences.map(exp => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : null
        }))
        : [{ id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '' }],
      educations: cv?.educations?.length
        ? cv.educations.map(edu => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
          endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : null
        }))
        : [{ id: Date.now(), institution: '', degree: '', startDate: '', endDate: '' }],
      skills: cv?.skills?.length
        ? cv.skills
        : ['']
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experiences"
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "educations"
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills"
  });

  const photo = watch('personalInfo.photo');

  // Gestion de l'aperçu de la photo
  useEffect(() => {
    // Nettoyer l'URL précédente
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    // Cas 1: Nouvelle photo uploadée (File)
    if (photo?.[0] instanceof File) {
      setPhotoPreview(URL.createObjectURL(photo[0]));
    }
    // Cas 2: Photo existante (string)
    else if (typeof photo === 'string') {
      setPhotoPreview(photo);
    }
    // Cas 3: Pas de photo
    else {
      setPhotoPreview(null);
    }

    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photo]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setValue('personalInfo.photo', [e.target.files[0]]);
    }
  };

  const removePhoto = () => {
    setValue('personalInfo.photo', null);
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    formData.append('cvData', JSON.stringify({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        // Ne pas inclure la photo dans le JSON si c'est un File
        photo: typeof data.personalInfo.photo === 'string' ? data.personalInfo.photo : undefined
      }
    }));

    // Gérer les 3 cas pour la photo
    if (Array.isArray(data.personalInfo.photo) && data.personalInfo.photo[0]) {
      // Nouvelle photo uploadée
      formData.append('photo', data.personalInfo.photo[0]);
    } else if (typeof data.personalInfo.photo === 'string') {
      // Photo existante (on signale qu'on la conserve)
      formData.append('existingPhoto', data.personalInfo.photo);
    }
    // Pas de photo: ne rien faire

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={styles.cvForm}
      encType="multipart/form-data"
    >
      {/* ===== PHOTO DE PROFIL ===== */}
      <div className={styles.photoSection}>
        <h2 className={styles.title}>Photo de profil</h2>
        <div className={styles.photoContainer}>
          {photoPreview ? (
            <div className={styles.photoPreview}>
              <img
                src={photoPreview.startsWith('blob:')
                  ? photoPreview
                  : `http://localhost:5001${photoPreview}`}
                alt="Aperçu"
                className={styles.photoImage}
              />
              <button
                type="button"
                onClick={removePhoto}
                className={styles.removePhotoButton}
              >
                ×
              </button>
            </div>
          ) : (
            <div className={styles.photoPlaceholder}>
              <img
                src="/default-avatar.png"
                alt="Photo par défaut"
                className={styles.photoImage}
              />
            </div>
          )}

          <label className={styles.photoLabel}>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className={styles.photoInput}
              onChange={handlePhotoChange}
            />
            {photoPreview ? 'Changer la photo' : 'Ajouter une photo'}
          </label>
          {errors.personalInfo?.photo && <p className={styles.error}>{errors.personalInfo.photo.message}</p>}
          <p className={styles.photoHint}>Formats supportés: JPEG, PNG (max 5MB)</p>
        </div>
      </div>

      {/* ===== INFORMATIONS PERSONNELLES ===== */}
      <h2 className={styles.title}>Informations personnelles</h2>
      <div className={styles.personalInfoSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Prénom*</label>
          <input className={styles.input} {...register('personalInfo.firstName')} />
          {errors.personalInfo?.firstName && <p className={styles.error}>{errors.personalInfo.firstName.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nom*</label>
          <input className={styles.input} {...register('personalInfo.lastName')} />
          {errors.personalInfo?.lastName && <p className={styles.error}>{errors.personalInfo.lastName.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Profession*</label>
          <input className={styles.input} {...register('personalInfo.profession')} />
          {errors.personalInfo?.profession && <p className={styles.error}>{errors.personalInfo.profession.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email*</label>
          <input className={styles.input} type="email" {...register('personalInfo.email')} />
          {errors.personalInfo?.email && <p className={styles.error}>{errors.personalInfo.email.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Téléphone</label>
          <input className={styles.input} type="tel" {...register('personalInfo.phone')} />
          {errors.personalInfo?.phone && <p className={styles.error}>{errors.personalInfo.phone.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Adresse</label>
          <input className={styles.input} {...register('personalInfo.address')} />
        </div>
      </div>

      {/* ===== RÉSUMÉ ===== */}
      <h2 className={styles.title}>Résumé</h2>
      <div className={styles.formGroup}>
        <textarea
          className={`${styles.input} ${styles.textArea}`}
          {...register('summary')}
          placeholder="Résumé professionnel..."
        />
      </div>

      {/* ===== EXPÉRIENCES PROFESSIONNELLES ===== */}
      <h2 className={styles.title}>Expériences professionnelles</h2>
      {experienceFields.map((field, index) => (
        <div key={field.id} className={styles.experienceItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Entreprise*</label>
            <input className={styles.input} {...register(`experiences.${index}.company`)} />
            {errors.experiences?.[index]?.company && <p className={styles.error}>{errors.experiences[index].company.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Poste*</label>
            <input className={styles.input} {...register(`experiences.${index}.position`)} />
            {errors.experiences?.[index]?.position && <p className={styles.error}>{errors.experiences[index].position.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date de début*</label>
            <input className={styles.input} type="date" {...register(`experiences.${index}.startDate`)} />
            {errors.experiences?.[index]?.startDate && <p className={styles.error}>{errors.experiences[index].startDate.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date de fin</label>
            <input className={styles.input} type="date" {...register(`experiences.${index}.endDate`)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.input} ${styles.textArea}`}
              {...register(`experiences.${index}.description`)}
            />
          </div>

          <button
            type="button"
            onClick={() => removeExperience(index)}
            className={styles.removeBtn}
          >
            Supprimer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendExperience({ company: '', position: '', startDate: '', endDate: '', description: '' })}
        className={styles.addBtn}
      >
        Ajouter une expérience
      </button>

      {/* ===== FORMATIONS ===== */}
      <h2 className={styles.title}>Formations</h2>
      {educationFields.map((field, index) => (
        <div key={field.id} className={styles.educationItem}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Établissement*</label>
            <input className={styles.input} {...register(`educations.${index}.institution`)} />
            {errors.educations?.[index]?.institution && <p className={styles.error}>{errors.educations[index].institution.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Diplôme*</label>
            <input className={styles.input} {...register(`educations.${index}.degree`)} />
            {errors.educations?.[index]?.degree && <p className={styles.error}>{errors.educations[index].degree.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date de début*</label>
            <input className={styles.input} type="date" {...register(`educations.${index}.startDate`)} />
            {errors.educations?.[index]?.startDate && <p className={styles.error}>{errors.educations[index].startDate.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Date de fin</label>
            <input className={styles.input} type="date" {...register(`educations.${index}.endDate`)} />
          </div>

          <button
            type="button"
            onClick={() => removeEducation(index)}
            className={styles.removeBtn}
          >
            Supprimer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => appendEducation({ id: Date.now(), institution: '', degree: '', startDate: '', endDate: '' })}
        className={styles.addBtn}
      >
        Ajouter une formation
      </button>

      {/* ===== COMPÉTENCES ===== */}
      <h2 className={styles.title}>Compétences</h2>
      <div className={styles.skillsContainer}>
        {skillFields.map((field, index) => (
          <div key={field.id} className={styles.skillItem}>
            <input
              className={`${styles.input} ${styles.skillInput}`}
              {...register(`skills.${index}`)}
              placeholder="Ex: JavaScript"
            />
            {errors.skills?.[index] && <p className={styles.error}>{errors.skills[index].message}</p>}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className={styles.removeSkillBtn}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => appendSkill('')}
        className={styles.addBtn}
      >
        Ajouter une compétence
      </button>

      {/* ===== BOUTON DE SOUMISSION ===== */}
      <div className={styles.submitContainer}>
        <button
          type="submit"
          className={styles.submitBtn}
        >
          {cv ? 'Mettre à jour le CV' : 'Créer le CV'}
        </button>
      </div>
    </form>
  );
}
