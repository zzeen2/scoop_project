



const {DataTypes, Model} = require('sequelize');


class Participant extends Model {
    static init(sequelize) {
        return super.init({
            participant_id : {type : DataTypes.STRING(20), allowNull : false, primaryKey : true},


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
    }
}



module.exports = Participant;
