import { ItemQuality } from '../../../../../shared/src/interface/item/item';

export const ITEM_QUALITY_COLORS: Record<ItemQuality, string> = {
  [ItemQuality.COMMON]: 'white',
  [ItemQuality.UNCOMMON]: '#10ee10',
  [ItemQuality.RARE]: 'rgb(0, 171, 255)',
  [ItemQuality.EPIC]: '#df47df',
  [ItemQuality.LEGENDARY]: '#d98c00',
};
