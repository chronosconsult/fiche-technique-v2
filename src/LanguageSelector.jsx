// LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="text-sm">
      <select
        onChange={handleChange}
        value={i18n.language}
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}
