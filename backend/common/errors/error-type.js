const ErrorType = {  
  // User & Auth
  existedUser: { type: 'Conflict', status: 409, message: '이미 가입된 계정입니다.' },
  unauthorized: { type: 'Unauthorized', status: 401, message: '인증되지 않은 사용자입니다.' },
  userBadRequest: { type: 'Bad Request', status: 400, message: '사용자 정보가 올바르지 않습니다.' },

  // Folder
  folderNotFound: { type: 'Not Found', status: 404, message: '해당 폴더를 찾을 수 없습니다.' },  
  folderForbidden: { type: 'Forbidden', status: 403, message: '접근 권한이 없는 폴더입니다.' },

  // Image
  imageBadRequest: { type: 'Bad Request', status: 400, message: '이미지 경로가 존재하지 않습니다.' },

  // Unit
  unitNotFound: { type: 'Not Found', status: 404, message: '해당 유닛을 찾을 수 없습니다.' },
  unitForbidden: { type: 'Forbidden', status: 403, message: '접근 권한이 없는 유닛입니다.' },

  // Bookmark
  bookmarkNotFound: { type: 'Not Found', status: 404, message: '해당 북마크 정보를 찾을 수 없습니다.' },
  
  // Review


  // Validation (request body, param...)

  // Server & Database
  internalServerError: { type: 'Internal Server Error', status: 500, message: '서버 에러입니다.' },
}  

module.exports = { ErrorType };






    




