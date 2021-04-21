import { useModal } from "../../hooks/hooks";
import UploadImage from "../UI/UploadImage";
import { shallowEqual, useSelector } from "react-redux";
import { selectProfile } from "../../store/profileSlice";
import "./profile.css";

const ProfileHeader = ({ edit, profileImg, profileBackImg }) => {
  const data = useSelector(selectProfile, shallowEqual);

  const [modal, showModal, closeModal] = useModal({
    withBackdrop: true,
    useTimer: false,
    inPlace: false,
  });

  return (
    <>
      {modal}
      {data && (
        <div className="prf-header">
          <div className="prf-back-block">
            <img
              className="prf-back-img"
              src={profileBackImg ? profileBackImg : data.image_back_url}
              alt=""
            />
            {edit && (
              <div>
                <button
                  className="button-link"
                  onClick={() => {
                    showModal(
                      <UploadImage
                        title="Set profile background image"
                        closeModal={closeModal}
                        uploadFileAPI="/api/account/update_back_image_file"
                        imageUrlAPI="/api/account/update_back_image_url"
                        deleteImageAPI="/api/account/delete_back_image"
                      />
                    );
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className="prf-img-block">
            <img
              className="prf-img"
              src={profileImg ? profileImg : data.image_url}
              alt=""
            />
            {edit && <div></div>}
            {edit && (
              <button
                className="button-link"
                onClick={() => {
                  showModal(
                    <UploadImage
                      title="Set profile image"
                      closeModal={closeModal}
                      uploadFileAPI="/api/account/update_profile_image_file"
                      imageUrlAPI="/api/account/update_profile_image_url"
                      deleteImageAPI="/api/account/delete_profile_image"
                    />
                  );
                }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
