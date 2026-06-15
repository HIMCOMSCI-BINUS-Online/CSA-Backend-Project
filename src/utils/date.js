const today = () => new Date().toISOString().slice(0, 10);

const monthStart = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
};

module.exports = { today, monthStart };
