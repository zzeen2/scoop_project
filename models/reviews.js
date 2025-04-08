const {DataTypes, Model} = require('sequelize');
class Review extends Model {
    static init(sequelize) {
        return super.init({
            id  : {type : DataTypes.STRING(20),primaryKey : true , allowNull : false},
            content : {type : DataTypes.STRING(200), allowNull : false },
            star : {type : DataTypes.INTEGER(10)}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Review',
            tableName : 'reviews',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Reviews.belongsTo(models.Users, {foreignKey : 'user_id_fk', target : 'uid', onDelete : 'CASCADE'})

    }
}

module.exports = Review;
