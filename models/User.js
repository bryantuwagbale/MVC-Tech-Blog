// set up imports
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

//Set up object
class User extends Model {
  //check passwords
  checkPassword(loginPw) {
    // method
    return bcrypt.compareSync(loginPw, this.password); // compare plaintextPassword with hased personal password
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // Validate if it is a valid email
      validate: { isEmail: true },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      
      validate: { len: [5] },
    },
  },

  {
    
    hooks: {
      // async functions
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    }, 
   
    sequelize,
    
    timestamps: false,
    
    freezeTableName: true,
    
    underscored: true,
    
    modelName: "user",
  }
);

module.exports = User;
