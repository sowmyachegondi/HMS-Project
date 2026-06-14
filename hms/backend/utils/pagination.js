export function getPaginationParams(req, defaultLimit = 10) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function paginatedResponse(rows, total, page, limit) {
  const totalPages = Math.ceil(total / limit) || 1;
  return { data: rows, total, page, limit, totalPages };
}
