import Anchor from '@ui/anchor';
import { getTimeAgo } from '@utils/getTimeAgo';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect } from 'react';
import { findAllHistory } from '../../features/marketplace/store/marketplace.actions';
import useAppDispatch from '../../store/hooks/useAppDispatch';
import useAppSelector from '../../store/hooks/useAppSelector';

export const ActivityArea = () => {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.marketplace);

  useEffect(() => {
    dispatch(findAllHistory());
  }, [dispatch]);

  if (!history?.length) {
    return (
      <div className="text-center my-5">
        <h3>No history found</h3>
      </div>
    );
  }

  if (!history) {
    return <>Loading</>;
  }
  return (
    <div className="container">
      <div className="row mb--30">
        <h3 className="title">All following Acivity</h3>
      </div>
      <div className="row g-6 activity-direction">
        <div className="col-lg-12 mb_dec--15">
          {history?.map((e) => (
            <div className={clsx('single-activity-wrapper')} key={e.id}>
              <div className="inner">
                <div className="read-content">
                  <div className="thumbnail">
                    <Anchor path="path">
                      <Image src={e.item?.image?.url} alt="Nft_Profile" width={500} height={500} />
                    </Anchor>
                  </div>
                  <div className="content">
                    <Anchor path={`/item/${e.item.itemId}`}>
                      <h6 className="title">{e.item.name}</h6>
                    </Anchor>
                    <span>
                      was {e.transactionType} {e.price && <>price for {e.price} ETH</>} by{' '}
                      <Anchor path="path">{e.owner.address}</Anchor>
                    </span>
                    <br />
                    <br />

                    {/* <p dangerouslySetInnerHTML={{ __html: desc }} /> */}
                    <div className="time-maintane">
                      <div className="time data">
                        <i className="feather-clock" />
                        <span>{getTimeAgo(e.createdAt)}</span>
                      </div>
                      {/* <div className="user-area data">
                      <i className="feather-user" />
                      <Anchor path="author.slug">{e.owner.address}</Anchor>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* TODO: Enable filters if needed */}
        {/* <div className="col-lg-4">
        <div className="filter-wrapper">
          <Sticky top="100px">
            <div className="widge-wrapper rbt-sticky-top-adjust">
              <div className="inner">
                <h3>Market filter</h3>
                <div className="sing-filter">
                  {marketFilters?.map((item) => (
                    <button key={item} type="button" onClick={() => filterHandler(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="inner">
                <h3>Filter by users</h3>
                <div className="sing-filter">
                  {userFilters?.map((item) => (
                    <button key={item} onClick={() => filterHandler(item)} type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Sticky>
        </div>
      </div> */}
      </div>
    </div>
  );
};