const {DataTypes, Model} = require('sequelize');
class Heart extends Model {
    static init(sequelize) {
        return super.init({
            like_id: {type : DataTypes.INTEGER(10),primaryKey : true, allowNull : false},

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Heart',
            tableName : 'hearts',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Hearts.belongsTo(models.Users, {foreignKey : 'user_id_fk', target : 'uid', onDelete : 'CASCADE'})
    }
}

module.exports = Heart;
