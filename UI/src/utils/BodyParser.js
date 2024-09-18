const parser = (
  NameFilter,
  SpecializationIdFilter,
  DegreeIdFilter,
  SortBy,
  SortDesc,
  Skip,
  Take
) => {
  return {
    NameFilter: NameFilter,
    SpecializationIdFilter: SpecializationIdFilter,
    DegreeIdFilter: DegreeIdFilter,
    SortBy: SortBy,
    SortDesc: SortDesc,
    Skip: Skip,
    Take: Take,
  };
};

export default parser;
