import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Item } from '@types';
import type { RootState } from '../../../store/types';
import { buyItem, listItem } from '../../marketplace/store/marketplace.actions';
import { findAll, findById, mintNft } from './leda-nft.actions';

type LedaNftState = {
  items: Item[];
  isLoading: boolean;
};

const initialState: LedaNftState = {
  items: [],
  isLoading: false,
};

const ledaNftSlice = createSlice({
  name: 'ledaNft',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(buyItem.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(buyItem.fulfilled, (state, { payload }) => {
      const index = state.items.findIndex((item) => item.itemId === payload.itemId);
      if (index !== -1) state.items[index] = payload;

      state.isLoading = false;
    });
    builder.addCase(buyItem.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(findAll.fulfilled, (state, { payload }) => {
      state.items = payload;
      state.isLoading = false;
    });
    builder.addCase(findAll.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(findById.fulfilled, (state, { payload }) => {
      const found = state.items.some((item) => item.itemId === payload.itemId);

      if (!found) state.items.push(payload);
    });
    builder.addCase(mintNft.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(mintNft.fulfilled, (state, { payload }) => {
      if (!payload) return;
      state.items.push(payload);
      state.isLoading = false;
    });
    builder.addCase(mintNft.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(listItem.fulfilled, (state, { payload }) => {
      const index = state.items.findIndex((item) => item.itemId === payload.itemId);
      if (index !== -1) state.items[index] = payload;
    });
  },
});

// TODO: Change this name to selectNftState
export const selectNftState = (state: RootState) => state.ledaNft;

export const selectAllItems = (state: RootState) => state.ledaNft.items;

export const selectFilteredItems = createSelector(
  selectAllItems,
  (
    _: unknown,
    author: string,
    title: string,
    description: string,
    priceFrom: number,
    priceTo: number,
    likesDirection: string | 'desc' | 'asc'
  ) => ({
    author,
    title,
    description,
    priceFrom,
    priceTo,
    likesDirection,
  }),
  (items: Item[], { author, title, description, priceFrom, priceTo, likesDirection }) => {
    let filteredItems = [...items];
    if (author && author !== 'all') {
      // TODO: The logic is working fine, but we should change the data from the user and add a username
      filteredItems = filteredItems.filter((item) => item.owner.address === author);
    }
    if (title !== 'all') {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (description !== 'all') {
      filteredItems = filteredItems.filter((item) =>
        item.description.toLowerCase().includes(description.toLowerCase())
      );
    }

    if (priceFrom >= 0 && priceTo >= priceFrom) {
      filteredItems = filteredItems.filter(
        (item) => Number(item.price) >= priceFrom && Number(item.price) <= priceTo
      );
    }

    if (likesDirection && likesDirection !== '') {
      if (likesDirection === 'asc') {
        filteredItems = filteredItems.sort((a, b) => a.likes - b.likes);
      }
      if (likesDirection === 'desc') {
        filteredItems = filteredItems.sort((a, b) => b.likes - a.likes);
      }
    }

    return filteredItems;
  }
);

export const selectNewest = (state: RootState) => state.ledaNft.items.slice(0, 5);

export const selectById = (state: RootState, itemId: string) =>
  state.ledaNft.items.find((item) => item.itemId === itemId);

export const ledaNftReducer = ledaNftSlice.reducer;
