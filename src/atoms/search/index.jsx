import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { trimWhiteSpace, getURLParameters, throttle, getBaseURL } from 'functions/utils';
import { pushNewQuery, searchByKeyphrase } from 'state/search';
import _ from 'lang';
import { useFetchSearchIndex } from 'functions/hooks';
const _l = _('en');

const handleHistoryUpdate = value => {
  if (typeof window !== 'undefined' && typeof window.location !== 'undefined' && typeof window.history !== 'undefined') {
    const encodedValue = encodeURIComponent(value);
    const params = getURLParameters(window.location.href);
    const baseURL = getBaseURL(window.location.href);
    if (value && params && params.keyphrase &&
      (encodedValue.includes(params.keyphrase) || params.keyphrase.includes(encodedValue))) {
      window.history.replaceState(
        { keyphrase: value },
        `Search results for ${value}`,
        `${baseURL}${value ? `?keyphrase=${encodedValue}` : ''}`
      );
    } else {
      window.history.pushState(
        { keyphrase: value },
        `Search results for ${value}`,
        `${baseURL}${value ? `?keyphrase=${encodedValue}` : ''}`
      );
    }
  }
};

const Search = ({
  className = '',
  id = '',
  searchIndex,
  searchQuery,
  shouldUpdateHistory = false,
  dispatch,
}) => {
  const [value, setValue] = React.useState(searchQuery);

  useFetchSearchIndex(dispatch);

  React.useEffect(() => {
    if (shouldUpdateHistory) {
      const params = getURLParameters(window.location.href);
      if (params && (params.keyphrase || params.keyphrase === '') && params.keyphrase !== encodeURIComponent(searchQuery))
        setValue(decodeURIComponent(params.keyphrase));
    }
  }, []);

  React.useEffect(throttle(() => {
    dispatch(pushNewQuery(value));
    dispatch(searchByKeyphrase(value, searchIndex));
    if(shouldUpdateHistory)
      handleHistoryUpdate(value);
  }, 500), [value]);

  return (
    <input
      defaultValue={ searchQuery }
      className={ trimWhiteSpace`search-box ${className}` }
      type='search'
      id={ id }
      placeholder={ _l('Search...') }
      aria-label={ _l('Search snippets') }
      onKeyUp={ e => {
        setValue(e.target.value);
      } }
      onKeyPress={ e => {
        if (
          e.charCode === 13 &&
          typeof document !== 'undefined' &&
          document.activeElement &&
          document.activeElement.blur &&
          typeof document.activeElement.blur === 'function'
        )
          document.activeElement.blur();
      } }
    />
  );
};

Search.propTypes = {
  /** Initial value for the search bar */
  searchQuery: PropTypes.string,
  /** Index of the searchable data */
  searchIndex: PropTypes.arrayOf(PropTypes.shape({})),
  /** Additional classname(s) for the search bar */
  className: PropTypes.string,
  /** Element id */
  id: PropTypes.string,
  /** Dispatch function of the Redux stotre */
  dispatch: PropTypes.func,
  /** Should this component handle history updates? */
  shouldUpdateHistory: PropTypes.bool,
};

export default connect(
  state => ({
    searchIndex: state.search.searchIndex,
    searchQuery: state.search.searchQuery,
  }),
  null
)(Search);
