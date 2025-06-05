import * as curationService from '../services/curationService.js';

/**
 * 새로운 큐레이팅을 등록하는 컨트롤러 POST 요청을 처리합니다.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */

async function createCurationController(req, res, next) {
  const { styleId } = req.params;
  const {
    nickname,
    password,
    trendy,
    personality,
    practicality,
    costEffectiveness,
    content
  } = req.body;

  // 1. 기본적인 입력값 유효성 검사 (Superstruct 적용 전까지)
  if (!nickname || !password || !content ||
      trendy === undefined || personality === undefined ||
      practicality === undefined || costEffectiveness === undefined) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Missing required fields or scores. Please provide nickname, password, content, trendy, personality, practicality, and costEffectiveness.',
    });
  }

  if (isNaN(parseInt(trendy)) || isNaN(parseInt(personality)) ||
      isNaN(parseInt(practicality)) || isNaN(parseInt(costEffectiveness))) {
      return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Score fields (trendy, personality, practicality, costEffectiveness) must be valid numbers.'
      });
  }

  try {
    const newCuration = await curationService.createCuration(styleId, {
      nickname,
      password,
      trendy: parseInt(trendy, 10),
      personality: parseInt(personality, 10),
      practicality: parseInt(practicality, 10),
      costEffectiveness: parseInt(costEffectiveness, 10),
      content,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Curation created successfully.',
      data: {
        curation: newCuration,
      },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * 큐레이팅 목록을 검색하는 컨트롤러 함수입니다. (todo)
 * @param {object} req 
 * @param {object} res
 * @param {function} next
 */
async function searchCurationsController(req, res, next) {
  res.status(501).json({
    success: false,
    statusCode: 501,
    message: 'Curation search functionality not yet implemented.',
  });
}

/**
 * 큐레이팅을 수정하는 컨트롤러 함수입니다. (todo)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function updateCurationController(req, res, next) {
    res.status(501).json({
      success: false,
      statusCode: 501,
      message: 'Curation update functionality not yet implemented.',
    });
}

/**
 * 큐레이팅을 삭제하는 컨트롤러 함수입니다. (todo)
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function deleteCurationController(req, res, next) {
    res.status(501).json({
      success: false,
      statusCode: 501,
      message: 'Curation delete functionality not yet implemented.',
    });
}

export {
  createCurationController,
  searchCurationsController,
  updateCurationController,
  deleteCurationController,
};