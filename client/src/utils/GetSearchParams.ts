const GetSearchParams = () => {
  const params:any = {};
  const Urlparams = new URLSearchParams(window.location.search);
  Urlparams.forEach((value, key) => {
    if (key === "brands") {
      const ArrayofBrands =
        value.split(",").filter((el) => el.trim() !== "") || [];
      return (params[key] = ArrayofBrands);
    }  else {
      return (params[key] = value);
    }
  });
  return params;
};

export { GetSearchParams };
