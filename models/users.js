
const { DataTypes, Model} = require('sequelize');

class User extends Model {
    static init(sequelize) {
        return super.init({
            uid : {type : DataTypes.STRING(20),primaryKey : true, allowNull : false},
            kakao_id : {type : DataTypes.STRING(20), allowNull : false},
            kakao_name : {type : DataTypes.STRING(20), allowNull : false},
            kakao_profile_image : {type : DataTypes.STRING(200), allowNull : false},
            age : {type : DataTypes.INTEGER(20), allowNull : false},
            gender : {type : DataTypes.STRING(20), allowNull : false},
            introduction : {type : DataTypes.INTEGER(200), allowNull : false},
            latitude : {type : DataTypes.STRING},
            longitude : {type : DataTypes.STRING}
  
        }, {
            sequelize,
            timestamps : true,
            modelName : 'User',
            tableName : 'users',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Users.hasMany(models.Points, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        models.Users.hasMany(models.Userintrests, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        models.Users.hasMany(models.Clubs, {foreignkey : 'user_id_fk', sourceKey : 'uid'})
        models.Users.hasMany(models.Reviews, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        models.Users.hasMany(models.Hearts, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        models.Users.hasMany(models.Events, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        // models.Users.hasMany(models.Members, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        // models.Users.hasMany(models.Categorys, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        // models.Users.hasMany(models.Locations, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        // models.Users.hasMany(models.Participants, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
        // models.Users.hasMany(models.Verifications, {foreignKey : 'user_id_fk', sourceKey : 'uid'})
    }
}


module.exports = User;
