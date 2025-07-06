import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f', '#a4de6c', '#d0ed57', '#8dd1e1'];
const statusColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f'];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ownersServices, setOwnersServices] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
    fetchOwnersServices();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost/Licenta/backend/getAllUsers.php');
      if (res.data && res.data.users) setUsers(res.data.users);
    } catch (err) {
      console.error('Eroare la incarcare utilizatori', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost/Licenta/backend/getAllAppointments.php');
      if (res.data && res.data.appointments) setAppointments(res.data.appointments);
    } catch (err) {
      console.error('Eroare la incarcare programari', err);
    }
  };

  const fetchOwnersServices = async () => {
    try {
      const res = await axios.get('http://localhost/Licenta/backend/getOwnersServicesCount.php');
      if (res.data && res.data.ownersServices) setOwnersServices(res.data.ownersServices);
    } catch (err) {
      console.error('Eroare la incarcare servicii detinatori', err);
    }
  };

  const totalUsers = users.length;
  const userTypeCounts = { Utilizatori: 0, Detinatori: 0, Admini: 0 };

  users.forEach(u => {
    const type = parseInt(u.type);
    if (type === 1) userTypeCounts.Utilizatori++;
    else if (type === 2) userTypeCounts.Detinatori++;
    else if (type === 3) userTypeCounts.Admini++;
  });

  const userTypeData = Object.entries(userTypeCounts).map(([name, count]) => ({
    name,
    value: totalUsers ? parseFloat(((count / totalUsers) * 100).toFixed(1)) : 0,
  }));

  const totalAppointments = appointments.length;
  const appointmentStatusCounts = {
    'In asteptare': 0,
    'Acceptata': 0,
    'Refuzata': 0,
    'Finalizata': 0,
  };

  appointments.forEach(p => {
    const statusCode = parseInt(p.status);
    switch (statusCode) {
      case 0:
        appointmentStatusCounts['In asteptare']++;
        break;
      case 1:
        appointmentStatusCounts['Acceptata']++;
        break;
      case 2:
        appointmentStatusCounts['Refuzata']++;
        break;
      case 3:
        appointmentStatusCounts['Finalizata']++;
        break;
      default:
        break;
    }
  });

  const appointmentStatusData = Object.entries(appointmentStatusCounts).map(([name, count]) => ({
    name,
    value: totalAppointments ? parseFloat(((count / totalAppointments) * 100).toFixed(1)) : 0,
  }));

  const filteredOwnersServices = ownersServices.filter(os => Number(os.service_count) > 0);

  const totalServices = filteredOwnersServices.reduce(
    (sum, owner) => sum + Number(owner.service_count),
    0
  );

  const ownersServicesData = filteredOwnersServices.map(owner => ({
    name: `${owner.first_name} ${owner.last_name}`,
    value: totalServices ? parseFloat(((Number(owner.service_count) / totalServices) * 100).toFixed(1)) : 0,
    rawCount: Number(owner.service_count),
  }));

  const renderLabelWithPercent = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};
  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-primary">Dashboard Admin</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">Distributie utilizatori</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={renderLabelWithPercent}
                  labelLine={false}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-user-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">Status programari</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={renderLabelWithPercent}
                  labelLine={false}
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-app-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">Service-uri auto per detinator</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ownersServicesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={renderLabelWithPercent}
                  labelLine={false}
                >
                  {ownersServicesData.map((entry, index) => (
                    <Cell key={`cell-owner-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
