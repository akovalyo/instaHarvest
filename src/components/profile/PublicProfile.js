import { useEffect } from "react";
import { useRequest } from "../../hooks/hooks";
import Spinner from "../UI/Spinner";
import ProfileHeader from "./ProfileHeader";
import PublicProfileInfo from "./PublicProfileInfo";
import "./profile.css";

const PublicProfile = (props) => {
  const [isLoading, data, error, errorNum, sendRequest] = useRequest();

  useEffect(() => {
    sendRequest(`/api/account/${props.match.params.addr}`, "GET", {});
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      {error && <h1>Profile Not Found</h1>}
      {data && (
        <>
          <ProfileHeader
            image={data.image_url}
            imageBack={data.image_back_url}
            edit={false}
          />
          <PublicProfileInfo
            firstName={data.first_name}
            emailVerified={data.email_verified}
            city={data.city}
            state={data.state}
            joined={data.joined}
          />
        </>
      )}
    </>
  );
};

export default PublicProfile;
