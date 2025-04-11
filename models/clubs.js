const {DataTypes, Model} = require('sequelize');
class Club extends Model {
    static init(sequelize) {
        return super.init({
            club_id : {type : DataTypes.STRING(20), primaryKey : true, allowNull : false},
            name : {type : DataTypes.STRING(20), allowNull : false},
            introduction : {type : DataTypes.STRING(200), allowNull : false},
            image : {type : DataTypes.STRING(200), allowNull : false},
            creator_id : {type : DataTypes.STRING(200), allowNull : false},
            member_limit : {type : DataTypes.INTEGER(10), allowNull : false},
            club_category_name : {type : DataTypes.STRING(20), allowNull : false},
            allow_guest : {type : DataTypes.STRING(20)},
            view_count : {type : DataTypes.INTEGER(10)}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Club',
            tableName : 'clubs',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Clubs.hasMany(models.Locations, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
        models.Clubs.hasMany(models.Members, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
        models.Clubs.hasMany(models.Events, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
        models.Clubs.belongsTo(models.Categorys, {foreignKey : 'categorys_id_fk', onDelete : 'CASCADE', target : 'id'})
        models.Clubs.hasMany(models.Tags, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
        models.Clubs.hasMany(models.Reviews, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
        models.Clubs.hasMany(models.Hearts, {foreignKey : 'club_id_fk', sourceKey : 'club_id'})
    }
}

module.exports = Club;