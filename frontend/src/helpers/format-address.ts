export const formatAddress = (
  address: string | null | undefined,
  split = 18
) => {
  if (!address) return '';
  return `${address.substring(0, split)}...${address.substr(
    address.length - 4,
    address.length - 2
  )}`;
};
