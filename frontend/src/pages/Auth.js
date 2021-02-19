import { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import Spinner from "../components/UI/Spinner";
import useModal from "../hooks/useModal";
import validateForm from "../utils/validateForm";
import useForm from "../hooks/useForm";
import "../hooks/useForm.css";
const Auth = ({ view, inModal, closeModal, user, afterConfirm }) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();
  const history = useHistory();
  const [modal, showModal] = useModal({
    withBackdrop: false,
    useTimer: true,
    inPlace: inModal ? true : false,
  });

  const onSubmit = (e) => {
    sendRequest(
      view === "login" || view === "confirm"
        ? "api/auth/login"
        : "api/auth/signup",
      "post",
      formData
    );
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(onSubmit);

  useEffect(() => {
    if (view === "login") {
      setFormData({ login: "", password: "" });
    } else if (view === "signup") {
      setFormData({
        email: "",
        password: "",
        confirm_pass: "",
        username: "",
        first_name: "",
        state: "",
        city: "",
      });
    } else if (view === "confirm") {
      setFormData({ login: user, password: "" });
    }
  }, [view]);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token && !inModal) {
      history.push("/profile");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      if (afterConfirm) {
        afterConfirm();
      }
      if (closeModal) {
        closeModal();
      } else {
        history.push("/profile");
      }
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      showModal(error, "mdl-error");
    } else if (data && data.msg) {
      showModal(data.msg, "mdl-ok");
    }
  }, [error, errorNum, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {modal}
      {isLoading && <Spinner />}
      {view === "login" && <h1>Login</h1>}
      {view === "signup" && <h1>Sign Up</h1>}
      {view === "confirm" && <h1>Confirm identity</h1>}

      <form onSubmit={handleSubmit}>
        {view === "login" && (
          <>
            <input
              key="1"
              type="text"
              placeholder="Email/Username"
              name="login"
              onChange={handleInputChange}
              value={formData.login}
            />
            <div className="form-danger">
              {formErrors.login && formErrors.login}
            </div>
          </>
        )}

        {view === "signup" && (
          <>
            <input
              key="2"
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
            <div className="form-danger">
              {formErrors.username && formErrors.username}
            </div>
          </>
        )}

        {view === "signup" && (
          <>
            <input
              key="3"
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
            <div className="form-danger">
              {formErrors.email && formErrors.email}
            </div>
          </>
        )}

        {view === "confirm" && <p>{formData.login}</p>}
        <>
          <input
            key="4"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
          />
          <div className="form-danger">
            {formErrors.password && formErrors.password}
          </div>
        </>
        {view === "signup" && (
          <>
            <input
              key="15"
              type="password"
              placeholder="Confirm password"
              name="confirm_pass"
              onChange={handleInputChange}
              value={formData.confirm_pass}
            />
            <div className="form-danger">
              {formErrors.confirm_pass && formErrors.confirm_pass}
            </div>
            <input
              key="5"
              type="text"
              placeholder="First Name"
              name="first_name"
              onChange={handleInputChange}
              value={formData.first_name}
            />
            <div className="form-danger">
              {formErrors.first_name && formErrors.first_name}
            </div>
            <input
              key="6"
              type="text"
              placeholder="State"
              name="state"
              onChange={handleInputChange}
              value={formData.state}
            />
            <div className="form-danger">
              {formErrors.state && formErrors.state}
            </div>
            <input
              key="7"
              type="text"
              placeholder="City"
              name="city"
              onChange={handleInputChange}
              value={formData.city}
            />
            <div className="form-danger">
              {formErrors.city && formErrors.city}
            </div>
          </>
        )}
        <input key="8" type="submit" disabled={isLoading} />
      </form>

      {inModal ? null : view === "login" ? (
        <Link to="/signup">Sign Up</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default Auth;
