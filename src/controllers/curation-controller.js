import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CurationController {
    // 큐레이팅 등록 (POST /curations/styles/:styleId)
    static async createCuration(req, res, next) {
        try {
            const { styleId } = req.params;
            const { nickname, password, trendy, personality, practicality, costEffectiveness, content } = req.body;

            const newCurationData = await createCurationService({
                styleId,
                nickname,
                password,
                trendy,
                personality,
                practicality,
                costEffectiveness,
                content,
            });

            res.status(201).json(newCurationData);
        } catch (err) {
            next(err); 
        }
    }

    // 큐레이팅 목록 조회 (GET /curations/styles/:styleId)
    static async getCurationList(req, res, next) {
        try {
            const { styleId } = req.params;
            const { page, pageSize, searchBy, keyword } = req.query;

            const curationsData = await getCurationListService({
                styleId,
                page,
                pageSize,
                searchBy,
                keyword,
            });

            res.status(200).json(curationsData);
        } catch (err) {
            next(err); 
        }
    }

    // 큐레이팅 수정 (PUT /curations/:curationId)
    static async updateCuration(req, res, next) {
        try {
            const { curationId } = req.params;
            const { password, trendy, personality, practicality, costEffectiveness, content, nickname } = req.body;

            const updatedCurationData = await updateCurationService(curationId, {
                password,
                trendy,
                personality,
                practicality,
                costEffectiveness,
                content,
                nickname,
            });

            res.status(200).json(updatedCurationData);
        } catch (err) {
            next(err); 
        }
    }

    // 큐레이팅 삭제 (DELETE /curations/:curationId)
    static async deleteCuration(req, res, next) {
        try {
            const { curationId } = req.params;
            const { password } = req.body;

            const result = await deleteCurationService(curationId, password);

            res.status(200).json(result);
        } catch (err) {
            next(err); 
        }
    }
}