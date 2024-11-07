'use strict';
const {
  Model
} = require('sequelize');
const convertDate = require('../helpers/convertDate');
const countWords = require('../helpers/countWords');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Tag, {foreignKey: 'TagId'})
      Post.belongsTo(models.User, {foreignKey: "UserId"})
    }

    get date(){
      return convertDate(this.createdAt)
    }
  }
  Post.init({
    title: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Title is required"
        },
        notEmpty:{
          msg:"Title is required"
        }
      }
    },
    content: {
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        notNull:{
          msg:"content is required"
        },
        notEmpty:{
          msg:"content is required"
        },
        words(value){
          if(countWords(value) <= 3){
            throw new Error("words must be greater than 3");
          }
        }
      }
    },
    imgUrl: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"imgUrl is required"
        },
        notEmpty:{
          msg:"imgUrl is required"
        }
      }
    },
    TagId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"tagsId is required"
        },
        notEmpty:{
          msg:"tagsId is required"
        }
      }
    },
    UserId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"UserId is required"
        },
        notEmpty:{
          msg:"UserId is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Post'
    // hooks: {
    //   beforeCreate: (post, options) => {
    //     post.UserId = 1
    //   }
    // }
  });
  return Post;
};