import { createSlice } from "@reduxjs/toolkit";


const initialState={
    inputVal:'',
    answer:[],
    chatHistory:[],
    latestResponseIndex:-1,
    circular:'hidden',
    error:false,
    clear:true,
    chatID:1,
    token:"",

}
const chatSlice=createSlice({
    name:'chat',
    initialState,
  reducers: {
    setInputVal(state, action) {
      state.inputVal = action.payload;
    },
    addAnswer(state, action) {
      state.latestResponseIndex += 1;
      state.answer.push(action.payload);   
    },
    
    updateChatHistory(state,action){
      state.chatHistory=action.payload;
    },
    setCircular(state, action) {
      state.circular = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearAnswer(state) {
      state.answer = [];
    },
    setClear(state,action){
      state.clear=action.payload;
    },
    setChatID(state,action){
      state.chatID=action.payload;
    },
    setToken(state,action){
      state.token=action.payload;
    }
  },
});

export const {
    setInputVal,
    addAnswer,
    setClear,
    setCircular,
    setError,
    clearAnswer,
    updateChatHistory,
    setChatID,
    setToken
  } = chatSlice.actions;
  
  export default chatSlice.reducer;


