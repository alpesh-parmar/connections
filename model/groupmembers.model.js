module.exports = (sequelize, Sequelize) => {
    const Master = sequelize.define("group_members", {        
        group_id: { type: Sequelize.INTEGER },
        member_id: { type: Sequelize.INTEGER },        
        createddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updateddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { timestamps: false });

    return Master;
};