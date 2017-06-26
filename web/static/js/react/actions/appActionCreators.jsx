import * as types from '../constants/appConstants'

export const listPhoto = (search_keyword, datas) => ({ 
    type: types.LIST_PHOTO, 
    search_keyword, datas 
})

export const showDetail = (is_show) => ({ 
    type: types.SHOW_DETAIL,
    is_show
})

export const setDetail = (data) => ({ 
    type: types.SET_DETAIL,
    data
})

export const listComment = (comments) => ({ 
    type: types.LIST_COMMENT,
    comments
})

export const addComment = (comment) => ({ 
    type: types.ADD_COMMENT,
    comment
})

export const setUser = (login_id) => ({ 
    type: types.SET_USER,
    login_id
})

export const setSuka = (id, suka) => ({ 
    type: types.SET_SUKA,
    id, suka
})

export const setLabelSuka = (label_like) => ({ 
    type: types.SET_LABEL_SUKA,
    label_like
})

//export const listData= (id) => ({ type: types.LIST_DATA, id })