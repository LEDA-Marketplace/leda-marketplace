import CollectionComponent from '@components/collections/collection.component';
import Anchor from '@ui/anchor';
import { SpinnerContainer } from '@ui/spinner-container/spinner-container';
import { useEffect, useMemo } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { getNewestCollections } from '../../features/collections/store/collections.actions';
import { selectCollectionsState } from '../../features/collections/store/collections.slice';
import useAppDispatch from '../../store/hooks/useAppDispatch';
import useAppSelector from '../../store/hooks/useAppSelector';
import { ICollection } from '../../types/ICollection';

const NotFound = () => (
  <div className="">
    <h5 className="text-center">No collections to show</h5>
  </div>
);

const NewestCollectionArea = () => {
  const dispatch = useAppDispatch();
  const { newestCollections, isLoadingCollections } = useAppSelector(selectCollectionsState);

  const qtyItemsToFetch = 4;

  useEffect(() => {
    dispatch(getNewestCollections(qtyItemsToFetch));
  }, [dispatch]);

  const renderedComponent = useMemo(() => {
    if (newestCollections.length === 0 && !isLoadingCollections) return <NotFound />;
    if (isLoadingCollections)
      return (
        <div className="d-flex align-items-center justify-content-center">
          <ClipLoader className="spinner" color="#35b049" />
        </div>
      );
    return (
      <div className="row g-5">
        {newestCollections.map((collection: ICollection) => (
          <div className="col-3" key={collection.id}>
            <CollectionComponent
              ownerAddress={collection?.owner?.address}
              collectionBanner={collection.items[0]?.image?.url}
              collectionThumbnail={collection.image?.url}
              colId={collection.id}
              itemsQty={collection.items.length}
              colTitle={collection.name}
            />
          </div>
        ))}
      </div>
    );
  }, [newestCollections, isLoadingCollections]);

  return (
    <div
      className="container mt-5"
      data-sal-delay="150"
      data-sal="slide-up"
      data-sal-duration="800"
    >
      {newestCollections.length > 0 && (
        <>
          <div className="d-flex justify-content-between">
            <h3>Newest Collections</h3>
            <Anchor className="btn-transparent" path="/collections">
              VIEW ALL
              <i className="feather feather-arrow-right" />
            </Anchor>
          </div>
          <SpinnerContainer isLoading={isLoadingCollections}>{renderedComponent}</SpinnerContainer>
        </>
      )}
    </div>
  );
};

export default NewestCollectionArea;
