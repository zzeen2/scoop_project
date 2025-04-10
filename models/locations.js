const {DataTypes, Model} = require('sequelize');
class Location extends Model {
    static init(sequelize) {
        return super.init({
            club_id : {type : DataTypes.STRING(20),primaryKey : true, allowNull : false},
            point : {type : DataTypes.STRING(200), allowNull : false},
            poligon : {type : DataTypes.STRING(200), allowNull : false}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Location',
            tableName : 'locations',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Locations.belongsTo(models.Clubs, {foreignKey : 'club_id_fk', target : 'club_id', onDelete : 'CASCADE'})
    }
}

module.exports = Location;
