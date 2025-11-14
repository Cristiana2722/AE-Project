import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import UserForm from '../components/UserForm';
import { getUserById, updateUser } from '../api/user.routes';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        
        if (response?.success || response?.data) {
          setUser(response.data || response);
        } else {
          setError(response?.message || 'Failed to load user');
          toast.error('Failed to load user');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the user');
        toast.error('An error occurred while fetching the user');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const response = await updateUser(id, formData);

      if (response?.success) {
        toast.success('User updated successfully!');
        navigate(`/users/${id}`);
      } else {
        toast.error(response?.message || 'Failed to update user');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while updating the user');
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !user) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return <UserForm user={user} onSubmit={handleSubmit} isLoading={loading} />;
}
