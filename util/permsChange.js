const permsChange = (oldRole, role) => {
  const permBefore = oldRole.permissions.toArray();
  const permAfter = role.permissions.toArray();
  let added = '';
  let removed = '';
  for (let perm of permBefore) {
    if (!permAfter.some((i) => i === perm)) {
      removed = removed + ', ' + perm;
    }
  }
  for (let perm of permAfter) {
    if (!permBefore.some((i) => i === perm)) {
      added = added + ', ' + perm;
    }
  }
  return {
    added,
    removed,
  };
};

module.exports = permsChange;
