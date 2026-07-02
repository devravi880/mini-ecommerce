import { useEffect, useState } from 'react';
import getImageUrl from '../../utils/getImageUrl';

function ImageUpload({ label, existingImage, onChange }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(existingImage ? getImageUrl(existingImage) : null);
  }, [existingImage]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    onChange(file || null);

    if (file) {
      setPreview(URL.createObjectURL(file));
      return;
    }

    setPreview(existingImage ? getImageUrl(existingImage) : null);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 h-32 w-32 rounded-lg border object-cover"
        />
      )}
    </div>
  );
}

export default ImageUpload;
