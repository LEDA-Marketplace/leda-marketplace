import { ContractTransaction } from 'ethers';
import { getContracts } from '../../../utils/getContracts';
import INftService from '../../../common/interfaces/nft-service.interface';
import createContract from '../../../common/utils/contract-utils';
import { LedaNFT } from '../types/LedaNFT';

const { LedaAddress, LedaAbi } = getContracts();
export default class LedaNftService implements INftService {
  private contract: LedaNFT | null;

  constructor() {
    this.contract = null;
  }

  public async init(): Promise<void> {
    this.contract = await createContract<LedaNFT>(LedaAddress, LedaAbi);
  }

  public async getOwner(tokenId: number): Promise<string | undefined> {
    return this.contract?.ownerOf(tokenId);
  }

  public async mint(tokenURI: string, royalty: number): Promise<ContractTransaction | undefined> {
    return this.contract?.mint(tokenURI, royalty);
  }

  public async approveForAll(address: string): Promise<void> {
    await this.contract?.setApprovalForAll(address, true);
  }

  public async isApproveForAll(
    ownerAddress: string,
    marketPlaceAddress: string
  ): Promise<Boolean | undefined> {
    const result = await this.contract?.isApprovedForAll(ownerAddress, marketPlaceAddress);
    return result;
  }
}

export const ledaNftService = new LedaNftService();
