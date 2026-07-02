import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import InputField from '../../components/InputField';
import ImageUpload from '../../components/admin/ImageUpload';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  createCategory,
  getCategory,
  updateCategory,
} from '../../api/categoryApi';

function AdminCategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [pageLoading, setPageLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      try {
        const { data } = await getCategory(id);
        const category = data.data.category;
        reset({ name: category.name, description: category.description || '' });
        setExistingImage(category.image);
      } catch {
        toast.error('Category not found');
        navigate('/admin/categories');
      } finally {
        setPageLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (formData) => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description || '');
    if (imageFile) payload.append('image', imageFile);

    try {
      if (isEdit) {
        await updateCategory(id, payload);
        toast.success('Category updated');
      } else {
        await createCategory(payload);
        toast.success('Category created');
      }
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title={isEdit ? 'Edit Category' : 'Add Category'} />
      <div className="flex-1 overflow-auto p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-xl space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <InputField
            label="Category Name"
            error={errors.name}
            {...register('name', { required: 'Name is required' })}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('description')}
            />
          </div>

          <ImageUpload
            label="Category Image"
            existingImage={existingImage}
            onChange={setImageFile}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminCategoryForm;
