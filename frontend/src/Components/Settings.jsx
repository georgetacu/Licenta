import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/Licenta/backend/getAllUsers.php');
        const data = await response.json();

        const emailToSearch = user?.email || 'a@a.ro';

        const currentUser = data.users.find(u => u.email === emailToSearch);
        if (currentUser) {
          setFormData({
            firstName: currentUser.first_name || '',
            lastName: currentUser.last_name || '',
            email: currentUser.email || '',
            phone: currentUser.mobile || '',
          });
        }
      } catch (error) {
        console.error('Eroare la preluarea datelor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/Licenta/backend/updateUser.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Datele au fost actualizate cu succes!');
      } else {
        toast.error('Eroare la actualizare: ' + (result.error || ''));
      }
    } catch (error) {
      console.error('Eroare la trimiterea datelor:', error);
      toast.error('Eroare la trimiterea datelor.');
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Parolele nu coincid.');
      return;
    }

    try {
      const response = await fetch('http://localhost/Licenta/backend/resetPassword.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Parola a fost schimbata cu succes!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Eroare: ' + (result.error || ''));
      }
    } catch (error) {
      console.error('Eroare la resetare parola:', error);
      toast.error('Eroare la resetare parola.');
    }
  };

  if (loading) return <div className="container py-5">Se incarca...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 fw-bold text-primary">Setari cont</h2>

      <form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm bg-light mb-4">
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">Prenume</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Nume</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="form-label">Telefon</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <i className="bi bi-save me-2"></i>Actualizeaza
        </button>
      </form>

      {/* Resetare parola */}
      <form onSubmit={handlePasswordSubmit} className="border rounded p-4 shadow-sm bg-light">
        <h5 className="mb-3 text-primary">Schimba parola</h5>

        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">Parola curenta</label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Parola noua</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirma parola noua</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-secondary w-100">
          <i className="bi bi-key me-2"></i>Schimba parola
        </button>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Settings;
