import { SET_LOADING, SET_ERROR } from "./actionTypes";

export const setLoading = (loading) => dispatch => {
    dispatch({ type: SET_LOADING, payload: loading });
};

export const setError = (loading) => dispatch => {
    dispatch({ type: SET_ERROR, payload: loading });
};
