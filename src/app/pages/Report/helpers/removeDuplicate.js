export const duplicateArrayObject = (data, key) => {
  return data.filter((item, index, self) => {
    return (
      index === self.findIndex((selfIndex) => selfIndex[key] === item[key])
    );
  });
};
