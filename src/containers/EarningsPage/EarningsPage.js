import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { LayoutSideNavigation, Page, UserNav, H3 } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import {
  earnings,
  earningsClear,
  resetPassword,
} from '../EarningsPage/EarningsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './EarningsPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';

export const EarningsPageComponent = props => {
  const {
    earningsError,
    earningsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitEarnings,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleEarnings = values => {
    return onSubmitEarnings(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);


  const totalTransactionLabel = 'TOTAL GIG';
  const totalTransactionValue = '20';
  const showTotalTransaction = true;

  const totalCompletedLabel = 'TOTAL COMPLETED';
  const totaLCompletedValue = '17';
  const showTotalCompleted = true;

  const totalDeclinedLabel = 'TOTAL PROFITS';
  const totalDeclinedValue = '$25000';
  const showTotalDeclined = true;

  const totalProfitLabel = 'TOTAL LOSS';
  const totalProfitValue = '$5000';
  const showTotalProfit = true;

  const pageDetails = (
    <div className={css.details}>
        <EarningsPageViewComponent
        
          totalTransactionLabel={totalTransactionLabel}
          totalTransactionValue={totalTransactionValue}
          showTotalTransaction={showTotalTransaction}
          totalCompletedLabel={totalCompletedLabel}
          totaLCompletedValue={totaLCompletedValue}
          showTotalCompleted={showTotalCompleted}
          totalDeclinedLabel={totalDeclinedLabel}
          totalDeclinedValue={totalDeclinedValue}
          showTotalDeclined={showTotalDeclined}
          totalProfitLabel={totalProfitLabel}
          totalProfitValue={totalProfitValue}
          showTotalProfit={showTotalProfit}
        />
    </div>
  );

  const title = intl.formatMessage({ id: 'EarningsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="EarningsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="EarningsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="EarningsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="EarningsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

EarningsPageComponent.defaultProps = {
  earningsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

EarningsPageComponent.propTypes = {
  earningsError: propTypes.error,
  earningsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitEarnings: func.isRequired,
  earnings: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    earningsError,
    earningsInProgress,
    earnings,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.EarningsPage;
  const { currentUser } = state.user;
  return {
    earningsError,
    earningsInProgress,
    currentUser,
    earnings,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(earningsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitEarnings: values => dispatch(earnings(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const EarningsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(EarningsPageComponent);

export default EarningsPage;