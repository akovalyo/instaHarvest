import { useEffect, useContext } from "react";
import { useRequest, useForm } from "../hooks/hooks";
import formValidation from "../form_validation/validateAuth";
import { useHistory } from "react-router-dom";
import Spinner from "../components/UI/Spinner";
import { ModalMsgContext } from "../context/ModalMsgContext";

const ResetPassword = (props) => {
  const history = useHistory();
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  const [msgState, setMsgState] = useContext(ModalMsgContext);

  const onSubmit = () => {
    if (props.reset) {
      console.log("ONSUBMIT SENT RESET");
      sendRequest("/api/auth/reset_password", "POST", {
        email: formData.email,
      });
    } else {
      sendRequest("/api/auth/reset_password_confirm", "POST", {
        password: formData.password,
        token: props.match.params.token,
      });
    }
  };

  const [
    setFormData,
    handleSubmit,
    handleInputChange,
    formData,
    formErrors,
  ] = useForm(
    props.reset ? { email: "" } : { password: "", confirm_pass: "" },
    onSubmit,
    formValidation
  );

  useEffect(() => {
    if (error) {
      setMsgState({
        open: true,
        msg: error,
        classes: "mdl-error",
      });
    } else if (data && data.msg) {
      setMsgState({
        open: true,
        msg: data.msg,
        classes: "mdl-ok",
      });
      if (props.reset) {
        history.push("/login");
      } else {
        history.push("/login");
      }
    }
  }, [error, errorNum, data]);

  return (
    <>
      {isLoading && <Spinner />}
      <h1>Reset Password</h1>
      {props.reset ? (
        <>
          <p>Enter your email address below</p>
          <form onSubmit={handleSubmit}>
            <label>Email: </label>
            <input
              key="9"
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email || ""}
            />
            <div className="form-danger">
              {formErrors.email && formErrors.email}
            </div>
            <input key="8" type="submit" disabled={isLoading} />
          </form>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label>New password: </label>
            <input
              key="4"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password || ""}
            />
            <div className="form-danger">
              {formErrors.password && formErrors.password}
            </div>

            <label>Confirm password: </label>
            <input
              key="15"
              type="password"
              placeholder="Confirm password"
              name="confirm_pass"
              onChange={handleInputChange}
              value={formData.confirm_pass || ""}
            />
            <div className="form-danger">
              {formErrors.confirm_pass && formErrors.confirm_pass}
            </div>
            <input key="87" type="submit" disabled={isLoading} />
          </form>
        </>
      )}
    </>
  );
};

export default ResetPassword;
