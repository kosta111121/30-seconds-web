import React from 'react';
import PropTypes from 'prop-types';
import Card from 'atoms/card';
import {Anchor} from 'atoms/anchor';
import { Snippet as SnippetPropType } from 'typedefs';
import { trimWhiteSpace } from 'functions/utils';
import TagList from 'molecules/tagList';

const PreviewCard = ({
  snippet,
  className,
  ...rest
}) => (
  <Anchor
    link={ {
      internal: true,
      url: snippet.url,
    } }
    className='preview-card-wrapper'
  >
    <Card className={ trimWhiteSpace`preview-card ${className}` } { ...rest } >
      <h4 className='card-title'>{ snippet.title }</h4>
      <TagList tags={ [snippet.language.long, snippet.primaryTag, snippet.expertise] } />
      <div
        className='card-description'
        dangerouslySetInnerHTML={ { __html: `${snippet.html.description}` } }
      />
    </Card>
  </Anchor>
);

PreviewCard.propTypes = {
  /** Snippet data for the card */
  snippet: SnippetPropType,
  /** Additional classes for the card */
  className: PropTypes.string,
  /** Any other arguments to be passed to the card */
  rest: PropTypes.any,
};

export default PreviewCard;
