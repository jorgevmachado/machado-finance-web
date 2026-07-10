import {
  ALLOCATION_CONTRIBUTION_DEFAULT_CREATE_ERROR_MESSAGE ,
  ALLOCATION_CONTRIBUTION_DEFAULT_UPDATE_ERROR_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE ,
  ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE ,
} from './messages';

describe('account validation messages', () => {
  it('exports expected i18n keys', () => {
    expect(ALLOCATION_CONTRIBUTION_INVALID_CONTRIBUTOR_NAME_MESSAGE).toBe('i18n:allocation-contribution.errors.invalidContributorName');
    expect(ALLOCATION_CONTRIBUTION_INVALID_ALLOCATION_MESSAGE).toBe('i18n:allocation.errors.invalidAllocation');
    expect(ALLOCATION_CONTRIBUTION_INVALID_DESCRIPTION_MESSAGE).toBe(
      'i18n:allocation-contribution.errors.invalidDescription',
    );
    expect(ALLOCATION_CONTRIBUTION_DEFAULT_CREATE_ERROR_MESSAGE).toBe(
      'i18n:allocation-contribution.errors.defaultCreate',
    );
    expect(ALLOCATION_CONTRIBUTION_DEFAULT_UPDATE_ERROR_MESSAGE).toBe(
      'i18n:allocation-contribution.errors.defaultUpdate',
    );
  });
});
