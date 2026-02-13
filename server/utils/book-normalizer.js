const toHttps = (url) => {
  if (!url || typeof url !== "string") return null;
  return url.replace("http://", "https://");
};

export const normalizeVolume = (item, wiki = null) => {
  const volumeInfo = item?.volumeInfo || {};
  const saleInfo = item?.saleInfo || {};
  const accessInfo = item?.accessInfo || {};
  const searchInfo = item?.searchInfo || {};

  return {
    kind: item?.kind || null,
    id: item?.id || null,
    etag: item?.etag || null,
    selfLink: item?.selfLink || null,
    volumeInfo: {
      ...volumeInfo,
      imageLinks: {
        smallThumbnail: toHttps(volumeInfo?.imageLinks?.smallThumbnail),
        thumbnail: toHttps(volumeInfo?.imageLinks?.thumbnail),
        small: toHttps(volumeInfo?.imageLinks?.small),
        medium: toHttps(volumeInfo?.imageLinks?.medium),
        large: toHttps(volumeInfo?.imageLinks?.large),
        extraLarge: toHttps(volumeInfo?.imageLinks?.extraLarge),
      },
      description: volumeInfo.description || wiki?.extract || null,
      wikipedia: wiki,
    },
    saleInfo,
    accessInfo,
    searchInfo,
    raw: item,
  };
};

export const normalizeVolumes = (items, wikiMap) => {
  return (items || []).map((item) => normalizeVolume(item, wikiMap.get(item?.id) || null));
};
