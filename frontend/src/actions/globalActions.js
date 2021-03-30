import { SET_LOADING } from "./actionTypes";

export const setLoading = (loading) => dispatch => {
    dispatch({ type: SET_LOADING, payload: loading });
};

