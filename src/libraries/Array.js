export const getList = ({ list, id, name, checkValue }) => {
  const obj = [];
  list.map((value) => {
    let disabled = false;
    if (checkValue) disabled = value[checkValue] === '';
    obj.push({
      id: value[id],
      name: value[name],
      disabled: disabled
    });
  });
  return obj;
};

export const countItem = ({ items, field, data }) => {
  let count = 0;
  items.forEach((value) => {
    if (value[field] === data) count++;
  });
  return count;
};

export const countArray = (arrays) => {
  let count = 0;
  arrays.forEach(() => {
    count++;
  });
  return count;
};
