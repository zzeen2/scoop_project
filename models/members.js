const {DataTypes, Model} = require('sequelize');
class Member extends Model {
    static init(sequelize) {
        return super.init({
            member_uid : {type : DataTypes.STRING(20), allowNull : false},
            signup_date : {type : DataTypes.STRING(20), allowNull : false},
            user_id_fk : { type :DataTypes.STRING(20), allowNull : false}

        }, {
            sequelize,
            timestamps : true ,
            modelName : 'Member',
            tableName : 'members',
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }
    static associate(models) {
        models.Members.belongsTo(models.Clubs, {foreignKey : 'club_id_fk', target : 'club_id', onDelete : 'CASCADE'})
        models.Members.belongsTo(models.Users, { foreignKey : 'user_id_fk', target : 'uid', onDelete : 'CASCADE'})
    }
}

module.exports = Member;
