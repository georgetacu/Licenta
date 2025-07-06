import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function OwnerApprovals() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReject = (id) => {
  axios
    .post("http://localhost/Licenta/backend/rejectOwner.php", { id })
    .then(() => {
      toast.success("Cont respins.");
      fetchOwners();
    })
    .catch(() => toast.error("Eroare la respingere."));
};


  useEffect(() => {
    fetchPendingOwners();
  }, []);

  const fetchPendingOwners = async () => {
    try {
      const res = await axios.get("http://localhost/Licenta/backend/getPendingOwner.php");
      setOwners(res.data.owners);
    } catch (err) {
      toast.error("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, approve) => {
    try {
      await axios.post("http://localhost/Licenta/backend/approveOwner.php", {
        id,
        approve,
      });
      toast.success(`User ${approve ? "approved" : "rejected"} successfully.`);
      setOwners(owners.filter((owner) => owner.id !== id));
    } catch (err) {
      toast.error("Error updating user.");
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <div className="container mt-4">
      <h2>Cereri de inregistrare conturi de Detinatori</h2>
      {owners.length === 0 ? (
        <p>No pending accounts.</p>
      ) : (
        owners.map((owner) => (
          <Card key={owner.id} className="mb-3">
            <Card.Body>
              <Card.Title>{owner.first_name} {owner.last_name}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {owner.email} <br />
                <strong>Phone:</strong> {owner.mobile}
              </Card.Text>
              <Button variant="success" onClick={() => handleAction(owner.id, true)} className="me-2">
                Approve
              </Button>
              <Button
              variant="danger"
              onClick={() => handleReject(owner.id)}
              className="ms-2">Reject
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}
