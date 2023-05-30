export const ErrorType = {   
    // User & Auth
    existedUser: { statusCode: 409, message: '이미 사용 중인 이메일입니다.' },
    unauthorized: { statusCode: 401, message: '인증되지 않은 사용자입니다.' },
    userBadRequest: { statusCode: 400, message: '사용자 정보가 올바르지 않습니다.' },

    // Folder
    folderNotFound: { statusCode: 404, message: '해당 폴더를 찾을 수 없습니다.' },  
    forderForbidden: { statusCode: 403, message: '접근 권한이 없는 폴더입니다.' },

    // Image
    imageBadRequest: { statusCode: 400, message: '이미지 경로가 존재하지 않습니다.' },
    imageNotFound: { statusCode: 404, message: '해당 이미지를 찾을 수 없습니다.' },
    imageForbidden: { statusCode: 403, message: '접근 권한이 없는 이미지입니다.' },

    // Unit
    unitNotFound: { statusCode: 404, message: '해당 단어장을 찾을 수 없습니다.' },
    unitForbidden: { statusCode: 403, message: '접근 권한이 없는 유닛입니다.' },

    // Server & Database
    InternalServerError: { statusCode: 500, message: '서버 에러입니다.' },
}  








    // Bookmark
    

    // Server



