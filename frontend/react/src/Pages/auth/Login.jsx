import "./login.css";
import { useState } from "react";

export default function LoginRegister() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="section">
      <div className="container">
        <div className="full-height">
          <div className="center">
            
            <h6>
              <span>Log In </span>
              <span>Sign Up</span>
            </h6>

            {/* SWITCH */}
            <input
              type="checkbox"
              id="reg-log"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="reg-log"></label>

            <div className={`card-3d-wrap ${isChecked ? "active" : ""}`}>
              <div className="card-3d-wrapper">

                {/* LOGIN */}
                <div className="card-front">
                  <div className="center-wrap">
                    <h4>Log In</h4>

                    <div className="form-group">
                      <input type="email" placeholder="Email" />
                    </div>

                    <div className="form-group">
                      <input type="password" placeholder="Password" />
                    </div>

                    <button className="btn">Login</button>
                  </div>
                </div>

                {/* REGISTER */}
                <div className="card-back">
                  <div className="center-wrap">
                    <h4>Sign Up</h4>

                    <div className="form-group">
                      <input type="text" placeholder="Full Name" />
                    </div>

                    <div className="form-group">
                      <input type="tel" placeholder="Phone Number" />
                    </div>

                    <div className="form-group">
                      <input type="email" placeholder="Email" />
                    </div>

                    <div className="form-group">
                      <input type="password" placeholder="Password" />
                    </div>

                    <button className="btn">Register</button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
