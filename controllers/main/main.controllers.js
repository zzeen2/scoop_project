// 메인페이지 오른쪽 영역 필터링 기능
const { Clubs, Members, Hearts, Reviews, sequelize: Sequelize } = require('../../models/configs');

const USERORDER = "member";
const REVIEWORDER = "review";
const LIKEORDER = "like";

// FilteringSort - 필터링 조회 함수
const FilteringSort = async (index) => {
    switch (index) {
        case USERORDER: {
            try {
                const data = await Clubs.findAll({
                    attributes: [
                        'club_id',
                        'name',
                        'introduction',
                        'image',
                        [Sequelize.fn('COUNT', Sequelize.col('Members.member_uid')), 'MemberCount']
                    ],
                    include: [{
                        model: Members,
                        attributes: []
                    }],
                    group: ['club_id'],
                    order: [[Sequelize.literal('MemberCount'), 'DESC']]
                });
                return { state: 200, message: "회원순 정렬 성공", data };
            } catch (error) {
                return { state: 404, message: "회원순 정렬 실패", error };
            }
        }
        case REVIEWORDER: {
            try {
                const data = await Clubs.findAll({
                    attributes: [
                        'club_id',
                        'name',
                        'introduction',
                        'image',
                        [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'ReviewCount']
                    ],
                    include: [{
                        model: Reviews,
                        attributes: []
                    }],
                    group: ['club_id'],
                    order: [[Sequelize.literal('ReviewCount'), 'DESC']]
                });
                return { state: 200, message: "리뷰순 정렬 성공", data };
            } catch (error) {
                return { state: 404, message: "리뷰순 정렬 실패", error };
            }
        }
        case LIKEORDER: {
            try {
                const data = await Clubs.findAll({
                    attributes: [
                        'club_id',
                        'name',
                        'introduction',
                        'image',
                        [Sequelize.fn('COUNT', Sequelize.col('Hearts.like_id')), 'HeartCount']
                    ],
                    include: [{
                        model: Hearts,
                        attributes: []
                    }],
                    group: ['club_id'],
                    order: [[Sequelize.literal('HeartCount'), 'DESC']]
                });
                return { state: 200, message: "좋아요순 정렬 성공", data };
            } catch (error) {
                return { state: 404, message: "좋아요순 정렬 실패", error };
            }
        }
        default:
            return { state: 400, message: "잘못된 정렬 기준입니다", data: [] };
    }
};

module.exports = { FilteringSort };
