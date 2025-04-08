const {DataTypes, Model} = require('sequelize');


class Category extends Model {
    static init(sequelize) {
        return super.init({
            id : {type : DataTypes.INTEGER, primaryKey : true, allowNull : false, autoIncrement : true},
            depth : {type : DataTypes.INTEGER, allowNull : false, defaultValue : 1},
            name : {type : DataTypes.STRING(20), unique : true}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Category',
            tableName : 'categorys',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Categorys.hasOne(models.Categorys, {foreignKey : 'categorys_id_fk', target : 'id'})
        models.Categorys.hasMany(models.Clubs, {foreignKey : 'categorys_id_fk', sourceKey : 'id'})
    }
}



module.exports = Category;
