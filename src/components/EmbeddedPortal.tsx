import React, { IframeHTMLAttributes, useRef } from 'react';
import { useCustomerLink } from '../hooks/useCustomerLink';

type IFrameProps = Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src'>;
type Props = {
  customerToken: string;
  baseApiUrl?: string;
} & IFrameProps;

export const EmbeddedPortal = (props: Props) => {
  const { customerToken, baseApiUrl, ...iframeProps } = props;
  const frameRef = useRef<HTMLIFrameElement>(null);

  const { result } = useCustomerLink({
    token: customerToken,
    baseApiUrl,
  });

  if (!result?.url) {
    return null;
  }

  const link = result.url.includes('https://')
    ? result.url
    : `https://${result.url}`;

  return (
    <iframe
      ref={frameRef}
      src={link}
      {...iframeProps}
      style={{ ...iframeProps.style, display: 'none' }}
      onLoad={() => {
        if (frameRef.current != null && frameRef.current.style != null) {
          frameRef.current.style.display =
            iframeProps.style?.display ?? 'block';
        }
      }}
    />
  );
};
