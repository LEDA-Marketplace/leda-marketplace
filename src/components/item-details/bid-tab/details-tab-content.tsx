import { ItemProperty } from '../../../common/types/ipfs-types';
import { Tag } from '../../../types/item';

type Props = {
  properties: ItemProperty[];
  tags: Tag[];
};

const DetailsTabContent = ({ properties, tags }: Props) => (
  <div className="rn-pd-bd-wrapper mt--20">
    {!!properties?.length && (
      <div className="rn-pd-sm-property-wrapper">
        <h6 className="pd-property-title">Properties</h6>
        <div className="property-wrapper">
          {properties.map((property: ItemProperty) => (
            <div key={property.key} className="pd-property-inner">
              <span className="color-body type">{property.key.toUpperCase()}</span>
              <span className="color-white value">{property.value}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {tags && (
      <div className="rn-pd-sm-property-wrapper">
        <h6 className="pd-property-title">Tags</h6>
        <div className="catagory-wrapper">
          {tags.map((tag: Tag) => (
            <div key={tag.id} className="pd-property-inner">
              <span className="color-white value">{tag.name.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default DetailsTabContent;
