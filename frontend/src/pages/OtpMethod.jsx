import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Shield, Sun, Moon, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import "./OtpMethod.css";

const METHODS = [
  { id: "email", icon: "📩", label: "Email OTP", desc: "Receive code via Email" },
];

export default function OtpMethod() {
  const navigate = useNavigate();
  const { theme, toggleTheme, otpMethod, setOtpMethod, user } = useApp();
  const loginEmail = localStorage.getItem("loginEmail");
  const dark = theme === "dark";

  const handleContinue = async () => {
    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: user?.email || loginEmail
        }
      );

      console.log(response.data);

      navigate("/otp-verify");

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "OTP Send Failed"
      );
    }
  };

  const getMethodCardClass = (m) => {
    const selected = otpMethod === m.id;
    if (dark) return selected ? "otp-method-card otp-method-card--selected-dark" : "otp-method-card otp-method-card--default-dark";
    return selected ? "otp-method-card otp-method-card--selected-light" : "otp-method-card otp-method-card--default-light";
  };

  return (
    <div
      className={`otp-root ${dark ? "otp-root--dark" : "otp-root--light"}`}
      style={{
        background: dark
          ? "linear-gradient(135deg,#1a0533 0%,#2d0f5a 50%,#0f1a3d 100%)"
          : "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0f2fe 100%)",
      }}
    >
      {/* Orbs */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className={`otp-orb ${dark ? "otp-orb--dark" : "otp-orb--light"}`}
          style={{
            background: i === 0 ? "#7c3aed" : "#3b82f6",
            top: i === 0 ? "-10%" : "60%",
            left: i === 0 ? "-10%" : "60%",
          }}
        />
      ))}

      {/* Top Bar */}
      <div className="otp-topbar">
        <div className="otp-topbar__left">
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`otp-topbar__back-btn ${dark ? "otp-topbar__back-btn--dark" : "otp-topbar__back-btn--light"}`}
          >
            <ArrowLeft className={`otp-topbar__back-icon ${dark ? "otp-topbar__back-icon--dark" : "otp-topbar__back-icon--light"}`} />
          </motion.button>

          <div className="otp-topbar__brand-icon">
            <Shield className="otp-topbar__shield" />
          </div>

          <span className={`otp-topbar__name ${dark ? "otp-topbar__name--dark" : "otp-topbar__name--light"}`}>
            HerShield
          </span>
        </div>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`otp-topbar__theme-btn ${dark ? "otp-topbar__theme-btn--dark" : "otp-topbar__theme-btn--light"}`}
        >
          {dark
            ? <Sun className="otp-topbar__sun" />
            : <Moon className="otp-topbar__moon" />
          }
        </motion.button>
      </div>

      {/* Card */}
      <div className="otp-card-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className={`otp-card ${dark ? "otp-card--dark" : "otp-card--light"}`}
        >
          {/* Header */}
          <div className="otp-card__header">
            <div className="otp-card__header-icon">📲</div>
            <h1 className={`otp-card__title ${dark ? "otp-card__title--dark" : "otp-card__title--light"}`}>
              Choose OTP Method
            </h1>
            <p className={`otp-card__subtitle ${dark ? "otp-card__subtitle--dark" : "otp-card__subtitle--light"}`}>
              Sending OTP to{" "}
              <span className="otp-card__phone">
                {user?.email || loginEmail}
              </span>
            </p>
          </div>

          {/* Method list */}
          <div className="otp-methods">
            {METHODS.map((m, i) => (
              <motion.button
                key={m.id}
                onClick={() => setOtpMethod(m.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={getMethodCardClass(m)}
              >
                <span className="otp-method-card__icon">{m.icon}</span>
                <div className="otp-method-card__text">
                  <p className={`otp-method-card__label ${dark ? "otp-method-card__label--dark" : "otp-method-card__label--light"}`}>
                    {m.label}
                  </p>
                  <p className={`otp-method-card__desc ${dark ? "otp-method-card__desc--dark" : "otp-method-card__desc--light"}`}>
                    {m.desc}
                  </p>
                </div>
                <div className={`otp-method-card__radio ${otpMethod === m.id
                    ? "otp-method-card__radio--selected"
                    : dark
                      ? "otp-method-card__radio--dark"
                      : "otp-method-card__radio--light"
                  }`}>
                  {otpMethod === m.id && <div className="otp-method-card__radio-dot" />}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Continue button */}
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="otp-submit"
          >
            Continue <ArrowRight className="otp-submit__icon" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}