const sum = (data, key) => {
  const values = data.map((item) => item[key]);
  return values.reduce((prev, curr) => prev + curr);
};

export default sum;
