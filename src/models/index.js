const User = require('./userModel');
const Todo = require('./todoModel');

User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Todo,
};
