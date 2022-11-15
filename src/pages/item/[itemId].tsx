import Breadcrumb from '@components/breadcrumb';
import SEO from '@components/seo';

import { ProductDetailsArea } from '@containers/item-details/item-details';
import { useEffect, useMemo, useState } from 'react';

import { SpinnerContainer } from '@ui/spinner-container/spinner-container';
import { findById } from '../../features/leda-nft/store/leda-nft.actions';
import { selectById } from '../../features/leda-nft/store/leda-nft.slice';

import ItemStatus from '../../features/marketplace/process/enums/item-status.enum';
import useAppDispatch from '../../store/hooks/useAppDispatch';
import useAppSelector from '../../store/hooks/useAppSelector';
import { selectAuthState } from '../../features/auth/store/auth.slice';
import { selectNFTsMarketplace } from '../../features/marketplace/store/marketplace.slice';

type Props = {
  itemId: string;
  metaData: {
    name: string;
    description: string;
    author: {
      address: string;
    };
    image: {
      url: string;
    };
  };
};

const NotListedLayout = () => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <h2>Hey! It seems like this Item does not exist or it&apos;s not listed any more.</h2>
    <h4>If you are the owner and you can not see it, please contact us to fix your problem</h4>
    <h5>Thank you!</h5>
  </div>
);

const ProductDetails = ({ itemId, metaData }: Props) => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const { address: addressState } = useAppSelector(selectAuthState);
  const { isLoading } = useAppSelector(selectNFTsMarketplace);
  const item = useAppSelector((state) => selectById(state, itemId));
  const { selectedItem } = useAppSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(findById(itemId));
  }, [itemId]);

  const formattedAddress = (address: string) =>
    `${address.substring(0, 7)}...${address.substring(address.length - 4, address.length)} - NFT`;

  const pageTitleWindow = item ? `${item?.name} #${item?.itemId.slice(0, 5)}` : 'Item Details';

  const pageTitleBreadcrumb = item?.owner.address
    ? formattedAddress(item.owner.address)
    : 'Item Details';

  const currentPage = item ? `NFT - ${item.name} #${item.itemId.slice(0, 4)}` : 'Item Details';

  useEffect(() => {
    if (item?.status === ItemStatus.NotListed) {
      if (item?.owner.address === addressState) setIsVisible(true);
    } else if (item?.status === ItemStatus.Listed) setIsVisible(true);
  }, [addressState, item?.owner.address, item?.status]);

  const renderedComponent = useMemo(() => {
    if (isVisible && Object.keys(selectedItem).length) {
      return <ProductDetailsArea />;
    }
    return <NotListedLayout />;
  }, [isVisible, selectedItem]);

  return (
    <div>
      <SEO
        pageTitle={pageTitleWindow}
        pageMeta={{
          nftName: metaData?.name,
          nftAuthor: metaData?.author.address,
          nftDescription: metaData?.description,
          nftImage: metaData.image.url,
        }}
      />
      <Breadcrumb pageTitle={pageTitleBreadcrumb} currentPage={currentPage} />
      <SpinnerContainer isLoading={isLoading}>{renderedComponent}</SpinnerContainer>
    </div>
  );
};

type Params = {
  params: { itemId: string };
};

export async function getServerSideProps({ params }: Params) {
  const url = `${process.env.NEXT_PUBLIC_LEDA_API_URL}/items/${params.itemId}`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(url, requestOptions);
  const resJson = await res.json();
  return {
    props: {
      itemId: params.itemId,
      metaData: resJson,
    },
  };
}

export default ProductDetails;
