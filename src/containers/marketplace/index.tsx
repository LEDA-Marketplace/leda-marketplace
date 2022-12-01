import { Item as ItemType } from '@types';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Item from '@components/item';
import Link from 'next/link';
import { selectNFTsMarketplace } from '../../features/marketplace/store/marketplace.slice';
import { findPagedItems } from '../../features/marketplace/store/marketplace.actions';
import LoadingSpinner from './loading-spinner';
import useAppDispatch from '../../store/hooks/useAppDispatch';
import useAppSelector from '../../store/hooks/useAppSelector';

const MarketplaceArea = () => {
  const dispatch = useAppDispatch();
  const { marketplaceFilters, itemPagination, isPagingLoading } =
    useAppSelector(selectNFTsMarketplace);
  const { items, totalCount } = itemPagination;

  const hasMore = items.length < totalCount;

  const handleNext = useCallback(() => {
    if (hasMore) {
      const newPage = Math.floor(items.length / marketplaceFilters.limit + 1);
      dispatch(findPagedItems({ ...marketplaceFilters, page: newPage }));
    }
  }, [dispatch, hasMore, marketplaceFilters, items]);

  return (
    <div className="rn-product-area rn-section-gapTop">
      <div className="row g-5">
        <InfiniteScroll
          style={{ overflow: 'inherit' }}
          dataLength={items.length}
          next={handleNext}
          hasMore={hasMore}
          loader={isPagingLoading ? <LoadingSpinner /> : null}
          endMessage={
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '20px' }}>
              <b>
                Looking for more NFTs?{' '}
                <Link href="/create">
                  <span className="create-nft-button">Create one!</span>
                </Link>
              </b>
            </p>
          }
        >
          <div className="row g-5">
            {items.map((item: ItemType) => (
              <div key={item.itemId} className="col-5 col-lg-4 col-md-6 col-sm-6 col-12">
                <Item
                  title={item.name}
                  itemId={item.itemId}
                  tokenId={item.tokenId}
                  owner={item.owner}
                  tags={item.tags}
                  price={Number(item.price)}
                  status={item.status}
                  likeCount={item.likes}
                  imageString={item.image.url}
                  isLazy={item.isLazy}
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MarketplaceArea;
