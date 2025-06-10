// src/services/curation-service.js

import db from '../config/db.js';

export const createCuration = async ({ styleId, nickname, password, trendy, personality, practicality, costEffectiveness, content }) => {
    const newCuration = await db.curation.create({
        data: {
            styleId: +styleId, 
            nickname,
            password: password,
            trendy: +trendy, 
            personality: +personality, 
            practicality: +practicality, 
            costEffectiveness: +costEffectiveness, 
            content,
        },
    });

    return {
        id: newCuration.curationId,
        nickname: newCuration.nickname,
        content: newCuration.content,
        trendy: newCuration.trendy,
        personality: newCuration.personality,
        practicality: newCuration.practicality,
        costEffectiveness: newCuration.costEffectiveness,
        createdAt: newCuration.createdAt,
    };
};

export const getCurationsByStyleId = async ({ styleId, page, pageSize, searchBy, keyword }) => {
    const parsedPage = parseInt(page || 1);
    const parsedPageSize = parseInt(pageSize || 10);

    if (parsedPage < 1 || parsedPageSize < 1) {
        throw new HttpError('페이지 및 페이지 크기는 1 이상의 유효한 숫자여야 합니다.', 400);
    }

    let where = { styleId: +styleId };
    if (searchBy && keyword) {
        if (searchBy === 'nickname') {
            where.nickname = { contains: keyword };
        } else if (searchBy === 'content') {
            where.content = { contains: keyword };
        } else {
            throw new HttpError('유효하지 않은 검색 기준입니다.', 400);
        }
    }

    const [totalItemCount, curations] = await Promise.all([
        db.curation.count({ where }),
        db.curation.findMany({
            where,
            skip: (parsedPage - 1) * parsedPageSize,
            take: parsedPageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                comments: true, // 큐레이션에 남겨진 답글도 함께 조회
            },
        }),
    ]);

    const totalPages = Math.ceil(totalItemCount / parsedPageSize);

    const formattedCurations = curations.map(curation => ({
        id: curation.curationId,
        nickname: curation.nickname,
        content: curation.content,
        trendy: curation.trendy,
        personality: curation.personality,
        practicality: curation.practicality,
        costEffectiveness: curation.costEffectiveness,
        createdAt: curation.createdAt,
        comment: curation.comments.length > 0 ? {
            id: curation.comments[0].commentId,
            nickname: curation.comments[0].nickname,
            content: curation.comments[0].content,
            createdAt: curation.comments[0].createdAt,
        } : {}, 
    }));

    return {
        currentPage: parsedPage,
        totalPages,
        totalItemCount,
        data: formattedCurations,
    };
};

export const updateCuration = async (curationId, { password, trendy, personality, practicality, costEffectiveness, content, nickname }) => {
    const existingCuration = await db.curation.findUnique({
        where: { curationId: +curationId }, 
    });

    // 비밀번호가 일치할 경우 큐레이팅 수정 가능
    if (existingCuration && existingCuration.password !== password) {
        throw new HttpError('비밀번호가 일치하지 않습니다.', 403);
    }

    const updatedCuration = await db.curation.update({
        where: { curationId: +curationId },
        data: {
            nickname: nickname || existingCuration?.nickname,
            trendy: +trendy, 
            personality: +personality, 
            practicality: +practicality, 
            costEffectiveness: +costEffectiveness, 
            content,
            updatedAt: new Date(),
        },
    });

    return {
        id: updatedCuration.curationId,
        nickname: updatedCuration.nickname,
        content: updatedCuration.content,
        trendy: updatedCuration.trendy,
        personality: updatedCuration.personality,
        practicality: updatedCuration.practicality,
        costEffectiveness: updatedCuration.costEffectiveness,
        createdAt: updatedCuration.createdAt,
    };
};

export const deleteCuration = async (curationId, password) => {
    const existingCuration = await db.curation.findUnique({
        where: { curationId: +curationId },
    });

    // 비밀번호가 일치할 경우 큐레이팅 삭제 가능
    if (existingCuration && existingCuration.password !== password) {
        throw new HttpError('비밀번호가 일치하지 않습니다.', 403);
    }

    await db.curation.delete({ where: { curationId: +curationId } });
    return { message: '큐레이팅 삭제 성공' };
};