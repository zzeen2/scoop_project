




const {DataTypes, Model} = require('sequelize');


class Event extends Model {
    static init(sequelize) {
        return super.init({
            id : {type : DataTypes.STRING(20), primaryKey : true, allowNull : false},
            club_id : {type : DataTypes.STRING(20), allowNull : false},
            title : {type : DataTypes.STRING(20), allowNull : false},
            content : {type : DataTypes.STRING(20), allowNull : false},
            start_date : {type : DataTypes.INTEGER(10)},
            end_date : {type : DataTypes.INTEGER(10)},
            location : {type : DataTypes.STRING(200), allowNull : false},
            guest_allow : {type : DataTypes.INTEGER(20), allowNull : false},
            max_participants : {type : DataTypes.INTEGER(20), allowNull : false}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Event',
            tableName : 'events',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Events.hasMany(models.Participants, {foreignKey : 'participants_id_fk', sourceKey : 'id'})
        models.Events.hasMany(models.Verifications, {foreignKey : 'verifications_id_fk', sourceKey : 'id'})
        models.Events.belongsTo(models.Clubs, {foreignKey : 'club_id_fk', target : 'club_id', onDelete : 'CASCADE'})
    }
}



module.exports = Event;
