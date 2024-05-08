import qs from "qs";

export const getCurrentUser = async (reef_token) => {
  const urlParamsObject = {
    populate: {
      avatar: {
        populate: "*",
      },
      background: {
        populate: "*",
      },
      brand: {
        populate: "*",
      },
      serviceOrderRequestIDs: {
        populate: "*",
      },
      attachedFile: {
        populate: "*",
      },
      role: {
        populate: "*",
      }
    },
  };

  const queryString = qs.stringify(urlParamsObject);

  const requestUrl = `${
    import.meta.env.STRAPI_URL
  }/api/users/me?${queryString}`;

  const userData = await fetch(`${requestUrl}`, {
    headers: {
      Authorization: `bearer ${reef_token}`,
    },
  });

  const data = await userData.json();

  return data;
};
