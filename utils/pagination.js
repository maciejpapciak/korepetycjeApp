async function defaultPagination(page, size) {
  const take = size ? Number(size) : 10;
  const skip = page ? page * take : 0;

  return { take, skip };
}

async function retrievePagingData(dataParam, page, take) {
  const { status, results, data } = dataParam;
  const currentPage = page ? Number(page) : 0;
  const totalPages = Math.ceil(results / take);
  return { status, results, data, totalPages, currentPage };
}

module.exports = { defaultPagination, retrievePagingData };
