import { createAsyncThunk } from '@reduxjs/toolkit';
import BusinessError from '../../../common/exceptions/business-error';
import CollectionType from '../../../common/minting/enums/collection-type.enum';
import LedaAddress from '../../../contracts/LedaNFT-address.json';
import { openToast } from '../../../store/ui/ui.slice';
import { itemService } from '../../leda-nft/services/item.service';
import { ledaNftService } from '../../leda-nft/services/leda-nft.service';
import MarketplaceClientProcessor from '../process/clients/marketplace-client-processor';
import ContractEvent from '../process/enums/contract-event.enum';
import MarketplaceState from '../process/types/marketplace-state';
import MarketplaceService from '../services/marketplace.service';

export const getOwner = createAsyncThunk('marketplace/getNftList', async () => {
  const service = new MarketplaceService(ledaNftService);
  return service.getOwner();
});

export const listItem = createAsyncThunk(
  'marketplace/listItem',
  async (
    {
      address,
      price,
      tokenId,
      itemId,
    }: { address: string; price: string; tokenId: number; itemId: string },
    { dispatch }
  ) => {
    try {
      const makeItemState = {
        address,
        collection: CollectionType.LedaNft,
        collectionAddress: LedaAddress.address,
        mintEventName: ContractEvent.LogCreateItem,
        price,
        tokenId,
        itemId,
      } as MarketplaceState;

      const processor = new MarketplaceClientProcessor();
      const listed = await processor.execute(makeItemState);

      dispatch(openToast({ type: 'success', text: 'The NFT has been listed successfully' }));

      return listed.item;
    } catch (err) {
      if (err instanceof BusinessError) {
        dispatch(openToast({ type: 'error', text: err.message }));
      }
      throw err;
    }
  }
);

export const buyItem = createAsyncThunk(
  'marketplace/buyItem',
  async (
    {
      price,
      tokenId,
      itemId,
      listId,
      address,
    }: { price: string; tokenId: number; itemId: string; listId: number; address: String },
    { dispatch }
  ) => {
    try {
      const buyItemState = {
        collectionAddress: LedaAddress.address,
        collection: CollectionType.LedaNft,
        mintEventName: ContractEvent.LogBuyItem,
        address,
        price,
        tokenId,
        itemId,
        listId,
      } as MarketplaceState;

      const processor = new MarketplaceClientProcessor();
      const bought = await processor.execute(buyItemState);

      dispatch(openToast({ type: 'success', text: 'The NFT has been bought successfully' }));

      return bought.item;
    } catch (err) {
      if (err instanceof BusinessError) {
        dispatch(openToast({ type: 'error', text: err.message }));
      }
      throw err;
    }
  }
);

export const findHistoryByItemId = createAsyncThunk(
  'marketplace/findHistoryByItemId',
  async ({ itemId }: { itemId: string }) => itemService.findHistoryByItemId(itemId)
);

export const findAllHistory = createAsyncThunk('marketplace/findAllHistory', async () =>
  itemService.findAllHistory()
);
