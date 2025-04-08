const {DataTypes, Model} = require('sequelize');
class Point extends Model {
    static init(sequelize) {
        return super.init({
            point : {type : DataTypes.INTEGER(200), allowNull : false ,primaryKey : true},

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Point',
            tableName : 'points',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Points.belongsTo(models.Users, {foreignKey : 'user_id_fk', target : 'uid', onDelete : 'CASCADE'})
        
    }
}

module.exports = Point;
