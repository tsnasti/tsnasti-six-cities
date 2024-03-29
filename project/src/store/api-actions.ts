import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state';
import {redirectToRoute} from './action';
import {saveToken, dropToken} from '../services/tokens/token';
import {saveEmail, dropEmail} from '../services/tokens/email';
import {Offer, FavoriteOfferData} from '../types/offer';
import {Comment, CommentData} from '../types/comment';
import {APIRoute, AppRoute} from '../const';
import {AuthData} from '../types/auth-data';
import {UserData} from '../types/user-data';

export const fetchOffersAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchOffers',
  async (_arg, {dispatch, extra: api}) => {
    const {data: dataOffers} = await api.get<Offer[]>(APIRoute.Offers);
    return dataOffers;
  }
);

export const fetchOfferAction = createAsyncThunk<Offer | undefined, string, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchOffer',
  async (id, {dispatch, extra: api}) => {
    try {
      const {data: offerAction} = await api.get<Offer>(`${APIRoute.Offers}/${id}`);
      return offerAction;
    } catch {
      dispatch(redirectToRoute(AppRoute.Error));
    }
  },
);

export const fetchNearbyOffer = createAsyncThunk<Offer[], string, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchNearbyOffer',
  async (id, {dispatch, extra: api}) => {
    const {data: nearbyOffers} = await api.get<Offer[]>(`${APIRoute.Offers}/${id}/nearby`);
    return nearbyOffers;
  },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    await api.get(APIRoute.Login);
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    const {data} = await api.post<UserData>(APIRoute.Login, {email, password});
    saveToken(data.token);
    saveEmail(data.email);
    dispatch(redirectToRoute(AppRoute.Root));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'user/logout',
  async (_arg, {dispatch, extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dropEmail();
  },
);

export const fetchCommentsAction = createAsyncThunk<Comment[], string, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchComments',
  async (id, {dispatch, extra: api}) => {
    const {data} = await api.get<Comment[]>(`${APIRoute.Comments}/${id}`);
    return data;
  }
);

export const addCommentAction = createAsyncThunk<Comment[], CommentData, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/comment',
  async ({hotelId, comment, rating}, {dispatch, extra: api}) => {
    const {data} = await api.post<Comment[]>(`${APIRoute.Comments}/${hotelId}`,{comment, rating});
    return data;
  }
);

export const fetchFavoritesAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/fetchFavorites',
  async (_arg, {dispatch, extra: api}) => {
    const {data} = await api.get<Offer[]>(APIRoute.Favotites);
    return data;
  }
);

export const addFavoriteAction = createAsyncThunk<Offer, FavoriteOfferData, {
  dispatch: AppDispatch,
  state: State,
  extra: AxiosInstance
}>(
  'data/favoriteAction',
  async ({hotelId, status}, {dispatch, extra: api}) => {
    const {data} = await api.post<Offer>(`${APIRoute.Favotites}/${hotelId}/${status}`);
    return data;
  }
);
