import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import InputField from '../../components/InputField';
import ImageUpload from '../../components/admin/ImageUpload';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getCategories } from '../../api/categoryApi';
import { createProduct, getProduct, updateProduct } from '../../api/productApi';

function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data.data.categories);

        if (isEdit) {
          const { data } = await getProduct(id);
          const product = data.data.product;
          reset({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
          });
          setExistingImage(product.image);
        }
      } catch {
        toast.error('Failed to load form data');
        navigate('/admin/products');
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, navigate, reset]);

  const onSubmit = async (formData) => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    if (imageFile) payload.append('image', imageFile);

    try {
      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
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
      <AdminHeader title={isEdit ? 'Edit Product' : 'Add Product'} />
      <div className="flex-1 overflow-auto p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-xl space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <InputField
            label="Product Name"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Price (₹)"
              type="number"
              step="0.01"
              error={errors.price}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
            />
            <InputField
              label="Stock"
              type="number"
              error={errors.stock}
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' },
              })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('categoryId', { required: 'Category is required' })}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <ImageUpload
            label="Product Image"
            existingImage={existingImage}
            onChange={setImageFile}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
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

export default AdminProductForm;
