import React, { IframeHTMLAttributes } from 'react';
import { useCustomerLink } from 'hooks/useCustomerLink';

type IFrameProps = Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src'>;
type Props = {
  apiKey: string;
  customerName: string;
  baseApiUrl?: string;
} & IFrameProps;

export const EmbeddedComponent = (props: Props) => {
  const { apiKey, customerName, ...iframeProps } = props;
  const { result } = useCustomerLink({
    apiKey,
    customerName,
  });

  if (!result?.url) {
    return null;
  }

  const link = result.url.includes('https://')
    ? result.url
    : `https://${result.url}`;

  return <iframe src={link} {...iframeProps} />;
};
