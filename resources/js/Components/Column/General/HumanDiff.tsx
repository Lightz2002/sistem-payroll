import React from 'react';
import moment from 'moment';

interface Props {
  value: number;
}

const HumanDiff = ({ value }: Props) => {
  return <div>{moment(value).fromNow()}</div>;
};

export default HumanDiff;
