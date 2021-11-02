import assert from 'assert';
import React, { useContext } from 'react';

interface TokenContextType {
  token: string;
}

const NO_TOKEN = 'NO_TOKEN';

export const TokenContext = React.createContext<TokenContextType>({
  token: NO_TOKEN,
});

export const useCustomerToken = (): TokenContextType => {
  const { token } = useContext(TokenContext);

  assert(
    token !== NO_TOKEN,
    'Expected non-null customerName and token. Double-check that you are wrapping your component tree with `TokenProvider`'
  );
  return { token };
};

interface TokenProviderProps extends TokenContextType {
  children?: React.ReactNode;
}

export const TokenProvider = ({
  children,
  token,
}: TokenProviderProps): JSX.Element => {
  return (
    <TokenContext.Provider value={{ token }}>{children}</TokenContext.Provider>
  );
};

export default useCustomerToken;
