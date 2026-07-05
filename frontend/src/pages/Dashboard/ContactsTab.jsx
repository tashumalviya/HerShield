import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Phone, Trash2 } from "lucide-react";
import "./ContactsTab.css";

export default function ContactsTab({ dark, contacts, setContacts }) {
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", relation: "" });
  const [showAddContact, setShowAddContact] = useState(false);

  const cardCls = dark ? "card card-dark" : "card card-light";
  const inputCls = dark ? "form-input input-dark" : "form-input input-light";

  const fetchContacts = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      const res = await axios.get(`https://hershield-f3bj.onrender.com/api/contacts/${user.id}`);
      const formatted = res.data.map(c => ({
        id: c.id,
        name: c.contact_name,
        phone: c.contact_phone,
        email: c.contact_email,
        relation: c.relationship,
      }));
      setContacts(formatted);
    } catch (err) {
      console.log("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addContact = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!newContact.name || !newContact.phone || !newContact.email)
      return alert("Please fill all fields");
    try {
      await axios.post("https://hershield-f3bj.onrender.com/api/contacts", {
        user_id: user.id,
        contact_name: newContact.name,
        contact_phone: newContact.phone,
        contact_email: newContact.email,
        relationship: newContact.relation,
      });
      fetchContacts();
      setNewContact({ name: "", phone: "", email: "", relation: "" });
      setShowAddContact(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>
          Emergency Contacts
        </h2>
        <button onClick={() => setShowAddContact(!showAddContact)} className="action-btn">
          <Plus size={14} /> Add
        </button>
      </div>

      {showAddContact && (
        <div className={`${cardCls} add-contact-form`}>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>
            Add Emergency Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { key: "name", ph: "Name", icon: "👤", type: "text" },
              { key: "phone", ph: "Phone Number", icon: "📱", type: "text" },
              { key: "email", ph: "Email Address", icon: "📧", type: "email" },
              { key: "relation", ph: "Relation (e.g. Mom)", icon: "💝", type: "text" },
            ].map(f => (
              <div key={f.key} className="input-wrap">
                <span className="input-icon">{f.icon}</span>
                <input
                  type={f.type}
                  placeholder={f.ph}
                  value={newContact[f.key]}
                  onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                  className={inputCls}
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            ))}
            <div className="form-actions">
              <button onClick={() => setShowAddContact(false)} className={dark ? "form-cancel-dark" : "form-cancel-light"}>
                Cancel
              </button>
              <button onClick={addContact} className="form-submit">Save</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {contacts.map(c => (
          <div key={c.id} className={`${cardCls} contact-card`}>
            <div className="contact-avatar">{c.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>{c.name}</p>
              <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>
                {c.relation} • {c.phone}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a href={`tel:${c.phone}`}>
                <div className="call-btn">
                  <Phone size={14} color="white" />
                </div>
              </a>
              <button
                onClick={() => setContacts(list => list.filter(x => x.id !== c.id))}
                className={`delete-btn ${dark ? "delete-btn-dark" : "delete-btn-light"}`}
              >
                <Trash2 size={14} color="#f87171" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b", marginBottom: "0.75rem" }}>
          National Emergency Numbers
        </p>
        {[
          { name: "Police", num: "100", icon: "👮", bg: "#3b82f6" },
          { name: "Women Helpline", num: "1091", icon: "🌸", bg: "#ec4899" },
          { name: "Ambulance", num: "108", icon: "🚑", bg: "#ef4444" },
          { name: "National Emergency", num: "112", icon: "🚨", bg: "#f97316" },
        ].map(e => (
          <div
            key={e.name}
            className="emergency-row"
            style={{ background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc" }}
          >
            <div className="emergency-icon" style={{ background: e.bg }}>{e.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{e.name}</p>
              <p style={{ fontSize: "0.75rem", color: "#8b5cf6", fontWeight: 700 }}>{e.num}</p>
            </div>
            <a href={`tel:${e.num}`} className="call-pill">Call</a>
          </div>
        ))}
      </div>
    </div>
  );
}
