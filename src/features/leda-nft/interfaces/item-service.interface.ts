import ActivateItemRequest from '../../../common/types/activate-item-request';
import DraftItemRequest from '../../../common/types/draft-item-request';
import ProcessLazyItemRequest from '../../../common/types/process-lazy-item-request';
import { History } from '../../../types/history';
import { Item } from '../../../types/item';
import { FilterTypeBase } from '../../../types/item-filter-types';
import { Voucher } from '../types/lazy-minting-types';

interface IItemService {
  findById(itemId: string): Promise<Item>;
  buy(itemId: string, address: string): Promise<Item>;
  transfer(itemId: string, address: string, voucherId: string, tokenId: number): Promise<void>;
  list(itemId: string, price: string, listId: number, address: string): Promise<Item>;
  delist(itemId: string, address: string): Promise<Item>;
  create(item: DraftItemRequest): Promise<Item>;
  activate(item: ActivateItemRequest): Promise<Item>;
  processLazyItem(lazyItemRequest: ProcessLazyItemRequest): Promise<Item>;
  findAllHistory({ limit, page }: FilterTypeBase): Promise<{ count: number; history: History[] }>;
  findHistoryByItemId(itemId: string): Promise<History[]>;
  findVoucherByItemId(itemId: string): Promise<Voucher>;
}

export default IItemService;
