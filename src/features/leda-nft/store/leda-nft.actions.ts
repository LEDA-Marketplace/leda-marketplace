import { createAsyncThunk } from '@reduxjs/toolkit';
import { Item, ItemRequest } from '@types';
import ClientProcessor from '../../../common/minting/clients/client-processor';
import CollectionType from '../../../common/minting/enums/collection-type.enum';
import ContractEvent from '../../../common/minting/enums/contract-event.enum';
import MintState from '../../../common/minting/types/mint-state';
import ItemService from '../services/item.service';

const mintNft = createAsyncThunk(
  'nft/mintNft',
  async ({
    address,
    blob,
    name,
    description,
    royalty,
    price,
  }: ItemRequest): Promise<Item | undefined> => {
    const mintState = {
      address,
      collectionAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // TODO: Remove hardcoded
      blob,
      collection: CollectionType.LedaNft,
      description,
      mintEventName: ContractEvent.LogNFTMinted,
      name,
      royalty,
      price,
    } as MintState;

    const processor = new ClientProcessor();
    const minted = await processor.execute(mintState);
    return minted.item;
  }
);

const findAll = createAsyncThunk('nft/findAll', async () => {
  const itemService = new ItemService();
  return itemService.findAll();
});

export { findAll, mintNft };
