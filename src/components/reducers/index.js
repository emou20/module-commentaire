
//import { USER_CIN } from "../actions/action-types";


function rootReducer(state, action) {
  console.log(action.type);
 

  if (action.type === "ID_ARTICLE") {
    
    state.idArticle=action.idArticle
    return {...state}; 

  }

  return state;
}

export default rootReducer;