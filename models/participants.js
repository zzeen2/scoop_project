const {DataTypes, Model} = require('sequelize');
class Participant extends Model {
    static init(sequelize) {
        return super.init({
            participant_id : {type : DataTypes.STRING(20), allowNull : false, primaryKey : true},
            state: {
                type: DataTypes.STRING(10),allowNull: false,defaultValue: 'maybe'}, // yes,no,maybe
            user_id_fk: { type: DataTypes.STRING(20), allowNull: false
                  }
        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Participant',
            tableName : 'participants',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Participants.belongsTo(models.Events, {foreignKey : 'participants_id_fk', target : 'id', onDelete : 'CASCADE'})
        models.Participants.belongsTo(models.Users, {foreignKey : 'user_id_fk', target : 'uid', onDelete : 'CASCADE'})
    }
}

module.exports = Participant;
