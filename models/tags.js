const { DataTypes, Model } = require('sequelize');

class Tag extends Model {
    static init(sequelize) {
        return super.init({
            tag: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Tag',
            tableName : 'tags',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        });
    }

    static associate(models) {
        models.Tags.belongsTo(models.Clubs, {foreignKey : 'club_id_fk', target : 'club_id',  onDelete : 'CASCADE'});
    }
}

module.exports = Tag;