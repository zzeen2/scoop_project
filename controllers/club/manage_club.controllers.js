const { Clubs, Tags } = require('../../models/configs');
const { Op } = require('sequelize');

const updateClub = async (req, res) => {
    const { clubId } = req.params;
    const { name, introduction, member_limit } = req.body;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const imagePath = req.file ? `/images/${req.file.filename}` : "/public/default.png";

    try {
        const existing = await Clubs.findOne({
            where: {
                name,
                club_id: { [Op.ne]: clubId }
            }
        });
        if (existing) {
            return res.json({ state: 400, message: "이미 존재하는 이름입니다." });
        }
        const updateData = {
            name,
            introduction,
            member_limit
        };

        if (imagePath) {
            updateData.image = imagePath;
        }
        await Clubs.update(updateData, {
            where: { club_id: clubId }
        });

        await Tags.destroy({ where: { club_id_fk: clubId } });

        if (Array.isArray(tags)) {
        const newTags = tags.map(tag => ({
            club_id_fk: clubId,
            tag
        }));
            await Tags.bulkCreate(newTags);
        }

        return res.json({ state: 200, message: "동호회가 수정되었습니다." });
    } catch (error) {
        return res.status(500).json({ state: 500, message: "서버 오류 발생" });
    }
};

module.exports = { updateClub };
