import React, { IframeHTMLAttributes } from 'react';
import { useCustomerLink } from '../hooks/useCustomerLink';

type IFrameProps = Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src'>;
type Props = {
  customerToken: string;
  baseApiUrl?: string;
} & IFrameProps;

export const EmbeddedPortal = (props: Props) => {
  const { customerToken, ...iframeProps } = props;
  const { result } = useCustomerLink({
    token: customerToken,
  });

  if (!result?.url) {
    return null;
  }

  const link = result.url.includes('https://')
    ? result.url
    : `https://${result.url}`;

  return <iframe src={link} {...iframeProps} />;
};
