import { useState, useEffect } from "react";
import axios from "axios";
import { Flag, Star } from "lucide-react";
import { AREA_TAGS } from "./areaTags";
import "./FeedbackTab.css";

export default function FeedbackTab({ dark }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ area: "", tag: "safe", rating: 5, comment: "" });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [filterTag, setFilterTag] = useState("all");

  const cardCls = dark ? "card card-dark" : "card card-light";
  const inputCls = dark ? "form-input input-dark" : "form-input input-light";

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("https://hershield-f3bj.onrender.com/api/feedback");
      const formatted = res.data.map(f => ({
        id: f.id,
        area: f.area_name,
        tag: f.tag,
        rating: f.rating,
        comment: f.review,
      }));
      setFeedbacks(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const addFeedback = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!feedbackForm.area) return;
    try {
      await axios.post("https://hershield-f3bj.onrender.com/api/feedback", {
        user_id: user.id,
        area_name: feedbackForm.area,
        tag: feedbackForm.tag,
        rating: feedbackForm.rating,
        review: feedbackForm.comment,
      });
      fetchFeedbacks();
      setFeedbackForm({ area: "", tag: "safe", rating: 5, comment: "" });
      setShowFeedbackForm(false);
    } catch (err) {
      console.log(err);
      alert("Error saving feedback");
    }
  };

  const filteredFeedbacks = filterTag === "all" ? feedbacks : feedbacks.filter(f => f.tag === filterTag);

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>
          Community Safety
        </h2>
        <button onClick={() => setShowFeedbackForm(!showFeedbackForm)} className="action-btn">
          <Flag size={14} /> Report
        </button>
      </div>

      <div className="filter-bar">
        {["all", ...AREA_TAGS.map(t => t.id)].map(t => {
          const tag = AREA_TAGS.find(x => x.id === t);
          return (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className="filter-btn"
              style={{
                background: filterTag === t ? "#8b5cf6" : dark ? "rgba(255,255,255,0.1)" : "#f5f3ff",
                color: filterTag === t ? "white" : dark ? "#cbd5e1" : "#7c3aed",
              }}
            >
              {tag ? `${tag.icon} ${tag.label}` : "All Areas"}
            </button>
          );
        })}
      </div>

      {showFeedbackForm && (
        <div className={`${cardCls} add-contact-form`}>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>
            Report an Area
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Area name / location"
              value={feedbackForm.area}
              onChange={e => setFeedbackForm(p => ({ ...p, area: e.target.value }))}
              className={inputCls}
            />
            <div>
              <p style={{ fontSize: "0.75rem", color: dark ? "#94a3b8" : "#64748b", marginBottom: "0.5rem" }}>
                Tag this area:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {AREA_TAGS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFeedbackForm(p => ({ ...p, tag: t.id }))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      border:
                        feedbackForm.tag === t.id
                          ? "none"
                          : `1px solid ${dark ? "rgba(255,255,255,0.2)" : "#e2e8f0"}`,
                      background:
                        feedbackForm.tag === t.id ? t.hex : dark ? "rgba(255,255,255,0.1)" : "white",
                      color: feedbackForm.tag === t.id ? "white" : dark ? "#cbd5e1" : "#475569",
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: dark ? "#94a3b8" : "#64748b", marginBottom: "0.5rem" }}>
                Safety Rating:
              </p>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setFeedbackForm(p => ({ ...p, rating: n }))}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                  >
                    <Star
                      size={24}
                      style={{
                        fill: n <= feedbackForm.rating ? "#fbbf24" : "none",
                        color:
                          n <= feedbackForm.rating
                            ? "#fbbf24"
                            : dark ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Short review (optional)"
              value={feedbackForm.comment}
              onChange={e => setFeedbackForm(p => ({ ...p, comment: e.target.value }))}
              className={inputCls}
            />
            <div className="form-actions">
              <button
                onClick={() => setShowFeedbackForm(false)}
                className={dark ? "form-cancel-dark" : "form-cancel-light"}
              >
                Cancel
              </button>
              <button onClick={addFeedback} className="form-submit">Submit</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredFeedbacks.map(f => {
          const tag = AREA_TAGS.find(t => t.id === f.tag);
          return (
            <div key={f.id} className={cardCls}>
              <div className="feedback-card-inner">
                <div className="feedback-tag-icon" style={{ background: tag?.hex || "#6b7280" }}>
                  {tag?.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>{f.area}</p>
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star
                          key={n}
                          size={12}
                          style={{
                            fill: n <= f.rating ? "#fbbf24" : "none",
                            color: n <= f.rating ? "#fbbf24" : "#cbd5e1",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="tag-pill" style={{ background: tag?.hex || "#6b7280" }}>{tag?.label}</span>
                  {f.comment && (
                    <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b", marginTop: "0.25rem" }}>
                      {f.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredFeedbacks.length === 0 && (
          <div className={`${cardCls} empty-state`}>
            <div className="empty-icon">📍</div>
            <p style={{ fontSize: "0.875rem", color: dark ? "#94a3b8" : "#64748b" }}>
              No reports for this tag yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
