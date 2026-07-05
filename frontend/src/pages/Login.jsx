import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sun, Moon, Phone, User, Mail, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, UserPlus } from "lucide-react";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme, setUser } = useApp();
  const dark = theme === "dark";



  const [loginEmail, setLoginEmail] = useState("");

  const [loading, setLoading] = useState(false);


  const canSend = loginEmail.trim() !== "";

  const handleLogin = async () => {

    if (!loginEmail) {
      alert("Enter Email");
      return;
    }

    try {

      setLoading(true);

      // 1. Check User
      const check = await axios.post(
        "http://localhost:5000/api/auth/check-user",
        {
          email: loginEmail
        }
      );

      console.log(check.data);

      // 2. Send OTP
      await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: loginEmail
        }
      );
      console.log("OTP SENT");

      localStorage.setItem(
        "loginEmail",
        loginEmail
      );

      localStorage.setItem("authMode", "signin");
      navigate("/otp-method");

    } catch (err) {

      console.log(err);

      alert(err.response?.data?.message || "User not found");

    } finally {

      setLoading(false);

    }

  };



  const floatVariants = {
    animate: (i) => ({
      y: [0, -18, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
      transition: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
    }),
  };

  const orbSizes = [200, 140, 180, 120];
  const orbColors = ["#7c3aed", "#6366f1", "#3b82f6", "#a855f7"];
  const orbTops = ["5%", "60%", "20%", "75%"];
  const orbLefts = ["-5%", "70%", "60%", "-8%"];

  return (
    <div
      className={`login-root ${dark ? "login-root--dark" : "login-root--light"}`}
      style={{
        background: dark
          ? "linear-gradient(135deg,#1a0533 0%,#2d0f5a 50%,#0f1a3d 100%)"
          : "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#e0f2fe 100%)",
      }}
    >
      {/* Floating orbs */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={floatVariants}
          animate="animate"
          className={`login-orb ${dark ? "login-orb--dark" : "login-orb--light"}`}
          style={{
            width: orbSizes[i],
            height: orbSizes[i],
            background: orbColors[i],
            top: orbTops[i],
            left: orbLefts[i],
          }}
        />
      ))}

      {/* Top bar */}
      <div className="login-topbar">
        <div className="login-topbar__brand">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="login-topbar__icon">


            <Shield className="login-topbar__shield" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`login-topbar__name ${dark ? "login-topbar__name--dark" : "login-topbar__name--light"}`}>
            HerShield
          </motion.span>
        </div>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`login-topbar__theme-btn ${dark ? "login-topbar__theme-btn--dark" : "login-topbar__theme-btn--light"}`}
        >
          <AnimatePresence mode="wait">
            {dark ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <Sun className="login-topbar__sun" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Moon className="login-topbar__moon" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Card */}
      <div className="login-card-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
          className={`login-card ${dark ? "login-card--dark" : "login-card--light"}`}
        >
          {/* Card header */}
          <div className="login-card__header">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.2 }}
              className="login-card__header-icon"
            >
              <img
                src="/logo1.jpg"
                alt="logo"
                className="login-logo"
              />
            </motion.div>
            <h1 className={`login-card__title ${dark ? "login-card__title--dark" : "login-card__title--light"}`}>
              Welcome Back
            </h1>

            <p className={`login-card__subtitle ${dark ? "login-card__subtitle--dark" : "login-card__subtitle--light"}`}>
              Login with your registered email
            </p>
          </div>

          {/* Sign In / Sign Up Switch */}


          {/* Fields */}
          <motion.div
            className="login-card__fields"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >


            {/* Email */}
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <label className={`login-label ${dark ? "login-label--dark" : "login-label--light"}`}>
                Email{" "}
                <span className={dark ? "login-label__optional--dark" : "login-label__optional--light"}>

                </span>
              </label>
              <div className="login-input-wrap">
                <Mail className={`login-input-icon ${dark ? "login-input-icon--dark" : "login-input-icon--light"}`} />
                <input
                  type="email"
                  value={loginEmail}

                  onChange={(e) => setLoginEmail(e.target.value)}

                  placeholder="you@email.com"
                  className={`login-input ${dark ? "login-input--dark" : "login-input--light"}`}
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="login-submit-wrap"
            >
              <motion.button
                onClick={handleLogin}
                disabled={!canSend}
                whileHover={canSend ? { scale: 1.02 } : {}}
                whileTap={canSend ? { scale: 0.97 } : {}}
                className={`login-submit ${canSend
                  ? "login-submit--active"
                  : dark
                    ? "login-submit--disabled-dark"
                    : "login-submit--disabled-light"
                  }`}
              >
                {loading ? "Please Wait..." : "Login"}



                <ArrowRight className="login-submit__icon" />
              </motion.button>

              <p style={{ textAlign: "center", marginTop: "15px" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  style={{
                    color: "#7c3aed",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Sign Up
                </span>
              </p>

            </motion.div>
          </motion.div>

          <p className={`login-card__terms ${dark ? "login-card__terms--dark" : "login-card__terms--light"}`}>
            By continuing, you agree to our{" "}
            <span className="login-card__terms-link">Terms of Service</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
