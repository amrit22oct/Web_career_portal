import { useState, useEffect } from 'react';
import API from '../services/api';

const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NEW: handle fetch errors

  useEffect(() => {
    let isMounted = true; // NEW: cleanup trick

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found.');
        }

        const { data } = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isMounted) {
          setError(err.response ? err.response.data : err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false; // Clean up
    };
  }, []);

  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found.');
      }

      const { data } = await API.put('/auth/profile', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: err.response ? err.response.data : err.message };
    }
  };

  return { profile, loading, error, updateProfile };
};

export default useUserProfile;
