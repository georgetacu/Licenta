import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Accounts() {
  const [users, setUsers] = useState([]);


  const fetchUsers = () => {
    axios
      .get("http://localhost/Licenta/backend/getAllUsers.php")
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Eroare la incarcarea conturilor"));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = (id, newStatus) => {
    axios
      .post("http://localhost/Licenta/backend/toggleUserStatus.php", {
        id,
        status: newStatus,
      })
      .then(() => {
        toast.success("Status actualizat cu succes");
        fetchUsers();
      })
      .catch(() => toast.error("Eroare la actualizarea statusului"));
  };

  return (
    <Container className="mt-5">
      <h2>Administrare Conturi</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Tip</th>
            <th>Status</th>
            <th>Actiuni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                {user.type === "1"
                  ? "Utilizator"
                  : user.type === "2"
                  ? "Detinator"
                  : "Admin"}
              </td>
              <td>
                {user.status === "0"
                  ? "Dezactivat"
                  : user.status === "1"
                  ? "Activ"
                  : "In asteptare"}
              </td>
              <td>
                {user.status === "0" ? (
                  <Button
                    variant="success"
                    onClick={() => toggleStatus(user.id, 1)}
                  >
                    Reactiveaza
                  </Button>
                ) : user.status === "1" ? (
                  <Button
                    variant="danger"
                    onClick={() => toggleStatus(user.id, 0)}
                  >
                    Dezactiveaza
                  </Button>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
