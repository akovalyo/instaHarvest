import { useEffect, useState } from "react";
import { useRequest } from "./hooks";
import { useDispatch } from "react-redux";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import { checkAuth, parseLocation } from "../utils/utils";
import { showMsg } from "../store/modalSlice";

/**
 *  useAddress
 *
 * ```
 * const { searchAddress, setSearchAddress, addresses, address } = useAdress({id, placeholder});
 * ```
 */

const useAddress = ({ id, placeholder }) => {
  const fields = {
    state: "",
    city: "",
    zip_code: "",
    country: "",
    lat: "",
    lon: "",
    address: "",
  };

  const { data, error, sendRequest } = useRequest();
  const [addresses, setAddresses] = useState();
  const [address, setAddress] = useState({ ...fields });
  const [searchAddress, setSearchAddress] = useState(false);
  const dispatch = useDispatch();

  const onResultGeocoder = (data) => {
    const parsedData = parseLocation(data);
    setAddress({ ...fields, ...parsedData });
  };

  const onClearGeocoder = () => {
    setAddress({ ...fields });
  };

  const updateAddresses = () => {
    if (checkAuth()) {
      sendRequest("/api/account/get_user_addresses", "POST");
    }
  };

  useEffect(() => {
    updateAddresses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      dispatch(
        showMsg({
          open: true,
          msg: error,
          type: "error",
        })
      );
    } else if (data) {
      setAddresses(data.list);
    }
  }, [data, error]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchAddress) {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_TOKEN,
      });
      geocoder.addTo(id);
      geocoder.setPlaceholder(placeholder ? placeholder : null);
      geocoder.on("result", onResultGeocoder);
      geocoder.on("clear", onClearGeocoder);

      return () => {
        geocoder.off("result", onResultGeocoder);
        geocoder.off("clear", onClearGeocoder);
      };
    }
  }, [searchAddress]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchAddress,
    setSearchAddress,
    updateAddresses,
    addresses,
    address,
  };
};

export default useAddress;
