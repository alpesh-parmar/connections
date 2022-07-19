module.exports = (sequelize, Sequelize) => {
    const Master = sequelize.define("directorys", {
        first_name: { type: Sequelize.STRING },
        last_name: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        phone_no: { type: Sequelize.STRING },
        profile_pic: { type: Sequelize.STRING },
        website: { type: Sequelize.STRING },
        social_media_links: { type: Sequelize.ARRAY(Sequelize.TEXT) },
        about: { type: Sequelize.STRING },
        createddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updateddate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    }, { timestamps: false });

    return Master;
};