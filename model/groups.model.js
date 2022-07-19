module.exports = (sequelize, Sequelize) => {
    const Master = sequelize.define("groups", {
        key: { type: Sequelize.INTEGER },
        group_name: { type: Sequelize.STRING },
        event_id: { type: Sequelize.INTEGER },
        event_mode: { type: Sequelize.STRING },
        createddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updateddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { timestamps: false });

    return Master;
};