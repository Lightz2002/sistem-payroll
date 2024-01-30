import React from 'react';
import moment from 'moment';

interface Props {
  value: number;
}

const HumanDiff = ({ value }: Props) => {
  return <div>{moment(value).format('DD-MMM-YYYY, h:mm:ss a')}</div>;
};

export default HumanDiff;
