import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyReviews({ user }) {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filterService, setFilterService] = useState("");

  useEffect(() => {
    if (!user) return;

    axios.post("http://localhost/Licenta/backend/getUserReviews.php", {
      user_id: user.id,
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    })
    .catch(err => {
      console.error("Eroare la incarcarea recenziilor", err);
    });
  }, [user]);
  const filteredReviews = reviews.filter((review) => {
  const matchRating = filterRating === "all" || String(review.rating) === filterRating;
  const matchDate =
    !filterDate ||
    new Date(review.appointment_datetime).toISOString().slice(0, 10) === filterDate;
  const matchService =
    !filterService ||
    review.auto_service_name?.toLowerCase().includes(filterService.toLowerCase());

  return matchRating && matchDate && matchService;
});


  return (
    <div className="container py-5">
      <h3 className="mb-4">Comentariile mele</h3>
      <div className="row mb-4">
  <div className="col-md-4">
    <label className="form-label">Filtrare dupa rating</label>
    <select
      className="form-select"
      value={filterRating}
      onChange={(e) => setFilterRating(e.target.value)}
    >
      <option value="all">Toate</option>
      {[5, 4, 3, 2, 1].map((r) => (
        <option key={r} value={r}>{r} ste{r === 1 ? "a" : "le"}</option>
      ))}
    </select>
  </div>
  <div className="col-md-4">
    <label className="form-label">Filtrare dupa data programarii</label>
    <input
      type="date"
      className="form-control"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
  </div>
  <div className="col-md-4">
    <label className="form-label">Filtrare dupa service auto</label>
    <input
      type="text"
      className="form-control"
      placeholder="Ex: AutoMax"
      value={filterService}
      onChange={(e) => setFilterService(e.target.value)}
    />
  </div>
</div>

      {reviews.length === 0 ? (
        <div className="alert alert-info text-center">
          Nu ai nicio recenzie scrisa.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredReviews.map((review) => (
            <div key={review.id} className="card shadow-sm w-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">Rating: {review.rating} / 5</h5>
                <p className="card-text mb-2">{review.comment || "Fara comentariu"}</p>
                <p className="mb-1"><strong>Service Auto:</strong> {review.auto_service_name || "Nespecificat"}</p>
                <p className="text-muted small mb-0 mt-auto">
                  Programare la: {new Date(review.appointment_datetime).toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};